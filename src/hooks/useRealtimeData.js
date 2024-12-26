// src/components/DashboardGeral/hooks/useRealtimeData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import FirebaseRealtimeService from '../services/FirebaseRealtimeService';

const useRealtimeData = (path, filters = {}, interval = 5000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Memorize filters
  const memoizedFilters = useMemo(() => {
    return JSON.stringify(filters);
  }, [filters]);

  // Função de refetch
  const refetch = useCallback(async () => {
    try {
      const newData = await FirebaseRealtimeService.fetchData(path, JSON.parse(memoizedFilters));
      setData(newData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Firebase Realtime Error:', err);
      setError(err);
    }
  }, [path, memoizedFilters]);

  useEffect(() => {
    setLoading(true);

    // Subscribe to connection status
    const unsubscribeConnection = FirebaseRealtimeService.subscribeToConnectionStatus(
      (connected) => setIsConnected(connected)
    );

    // Subscribe to data
    const unsubscribeData = FirebaseRealtimeService.subscribeToData(
      path,
      (newData) => {
        setData(newData);
        setLastUpdate(new Date());
        setLoading(false);
        setError(null);
      },
      JSON.parse(memoizedFilters)
    );

    // Error handling
    const handleError = (error) => {
      console.error('Firebase Realtime Error:', error);
      setError(error);
      setLoading(false);
    };

    // Configurar intervalo de atualização
    const intervalId = setInterval(refetch, interval);

    window.addEventListener('unhandledrejection', handleError);

    // Cleanup
    return () => {
      unsubscribeData();
      unsubscribeConnection();
      clearInterval(intervalId);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [path, memoizedFilters, interval, refetch]);

  return { 
    data, 
    loading, 
    error, 
    isConnected,
    lastUpdate,
    refetch
  };
};

export default useRealtimeData;