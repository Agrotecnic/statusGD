class DashboardCache {
    constructor(options = {}) {
      this.cache = new Map();
      this.config = {
        maxAge: options.maxAge || 5 * 60 * 1000, // 5 minutos por padrão
        maxItems: options.maxItems || 100,
        cleanupInterval: options.cleanupInterval || 60 * 1000 // 1 minuto
      };
  
      // Iniciar limpeza automática
      this.startCleanupInterval();
    }
  
    // Gerar chave de cache baseada nos filtros
    generateKey(filters) {
      return JSON.stringify({
        ...filters,
        timestamp: Math.floor(Date.now() / this.config.maxAge)
      });
    }
  
    // Obter dados do cache
    get(filters) {
      const key = this.generateKey(filters);
      const cached = this.cache.get(key);
  
      if (!cached) return null;
  
      const isExpired = Date.now() - cached.timestamp > this.config.maxAge;
      if (isExpired) {
        this.cache.delete(key);
        return null;
      }
  
      return cached.data;
    }
  
    // Armazenar dados no cache
    set(filters, data) {
      const key = this.generateKey(filters);
      
      // Limpar cache se exceder limite
      if (this.cache.size >= this.config.maxItems) {
        this.cleanup();
      }
  
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
  
    // Limpar dados expirados
    cleanup() {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > this.config.maxAge) {
          this.cache.delete(key);
        }
      }
    }
  
    // Iniciar intervalo de limpeza
    startCleanupInterval() {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, this.config.cleanupInterval);
    }
  
    // Parar intervalo de limpeza
    stopCleanupInterval() {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
    }
  
    // Limpar cache manualmente
    clear() {
      this.cache.clear();
    }
  
    // Verificar se dados estão disponíveis e frescos
    isCacheFresh(filters) {
      const cached = this.get(filters);
      return cached !== null;
    }
  
    // Obter estatísticas do cache
    getStats() {
      return {
        size: this.cache.size,
        maxItems: this.config.maxItems,
        maxAge: this.config.maxAge,
        cleanupInterval: this.config.cleanupInterval
      };
    }
  
    // Destruir instância
    destroy() {
      this.stopCleanupInterval();
      this.clear();
    }
  }
  
  // Criar instância única do cache
  const dashboardCache = new DashboardCache();
  
  // Middleware para integrar cache com chamadas de dados
  export const withCache = async (fetchFunction, filters = {}) => {
    // Tentar obter do cache primeiro
    const cachedData = dashboardCache.get(filters);
    if (cachedData) {
      return cachedData;
    }
  
    // Se não estiver no cache, buscar dados frescos
    const freshData = await fetchFunction();
    
    // Salvar no cache
    dashboardCache.set(filters, freshData);
    
    return freshData;
  };
  
  export const clearCache = () => dashboardCache.clear();
  export const getCacheStats = () => dashboardCache.getStats();
  
  export default dashboardCache;