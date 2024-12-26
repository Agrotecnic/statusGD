import WebSocketService from './WebSocketService';
import StateManager from './StateManager';
import SyncService from './SyncService';

class MetricsService {
  constructor() {
    this.metrics = new Map();
    this.thresholds = new Map();
    this.aggregationIntervals = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000
    };
  }

  track(metricName, value, tags = {}) {
    const timestamp = Date.now();
    const metric = {
      value,
      timestamp,
      tags
    };

    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    this.metrics.get(metricName).push(metric);
    this.checkThresholds(metricName, value);
    this.syncMetric(metricName, metric);
  }

  setThreshold(metricName, { min, max, callback }) {
    this.thresholds.set(metricName, { min, max, callback });
  }

  checkThresholds(metricName, value) {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    if (value < threshold.min || value > threshold.max) {
      threshold.callback?.({
        metricName,
        value,
        threshold: value < threshold.min ? 'min' : 'max',
        timestamp: Date.now()
      });
    }
  }

  getMetric(metricName, interval = '5m') {
    const metrics = this.metrics.get(metricName) || [];
    const timeRange = this.aggregationIntervals[interval];
    const now = Date.now();

    return metrics.filter(m => now - m.timestamp <= timeRange);
  }

  getAggregatedMetrics(metricName, interval = '5m') {
    const metrics = this.getMetric(metricName, interval);
    if (!metrics.length) return null;

    const values = metrics.map(m => {
      const num = Number(m.value);
      return isNaN(num) ? 0 : num;
    });

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
      last: values[values.length - 1]
    };
  }

  getAllMetrics(interval) {
    const result = {};
    this.metrics.forEach((_, metricName) => {
      result[metricName] = this.getAggregatedMetrics(metricName, interval);
    });
    return result;
  }

  async syncMetric(metricName, metric) {
    await SyncService.syncData(`metric_${metricName}`, {
      name: metricName,
      ...metric
    });

    StateManager.setState({
      metrics: {
        [metricName]: this.getAggregatedMetrics(metricName)
      }
    });

    WebSocketService.send('metric_update', {
      name: metricName,
      data: metric
    });
  }

  clearOldMetrics(maxAge = 86400000) { // 24h
    const now = Date.now();
    this.metrics.forEach((metrics, name) => {
      this.metrics.set(
        name,
        metrics.filter(m => now - m.timestamp <= maxAge)
      );
    });
  }
}

export default new MetricsService();