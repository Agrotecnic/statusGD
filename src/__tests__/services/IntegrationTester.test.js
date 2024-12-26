import IntegrationTester from '../../../../components/DashboardGeral/services/IntegrationTester';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';
import MetricsService from '../../../../components/DashboardGeral/services/MetricsService';
import SyncService from '../../../../components/DashboardGeral/services/SyncService';
import APIIntegrationService from '../../../../components/DashboardGeral/services/APIIntegrationService';

jest.mock('../../../../components/DashboardGeral/services/StateManager');
jest.mock('../../../../components/DashboardGeral/services/MetricsService');
jest.mock('../../../../components/DashboardGeral/services/SyncService');
jest.mock('../../../../components/DashboardGeral/services/APIIntegrationService');

describe('IntegrationTester', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StateManager.getState.mockReturnValue({
      metrics: {},
      sync: {},
      api: {}
    });
  });

  test('integração completa', async () => {
    MetricsService.getMetric.mockReturnValue([{ value: 100 }]);
    SyncService.syncData.mockResolvedValue(true);
    APIIntegrationService.request.mockResolvedValue({ data: 'test' });

    const result = await IntegrationTester.testIntegration();
    expect(result.success).toBe(true);
  });

  test('verificação de cache', async () => {
    const result = await IntegrationTester.verifyCache();
    expect(result.success).toBeDefined();
  });

  test('monitoramento em tempo real', () => {
    const monitor = IntegrationTester.monitorRealtime();
    monitor.start();
    
    // Simula atualização
    StateManager.subscribe.mockImplementation(cb => cb({}));
    
    const metrics = monitor.getMetrics();
    expect(metrics.updateCount).toBeGreaterThan(0);
  });
});