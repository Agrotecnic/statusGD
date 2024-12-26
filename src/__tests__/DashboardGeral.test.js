// src/__tests__/DashboardGeral.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { processRawData } from '../utils/dashboardDataProcessors';
import { dashboardCache } from '../utils/dataCache';
import DashboardGeral from '../components/DashboardGeral/DashboardGeral';
import '@testing-library/jest-dom';

// Mock data
const mockRawData = {
  user1: {
    vendedorInfo: {
      nome: 'João Silva',
      regional: 'Sul',
    },
    areas: {
      emAcompanhamento: 5,
      aImplantar: 2,
      finalizados: 1,
      mediaHectaresArea: 35,
      areaPotencialTotal: 100
    },
    produtos: [
      { valorVendido: 10000, valorBonificado: 1000 },
      { valorVendido: 15000, valorBonificado: 2000 }
    ]
  },
  // ... mais dados de teste
};

// Testes do componente principal
describe('DashboardGeral Component', () => {
  beforeEach(() => {
    dashboardCache.clear();
  });

  test('renders loading state initially', () => {
    render(<DashboardGeral />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test('renders error state when fetch fails', async () => {
    // Mock de erro no fetch
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<DashboardGeral />);
    
    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });
  });

  test('applies filters correctly', async () => {
    render(<DashboardGeral />);
    
    // Selecionar regional
    const regionalSelect = screen.getByLabelText(/regional/i);
    fireEvent.change(regionalSelect, { target: { value: 'Sul' } });
    
    await waitFor(() => {
      // Verificar se os dados foram filtrados
      const regionalData = screen.getByText('Sul');
      expect(regionalData).toBeInTheDocument();
    });
  });
});

// Testes dos processadores de dados
describe('Data Processors', () => {
  test('processes raw data correctly', () => {
    const filters = {
      regional: '',
      period: 'ultimo_mes'
    };

    const processed = processRawData(mockRawData, filters);

    expect(processed.kpis).toBeDefined();
    expect(processed.regionais).toBeDefined();
    expect(processed.trends).toBeDefined();
    expect(processed.performance).toBeDefined();
  });

  test('calculates KPIs correctly', () => {
    const filters = {
      regional: '',
      period: 'ultimo_mes'
    };

    const processed = processRawData(mockRawData, filters);
    const { kpis } = processed;

    // Verificar cálculos específicos
    expect(kpis.totalVendas).toBe(28000); // 10000 + 15000 + 1000 + 2000
    expect(kpis.taxaConversao).toBeGreaterThan(0);
    expect(kpis.mediaVendasVendedor).toBeGreaterThan(0);
  });
});

// Testes do cache
describe('Dashboard Cache', () => {
  test('caches and retrieves data correctly', () => {
    const filters = {
      regional: 'Sul',
      period: 'ultimo_mes'
    };

    const testData = { test: 'data' };