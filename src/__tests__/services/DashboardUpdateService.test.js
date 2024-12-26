import DashboardUpdateService from '../../../../components/DashboardGeral/services/DashboardUpdateService';
import RealtimeUpdateService from '../../../../components/DashboardGeral/services/RealtimeUpdateService';

jest.mock('../../../../components/DashboardGeral/services/RealtimeUpdateService');

describe('DashboardUpdateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DashboardUpdateService.clearMetrics();
  });

  test('deve subscrever a métricas corretamente', () => {
    const callback = jest.fn();
    const path = 'metrics/test';
    
    DashboardUpdateService.subscribeToMetric(path, callback);
    expect(RealtimeUpdateService.subscribe).toHaveBeenCalledWith(
      path,
      expect.any(Function),
      {}
    );
  });

  test('deve notificar callbacks sobre atualizações', () => {
    const updateCallback = jest.fn();
    const metricCallback = jest.fn();
    const path = 'metrics/test';
    const testData = { value: 100 };

    DashboardUpdateService.subscribeToMetric(path, metricCallback);
    DashboardUpdateService.subscribeToUpdates(updateCallback);

    // Simula atualização de métrica
    DashboardUpdateService.handleMetricUpdate(path, testData, metricCallback);

    expect(metricCallback).toHaveBeenCalledWith(testData);
    expect(updateCallback).toHaveBeenCalledWith(expect.objectContaining({
      metrics: expect.any(Object),
      timestamp: expect.any(Date)
    }));
  });

  test('deve recuperar valores de métricas corretamente', () => {
    const path = 'metrics/test';
    const testData = { value: 100 };

    DashboardUpdateService.subscribeToMetric(path, jest.fn());
    DashboardUpdateService.handleMetricUpdate(path, testData, jest.fn());

    expect(DashboardUpdateService.getMetricValue(path)).toEqual(testData);
    expect(DashboardUpdateService.getAllMetrics()).toHaveProperty(path, testData);
  });

  test('deve manter registro do último update', () => {
    const path = 'metrics/test';
    const testData = { value: 100 };

    DashboardUpdateService.subscribeToMetric(path, jest.fn());
    DashboardUpdateService.handleMetricUpdate(path, testData, jest.fn());

    expect(DashboardUpdateService.getLastUpdate()).toBeInstanceOf(Date);
  });
});