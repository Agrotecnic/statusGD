// src/__tests__/components/DashboardGeral/hooks/useRealtimeData.test.js

import { renderHook, act } from '@testing-library/react-hooks';
import useRealtimeData from '../../../../components/DashboardGeral/hooks/useRealtimeData';
import FirebaseRealtimeService from '../../../../services/FirebaseRealtimeService';

jest.mock('../../../../services/FirebaseRealtimeService');

describe('useRealtimeData', () => {
 beforeEach(() => {
   jest.useFakeTimers();
   FirebaseRealtimeService.subscribeToConnectionStatus.mockImplementation((cb) => {
     cb(true);
     return jest.fn();
   });
   FirebaseRealtimeService.subscribeToData.mockImplementation((path, cb) => {
     cb({ test: 'data' });
     return jest.fn();
   });
   FirebaseRealtimeService.fetchData.mockResolvedValue({ test: 'data' });
 });

 afterEach(() => {
   jest.clearAllMocks();
   jest.clearAllTimers();
   jest.useRealTimers();
 });

 it('initializes with correct state', async () => {
   const { result, waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path', {}, 1000)
   );

   expect(result.current.loading).toBe(true);
   await waitForNextUpdate();
   
   expect(result.current.data).toEqual({ test: 'data' });
   expect(result.current.loading).toBe(false);
   expect(result.current.isConnected).toBe(true);
   expect(result.current.error).toBe(null);
 });

 it('handles connection status updates', async () => {
   FirebaseRealtimeService.subscribeToConnectionStatus.mockImplementation((cb) => {
     cb(false);
     return jest.fn();
   });

   const { result, waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path')
   );

   await waitForNextUpdate();
   expect(result.current.isConnected).toBe(false);
 });

 it('updates data on interval', async () => {
   const { waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path', {}, 1000)
   );

   await waitForNextUpdate();
   act(() => {
     jest.advanceTimersByTime(1000);
   });

   expect(FirebaseRealtimeService.fetchData).toHaveBeenCalled();
 });

 it('handles refetch manually', async () => {
   const { result, waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path')
   );

   await waitForNextUpdate();
   await act(async () => {
     await result.current.refetch();
   });

   expect(FirebaseRealtimeService.fetchData).toHaveBeenCalled();
 });

 it('handles errors', async () => {
   const testError = new Error('Test error');
   FirebaseRealtimeService.subscribeToData.mockImplementation(() => {
     throw testError;
   });

   const { result, waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path')
   );

   await waitForNextUpdate();
   expect(result.current.error).toBeTruthy();
 });

 it('cleans up subscriptions on unmount', () => {
   const unsubscribeData = jest.fn();
   const unsubscribeConnection = jest.fn();
   
   FirebaseRealtimeService.subscribeToData.mockReturnValue(unsubscribeData);
   FirebaseRealtimeService.subscribeToConnectionStatus.mockReturnValue(unsubscribeConnection);

   const { unmount } = renderHook(() => useRealtimeData('test/path'));
   unmount();

   expect(unsubscribeData).toHaveBeenCalled();
   expect(unsubscribeConnection).toHaveBeenCalled();
 });

 it('applies filters correctly', async () => {
   const testFilters = { status: 'active' };
   
   const { waitForNextUpdate } = renderHook(() => 
     useRealtimeData('test/path', testFilters)
   );

   await waitForNextUpdate();
   expect(FirebaseRealtimeService.subscribeToData).toHaveBeenCalledWith(
     'test/path',
     expect.any(Function),
     testFilters
   );
 });
});