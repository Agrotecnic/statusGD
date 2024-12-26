// src/components/DashboardGeral/services/DashboardUpdateService.js

import RealtimeUpdateService from './RealtimeUpdateService';

class DashboardUpdateService {
  constructor() {
    this.metrics = new Map();
    this.updateCallbacks = new Set();
    this.lastUpdate = null;
  }

  subscribeToMetric(metricPath, callback, filters = {}) {
    const unsubscribe = RealtimeUpdateService.subscribe(
      metricPath,
      (data) => this.handleMetricUpdate(metricPath, data, callback),
      filters
    );

    this.metrics.set(metricPath, {
      callback,
      filters,
      lastValue: null
    });

    return unsubscribe;
  }

  handleMetricUpdate(metricPath, data, callback) {
    const metric = this.metrics.get(metricPath);
    if (metric) {
      metric.lastValue = data;
      this.lastUpdate = new Date();
      callback(data);
      this.notifyUpdateCallbacks();
    }
  }

  subscribeToUpdates(callback) {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  notifyUpdateCallbacks() {
    const allMetrics = {};
    this.metrics.forEach((metric, path) => {
      allMetrics[path] = metric.lastValue;
    });

    this.updateCallbacks.forEach(callback => {
      try {
        callback({
          metrics: allMetrics,
          timestamp: this.lastUpdate
        });
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  getLastUpdate() {
    return this.lastUpdate;
  }

  getMetricValue(metricPath) {
    const metric = this.metrics.get(metricPath);
    return metric ? metric.lastValue : null;
  }

  getAllMetrics() {
    const result = {};
    this.metrics.forEach((metric, path) => {
      result[path] = metric.lastValue;
    });
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
    this.notifyUpdateCallbacks();
  }
}

export default new DashboardUpdateService();