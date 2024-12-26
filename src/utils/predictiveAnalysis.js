import { regression } from 'regression';
import { format } from 'date-fns';

// Constantes para análise
const CONFIDENCE_LEVELS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

export class PredictiveAnalysis {
  constructor(historicalData) {
    this.historicalData = historicalData;
    this.regressionModel = null;
    this.trend = null;
    this.seasonality = null;
    this.confidence = 0;
  }

  // Análise principal
  analyze() {
    if (!this.historicalData || !this.historicalData.length) {
      throw new Error('Dados históricos são necessários para análise');
    }

    this.calculateTrend();
    this.calculateSeasonality();
    this.calculateConfidence();

    return {
      trend: this.trend,
      seasonality: this.seasonality,
      confidence: this.confidence,
      predictions: this.generatePredictions(),
      insights: this.generateInsights()
    };
  }

  // Cálculo de tendência
  calculateTrend() {
    const points = this.historicalData.map((data, index) => [
      index,
      data.value
    ]);

    this.regressionModel = regression.linear(points);
    this.trend = {
      slope: this.regressionModel.equation[0],
      intercept: this.regressionModel.equation[1],
      r2: this.regressionModel.r2
    };
  }

  // Cálculo de sazonalidade
  calculateSeasonality() {
    if (this.historicalData.length < 12) {
      this.seasonality = null;
      return;
    }

    const monthlyAverages = new Array(12).fill(0);
    const monthCounts = new Array(12).fill(0);

    this.historicalData.forEach(data => {
      const date = new Date(data.date);
      const month = date.getMonth();
      monthlyAverages[month] += data.value;
      monthCounts[month]++;
    });

    this.seasonality = monthlyAverages.map((sum, index) => 
      monthCounts[index] > 0 ? sum / monthCounts[index] : null
    );
  }

  // Cálculo de confiança
  calculateConfidence() {
    let confidence = 0;

    // Confiança baseada no R²
    if (this.trend.r2 > CONFIDENCE_LEVELS.HIGH) {
      confidence += 0.4;
    } else if (this.trend.r2 > CONFIDENCE_LEVELS.MEDIUM) {
      confidence += 0.25;
    } else if (this.trend.r2 > CONFIDENCE_LEVELS.LOW) {
      confidence += 0.1;
    }

    // Confiança baseada no volume de dados
    if (this.historicalData.length >= 24) {
      confidence += 0.3;
    } else if (this.historicalData.length >= 12) {
      confidence += 0.2;
    } else if (this.historicalData.length >= 6) {
      confidence += 0.1;
    }

    // Confiança baseada na sazonalidade
    if (this.seasonality) {
      confidence += 0.3;
    }

    this.confidence = Math.min(confidence, 1);
  }

  // Geração de previsões
  generatePredictions() {
    const predictions = [];
    const lastDate = new Date(this.historicalData[this.historicalData.length - 1].date);
    const lastValue = this.historicalData[this.historicalData.length - 1].value;

    for (let i = 1; i <= 6; i++) {
      const predictionDate = new Date(lastDate);
      predictionDate.setMonth(predictionDate.getMonth() + i);

      const trendValue = this.regressionModel.predict(this.historicalData.length + i)[1];
      let seasonalAdjustment = 0;

      if (this.seasonality) {
        const month = predictionDate.getMonth();
        seasonalAdjustment = this.seasonality[month] 
          ? (this.seasonality[month] - lastValue) * 0.5 
          : 0;
      }

      predictions.push({
        date: format(predictionDate, 'yyyy-MM-dd'),
        value: trendValue + seasonalAdjustment,
        confidence: this.calculatePredictionConfidence(i)
      });
    }

    return predictions;
  }

  // Cálculo de confiança para cada previsão
  calculatePredictionConfidence(monthsAhead) {
    // Diminui a confiança conforme aumenta o período de previsão
    const distanceFactorBase = 0.9;
    const distancePenalty = Math.pow(distanceFactorBase, monthsAhead);
    
    return this.confidence * distancePenalty;
  }

  // Geração de insights
  generateInsights() {
    const insights = [];

    // Análise de tendência
    if (this.trend.slope > 0) {
      insights.push({
        type: 'trend',
        message: 'Tendência de crescimento identificada',
        impact: this.trend.slope,
        confidence: this.confidence
      });
    } else if (this.trend.slope < 0) {
      insights.push({
        type: 'trend',
        message: 'Tendência de queda identificada',
        impact: this.trend.slope,
        confidence: this.confidence
      });
    }

    // Análise de sazonalidade
    if (this.seasonality) {
      const seasonalityStrength = Math.max(...this.seasonality) - Math.min(...this.seasonality);
      if (seasonalityStrength > lastValue * 0.1) {
        insights.push({
          type: 'seasonality',
          message: 'Padrão sazonal significativo detectado',
          impact: seasonalityStrength,
          confidence: this.confidence
        });
      }
    }

    return insights;
  }
}

export const analyzePredictiveData = (historicalData) => {
  const analyzer = new PredictiveAnalysis(historicalData);
  return analyzer.analyze();
};

export default {
  PredictiveAnalysis,
  analyzePredictiveData,
  CONFIDENCE_LEVELS
};