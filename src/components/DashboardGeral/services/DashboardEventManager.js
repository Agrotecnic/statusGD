import StateManager from './StateManager';
import LoggerService from './LoggerService';

class DashboardEventManager {
  constructor() {
    this.handlers = new Map();
    this.eventQueue = [];
    this.processing = false;
  }

  on(eventType, handler, priority = 0) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map());
    }

    const handlers = this.handlers.get(eventType);
    const id = crypto.randomUUID();
    
    handlers.set(id, { handler, priority });
    return () => handlers.delete(id);
  }

  async emit(eventType, data) {
    this.eventQueue.push({ type: eventType, data, timestamp: Date.now() });
    
    if (!this.processing) {
      await this.processEventQueue();
    }
  }

  async processEventQueue() {
    this.processing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      await this.processEvent(event);
    }

    this.processing = false;
  }

  async processEvent(event) {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    const sortedHandlers = Array.from(handlers.entries())
      .sort(([, a], [, b]) => b.priority - a.priority);

    try {
      for (const [id, { handler }] of sortedHandlers) {
        await handler(event.data);
      }

      StateManager.setState({
        events: {
          last: event,
          processed: true,
          timestamp: new Date()
        }
      });

    } catch (error) {
      LoggerService.log('error', 'Event processing failed', {
        event,
        error
      });

      StateManager.setState({
        events: {
          last: event,
          error: error.message,
          timestamp: new Date()
        }
      });
    }
  }

  getEventHandlers(eventType) {
    return Array.from(this.handlers.get(eventType)?.values() || []);
  }

  clearHandlers(eventType) {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }
}

export default new DashboardEventManager();