import { create } from 'zustand';

export const useDashboardState = create((set) => ({
  auth: {
    user: null,
    permissions: []
  },
  metrics: {},
  filters: {},
  alerts: {},
  settings: {},
  updateAuth: (newAuthState) => set(state => ({
    ...state,
    auth: { ...state.auth, ...newAuthState }
  })),
  updateMetrics: (newMetrics) => set(state => ({
    ...state,
    metrics: { ...state.metrics, ...newMetrics }
  })),
  updateFilters: (newFilters) => set(state => ({
    ...state,
    filters: { ...state.filters, ...newFilters }
  })),
  updateAlerts: (newAlerts) => set(state => ({
    ...state,
    alerts: { ...state.alerts, ...newAlerts }
  })),
  updateSettings: (newSettings) => set(state => ({
    ...state,
    settings: { ...state.settings, ...newSettings }
  }))
}));

export function useAuth() {
  return useDashboardState(state => state.auth);
}

export function useMetrics() {
  return useDashboardState(state => state.metrics);
}

export function useFilters() {
  return useDashboardState(state => state.filters);
}

export function useAlerts() {
  return useDashboardState(state => state.alerts);
}

export function useSettings() {
  return useDashboardState(state => state.settings);
}

export default useDashboardState;