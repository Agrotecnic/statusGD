import WebSocketService from './WebSocketService';
import StateManager from './StateManager';
import AdvancedCacheService from './AdvancedCacheService';
import LoggerService from './LoggerService';

class SyncService {
  constructor() {
    this.syncQueue = new Map();
    this.retryDelays = [1000, 2000, 5000, 10000];
    this.maxRetries = 3;
  }

  async syncData(key, data, priority = 'HIGH') {
    const syncId = crypto.randomUUID();
    this.queueSync(syncId, key, data);

    try {
      await this.processSyncItem(syncId);
      return true;
    } catch (error) {
      LoggerService.log('error', 'Sync failed', { key, error });
      return false;
    }
  }

  queueSync(syncId, key, data) {
    this.syncQueue.set(syncId, {
      key,
      data,
      retries: 0,
      timestamp: Date.now()
    });
  }

  async processSyncItem(syncId) {
    const item = this.syncQueue.get(syncId);
    if (!item) return;

    try {
      await this.performSync(item);
      this.syncQueue.delete(syncId);
      
      StateManager.setState({
        sync: {
          lastSync: new Date(),
          status: 'success'
        }
      });
    } catch (error) {
      if (item.retries < this.maxRetries) {
        this.scheduleRetry(syncId, item);
      } else {
        this.handleSyncFailure(syncId, item, error);
      }
    }
  }

  async performSync(item) {
    const { key, data } = item;
    
    // Atualiza cache local
    AdvancedCacheService.setCacheStrategy(key, data, 'HIGH');
    
    // Envia para WebSocket
    WebSocketService.send('sync', { key, data });
    
    // Aguarda confirmação
    await this.waitForSyncConfirmation(key);
  }

  waitForSyncConfirmation(key) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Sync confirmation timeout'));
      }, 5000);

      const unsubscribe = WebSocketService.subscribe('sync_confirm', (response) => {
        if (response.key === key) {
          clearTimeout(timeout);
          unsubscribe();
          resolve(response);
        }
      });
    });
  }

  scheduleRetry(syncId, item) {
    const delay = this.retryDelays[item.retries];
    item.retries++;
    this.syncQueue.set(syncId, item);

    setTimeout(() => {
      this.processSyncItem(syncId);
    }, delay);
  }

  handleSyncFailure(syncId, item, error) {
    this.syncQueue.delete(syncId);
    
    StateManager.setState({
      sync: {
        lastSync: new Date(),
        status: 'error',
        error: error.message
      }
    });

    LoggerService.log('error', 'Sync failed after retries', {
      key: item.key,
      retries: item.retries,
      error
    });
  }

  getQueueStatus() {
    return {
      pending: this.syncQueue.size,
      items: Array.from(this.syncQueue.values()).map(item => ({
        key: item.key,
        retries: item.retries,
        age: Date.now() - item.timestamp
      }))
    };
  }
}

export default new SyncService();