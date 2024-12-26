import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useMonitoring } from '../../hooks/useMonitoring';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    performance: [],
    errors: [],
    usage: []
  });

  const { trackError } = useMonitoring('PerformanceMetrics');

  const processMetrics = useCallback((data) => {
    try {
      const processed = {
        performance: processPerformanceData(data.performance || {}),
        errors: processErrorData(data.errors || {}),
        usage: processUsageData(data.usage || {})
      };
      setMetrics(processed);
    } catch (error) {
      trackError(error, { context: 'processMetrics' });
    }
  }, [trackError]);

  useEffect(() => {
    const db = getDatabase();
    const metricsRef = ref(db, 'metrics');

    const handleDataUpdate = (snapshot) => {
      if (snapshot.exists()) {
        processMetrics(snapshot.val());
      }
    };

    const unsubscribe = onValue(metricsRef, handleDataUpdate, (error) => {
      trackError(error, { context: 'metrics-subscription' });
    });

    return () => unsubscribe();
  }, [processMetrics, trackError]);

  const processPerformanceData = (performanceData) => {
    return Object.entries(performanceData).map(([timestamp, data]) => ({
      timestamp: new Date(Number(timestamp)).toLocaleString(),
      ...data
    })).slice(-50);
  };

  const processErrorData = (errorData) => {
    return Object.entries(errorData).map(([timestamp, data]) => ({
      timestamp: new Date(Number(timestamp)).toLocaleString(),
      ...data
    })).slice(-20);
  };

  const processUsageData = (usageData) => {
    return Object.entries(usageData).map(([timestamp, data]) => ({
      timestamp: new Date(Number(timestamp)).toLocaleString(),
      ...data
    })).slice(-100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Performance do Sistema</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                name="Duração (ms)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Erros Recentes</h3>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensagem
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Componente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.errors.map((error, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {error.timestamp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {error.message}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {error.context?.component}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Uso do Sistema</h3>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Componente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.usage.map((usage, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {usage.timestamp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {usage.action}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {usage.component}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;