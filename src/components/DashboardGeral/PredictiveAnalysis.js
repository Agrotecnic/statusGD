import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2 } from 'lucide-react';
import _ from 'lodash';

const PredictiveAnalysis = ({ historicalData = [], forecastPeriod = 12, confidenceLevel = 0.95, onPredictionUpdate, isLoading = false }) => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  // Cálculo das médias móveis para suavização dos dados
  const smoothedData = useMemo(() => {
    // Validação dos dados movida para dentro do useMemo
    const validData = Array.isArray(historicalData) ? historicalData : [];
    if (validData.length === 0) return [];
    
    const period = 3; // Período para média móvel
    return validData.map((point, index) => {
      if (index < period - 1) return point;
      
      const slice = validData.slice(index - period + 1, index + 1);
      const ma = _.meanBy(slice, 'value');
      
      return { 
        ...point,
        value: ma // Usa a média móvel como valor suavizado
      };
    });
  }, [historicalData]);

  // Cálculo da tendência usando regressão linear com dados suavizados
  const calculateTrend = useMemo(() => {
    if (!smoothedData.length) return { slope: 0, intercept: 0 };
    
    const xValues = smoothedData.map((_, i) => i);
    const yValues = smoothedData.map(d => d.value || 0);
    
    const n = xValues.length;
    const sumX = _.sum(xValues);
    const sumY = _.sum(yValues);
    const sumXY = _.sum(xValues.map((x, i) => x * yValues[i]));
    const sumXX = _.sum(xValues.map(x => x * x));
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }, [smoothedData]);

  // Cálculo dos intervalos de confiança usando dados suavizados
  const confidenceIntervals = useMemo(() => {
    if (!smoothedData.length) return [];
    
    const { slope, intercept } = calculateTrend;
    const residuals = smoothedData.map((point, index) => {
      const predicted = slope * index + intercept;
      return (point.value || 0) - predicted;
    });
    
    const standardError = Math.sqrt(
      _.sum(residuals.map(r => r * r)) / (residuals.length - 2)
    );
    
    const tValue = confidenceLevel === 0.95 ? 1.96 : 1.645;
    
    return smoothedData.map((point, index) => {
      const predicted = slope * index + intercept;
      const interval = tValue * standardError * 
        Math.sqrt(1 + 1/smoothedData.length + 
        Math.pow(index - _.mean(smoothedData.map((_, i) => i)), 2) / 
        _.sum(smoothedData.map((_, i) => 
          Math.pow(i - _.mean(smoothedData.map((_, j) => j)), 2)
        )));
      
      return {
        ...point,
        predicted,
        upperBound: predicted + interval,
        lowerBound: predicted - interval
      };
    });
  }, [smoothedData, calculateTrend, confidenceLevel]);

  // Geração das previsões futuras
  useEffect(() => {
    if (!smoothedData.length) return;

    try {
      const { slope, intercept } = calculateTrend;
      const lastIndex = smoothedData.length - 1;
      
      const futurePredictions = Array.from({ length: forecastPeriod }, (_, i) => {
        const index = lastIndex + i + 1;
        const predictedValue = slope * index + intercept;
        
        const standardError = Math.sqrt(
          _.sum(confidenceIntervals.map(ci => 
            Math.pow((ci.value || 0) - ci.predicted, 2)
          )) / (confidenceIntervals.length - 2)
        );
        
        const tValue = confidenceLevel === 0.95 ? 1.96 : 1.645;
        const interval = tValue * standardError * 
          Math.sqrt(1 + 1/smoothedData.length + 
          Math.pow(index - _.mean(smoothedData.map((_, i) => i)), 2) / 
          _.sum(smoothedData.map((_, i) => 
            Math.pow(i - _.mean(smoothedData.map((_, j) => j)), 2)
          )));

        const date = new Date();
        date.setDate(date.getDate() + i);

        return {
          date: date.toISOString().split('T')[0],
          value: predictedValue,
          upperBound: predictedValue + interval,
          lowerBound: predictedValue - interval,
          isPrediction: true
        };
      });

      setPredictions(futurePredictions);
      onPredictionUpdate?.(futurePredictions);
    } catch (err) {
      setError('Erro ao gerar previsões: ' + err.message);
    }
  }, [smoothedData, forecastPeriod, calculateTrend, confidenceIntervals, onPredictionUpdate, confidenceLevel]);

  // Combinação dos dados históricos com previsões para visualização
  const combinedData = useMemo(() => {
    if (!Array.isArray(smoothedData)) return [];
    
    return [...smoothedData, ...predictions].map(point => ({
      ...point,
      value: Number((point.value || 0).toFixed(2)),
      upperBound: Number((point.upperBound || 0).toFixed(2)),
      lowerBound: Number((point.lowerBound || 0).toFixed(2))
    }));
  }, [smoothedData, predictions]);

  if (isLoading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          Nenhum dado histórico disponível para análise
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análise Preditiva</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded shadow-lg border">
                      <p className="font-semibold">
                        {new Date(data.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p>Valor: {data.value}</p>
                      {data.isPrediction && (
                        <>
                          <p>Limite Superior: {data.upperBound}</p>
                          <p>Limite Inferior: {data.lowerBound}</p>
                        </>
                      )}
                    </div>
                  );
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
                name={predictions.length > 0 ? "Dados Históricos (Suavizados)" : "Dados Históricos"}
              />
              {predictions.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Previsão"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

PredictiveAnalysis.propTypes = {
  historicalData: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    value: PropTypes.number
  })),
  forecastPeriod: PropTypes.number,
  confidenceLevel: PropTypes.number,
  onPredictionUpdate: PropTypes.func,
  isLoading: PropTypes.bool
};

PredictiveAnalysis.defaultProps = {
  historicalData: [],
  forecastPeriod: 12,
  confidenceLevel: 0.95,
  isLoading: false
};

export default PredictiveAnalysis;