import { renderHook, act } from '@testing-library/react-hooks';
import { useWebSocket } from '../../../../components/DashboardGeral/hooks/useWebSocket';
import WebSocketService from '../../../../components/DashboardGeral/services/WebSocketService';

jest.mock('../../../../components/DashboardGeral/services/WebSocketService');

describe('useWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('subscription management', () => {
    const mockHandler = jest.fn();
    const unsubscribeMock = jest.fn();
    WebSocketService.subscribe.mockReturnValue(unsubscribeMock);

    const { result, unmount } = renderHook(() => 
      useWebSocket(['test_message'])
    );

    act(() => {
      result.current.subscribe('test_message', mockHandler);
    });

    expect(WebSocketService.subscribe).toHaveBeenCalledWith(
      'test_message',
      mockHandler
    );

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  test('message sending', () => {
    const { result } = renderHook(() => useWebSocket());

    act(() => {
      result.current.send('test_message', { data: 'test' });
    });

    expect(WebSocketService.send).toHaveBeenCalledWith(
      'test_message',
      { data: 'test' }
    );
  });

  test('connection state tracking', () => {
    const { result } = renderHook(() => useWebSocket());

    expect(result.current.isConnected).toBeDefined();
    expect(result.current.lastMessage).toBeDefined();
    expect(result.current.lastUpdate).toBeDefined();
  });

  test('multiple message types', () => {
    const messageTypes = ['type1', 'type2', 'type3'];
    const { result } = renderHook(() => useWebSocket(messageTypes));

    messageTypes.forEach(type => {
      act(() => {
        result.current.subscribe(type, jest.fn());
      });
    });

    expect(WebSocketService.subscribe).toHaveBeenCalledTimes(messageTypes.length);
  });
});