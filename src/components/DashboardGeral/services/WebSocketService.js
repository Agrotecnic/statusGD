import StateManager from './StateManager';
import LoggerService from './LoggerService';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscriptions = new Map();
    this.messageQueue = [];
    this.isConnected = false;
  }

  connect(url, options = {}) {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = new WebSocket(url);
      this.setupSocketListeners();
      this.initializeHeartbeat();
      
      return new Promise((resolve, reject) => {
        this.socket.onopen = () => {
          this.onConnectionEstablished();
          resolve();
        };
        this.socket.onerror = (error) => {
          reject(error);
        };
      });
    } catch (error) {
      LoggerService.log('error', 'WebSocket connection failed', { error });
      throw error;
    }
  }

  setupSocketListeners() {
    this.socket.onmessage = (event) => this.handleMessage(event);
    this.socket.onclose = () => this.handleDisconnection();
    this.socket.onerror = (error) => {
      LoggerService.log('error', 'WebSocket error', { error });
    };
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      
      if (message.type === 'heartbeat') {
        this.handleHeartbeat(message);
        return;
      }

      const handlers = this.subscriptions.get(message.type) || [];
      handlers.forEach(handler => {
        try {
          handler(message.data);
        } catch (error) {
          LoggerService.log('error', 'Message handler failed', { error });
        }
      });

      StateManager.setState({
        websocket: {
          lastMessage: message,
          timestamp: new Date()
        }
      });
    } catch (error) {
      LoggerService.log('error', 'Failed to process message', { error });
    }
  }

  subscribe(messageType, handler) {
    if (!this.subscriptions.has(messageType)) {
      this.subscriptions.set(messageType, new Set());
    }
    this.subscriptions.get(messageType).add(handler);
    
    return () => {
      const handlers = this.subscriptions.get(messageType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(messageType);
        }
      }
    };
  }

  send(type, data) {
    const message = JSON.stringify({ type, data });
    
    if (!this.isConnected) {
      this.messageQueue.push(message);
      return;
    }

    try {
      this.socket.send(message);
    } catch (error) {
      LoggerService.log('error', 'Failed to send message', { error });
      this.messageQueue.push(message);
    }
  }

  onConnectionEstablished() {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.processMessageQueue();
    
    StateManager.setState({
      websocket: {
        status: 'connected',
        timestamp: new Date()
      }
    });
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      try {
        this.socket.send(message);
      } catch (error) {
        LoggerService.log('error', 'Failed to process queued message', { error });
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  handleDisconnection() {
    this.isConnected = false;
    StateManager.setState({
      websocket: {
        status: 'disconnected',
        timestamp: new Date()
      }
    });

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnection();
    }
  }

  scheduleReconnection() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      try {
        this.connect(this.socket.url);
      } catch (error) {
        LoggerService.log('error', 'Reconnection failed', { error });
      }
    }, delay);
  }

  initializeHeartbeat() {
    setInterval(() => {
      if (this.isConnected) {
        this.send('heartbeat', { timestamp: new Date() });
      }
    }, 30000);
  }

  handleHeartbeat(message) {
    this.send('heartbeat_ack', {
      timestamp: message.data.timestamp,
      received: new Date()
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.messageQueue = [];
  }
}

export default new WebSocketService();