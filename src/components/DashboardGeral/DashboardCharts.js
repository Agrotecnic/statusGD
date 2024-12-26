import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import _ from 'lodash';

// PropTypes para componentes auxiliares
const chartDataPropType = PropTypes.arrayOf(
  PropTypes.shape({
    period: PropTypes.string.isRequired,
    value: PropTypes.number,
    total: PropTypes.number,
    average: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number
  })
);

const trendsPropType = PropTypes.shape({
  totalChange: PropTypes.number.isRequired,
  averageChange: PropTypes.number.isRequired
});

const TrendChart = ({ data, trends }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <span>Tendências</span>
        {trends.totalChange > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="period"
              tickFormatter={formatDate}
            />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            <Line
              type="monotone"
              dataKey="average"
              name="Média"
              stroke="#4F46E5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

TrendChart.propTypes = {
  data: chartDataPropType.isRequired,
  trends: trendsPropType.isRequired
};

const DistributionChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Distribuição</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="period"
              tickFormatter={formatDate}
            />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            <Bar
              dataKey="max"
              name="Máximo"
              fill="#4F46E5"
              opacity={0.8}
            />
            <Bar
              dataKey="min"
              name="Mínimo"
              fill="#10B981"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

DistributionChart.propTypes = {
  data: chartDataPropType.isRequired
};

const RealtimeMetricsChart = ({ data, activeMetrics }) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle>Métricas em Tempo Real</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.slice(-50)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatTime}
            />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            {activeMetrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metric}
                stroke={`hsl(${index * 45}, 70%, 50%)`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

RealtimeMetricsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string.isRequired,
    value: PropTypes.number
  })),
  activeMetrics: PropTypes.arrayOf(PropTypes.string).isRequired
};

// Funções utilitárias
const formatDate = (period) => {
  const date = new Date(period);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatValue = (value, name) => [
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }),
  name
];

const INITIAL_ACTIVE_METRICS = ['value', 'average', 'total'];

const DashboardCharts = ({ 
  metricsData,
  isLoading,
  onChartInteraction,
  refreshInterval
}) => {
  const [activeMetrics, setActiveMetrics] = useState(INITIAL_ACTIVE_METRICS);
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Atualização automática dos dados e validação
  useEffect(() => {
    if (!onChartInteraction) return;

    const updateData = () => {
      try {
        setLastUpdate(new Date());
        onChartInteraction({ type: 'refresh', timestamp: new Date() });
        setError(null);
      } catch (err) {
        setError('Erro ao atualizar dados: ' + err.message);
      }
    };

    updateData(); // Atualização inicial
    const intervalId = setInterval(updateData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, onChartInteraction]);

  // Processamento dos dados para diferentes timeframes
  const processedData = useMemo(() => {
    if (!metricsData?.length) return [];

    return _.groupBy(metricsData, record => {
      const date = new Date(record.timestamp);
      let result;
      
      switch (selectedTimeframe) {
        case 'hourly':
          result = date.toISOString().slice(0, 13);
          break;
        case 'daily':
          result = date.toISOString().slice(0, 10);
          break;
        case 'weekly': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          result = weekStart.toISOString().slice(0, 10);
          break;
        }
        case 'monthly':
          result = date.toISOString().slice(0, 7);
          break;
        default:
          result = date.toISOString().slice(0, 10);
      }
      return result;
    });
  }, [metricsData, selectedTimeframe]);

  // Cálculo de métricas agregadas
  const aggregatedMetrics = useMemo(() => {
    return Object.entries(processedData).map(([period, records]) => ({
      period,
      total: _.sumBy(records, 'value'),
      average: _.meanBy(records, 'value'),
      max: _.maxBy(records, 'value')?.value,
      min: _.minBy(records, 'value')?.value,
      count: records.length
    }));
  }, [processedData]);

  // Identificação de tendências
  const trends = useMemo(() => {
    if (aggregatedMetrics.length < 2) return { totalChange: 0, averageChange: 0 };

    const current = aggregatedMetrics[aggregatedMetrics.length - 1];
    const previous = aggregatedMetrics[aggregatedMetrics.length - 2];
    
    return {
      totalChange: ((current.total - previous.total) / previous.total) * 100,
      averageChange: ((current.average - previous.average) / previous.average) * 100
    };
  }, [aggregatedMetrics]);

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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Dashboard de Métricas</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {INITIAL_ACTIVE_METRICS.map(metric => (
              <button
                key={metric}
                className={`px-2 py-1 text-sm rounded ${
                  activeMetrics.includes(metric)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => {
                  setActiveMetrics(prev => 
                    prev.includes(metric)
                      ? prev.filter(m => m !== metric)
                      : [...prev, metric]
                  );
                }}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList>
              <TabsTrigger value="hourly">Por Hora</TabsTrigger>
              <TabsTrigger value="daily">Diário</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendChart data={aggregatedMetrics} trends={trends} />
          <DistributionChart data={aggregatedMetrics} />
          <RealtimeMetricsChart 
            data={metricsData} 
            activeMetrics={activeMetrics} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

DashboardCharts.propTypes = {
  metricsData: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.number
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  onChartInteraction: PropTypes.func,
  refreshInterval: PropTypes.number
};

DashboardCharts.defaultProps = {
  isLoading: false,
  onChartInteraction: null,
  refreshInterval: 30000
};

export default DashboardCharts;