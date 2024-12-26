import MetricsService from '../../../../components/DashboardGeral/services/MetricsService';
import SyncService from '../../../../components/DashboardGeral/services/SyncService';
import WebSocketService from '../../../../components/DashboardGeral/services/WebSocketService';

jest.mock('../../../../components/DashboardGeral/services/SyncService');
jest.mock('../../../../components/DashboardGeral/services/WebSocketService');

describe('MetricsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MetricsService.metrics.clear();
    MetricsService.thresholds.clear();
  });

  test('rastreamento de métricas', () => {
    MetricsService.track('cpu_usage', 80, { server: 'prod-1' });
    
    const metrics = MetricsService.getMetric('cpu_usage');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].value).toBe(80);
    expect(metrics[0].tags.server).toBe('prod-1');
  });

  test('thresholds e callbacks', () => {
    const callback = jest.fn();
    MetricsService.setThreshold('memory_usage', {
      min: 0,
      max: 90,
      callback
    });

    MetricsService.track('memory_usage', 95);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        metricName: 'memory_usage',
        value: 95,
        threshold: 'max'
      })
    );
  });

  test('agregação de métricas', () => {
    const values = [10, 20, 30, 40, 50];
    values.forEach(value => {
      MetricsService.track('test_metric', value);
    });

    const aggregated = MetricsService.getAggregatedMetrics('test_metric');
    expect(aggregated.avg).toBe(30);
    expect(aggregated.min).toBe(10);
    expect(aggregated.max).toBe(50);
    expect(aggregated.count).toBe(5);
  });

  test('sincronização de métricas', () => {
    MetricsService.track('sync_test', 100);
    
    expect(SyncService.syncData).toHaveBeenCalled();
    expect(WebSocketService.send).toHaveBeenCalledWith(
      'metric_update',
      expect.any(Object)
    );
  });

  test('limpeza de métricas antigas', () => {
    const oldTimestamp = Date.now() - 100000;
    MetricsService.metrics.set('old_metric', [
      { value: 1, timestamp: oldTimestamp }
    ]);

    MetricsService.clearOldMetrics(50000);
    expect(MetricsService.getMetric('old_metric')).toHaveLength(0);
  });
});