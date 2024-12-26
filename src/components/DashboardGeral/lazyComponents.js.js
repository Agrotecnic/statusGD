import { lazy } from 'react';

// Componentes lazy loaded
export const KPIAnalysis = lazy(() => import('./KPIAnalysis'));
export const RegionalAnalysis = lazy(() => import('./RegionalAnalysis'));
export const TrendAnalysis = lazy(() => import('./TrendAnalysis'));
export const PredictiveAnalysis = lazy(() => import('./PredictiveAnalysis'));
export const PerformanceMetrics = lazy(() => import('./PerformanceMetrics'));

// Componentes mais leves podem ser importados diretamente
export { default as DashboardFilters } from './DashboardFilters';
export { default as AlertDashboard } from './AlertDashboard';