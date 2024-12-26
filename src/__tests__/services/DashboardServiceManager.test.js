import DashboardServiceManager from '../../../../components/DashboardGeral/services/DashboardServiceManager';
import FirebaseRealtimeService from '../../../../components/DashboardGeral/services/FirebaseRealtimeService';
import AdvancedCacheService from '../../../../components/DashboardGeral/services/AdvancedCacheService';
import LoggerService from '../../../../components/DashboardGeral/services/LoggerService';

jest.mock('../../../../components/DashboardGeral/services/FirebaseRealtimeService');
jest.mock('../../../../components/DashboardGeral/services/AdvancedCacheService');
jest.mock('../../../../components/DashboardGeral/services/LoggerService');

describe('DashboardServiceManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DashboardServiceManager.cleanup();
  });

  test('inicialização correta do serviço', async () => {
    FirebaseRealtimeService.fetchData.mockResolvedValueOnce({});
    
    await DashboardServiceManager.initialize();
    
    expect(LoggerService.log).toHaveBeenCalledWith(
      'system',
      'Dashboard Service Manager initialized'
    );
    expect(DashboardServiceManager.initialized).toBe(true);
  });

  test('carregamento inicial de dados', async () => {
    const mockData = {
      kpis: { data: 'kpis' },
      metrics: { data: 'metrics' },
      trends: { data: 'trends' }
    };

    FirebaseRealtimeService.fetchData
      .mockResolvedValueOnce(mockData.kpis)
      .mockResolvedValueOnce(mockData.metrics)
      .mockResolvedValueOnce(mockData.trends);

    await DashboardServiceManager.loadInitialData();

    expect(AdvancedCacheService.preloadData).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'kpis' }),
        expect.objectContaining({ key: 'metrics' }),
        expect.objectContaining({ key: 'trends' })
      ])
    );
  });

  test('manipulação de atualizações em tempo real', () => {
    const testData = { value: 100 };
    DashboardServiceManager.handleRealtimeUpdate(testData);

    expect(AdvancedCacheService.setCacheStrategy).toHaveBeenCalledWith(
      'realtime_metrics',
      testData,
      'HIGH'
    );
  });

  test('geração de relatórios', async () => {
    const mockCacheData = {
      kpis: { data: 'kpis' },
      metrics: { data: 'metrics' }
    };

    AdvancedCacheService.getCacheData
      .mockReturnValueOnce(mockCacheData.kpis)
      .mockReturnValueOnce(mockCacheData.metrics);

    await DashboardServiceManager.generateReport({ format: 'excel' });
    
    expect(AdvancedCacheService.getCacheData).toHaveBeenCalledTimes(4);
  });

  test('métricas de performance', () => {
    const metrics = DashboardServiceManager.getPerformanceMetrics();
    
    expect(metrics).toHaveProperty('cacheMetrics');
    expect(metrics).toHaveProperty('lastUpdate');
    expect(metrics).toHaveProperty('initialized');
  });
});