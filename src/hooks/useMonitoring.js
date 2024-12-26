// src/hooks/useMonitoring.js
import { useCallback, useEffect, useRef } from 'react';
import MonitoringService from '../services/MonitoringService';

export const useMonitoring = (componentName) => {
  const startTimeRef = useRef(null);
  const markRef = useRef({});

  // Inicia uma medição de tempo
  const startMeasurement = useCallback((name) => {
    markRef.current[name] = performance.now();
  }, []);

  // Finaliza uma medição de tempo e registra
  const endMeasurement = useCallback((name, metadata = {}) => {
    if (markRef.current[name]) {
      const duration = performance.now() - markRef.current[name];
      MonitoringService.trackPerformance(name, duration, {
        component: componentName,
        ...metadata
      });
      delete markRef.current[name];
    }
  }, [componentName]);

  // Monitora um erro
  const trackError = useCallback((error, context = {}) => {
    MonitoringService.trackError(error, {
      component: componentName,
      ...context
    });
  }, [componentName]);

  // Monitora uma ação do usuário
  const trackAction = useCallback((action, data = {}) => {
    MonitoringService.trackUsage(action, {
      component: componentName,
      ...data
    });
  }, [componentName]);

  // Monitora tempo de vida do componente
  useEffect(() => {
    startTimeRef.current = performance.now();
    
    // Registra montagem do componente
    MonitoringService.trackUsage('componentMount', {
      component: componentName,
      timestamp: new Date().toISOString()
    });

    return () => {
      const duration = performance.now() - startTimeRef.current;
      MonitoringService.trackPerformance('componentLifetime', duration, {
        component: componentName
      });
      
      // Registra desmontagem do componente
      MonitoringService.trackUsage('componentUnmount', {
        component: componentName,
        duration,
        timestamp: new Date().toISOString()
      });
    };
  }, [componentName]);

  // Wrapper para funções assíncronas com monitoramento automático
  const withMonitoring = useCallback((
    asyncFunction,
    actionName,
    errorContext = {}
  ) => {
    return async (...args) => {
      const start = performance.now();
      
      try {
        const result = await asyncFunction(...args);
        const duration = performance.now() - start;
        
        MonitoringService.trackPerformance(actionName, duration, {
          component: componentName,
          success: true,
          arguments: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
          )
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        
        MonitoringService.trackPerformance(actionName, duration, {
          component: componentName,
          success: false
        });
        
        MonitoringService.trackError(error, {
          component: componentName,
          action: actionName,
          arguments: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
          ),
          ...errorContext
        });
        
        throw error;
      }
    };
  }, [componentName]);

  return {
    startMeasurement,
    endMeasurement,
    trackError,
    trackAction,
    withMonitoring
  };
};

export default useMonitoring;