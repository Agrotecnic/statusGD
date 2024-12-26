import StateManager from './StateManager';
import LoggerService from './LoggerService';

class PerformanceMonitorService {
  private metrics = new Map();
  private thresholds = {
    renderTime: 16.67, // 60fps
    memoryUsage: 0.8, // 80% do limite
    loadTime: 3000, // 3 segundos
  };

  trackRender(componentId, renderTime) {
    this.trackMetric('render', {
      componentId,
      duration: renderTime,
      timestamp: performance.now()
    });
  }

  trackMemory() {
    if (performance.memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usage = usedJSHeapSize / jsHeapSizeLimit;

      this.trackMetric('memory', {
        usage,
        used: usedJSHeapSize,
        limit: jsHeapSizeLimit,
        timestamp: performance.now()
      });
    }
  }

  trackLoadTime(route, loadTime) {
    this.trackMetric('load', {
      route,
      duration: loadTime,
      timestamp: performance.now()
    });
  }

  private trackMetric(type, data) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }

    const metrics = this.metrics.get(type);
    metrics.push(data);

    // Mantém apenas últimas 100 métricas
    if (metrics.length > 100) {
      metrics.shift();
    }

    this.checkThresholds(type, data);
    this.updateState();
  }

  private checkThresholds(type, data) {
    switch (type) {
      case 'render':
        if (data.duration > this.thresholds.renderTime) {
          this.reportPerformanceIssue('render', {
            component: data.componentId,
            duration: data.duration,
            threshold: this.thresholds.renderTime
          });
        }
        break;

      case 'memory':
        if (data.usage > this.thresholds.memoryUsage) {
          this.reportPerformanceIssue('memory', {
            usage: data.usage,
            threshold: this.thresholds.memoryUsage
          });
        }
        break;

      case 'load':
        if (data.duration > this.thresholds.loadTime) {
          this.reportPerformanceIssue('load', {
            route: data.route,
            duration: data.duration,
            threshold: this.thresholds.loadTime
          });
        }
        break;
    }
  }

  private reportPerformanceIssue(type, data) {
    LoggerService.log('warning', `Performance issue detected: ${type}`, data);
    
    StateManager.setState({
      performance: {
        issues: [...(StateManager.getState().performance?.issues || []), {
          type,
          data,
          timestamp: new Date()
        }]
      }
    });
  }

  private updateState() {
    const summary = {};
    this.metrics.forEach((metrics, type) => {
      summary[type] = this.calculateMetricsSummary(metrics);
    });

    StateManager.setState({
      performance: {
        ...StateManager.getState().performance,
        metrics: summary
      }
    });
  }

  private calculateMetricsSummary(metrics) {
    if (!metrics.length) return null;

    const values = metrics.map(m => 
      m.duration || m.usage || 0
    );

    return {
      avg: values.reduce((a, b) => a + b) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      last: values[values.length - 1]
    };
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
    this.updateState();
  }
}

export default new PerformanceMonitorService();