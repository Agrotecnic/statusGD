import WebSocketService from '../../../../components/DashboardGeral/services/WebSocketService';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';

describe('WebSocketService', () => {
  let mockWebSocket;
  const mockUrl = 'ws://test.com';

  beforeEach(() => {
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    global.WebSocket = jest.fn(() => mockWebSocket);
    WebSocketService.disconnect();
    StateManager.setState = jest.fn();
  });

  test('connection establishment', async () => {
    const connectPromise = WebSocketService.connect(mockUrl);
    mockWebSocket.onopen();
    
    await connectPromise;
    expect(WebSocketService.isConnected).toBe(true);
    expect(StateManager.setState).toHaveBeenCalledWith(
      expect.objectContaining({
        websocket: expect.objectContaining({
          status: 'connected'
        })
      })
    );
  });

  test('message handling', () => {
    const mockHandler = jest.fn();
    const messageType = 'test';
    const mockData = { value: 123 };

    WebSocketService.connect(mockUrl);
    WebSocketService.subscribe(messageType, mockHandler);

    mockWebSocket.onmessage({
      data: JSON.stringify({ type: messageType, data: mockData })
    });

    expect(mockHandler).toHaveBeenCalledWith(mockData);
  });

  test('message queueing when disconnected', () => {
    WebSocketService.send('test', { data: 'test' });
    expect(WebSocketService.messageQueue.length).toBe(1);

    WebSocketService.connect(mockUrl);
    mockWebSocket.onopen();

    expect(WebSocketService.messageQueue.length).toBe(0);
  });

  test('reconnection logic', () => {
    jest.useFakeTimers();
    WebSocketService.connect(mockUrl);
    mockWebSocket.onclose();

    expect(WebSocketService.isConnected).toBe(false);
    expect(WebSocketService.reconnectAttempts).toBe(1);

    jest.advanceTimersByTime(1000);
    expect(global.WebSocket).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  test('subscription management', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const messageType = 'test';

    const unsubscribe1 = WebSocketService.subscribe(messageType, handler1);
    WebSocketService.subscribe(messageType, handler2);

    mockWebSocket.onmessage({
      data: JSON.stringify({ type: messageType, data: 'test' })
    });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();

    unsubscribe1();

    mockWebSocket.onmessage({
      data: JSON.stringify({ type: messageType, data: 'test2' })
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(2);
  });
});