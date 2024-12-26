import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const TrendAnalysis = ({ data = [], predictions = [] }) => {
  const [metric, setMetric] = useState('vendas');
  const [showPredictions, setShowPredictions] = useState(true);

  // Formatadores memoizados
  const formatters = useMemo(() => ({
    currency: (value) => {
      if (value === null || value === undefined) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    },
    date: (dateString) => {
      if (!dateString) return '';
      try {
        return format(parseISO(dateString), 'MMM/yy', { locale: ptBR });
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
    },
    percentage: (value) => {
      if (value === null || value === undefined) return '0%';
      return `${Number(value).toFixed(1)}%`;
    },
    default: (value) => {
      if (value === null || value === undefined) return '0';
      return value.toLocaleString('pt-BR');
    }
  }), []);

  // Configurações de métricas memoizadas
  const metricConfig = useMemo(() => ({
    vendas: { color: '#8884d8', formatter: formatters.currency },
    areas: { color: '#82ca9d', formatter: formatters.default },
    realizacao: { color: '#ffc658', formatter: formatters.percentage },
    ticketMedio: { color: '#ff7300', formatter: formatters.currency }
  }), [formatters]);

  const getMetricFormatter = () => metricConfig[metric]?.formatter || formatters.default;
  const getMetricColor = () => metricConfig[metric]?.color || '#8884d8';

  // Dados combinados memoizados com proteção contra dados inválidos
  const combinedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    const validData = [...data];
    if (showPredictions && Array.isArray(predictions) && predictions.length > 0) {
      return [...validData, ...predictions.map(p => ({ ...p, isPrediction: true }))];
    }
    return validData;
  }, [data, showPredictions, predictions]);

  const renderMetricValue = (value, variation) => {
    if (value === null || value === undefined) return null;
    const formatter = getMetricFormatter();
    return (
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold">{formatter(value)}</span>
        {variation !== 0 && variation != null && (
          <span className={`text-sm ${variation > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {variation > 0 ? '↑' : '↓'} {Math.abs(variation).toFixed(1)}%
          </span>
        )}
      </div>
    );
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-gray-500">
          Nenhum dado disponível para análise
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Análise de Tendências</h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="vendas">Vendas</option>
            <option value="areas">Áreas</option>
            <option value="realizacao">Realização</option>
            <option value="ticketMedio">Ticket Médio</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Mostrar Previsões</span>
          </label>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatters.date}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tickFormatter={getMetricFormatter()} />
            <Tooltip
              formatter={getMetricFormatter()}
              labelFormatter={formatters.date}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey={metric}
              stroke={getMetricColor()}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={predictions.length > 0 ? "Dados Históricos" : "Dados"}
            />

            {showPredictions && predictions.length > 0 && (
              <Area
                type="monotone"
                dataKey={metric}
                stroke={`${getMetricColor()}80`}
                fill={`${getMetricColor()}20`}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
                connectNulls
                name="Previsão"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Atual vs Período Anterior</h3>
          {renderMetricValue(
            data[data.length - 1]?.[metric], 
            data[data.length - 1]?.variation
          )}
        </div>

        {showPredictions && predictions?.length > 0 && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Previsão Próximo Período</h3>
              {renderMetricValue(predictions[0][metric], predictions[0].variation)}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Tendência</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {predictions[0].trend > 0 ? '↗' : predictions[0].trend < 0 ? '↘' : '→'}
                </span>
                <span className="text-sm text-gray-600">
                  Confiança: {((predictions[0].confidence || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {data[data.length - 1]?.insights?.length > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Insights</h3>
          <ul className="space-y-2">
            {data[data.length - 1].insights.map((insight, index) => (
              <li key={index} className="text-sm text-blue-600">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

TrendAnalysis.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    vendas: PropTypes.number.isRequired,
    areas: PropTypes.number.isRequired,
    realizacao: PropTypes.number.isRequired,
    ticketMedio: PropTypes.number.isRequired,
    variation: PropTypes.number,
    insights: PropTypes.arrayOf(PropTypes.string)
  })),
  predictions: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    vendas: PropTypes.number.isRequired,
    areas: PropTypes.number.isRequired,
    realizacao: PropTypes.number.isRequired,
    ticketMedio: PropTypes.number.isRequired,
    confidence: PropTypes.number.isRequired,
    trend: PropTypes.number.isRequired,
    variation: PropTypes.number
  }))
};

TrendAnalysis.defaultProps = {
  data: [],
  predictions: []
};

export default TrendAnalysis;