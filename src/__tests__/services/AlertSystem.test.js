import alertSystem, { AlertTypes, SeverityLevels } from '../../../../components/DashboardGeral/services/AlertSystem';

describe('AlertSystem', () => {
  test('deve analisar performance corretamente', () => {
    const testData = {
      kpis: {
        realizacaoMeta: 0.5
      }
    };

    const alerts = [];
    alertSystem.analyzePerformanceAlerts(testData, {
      performance: {
        critical: 0.6,
        high: 0.75
      }
    }, alerts);

    expect(alerts[0]).toMatchObject({
      type: AlertTypes.PERFORMANCE,
      severity: SeverityLevels.CRITICAL
    });
  });

  test('deve analisar tendências corretamente', () => {
    const testData = {
      trends: {
        indicadores: {
          tendenciaCrescimento: -25
        }
      }
    };

    const alerts = [];
    alertSystem.analyzeTrendAlerts(testData, {
      trend: {
        critical: -20
      }
    }, alerts);

    expect(alerts[0]).toMatchObject({
      type: AlertTypes.TREND,
      severity: SeverityLevels.CRITICAL
    });
  });

  test('deve priorizar alertas corretamente', () => {
    const alerts = [
      { severity: SeverityLevels.MEDIUM },
      { severity: SeverityLevels.CRITICAL },
      { severity: SeverityLevels.HIGH }
    ];

    const prioritized = alertSystem.categorizeAndPrioritizeAlerts(alerts);
    expect(prioritized[0].severity).toBe(SeverityLevels.CRITICAL);
  });

  test('deve analisar riscos de concentração', () => {
    const testData = {
      regionais: [
        { nome: 'Sul', vendas: 800 },
        { nome: 'Norte', vendas: 200 }
      ]
    };

    const alerts = [];
    alertSystem.analyzeConcentrationRisk(testData, alerts);
    
    expect(alerts[0]).toMatchObject({
      type: AlertTypes.RISK,
      severity: SeverityLevels.HIGH
    });
  });
});