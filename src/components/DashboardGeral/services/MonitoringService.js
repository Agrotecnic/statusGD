// src/components/DashboardGeral/services/MonitoringService.js
import { CacheService } from './CacheService';
import { LoggerService } from './LoggerService';
import { FirebaseService } from './FirebaseService';

export const MonitoringService = {
  async logError(error, context = {}) {
    try {
      const errorLog = {
        timestamp: Date.now(),
        error: error.message,
        stack: error.stack,
        context
      };

      // Tentar salvar no Firebase
      await FirebaseService.writeData('monitoring/errors/', errorLog);
    } catch (e) {
      // Em caso de erro, salvar localmente
      CacheService.set(`error_${Date.now()}`, errorLog);
    }
  },

  async logPerformance(metric, value) {
    try {
      const perfLog = {
        timestamp: Date.now(),
        metric,
        value
      };

      await FirebaseService.writeData('monitoring/performance/', perfLog);
    } catch (e) {
      CacheService.set(`perf_${Date.now()}`, perfLog);
    }
  },

  async logUsage(action, details = {}) {
    try {
      const usageLog = {
        timestamp: Date.now(),
        action,
        details
      };

      await FirebaseService.writeData('monitoring/usage/', usageLog);
    } catch (e) {
      CacheService.set(`usage_${Date.now()}`, usageLog);
    }
  },

  // Método para sincronizar logs offline
  async syncOfflineLogs() {
    const allCache = CacheService.getAll();
    
    for (const [key, value] of Object.entries(allCache)) {
      if (key.startsWith('error_')) {
        await this.logError(value.error, value.context);
        CacheService.remove(key);
      } else if (key.startsWith('perf_')) {
        await this.logPerformance(value.metric, value.value);
        CacheService.remove(key);
      } else if (key.startsWith('usage_')) {
        await this.logUsage(value.action, value.details);
        CacheService.remove(key);
      }
    }
  }
};

export default MonitoringService;