import AdvancedCacheService from '../../../../components/DashboardGeral/services/AdvancedCacheService';
import CacheService from '../../../../components/DashboardGeral/services/CacheService';

jest.mock('../../../../components/DashboardGeral/services/CacheService');

describe('AdvancedCacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    CacheService.set.mockClear();
  });

  test('deve gerenciar prioridades de cache', () => {
    const testData = { value: 'test' };
    AdvancedCacheService.setCacheStrategy('test-key', testData, 'HIGH');

    expect(CacheService.set).toHaveBeenCalledWith(
      'test-key',
      expect.objectContaining({
        data: testData,
        metadata: expect.objectContaining({
          priority: 'HIGH'
        })
      })
    );
  });

  test('deve gerenciar tamanho do cache', () => {
    const originalMaxSize = AdvancedCacheService.maxSize;
    AdvancedCacheService.maxSize = 2;

    AdvancedCacheService.setCacheStrategy('key1', 'data1', 'LOW');
    AdvancedCacheService.setCacheStrategy('key2', 'data2', 'MEDIUM');
    AdvancedCacheService.setCacheStrategy('key3', 'data3', 'HIGH');

    expect(AdvancedCacheService.metrics.size).toBeLessThanOrEqual(2);
    AdvancedCacheService.maxSize = originalMaxSize;
  });

  test('deve rastrear métricas de acesso', () => {
    AdvancedCacheService.setCacheStrategy('test-key', 'data');
    AdvancedCacheService.getCacheData('test-key');
    AdvancedCacheService.getCacheData('test-key');

    const metrics = AdvancedCacheService.getMetrics();
    expect(metrics['test-key'].accessCount).toBe(2);
  });

  test('deve otimizar cache baseado no uso', () => {
    const largeData = new Array(1000000).fill('x').join('');
    AdvancedCacheService.setCacheStrategy('large-key', largeData);

    AdvancedCacheService.optimizeCache();
    const metrics = AdvancedCacheService.getMetrics();
    expect(metrics['large-key']).toBeDefined();
  });

  test('deve precarregar dados corretamente', () => {
    const dataList = [
      { key: 'key1', data: 'data1', priority: 'HIGH' },
      { key: 'key2', data: 'data2', priority: 'LOW' }
    ];

    AdvancedCacheService.preloadData(dataList);
    expect(CacheService.set).toHaveBeenCalledTimes(2);
  });
});