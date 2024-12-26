class DashboardCache {
  constructor() {
    this.cache = new Map();
    this.reportCache = new Map();
    this.lastUpdate = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.reportCacheTimeout = 30 * 60 * 1000; // 30 minutos para relatórios
  }

  generateKey(filters) {
    return JSON.stringify({
      regional: filters.regional || 'all',
      period: filters.period,
      startDate: filters.startDate,
      endDate: filters.endDate
    });
  }

  generateReportKey(filters, reportType, format) {
    return JSON.stringify({
      ...JSON.parse(this.generateKey(filters)),
      reportType,
      format
    });
  }

  set(filters, data) {
    const key = this.generateKey(filters);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.lastUpdate = Date.now();
  }

  get(filters) {
    const key = this.generateKey(filters);
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  // Cache específico para relatórios
  setReport(filters, reportType, format, blob) {
    const key = this.generateReportKey(filters, reportType, format);
    this.reportCache.set(key, {
      blob,
      timestamp: Date.now()
    });
  }

  getReport(filters, reportType, format) {
    const key = this.generateReportKey(filters, reportType, format);
    const cached = this.reportCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.reportCacheTimeout;
    if (isExpired) {
      this.reportCache.delete(key);
      return null;
    }
    return cached.blob;
  }

  clear() {
    this.cache.clear();
    this.reportCache.clear();
    this.lastUpdate = null;
  }

  clearReports() {
    this.reportCache.clear();
  }

  isStale() {
    if (!this.lastUpdate) return true;
    return Date.now() - this.lastUpdate > this.cacheTimeout;
  }

  // Limpa entradas expiradas periodicamente
  cleanup() {
    const now = Date.now();
    
    // Limpa cache de dados
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
    
    // Limpa cache de relatórios
    for (const [key, value] of this.reportCache.entries()) {
      if (now - value.timestamp > this.reportCacheTimeout) {
        this.reportCache.delete(key);
      }
    }
  }
}

export const dashboardCache = new DashboardCache();

// Middleware para integrar com o fetch de dados
export const withCache = async (fetchFunction, filters) => {
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

// Middleware para cache de relatórios
export const withReportCache = async (exportFunction, filters, reportType, format) => {
  // Tentar obter relatório do cache
  const cachedReport = dashboardCache.getReport(filters, reportType, format);
  if (cachedReport) {
    return cachedReport;
  }

  // Se não estiver no cache, gerar novo relatório
  const reportBlob = await exportFunction();
  
  // Salvar no cache
  dashboardCache.setReport(filters, reportType, format, reportBlob);
  return reportBlob;
};