import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import DashboardCharts from '../../../components/DashboardGeral/DashboardCharts';

const mockMetricsData = [
  { timestamp: '2024-01-01T00:00:00', value: 100, metric1: 150 },
  { timestamp: '2024-01-01T01:00:00', value: 110, metric1: 160 },
  { timestamp: '2024-01-01T02:00:00', value: 120, metric1: 170 }
];

const mockKPIData = {
  kpi1: 95,
  kpi2: 85
};

describe('DashboardCharts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders loading state', () => {
    render(<DashboardCharts isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    render(<DashboardCharts error="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('displays correct timeframe tabs', () => {
    render(<DashboardCharts metricsData={mockMetricsData} />);
    
    expect(screen.getByText('Por Hora')).toBeInTheDocument();
    expect(screen.getByText('Diário')).toBeInTheDocument();
    expect(screen.getByText('Semanal')).toBeInTheDocument();
    expect(screen.getByText('Mensal')).toBeInTheDocument();
  });

  it('changes timeframe when tab is clicked', () => {
    render(<DashboardCharts metricsData={mockMetricsData} />);
    
    const weeklyTab = screen.getByText('Semanal');
    fireEvent.click(weeklyTab);
    
    expect(weeklyTab).toHaveAttribute('aria-selected', 'true');
  });

  it('triggers data refresh at correct interval', () => {
    const onChartInteraction = jest.fn();
    render(
      <DashboardCharts 
        metricsData={mockMetricsData}
        onChartInteraction={onChartInteraction}
        refreshInterval={1000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onChartInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'refresh',
        timestamp: expect.any(Date)
      })
    );
  });

  it('displays correct chart components', () => {
    render(
      <DashboardCharts 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
      />
    );

    expect(screen.getByText('Tendências')).toBeInTheDocument();
    expect(screen.getByText('Distribuição')).toBeInTheDocument();
    expect(screen.getByText('Métricas em Tempo Real')).toBeInTheDocument();
  });

  it('shows trend indicators correctly', () => {
    render(
      <DashboardCharts 
        metricsData={[
          { timestamp: '2024-01-01T00:00:00', value: 100 },
          { timestamp: '2024-01-01T01:00:00', value: 150 }
        ]}
      />
    );

    const trendSection = screen.getByText('Tendências').closest('div');
    expect(trendSection).toBeInTheDocument();
  });

  it('formats dates in Brazilian Portuguese', () => {
    render(<DashboardCharts metricsData={mockMetricsData} />);
    
    const date = new Date(mockMetricsData[0].timestamp);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
    
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<DashboardCharts metricsData={[]} />);
    expect(screen.getByText('Dashboard de Métricas')).toBeInTheDocument();
  });

  it('updates last update timestamp', () => {
    render(<DashboardCharts metricsData={mockMetricsData} />);
    
    const initialTime = new Date().toLocaleTimeString('pt-BR');
    expect(screen.getByText(expect.stringContaining('Última atualização'))).toHaveTextContent(
      expect.stringContaining(initialTime)
    );
  });

  it('processes metrics data correctly for different timeframes', async () => {
    const { rerender } = render(<DashboardCharts metricsData={mockMetricsData} />);

    // Test daily view
    const dailyTab = screen.getByText('Diário');
    fireEvent.click(dailyTab);
    await waitFor(() => {
      expect(screen.getByText('Média')).toBeInTheDocument();
    });

    // Test weekly view
    const weeklyTab = screen.getByText('Semanal');
    fireEvent.click(weeklyTab);
    await waitFor(() => {
      expect(screen.getByText('Média')).toBeInTheDocument();
    });

    // Test monthly view
    const monthlyTab = screen.getByText('Mensal');
    fireEvent.click(monthlyTab);
    await waitFor(() => {
      expect(screen.getByText('Média')).toBeInTheDocument();
    });
  });

  it('displays tooltip with correct format', async () => {
    render(<DashboardCharts metricsData={mockMetricsData} />);
    
    const chart = screen.getByText('Média');
    fireEvent.mouseOver(chart);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });
});