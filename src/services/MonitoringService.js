// src/services/MonitoringService.js
import { db } from '../config/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

class MonitoringService {
  constructor() {
    this.listeners = new Map();
    this.sessionId = crypto.randomUUID();
  }

  // Monitora performance
  trackPerformance(name, duration, metadata = {}) {
    const performanceRef = ref(db, 'monitoring/performance');
    const newPerformanceRef = push(performanceRef);
    
    set(newPerformanceRef, {
      name,
      duration,
      timestamp: serverTimestamp(),
      sessionId: this.sessionId,
      ...metadata
    });
  }

  // Monitora erros
  trackError(error, context = {}) {
    const errorsRef = ref(db, 'monitoring/errors');
    const newErrorRef = push(errorsRef);
    
    set(newErrorRef, {
      message: error.message,
      stack: error.stack,
      timestamp: serverTimestamp(),
      sessionId: this.sessionId,
      ...context
    });
  }

  // Monitora uso
  trackUsage(action, data = {}) {
    const usageRef = ref(db, 'monitoring/usage');
    const newUsageRef = push(usageRef);
    
    set(newUsageRef, {
      action,
      timestamp: serverTimestamp(),
      sessionId: this.sessionId,
      ...data
    });
  }
  
  // Monitora métricas gerais
  trackMetric(name, value, metadata = {}) {
    const metricsRef = ref(db, 'monitoring/metrics');
    const newMetricRef = push(metricsRef);
    
    set(newMetricRef, {
      name,
      value,
      timestamp: serverTimestamp(),
      sessionId: this.sessionId,
      ...metadata
    });
  }

  // Limpa os listeners quando necessário
  cleanup() {
    this.listeners.clear();
  }
}

export default new MonitoringService();