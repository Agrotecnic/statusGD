import APIIntegrationService from '../../../../components/DashboardGeral/services/APIIntegrationService';
import DashboardEventManager from '../../../../components/DashboardGeral/services/DashboardEventManager';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';

jest.mock('../../../../components/DashboardGeral/services/StateManager');

describe('Core Services Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('APIIntegrationService', () => {
    test('gerenciamento de endpoints e requisições', async () => {
      APIIntegrationService.registerEndpoint('testAPI', {
        url: 'https://api.test.com',
        rateLimit: 100
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      });

      const result = await APIIntegrationService.request('testAPI');
      expect(result).toEqual({ data: 'test' });
      expect(StateManager.setState).toHaveBeenCalled();
    });

    test('rate limiting', async () => {
      APIIntegrationService.registerEndpoint('limitedAPI', {
        url: 'https://api.test.com',
        rateLimit: 1
      });

      await APIIntegrationService.request('limitedAPI');
      await expect(APIIntegrationService.request('limitedAPI')).rejects.toThrow();
    });
  });

  describe('DashboardEventManager', () => {
    test('processamento de eventos em ordem de prioridade', async () => {
      const events = [];
      
      DashboardEventManager.on('test', () => events.push(1), 1);
      DashboardEventManager.on('test', () => events.push(2), 2);
      
      await DashboardEventManager.emit('test');
      expect(events).toEqual([2, 1]);
    });

    test('manipulação de erros em eventos', async () => {
      DashboardEventManager.on('error', () => {
        throw new Error('Test error');
      });

      await DashboardEventManager.emit('error');
      expect(StateManager.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            error: expect.any(String)
          })
        })
      );
    });
  });
});