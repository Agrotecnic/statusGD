import StateManager from '../services/StateManager';
import MetricsService from '../services/MetricsService';
import SyncService from '../services/SyncService';
import LoggerService from '../services/LoggerService';
import APIIntegrationService from '../services/APIIntegrationService';

class DashboardVerifier {
  async verifyAll() {
    const status = {
      services: await this.verifyServices(),
      data: await this.verifyData(),
      sync: await this.verifySynchronization(),
      performance: await this.verifyPerformance()
    };

    LoggerService.log('info', 'Dashboard verification completed', status);
    return status;
  }

  async verifyServices() {
    const services = {
      state: false,
      metrics: false,
      sync: false,
      api: false
    };

    try {
      // Verifica StateManager
      services.state = StateManager.getState() !== null;

      // Verifica MetricsService
      const metrics = MetricsService.getAllMetrics();
      services.metrics = metrics !== null;

      // Verifica SyncService
      const syncStatus = await SyncService.getQueueStatus();
      services.sync = syncStatus.pending !== undefined;

      // Verifica API
      services.api = await this.checkAPIConnection();

    } catch (error) {
      LoggerService.log('error', 'Service verification failed', error);
    }

    return services;
  }

  async verifyData() {
    const state = StateManager.getState();
    return {
      hasKPIs: state?.dashboardData?.kpis !== undefined,
      hasRegionals: state?.dashboardData?.regionais?.length > 0,
      hasTrends: state?.dashboardData?.trends !== undefined,
      hasPerformance: state?.dashboardData?.performance !== undefined
    };
  }

  async verifySynchronization() {
    const syncStatus = await SyncService.getQueueStatus();
    return {
      queueSize: syncStatus.pending || 0,
      lastSync: syncStatus.lastSync,
      hasPendingUpdates: syncStatus.pending > 0
    };
  }

  async verifyPerformance() {
    const metrics = MetricsService.getAllMetrics();
    return {
      loadTime: metrics?.dashboard_load?.last || 0,
      renderTime: metrics?.component_render?.avg || 0,
      dataFetchTime: metrics?.data_fetch?.last || 0,
      memoryUsage: performance?.memory?.usedJSHeapSize || 0
    };
  }

  async checkAPIConnection() {
    try {
      await APIIntegrationService.request('healthCheck');
      return true;
    } catch {
      return false;
    }
  }

  generateReport() {
    return {
      timestamp: new Date(),
      metrics: MetricsService.getAllMetrics(),
      state: StateManager.getState(),
      sync: SyncService.getQueueStatus(),
      logs: LoggerService.getLogs()
    };
  }
}

export default new DashboardVerifier();