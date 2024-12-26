import SyncService from '../../../../components/DashboardGeral/services/SyncService';
import WebSocketService from '../../../../components/DashboardGeral/services/WebSocketService';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';

jest.mock('../../../../components/DashboardGeral/services/WebSocketService');
jest.mock('../../../../components/DashboardGeral/services/StateManager');

describe('SyncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    WebSocketService.send.mockClear();
  });

  test('sincronização bem-sucedida', async () => {
    WebSocketService.subscribe.mockImplementation((event, callback) => {
      setTimeout(() => {
        callback({ key: 'testKey' });
      }, 100);
      return jest.fn();
    });

    const result = await SyncService.syncData('testKey', { data: 'test' });
    
    expect(result).toBe(true);
    expect(WebSocketService.send).toHaveBeenCalledWith(
      'sync',
      expect.objectContaining({ key: 'testKey' })
    );
  });

  test('gerenciamento de falhas e tentativas', async () => {
    jest.useFakeTimers();
    
    let attemptCount = 0;
    WebSocketService.subscribe.mockImplementation((event, callback) => {
      setTimeout(() => {
        attemptCount++;
        if (attemptCount <= 2) {
          throw new Error('Sync failed');
        }
        callback({ key: 'testKey' });
      }, 100);
      return jest.fn();
    });

    const syncPromise = SyncService.syncData('testKey', { data: 'test' });
    
    for (let i = 0; i < 3; i++) {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    }

    const result = await syncPromise;
    expect(result).toBe(false);
    
    jest.useRealTimers();
  });

  test('status da fila de sincronização', async () => {
    await SyncService.syncData('key1', { data: 'test1' });
    await SyncService.syncData('key2', { data: 'test2' });

    const status = SyncService.getQueueStatus();
    expect(status.pending).toBe(2);
    expect(status.items).toHaveLength(2);
  });
});