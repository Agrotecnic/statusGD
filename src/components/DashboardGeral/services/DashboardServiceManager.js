import FirebaseRealtimeService from './FirebaseRealtimeService';
import AdvancedCacheService from './AdvancedCacheService';
import DashboardIntegrationService from './DashboardIntegrationService';
import alertSystem from './AlertSystem';
import LoggerService from './LoggerService';
import { ReportExporter } from './ReportExporter';

class DashboardServiceManager {
  constructor() {
    this.initialized = false;
    this.updateInterval = null;
    this.lastUpdate = null;
    this.dataSubscriptions = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Configura cache inicial
      this.setupInitialCache();

      // Inicializa serviços
      await DashboardIntegrationService.initialize();

      // Configura listeners
      this.setupEventListeners();

      // Carrega dados iniciais
      await this.loadInitialData();

      this.initialized = true;
      LoggerService.log('system', 'Dashboard Service Manager initialized');
    } catch (error) {
      LoggerService.log('error', 'Failed to initialize Dashboard Service Manager', { error });
      throw error;
    }
  }

  setupInitialCache() {
    const cacheConfig = {
      kpis: { priority: 'HIGH' },
      metrics: { priority: 'HIGH' },
      trends: { priority: 'MEDIUM' },
      regional: { priority: 'MEDIUM' },
      historical: { priority: 'LOW' }
    };

    Object.entries(cacheConfig).forEach(([key, config]) => {
      AdvancedCacheService.setCacheStrategy(`${key}_config`, config, config.priority);
    });
  }

  setupEventListeners() {
    // Listener para atualizações do Firebase
    this.dataSubscriptions.set('realtime', 
      FirebaseRealtimeService.subscribeToData('metrics', this.handleRealtimeUpdate.bind(this))
    );

    // Listener para alertas
    this.dataSubscriptions.set('alerts',
      DashboardIntegrationService.subscribe('metricsUpdate', this.handleMetricsUpdate.bind(this))
    );
  }

  async loadInitialData() {
    try {
      const [kpis, metrics, trends] = await Promise.all([
        FirebaseRealtimeService.fetchData('kpis'),
        FirebaseRealtimeService.fetchData('metrics'),
        FirebaseRealtimeService.fetchData('trends')
      ]);

      // Pré-carrega dados no cache
      AdvancedCacheService.preloadData([
        { key: 'kpis', data: kpis, priority: 'HIGH' },
        { key: 'metrics', data: metrics, priority: 'HIGH' },
        { key: 'trends', data: trends, priority: 'MEDIUM' }
      ]);

      // Processa alertas iniciais
      this.processAlerts({ kpis, metrics, trends });

    } catch (error) {
      LoggerService.log('error', 'Failed to load initial data', { error });
      throw error;
    }
  }

  handleRealtimeUpdate(data) {
    try {
      // Atualiza cache com novos dados
      AdvancedCacheService.setCacheStrategy('realtime_metrics', data, 'HIGH');

      // Notifica integrações
      DashboardIntegrationService.handleMetricsUpdate(data);

      this.lastUpdate = new Date();
      LoggerService.log('update', 'Realtime data updated', { timestamp: this.lastUpdate });
    } catch (error) {
      LoggerService.log('error', 'Error handling realtime update', { error });
    }
  }

  handleMetricsUpdate(update) {
    try {
      const alerts = this.processAlerts(update);
      
      if (alerts.length > 0) {
        this.notifyAlerts(alerts);
      }

      AdvancedCacheService.setCacheStrategy('latest_metrics', update, 'HIGH');
    } catch (error) {
      LoggerService.log('error', 'Error handling metrics update', { error });
    }
  }

  processAlerts(data) {
    const alerts = alertSystem.analyzeAlerts(data);
    AdvancedCacheService.setCacheStrategy('current_alerts', alerts, 'HIGH');
    return alerts;
  }

  notifyAlerts(alerts) {
    alerts.forEach(alert => {
      alertSystem.showAlert(alert.message, alert.type, {
        autoClose: alert.severity === 'HIGH' ? false : 5000
      });
    });
  }

  async generateReport(options = {}) {
    try {
      const data = {
        kpis: AdvancedCacheService.getCacheData('kpis'),
        metrics: AdvancedCacheService.getCacheData('latest_metrics'),
        trends: AdvancedCacheService.getCacheData('trends'),
        alerts: AdvancedCacheService.getCacheData('current_alerts')
      };

      const exporter = new ReportExporter(data, options);
      return options.format === 'pdf' ? 
        await exporter.exportToPDF() : 
        await exporter.exportToExcel();

    } catch (error) {
      LoggerService.log('error', 'Failed to generate report', { error });
      throw error;
    }
  }

  getPerformanceMetrics() {
    return {
      cacheMetrics: AdvancedCacheService.getMetrics(),
      lastUpdate: this.lastUpdate,
      activeSubscriptions: this.dataSubscriptions.size,
      initialized: this.initialized
    };
  }

  cleanup() {
    // Limpa subscrições
    this.dataSubscriptions.forEach(unsubscribe => unsubscribe());
    this.dataSubscriptions.clear();

    // Limpa cache
    AdvancedCacheService.optimizeCache();

    // Reseta estado
    this.initialized = false;
    this.lastUpdate = null;

    LoggerService.log('system', 'Dashboard Service Manager cleaned up');
  }
}

export default new DashboardServiceManager();