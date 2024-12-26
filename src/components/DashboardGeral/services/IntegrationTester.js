import StateManager from './StateManager';
import MetricsService from './MetricsService';
import SyncService from './SyncService';
import LoggerService from './LoggerService';
import APIIntegrationService from './APIIntegrationService';

class IntegrationTester {
  static testIntegration() {
    const tester = new IntegrationTester();
    return tester.verifyAll();
  }

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

  async checkInitialState() {
    const state = StateManager.getState();
    const requiredKeys = ['metrics', 'sync', 'api'];
    // Correção do ESLint: usar Object.prototype.hasOwnProperty.call()
    const missingKeys = requiredKeys.filter(key => !Object.prototype.hasOwnProperty.call(state, key));
    
    if (missingKeys.length > 0) {
      return {
        success: false,
        error: `Estado inicial incompleto. Faltando: ${missingKeys.join(', ')}`
      };
    }
    return { success: true };
  }

  async verifyServices() {
    const services = {
      state: false,
      metrics: false,
      sync: false,
      api: false
    };

    try {
      services.state = StateManager.getState() !== null;
      const metrics = MetricsService.getAllMetrics();
      services.metrics = metrics !== null;
      const syncStatus = await SyncService.getQueueStatus();
      services.sync = syncStatus.pending !== undefined;
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

// Exportar como uma classe em vez de uma instância
export default IntegrationTester;