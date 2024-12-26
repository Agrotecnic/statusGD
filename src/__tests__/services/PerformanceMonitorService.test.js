import PerformanceMonitorService from '../../../../components/DashboardGeral/services/PerformanceMonitorService';
import LoggerService from '../../../../components/DashboardGeral/services/LoggerService';

jest.mock('../../../../components/DashboardGeral/services/LoggerService');

describe('PerformanceMonitorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    PerformanceMonitorService.metrics.clear();
  });

  test('rastreamento de métricas', () => {
    PerformanceMonitorService.trackMetric('test', 100);
    const metrics = PerformanceMonitorService.getMetrics('test');
    
    expect(metrics).toHaveLength(1);
    expect(metrics[0].value).toBe(100);
  });

  test('alerta de threshold excedido', () => {
    PerformanceMonitorService.trackMetric('renderTime', 1000, {
      component: 'TestComponent'
    });

    expect(LoggerService.log).toHaveBeenCalledWith(
      'warning',
      'Render time exceeded threshold',
      expect.any(Object)
    );
  });

  test('cálculo de média de métricas', () => {
    PerformanceMonitorService.trackMetric('test', 100);
    PerformanceMonitorService.trackMetric('test', 200);
    
    const average = PerformanceMonitorService.getAverageMetric('test');
    expect(average).toBe(150);
  });

  test('geração de relatório de performance', () => {
    PerformanceMonitorService.trackMetric('metric1', 100);
    PerformanceMonitorService.trackMetric('metric2', 200);
    
    const report = PerformanceMonitorService.getPerformanceReport();
    
    expect(report.metrics).toHaveProperty('metric1');
    expect(report.metrics).toHaveProperty('metric2');
    expect(report.summary.totalMetrics).toBe(2);
  });

  test('limpeza de métricas antigas', () => {
    const oldDate = Date.now() - 100000;
    PerformanceMonitorService.trackMetric('test', 100);
    PerformanceMonitorService.metrics.get('test')[0].timestamp = oldDate;
    
    PerformanceMonitorService.clearMetrics(50000);
    expect(PerformanceMonitorService.getMetrics('test')).toHaveLength(0);
  });
});