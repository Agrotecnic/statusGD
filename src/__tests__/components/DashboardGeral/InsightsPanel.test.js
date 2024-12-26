import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InsightsPanel from './InsightsPanel';

const mockMetricsData = [
  { timestamp: '2024-01-01T00:00:00', metric1: 100, metric2: 200 },
  { timestamp: '2024-01-01T01:00:00', metric1: 150, metric2: 180 },
  { timestamp: '2024-01-01T02:00:00', metric1: 200, metric2: 160 }
];

const mockKPIData = {
  kpi1: 95,
  kpi2: 85
};

const mockThresholds = {
  kpi1: { min: 90, max: 110 },
  kpi2: { min: 80, max: 100 }
};

describe('InsightsPanel', () => {
  it('renders without crashing', () => {
    render(<InsightsPanel metricsData={[]} kpiData={{}} />);
    expect(screen.getByText('Insights e Alertas')).toBeInTheDocument();
  });

  it('shows empty state message when no insights', () => {
    render(<InsightsPanel metricsData={[]} kpiData={{}} />);
    expect(screen.getByText('Nenhum insight relevante encontrado')).toBeInTheDocument();
  });

  it('generates trend insights correctly', () => {
    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
      />
    );
    
    // Verifica se detectou a tendência de aumento em metric1
    expect(screen.getByText(/metric1: \d+(\.\d+)?% de aumento/)).toBeInTheDocument();
  });

  it('generates KPI insights correctly', () => {
    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
      />
    );
    
    // Verifica alertas de KPI
    const kpiAlerts = screen.getAllByRole('alert');
    expect(kpiAlerts.length).toBeGreaterThan(0);
  });

  it('limits number of insights based on maxInsights prop', () => {
    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
        maxInsights={2}
      />
    );
    
    const insights = screen.getAllByRole('alert');
    expect(insights.length).toBeLessThanOrEqual(2);
  });

  it('calls onInsightClick when insight is clicked', () => {
    const mockOnInsightClick = jest.fn();
    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
        onInsightClick={mockOnInsightClick}
      />
    );
    
    const firstInsight = screen.getAllByRole('alert')[0];
    fireEvent.click(firstInsight);
    expect(mockOnInsightClick).toHaveBeenCalled();
  });

  it('prioritizes high severity insights', () => {
    const criticalKPIData = {
      ...mockKPIData,
      kpi1: 50 // Muito abaixo do threshold mínimo
    };

    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={criticalKPIData}
        thresholds={mockThresholds}
      />
    );
    
    const insights = screen.getAllByRole('alert');
    expect(insights[0]).toHaveClass('destructive'); // Primeiro insight deve ser crítico
  });

  it('formats numbers correctly in insight messages', () => {
    render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
      />
    );
    
    const insights = screen.getAllByRole('alert');
    insights.forEach(insight => {
      const text = insight.textContent;
      // Verifica se os números têm no máximo 2 casas decimais
      const numbers = text.match(/\d+\.\d+/g) || [];
      numbers.forEach(number => {
        expect(number.split('.')[1].length).toBeLessThanOrEqual(2);
      });
    });
  });

  it('handles dynamic data updates', () => {
    const { rerender } = render(
      <InsightsPanel 
        metricsData={mockMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
      />
    );

    const initialInsights = screen.getAllByRole('alert').length;

    // Atualiza com novos dados
    const newMetricsData = [
      ...mockMetricsData,
      { timestamp: '2024-01-01T03:00:00', metric1: 250, metric2: 140 }
    ];

    rerender(
      <InsightsPanel 
        metricsData={newMetricsData}
        kpiData={mockKPIData}
        thresholds={mockThresholds}
      />
    );

    const updatedInsights = screen.getAllByRole('alert').length;
    expect(updatedInsights).not.toBe(initialInsights);
  });
});