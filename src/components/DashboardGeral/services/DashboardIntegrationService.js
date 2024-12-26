// src/components/DashboardGeral/services/DashboardIntegrationService.js

import FirebaseRealtimeService from './FirebaseRealtimeService';
import DashboardUpdateService from './DashboardUpdateService';
import RealtimeUpdateService from './RealtimeUpdateService';
import * as CacheService from './CacheService';
import * as LoggerService from './LoggerService';
import alertSystem from './AlertSystem';

class DashboardIntegrationService {
  constructor() {
    this.subscribers = new Map();
    this.currentFilters = null;
    this.isInitialized = false;

    // Bind dos métodos ao contexto da classe
    this.handleMetricsUpdate = this.handleMetricsUpdate.bind(this);
    this.handleDashboardUpdate = this.handleDashboardUpdate.bind(this);
  }

  async initialize(initialFilters = {}) {
    if (this.isInitialized) return;

    this.currentFilters = initialFilters;
    
    try {
      // Inicializa conexão com Firebase
      await FirebaseRealtimeService.initialize();
      
      // Configura listeners para atualizações
      RealtimeUpdateService.subscribe('metrics', this.handleMetricsUpdate);
      DashboardUpdateService.subscribeToUpdates(this.handleDashboardUpdate);
      
      LoggerService.log('system', 'Dashboard Integration Service initialized');
      this.isInitialized = true;
    } catch (error) {
      LoggerService.log('error', 'Erro na inicialização do serviço', error);
      throw error;
    }
  }

  handleMetricsUpdate(data) {
    // Processa dados e aplica filtros
    const filteredData = this.applyFilters(data);
    
    // Analisa alertas
    const alerts = alertSystem.analyzeAlerts(filteredData);
    
    // Atualiza cache
    CacheService.set('currentMetrics', filteredData);
    CacheService.set('currentAlerts', alerts);
    
    // Notifica subscribers
    this.notifySubscribers('metricsUpdate', {
      metrics: filteredData,
      alerts,
      timestamp: new Date()
    });
  }

  handleDashboardUpdate(update) {
    const { metrics, timestamp } = update;
    
    LoggerService.log('update', 'Dashboard data updated', {
      timestamp,
      metricsCount: Object.keys(metrics).length
    });

    this.notifySubscribers('dashboardUpdate', update);
  }

  applyFilters(data) {
    if (!data) {
      return { metrics: [] };
    }

    if (!this.currentFilters) return data;

    const {
      dateRange,
      selectedRegions,
      selectedMetrics,
      projectionHorizon,
      confidenceInterval
    } = this.currentFilters;

    // Aplica filtros de data
    let filteredData = this.filterByDateRange(data, dateRange);
    
    // Aplica filtros de região
    if (selectedRegions?.length) {
      filteredData = this.filterByRegions(filteredData, selectedRegions);
    }

    // Aplica filtros de métricas
    if (selectedMetrics?.length) {
      filteredData = this.filterByMetrics(filteredData, selectedMetrics);
    }

    // Aplica configurações de projeção
    if (projectionHorizon && confidenceInterval) {
      filteredData = this.applyProjectionSettings(
        filteredData, 
        projectionHorizon, 
        confidenceInterval
      );
    }

    return filteredData;
  }

  filterByDateRange(data, dateRange) {
    if (!dateRange?.start || !dateRange?.end) return data;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    return {
      ...data,
      metrics: data.metrics?.filter(metric => {
        const metricDate = new Date(metric.timestamp);
        return metricDate >= startDate && metricDate <= endDate;
      })
    };
  }

  filterByRegions(data, regions) {
    return {
      ...data,
      regionais: data.regionais?.filter(regional => 
        regions.includes(regional.id)
      )
    };
  }

  filterByMetrics(data, metrics) {
    const filteredMetrics = {};
    metrics.forEach(metricKey => {
      if (data.metrics?.[metricKey]) {
        filteredMetrics[metricKey] = data.metrics[metricKey];
      }
    });

    return {
      ...data,
      metrics: filteredMetrics
    };
  }

  applyProjectionSettings(data, horizon, confidence) {
    return {
      ...data,
      projectionSettings: {
        horizon: parseInt(horizon),
        confidence: parseFloat(confidence)
      }
    };
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);

    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(callback);
    }
  }

  notifySubscribers(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          LoggerService.log('error', 'Error in subscriber callback', { error });
        }
      });
    }
  }

  updateFilters(newFilters) {
    this.currentFilters = newFilters;
    
    // Reprocessa dados com novos filtros
    const currentData = CacheService.get('currentMetrics');
    if (currentData) {
      this.handleMetricsUpdate(currentData);
    }
  }

  async refreshData() {
    const freshData = await FirebaseRealtimeService.fetchData('metrics');
    this.handleMetricsUpdate(freshData);
  }

  cleanup() {
    this.subscribers.clear();
    this.currentFilters = null;
    this.isInitialized = false;
    LoggerService.log('system', 'Dashboard Integration Service cleaned up');
  }
}

// Criar e exportar instância única
const instance = new DashboardIntegrationService();
export default instance;