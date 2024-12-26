import DashboardUpdateService from '../services/DashboardUpdateService';
import CacheService from './services/CacheService';

class DataUpdateManager {
  constructor() {
    this.updateIntervals = new Map();
    this.dataSubscriptions = new Map();
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.setupMetricSubscriptions();
    this.setupUpdateIntervals();
    this.isInitialized = true;
  }

  setupMetricSubscriptions() {
    const metrics = [
      { path: 'metrics/performance', interval: 5000 },
      { path: 'metrics/errors', interval: 10000 },
      { path: 'metrics/usage', interval: 30000 }
    ];

    metrics.forEach(metric => {
      this.subscribeToMetric(metric.path, metric.interval);
    });
  }

  setupUpdateIntervals() {
    DashboardUpdateService.subscribeToUpdates(data => {
      this.processUpdates(data);
    });
  }

  subscribeToMetric(path, interval) {
    const subscription = DashboardUpdateService.subscribeToMetric(
      path,
      data => this.handleMetricUpdate(path, data)
    );

    this.dataSubscriptions.set(path, subscription);
    this.updateIntervals.set(path, interval);
  }

  handleMetricUpdate(path, data) {
    CacheService.set(path, data);
    this.notifySubscribers(path, data);
  }

  processUpdates(data) {
    Object.entries(data.metrics).forEach(([path, value]) => {
      this.handleMetricUpdate(path, value);
    });
  }

  notifySubscribers(path, data) {
    const event = new CustomEvent('metric-update', {
      detail: { path, data, timestamp: new Date() }
    });
    window.dispatchEvent(event);
  }

  getMetricData(path) {
    return CacheService.get(path) || DashboardUpdateService.getMetricValue(path);
  }

  getAllMetrics() {
    return {
      ...CacheService.getAll(),
      ...DashboardUpdateService.getAllMetrics()
    };
  }

  cleanup() {
    this.dataSubscriptions.forEach(unsubscribe => unsubscribe());
    this.dataSubscriptions.clear();
    this.updateIntervals.clear();
    this.isInitialized = false;
  }
}

export default new DataUpdateManager();