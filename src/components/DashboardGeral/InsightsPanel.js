import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import _ from 'lodash';

const InsightsPanel = ({
  metricsData,
  kpiData,
  thresholds = {},
  onInsightClick,
  maxInsights = 5,
  refreshInterval = 30000
}) => {
  const [insights, setInsights] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const analyzeTrends = useMemo(() => {
    if (!metricsData?.length) return [];

    const trends = [];
    const metrics = Object.keys(_.omit(metricsData[0] || {}, ['timestamp', 'id']));

    metrics.forEach(metric => {
      const values = metricsData.map(d => d[metric]);
      const recentValues = values.slice(-24);
      
      const mean = _.mean(recentValues);
      const stdDev = Math.sqrt(
        _.sum(recentValues.map(v => Math.pow(v - mean, 2))) / recentValues.length
      );

      // Detecção de anomalias aprimorada
      const anomalies = recentValues.map((value, index) => {
        const zScore = Math.abs((value - mean) / stdDev);
        if (zScore > 2) {
          return {
            metric,
            value,
            timestamp: metricsData[metricsData.length - 24 + index].timestamp,
            zScore,
            deviation: (value - mean) / mean * 100
          };
        }
        return null;
      }).filter(Boolean);

      const trend = recentValues[recentValues.length - 1] - recentValues[0];
      const trendPercentage = (trend / recentValues[0]) * 100;

      if (Math.abs(trendPercentage) > 10) {
        trends.push({
          type: 'trend',
          metric,
          change: trendPercentage,
          direction: trendPercentage > 0 ? 'up' : 'down',
          severity: Math.abs(trendPercentage) > 20 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        });
      }

      anomalies.forEach(anomaly => {
        trends.push({
          type: 'anomaly',
          ...anomaly,
          severity: anomaly.zScore > 3 ? 'high' : 'medium'
        });
      });
    });

    return trends;
  }, [metricsData]);

  const analyzeKPIs = useMemo(() => {
    if (!kpiData) return [];

    return Object.entries(kpiData).map(([kpi, value]) => {
      const threshold = thresholds[kpi];
      if (!threshold) return null;

      const severity = value < threshold.min || value > threshold.max ? 'high' : 'medium';
      const direction = value < threshold.min ? 'down' : value > threshold.max ? 'up' : 'stable';

      return {
        type: 'kpi',
        metric: kpi,
        value,
        threshold: direction === 'down' ? threshold.min : threshold.max,
        direction,
        severity,
        timestamp: new Date().toISOString(),
        deviation: direction === 'stable' ? 0 : 
          ((value - (direction === 'down' ? threshold.min : threshold.max)) / 
          (direction === 'down' ? threshold.min : threshold.max)) * 100
      };
    }).filter(Boolean);
  }, [kpiData, thresholds]);

  useEffect(() => {
    const allInsights = [...analyzeTrends, ...analyzeKPIs]
      .sort((a, b) => {
        const severityScore = { high: 3, medium: 2, low: 1 };
        const scoreA = severityScore[a.severity];
        const scoreB = severityScore[b.severity];
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, maxInsights);

    setInsights(allInsights);
  }, [analyzeTrends, analyzeKPIs, maxInsights]);

  const getInsightBadge = (severity) => {
    const variants = {
      high: 'destructive',
      medium: 'warning',
      low: 'secondary'
    };
    return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Insights e Alertas</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <Alert
                key={index}
                variant={insight.severity === 'high' ? 'destructive' : 'default'}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  setSelectedInsight(insight);
                  onInsightClick?.(insight);
                }}
              >
                <div className="flex items-center gap-3">
                  {insight.type === 'trend' && (insight.direction === 'up' ? 
                    <TrendingUp className={`h-5 w-5 ${insight.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} /> :
                    <TrendingDown className={`h-5 w-5 ${insight.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                  {insight.type === 'anomaly' && 
                    <AlertTriangle className={`h-5 w-5 ${insight.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                  }
                  {insight.type === 'kpi' && (insight.severity === 'high' ?
                    <AlertCircle className="h-5 w-5 text-red-500" /> :
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className="flex items-center justify-between">
                      <span>
                        {insight.type === 'trend' && 
                          `${insight.metric}: ${Math.abs(insight.change).toFixed(1)}% de ${insight.direction === 'up' ? 'aumento' : 'redução'}`
                        }
                        {insight.type === 'anomaly' &&
                          `Anomalia em ${insight.metric}: ${insight.value.toFixed(2)} (${insight.deviation > 0 ? '+' : ''}${insight.deviation.toFixed(1)}% do normal)`
                        }
                        {insight.type === 'kpi' &&
                          `${insight.metric} ${insight.direction === 'up' ? 'acima' : 'abaixo'} do limite: ${insight.value.toFixed(2)} vs ${insight.threshold.toFixed(2)}`
                        }
                      </span>
                      {getInsightBadge(insight.severity)}
                    </AlertDescription>
                    <span className="text-sm text-muted-foreground">
                      {new Date(insight.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Alert>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              Nenhum insight relevante encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;