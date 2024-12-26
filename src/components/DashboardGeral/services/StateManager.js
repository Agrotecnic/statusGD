import AdvancedCacheService from './AdvancedCacheService';
import LoggerService from './LoggerService';
import { create } from 'zustand';

export const createStateManager = (initialState) => {
  return create((set) => ({
    ...initialState,
    updateState: (newState) => set(newState)
  }));
};
class StateManager {
  constructor() {
    this.state = {
      metrics: {},
      filters: {},
      alerts: [],
      settings: {},
      ui: {}
    };
    this.subscribers = new Map();
    this.middleware = [];
  }

  initialize(initialState = {}) {
    this.state = {
      ...this.state,
      ...initialState,
      lastUpdate: new Date()
    };
    
    this.setupCache();
    return this.state;
  }

  setupCache() {
    Object.keys(this.state).forEach(key => {
      const cachedData = AdvancedCacheService.getCacheData(key);
      if (cachedData) {
        this.state[key] = cachedData;
      }
    });
  }

  getState(selector) {
    if (selector) {
      return selector(this.state);
    }
    return this.state;
  }

  setState(updater, options = {}) {
    const prevState = { ...this.state };
    const nextState = typeof updater === 'function' 
      ? updater(prevState)
      : { ...prevState, ...updater };

    const changes = this.getStateChanges(prevState, nextState);
    
    if (Object.keys(changes).length === 0) return false;

    // Executa middlewares
    const shouldUpdate = this.middleware.every(middleware => 
      middleware(prevState, nextState, changes)
    );

    if (!shouldUpdate) return false;

    this.state = nextState;
    this.state.lastUpdate = new Date();

    // Atualiza cache se necessário
    if (options.cache !== false) {
      this.updateCache(changes);
    }

    // Notifica subscribers
    this.notifySubscribers(changes);

    LoggerService.log('state', 'State updated', { changes });
    return true;
  }

  subscribe(selector, callback) {
    const id = crypto.randomUUID();
    this.subscribers.set(id, { selector, callback });
    
    return () => this.subscribers.delete(id);
  }

  addMiddleware(middleware) {
    this.middleware.push(middleware);
    return () => {
      const index = this.middleware.indexOf(middleware);
      if (index > -1) {
        this.middleware.splice(index, 1);
      }
    };
  }

  getStateChanges(prevState, nextState) {
    const changes = {};
    const allKeys = new Set([
      ...Object.keys(prevState),
      ...Object.keys(nextState)
    ]);

    for (const key of allKeys) {
      if (prevState[key] !== nextState[key]) {
        changes[key] = nextState[key];
      }
    }

    return changes;
  }

  updateCache(changes) {
    Object.entries(changes).forEach(([key, value]) => {
      AdvancedCacheService.setCacheStrategy(
        key,
        value,
        this.getCachePriority(key)
      );
    });
  }

  getCachePriority(key) {
    const priorities = {
      metrics: 'HIGH',
      filters: 'HIGH',
      alerts: 'HIGH',
      settings: 'MEDIUM',
      ui: 'LOW'
    };
    return priorities[key] || 'MEDIUM';
  }

  notifySubscribers(changes) {
    this.subscribers.forEach(({ selector, callback }) => {
      if (!selector || this.shouldNotifySubscriber(selector, changes)) {
        callback(this.getState(selector));
      }
    });
  }

  shouldNotifySubscriber(selector, changes) {
    const prevSelected = selector({ ...this.state, ...changes });
    const nextSelected = selector(this.state);
    return prevSelected !== nextSelected;
  }
}

export default new StateManager();