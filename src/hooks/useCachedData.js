import { useState, useEffect, useCallback } from 'react';
import dashboardCache, { withCache } from '../utils/dashboardCache';
import { useMonitoring } from './useMonitoring';

export const useCachedData = (fetchFunction, filters = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  const { trackError, trackAction } = useMonitoring('useCachedData');

  const fetchData = useCallback(async (forceFresh = false) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (forceFresh) {
        result = await fetchFunction();
        dashboardCache.set(filters, result);
        setIsCached(false);
        trackAction('fetchFreshData', { filters });
      } else {
        result = await withCache(fetchFunction, filters);
        setIsCached(dashboardCache.isCacheFresh(filters));
        trackAction('fetchCachedData', { filters, isCached: true });
      }

      setData(result);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao buscar dados');
      trackError(err, { context: 'fetchData', filters });
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, filters, trackError, trackAction]);

  // Efeito para buscar dados quando filtros mudam
  useEffect(() => {
    if (options.skipInitialFetch) return;

    fetchData(options.forceFresh);
  }, [fetchData, options.skipInitialFetch, options.forceFresh]);

  // Função para forçar atualização
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Função para limpar cache
  const clearCache = useCallback(() => {
    dashboardCache.clear();
    trackAction('clearCache');
  }, [trackAction]);

  return {
    data,
    loading,
    error,
    isCached,
    refresh,
    clearCache
  };
};

export default useCachedData;