// src/__tests__/services/DashboardIntegrationService.test.js

import DashboardIntegrationService from '../../../../components/DashboardGeral/services/DashboardIntegrationService';
import * as FirebaseRealtimeService from '../../../../components/DashboardGeral/services/FirebaseRealtimeService';
import * as CacheService from '../../../../components/DashboardGeral/services/CacheService';
import * as LoggerService from '../../../../components/DashboardGeral/services/LoggerService';

// Mocks atualizados para funções exportadas
jest.mock('../../../../components/DashboardGeral/services/FirebaseRealtimeService', () => ({
  initialize: jest.fn()
}));

jest.mock('../../../../components/DashboardGeral/services/CacheService', () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  getAll: jest.fn()
}));

jest.mock('../../../../components/DashboardGeral/services/LoggerService', () => ({
  log: jest.fn(),
  getLogs: jest.fn(),
  clearLogs: jest.fn()
}));

describe('DashboardIntegrationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DashboardIntegrationService.cleanup();
  });

  test('deve inicializar corretamente', async () => {
    await DashboardIntegrationService.initialize();
    expect(FirebaseRealtimeService.initialize).toHaveBeenCalledTimes(1);
    expect(LoggerService.log).toHaveBeenCalledWith(
      'system',
      expect.any(String)
    );
  });

  test('deve aplicar filtros corretamente', () => {
    const testData = {
      metrics: [
        { timestamp: '2024-01-01', value: 100 },
        { timestamp: '2024-02-01', value: 200 }
      ]
    };

    const filters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      }
    };

    DashboardIntegrationService.updateFilters(filters);
    const filteredData = DashboardIntegrationService.applyFilters(testData);
    expect(filteredData.metrics).toHaveLength(1);
    expect(filteredData.metrics[0]).toEqual(
      expect.objectContaining({
        timestamp: '2024-01-01',
        value: 100
      })
    );
  });

  test('deve gerenciar subscribers corretamente', () => {
    const mockCallback = jest.fn();
    const testData = { data: 'test' };
    const testData2 = { data: 'test2' };

    const unsubscribe = DashboardIntegrationService.subscribe('metricsUpdate', mockCallback);
    DashboardIntegrationService.notifySubscribers('metricsUpdate', testData);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testData);

    unsubscribe();
    DashboardIntegrationService.notifySubscribers('metricsUpdate', testData2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalledWith(testData2);
  });

  test('deve atualizar cache ao receber novos dados', () => {
    const testData = {
      metrics: {
        test: 100
      }
    };

    DashboardIntegrationService.handleMetricsUpdate(testData);

    expect(CacheService.set).toHaveBeenCalledTimes(1);
    expect(CacheService.set).toHaveBeenCalledWith(
      'currentMetrics',
      expect.objectContaining({
        metrics: expect.objectContaining({
          test: 100
        })
      })
    );
  });

  test('deve lidar com erros de inicialização graciosamente', async () => {
    FirebaseRealtimeService.initialize.mockRejectedValueOnce(new Error('Erro de conexão'));
    await DashboardIntegrationService.initialize();

    expect(LoggerService.log).toHaveBeenCalledWith(
      'error',
      expect.stringContaining('inicialização'),
      expect.any(Error)
    );
  });

  test('deve lidar com dados inválidos no filtro', () => {
    const invalidData = null;
    const filters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      }
    };

    DashboardIntegrationService.updateFilters(filters);
    const result = DashboardIntegrationService.applyFilters(invalidData);

    expect(result).toEqual(expect.objectContaining({
      metrics: expect.any(Array)
    }));
    expect(result.metrics).toHaveLength(0);
  });
});