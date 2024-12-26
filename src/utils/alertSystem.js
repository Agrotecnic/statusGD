import { toast } from 'react-toastify';

// Tipos de alerta
export const AlertTypes = {
  PERFORMANCE: 'performance',
  TREND: 'trend',
  SEASONAL: 'seasonal',
  OPPORTUNITY: 'opportunity',
  RISK: 'risk'
};

// Tipos de toast
export const ToastTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Níveis de severidade
export const SeverityLevels = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Thresholds padrão
const defaultThresholds = {
  performance: {
    critical: 0.6, // Abaixo de 60% da meta
    high: 0.75,    // Abaixo de 75% da meta
    medium: 0.85,  // Abaixo de 85% da meta
    low: 0.95      // Abaixo de 95% da meta
  },
  trend: {
    critical: -20, // Queda de 20% ou mais
    high: -15,     // Queda de 15% ou mais
    medium: -10,   // Queda de 10% ou mais
    low: -5        // Queda de 5% ou mais
  },
  seasonal: {
    significant: 15 // Variação sazonal maior que 15%
  },
  opportunity: {
    significant: 10 // Potencial de crescimento maior que 10%
  }
};

// Sistema de notificações
class AlertSystem {
  constructor() {
    this.toastConfig = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };
  }

  showAlert(message, type = ToastTypes.INFO, options = {}) {
    const finalOptions = { ...this.toastConfig, ...options };

    switch (type) {
      case ToastTypes.SUCCESS:
        return toast.success(message, finalOptions);
      case ToastTypes.ERROR:
        return toast.error(message, finalOptions);
      case ToastTypes.WARNING:
        return toast.warning(message, finalOptions);
      default:
        return toast.info(message, finalOptions);
    }
  }

  // Análise de Performance
  analyzePerformanceAlerts(data, thresholds, alerts) {
    const { kpis } = data;
    if (!kpis) return;

    const performance = kpis.realizacaoMeta;
    
    if (performance < thresholds.performance.critical) {
      alerts.push({
        type: AlertTypes.PERFORMANCE,
        severity: SeverityLevels.CRITICAL,
        message: 'Performance crítica: Realização muito abaixo da meta',
        value: performance,
        threshold: thresholds.performance.critical,
        metric: 'Realização de Meta',
        recommendations: [
          'Realizar reunião emergencial com a equipe',
          'Revisar estratégias de vendas',
          'Identificar obstáculos principais'
        ]
      });
    } else if (performance < thresholds.performance.high) {
      alerts.push({
        type: AlertTypes.PERFORMANCE,
        severity: SeverityLevels.HIGH,
        message: 'Performance preocupante: Realização significativamente abaixo da meta',
        value: performance,
        threshold: thresholds.performance.high,
        metric: 'Realização de Meta'
      });
    }
  }

  // Análise de Tendências
  analyzeTrendAlerts(data, thresholds, alerts) {
    const { trends } = data;
    if (!trends?.indicadores?.tendenciaCrescimento) return;

    const trendValue = trends.indicadores.tendenciaCrescimento;
    
    if (trendValue < thresholds.trend.critical) {
      alerts.push({
        type: AlertTypes.TREND,
        severity: SeverityLevels.CRITICAL,
        message: 'Tendência crítica de queda nas vendas',
        value: trendValue,
        threshold: thresholds.trend.critical,
        metric: 'Tendência de Crescimento',
        recommendations: [
          'Analisar causas da queda',
          'Revisar estratégia de mercado',
          'Avaliar ações da concorrência'
        ]
      });
    }
  }

  // Análise Sazonal
  analyzeSeasonalAlerts(data, thresholds, alerts) {
    const { sazonalidade } = data;
    if (!sazonalidade) return;

    const currentMonth = new Date().getMonth();
    const seasonalImpact = sazonalidade[currentMonth]?.impacto || 0;

    if (Math.abs(seasonalImpact) > thresholds.seasonal.significant) {
      alerts.push({
        type: AlertTypes.SEASONAL,
        severity: SeverityLevels.MEDIUM,
        message: `Impacto sazonal significativo: ${seasonalImpact > 0 ? 'positivo' : 'negativo'}`,
        value: seasonalImpact,
        threshold: thresholds.seasonal.significant,
        metric: 'Impacto Sazonal'
      });
    }
  }

  // Análise de Oportunidades
  analyzeOpportunityAlerts(data, thresholds, alerts) {
    const { trends } = data;
    if (!trends?.indicadores?.potencialCrescimento) return;

    const growthPotential = trends.indicadores.potencialCrescimento;
    
    if (growthPotential > thresholds.opportunity.significant) {
      alerts.push({
        type: AlertTypes.OPPORTUNITY,
        severity: SeverityLevels.MEDIUM,
        message: 'Oportunidade significativa de crescimento identificada',
        value: growthPotential,
        threshold: thresholds.opportunity.significant,
        metric: 'Potencial de Crescimento',
        recommendations: [
          'Avaliar aumento de investimentos',
          'Expandir equipe de vendas',
          'Intensificar ações de marketing'
        ]
      });
    }
  }

  // Análise de Riscos
  analyzeRiskAlerts(data, alerts) {
    const { trends } = data;
    if (!trends?.indicadores?.previsaoRealizacao) return;

    const projectedRealization = trends.indicadores.previsaoRealizacao;
    const confidence = trends.indicadores.confiancaPrevisao || 0;

    const riskLevel = this.calculateRiskLevel(projectedRealization, confidence);

    if (riskLevel.severity !== SeverityLevels.LOW) {
      alerts.push({
        type: AlertTypes.RISK,
        severity: riskLevel.severity,
        message: `Risco ${riskLevel.severity} de não atingimento das metas`,
        value: projectedRealization,
        metric: 'Previsão de Realização',
        recommendations: riskLevel.recommendations
      });
    }

    this.analyzeConcentrationRisk(data, alerts);
    this.analyzePerformanceDeviations(data, alerts);
  }

  // Análise Principal
  analyzeAlerts(dashboardData, thresholds = defaultThresholds) {
    const alerts = [];

    this.analyzePerformanceAlerts(dashboardData, thresholds, alerts);
    this.analyzeTrendAlerts(dashboardData, thresholds, alerts);
    this.analyzeSeasonalAlerts(dashboardData, thresholds, alerts);
    this.analyzeOpportunityAlerts(dashboardData, thresholds, alerts);
    this.analyzeRiskAlerts(dashboardData, alerts);

    return this.categorizeAndPrioritizeAlerts(alerts);
  }

  // Funções Auxiliares
  calculateRiskLevel(projectedRealization, confidence) {
    if (projectedRealization < 0.7) {
      return {
        severity: SeverityLevels.CRITICAL,
        recommendations: [
          'Realizar revisão emergencial das estratégias',
          'Implementar plano de ação corretivo',
          'Intensificar acompanhamento diário'
        ]
      };
    }
    // ... outros níveis de risco ...
    return { severity: SeverityLevels.LOW, recommendations: [] };
  }

  analyzeConcentrationRisk(data, alerts) {
    const { regionais } = data;
    if (!regionais?.length) return;

    const totalVendas = regionais.reduce((sum, r) => sum + (r.vendas || 0), 0);
    if (!totalVendas) return;

    regionais.forEach(regional => {
      const concentration = (regional.vendas / totalVendas) * 100;
      if (concentration > 40) {
        alerts.push({
          type: AlertTypes.RISK,
          severity: SeverityLevels.HIGH,
          message: `Alta concentração de vendas na regional ${regional.nome}`,
          value: concentration,
          metric: 'Concentração Regional',
          recommendations: [
            'Diversificar atuação em outras regionais',
            'Desenvolver plano de expansão',
            'Avaliar dependência de mercados específicos'
          ]
        });
      }
    });
  }

  analyzePerformanceDeviations(data, alerts) {
    const { regionais } = data;
    if (!regionais?.length) return;

    const performances = regionais
      .filter(r => r.realizacaoMeta !== undefined)
      .map(r => ({
        regional: r.nome,
        performance: r.realizacaoMeta
      }));

    if (!performances.length) return;

    const avgPerformance = performances.reduce((sum, p) => sum + p.performance, 0) / performances.length;
    const stdDev = this.calculateStandardDeviation(performances.map(p => p.performance));

    performances.forEach(p => {
      const deviation = Math.abs(p.performance - avgPerformance);
      if (deviation > stdDev * 2) {
        alerts.push({
          type: AlertTypes.PERFORMANCE,
          severity: p.performance < avgPerformance ? SeverityLevels.HIGH : SeverityLevels.LOW,
          message: `Desvio significativo de performance na regional ${p.regional}`,
          value: p.performance,
          metric: 'Desvio de Performance',
          recommendations: p.performance < avgPerformance ? [
            'Realizar diagnóstico detalhado da regional',
            'Identificar fatores limitantes',
            'Desenvolver plano de recuperação específico'
          ] : [
            'Documentar práticas de sucesso',
            'Avaliar replicação de estratégias',
            'Reconhecer e incentivar equipe'
          ]
        });
      }
    });
  }

  calculateStandardDeviation(values) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  categorizeAndPrioritizeAlerts(alerts) {
    const priorityOrder = {
      [SeverityLevels.CRITICAL]: 0,
      [SeverityLevels.HIGH]: 1,
      [SeverityLevels.MEDIUM]: 2,
      [SeverityLevels.LOW]: 3
    };

    return alerts.sort((a, b) => {
      if (priorityOrder[a.severity] !== priorityOrder[b.severity]) {
        return priorityOrder[a.severity] - priorityOrder[b.severity];
      }
      return 0; // Mantém a ordem original se a severidade for igual
    });
  }
}

// Instância única do sistema de alertas
const alertSystem = new AlertSystem();

export const {
  showAlert,
  analyzeAlerts
} = alertSystem;

export default alertSystem;