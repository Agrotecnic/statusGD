// src/components/DashboardGeral/components/MetricsOverview.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Bar, BarChart 
} from 'recharts';

const MetricsOverview = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const metrics = [
    {
      title: "Total Vendido",
      value: data.totalVendido || 0,
      change: data.vendidoChange || 0,
      color: "text-green-600"
    },
    {
      title: "Total Bonificado",
      value: data.totalBonificado || 0,
      change: data.bonificadoChange || 0,
      color: "text-blue-600"
    },
    {
      title: "Área Total",
      value: data.areaTotal || 0,
      change: data.areaChange || 0,
      isArea: true,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.isArea 
                  ? `${metric.value.toLocaleString('pt-BR')} ha`
                  : formatCurrency(metric.value)
                }
              </div>
              <div className={`flex items-center mt-1 ${
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change > 0 ? '↑' : '↓'}
                <span className="ml-1 text-sm">
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.vendasTimeline || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vendido" 
                    stroke="#16a34a" 
                    name="Vendido"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bonificado" 
                    stroke="#2563eb" 
                    name="Bonificado"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.produtosDistribuicao || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={150} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="vendido" fill="#16a34a" name="Vendido" />
                  <Bar dataKey="bonificado" fill="#2563eb" name="Bonificado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

MetricsOverview.propTypes = {
  data: PropTypes.shape({
    totalVendido: PropTypes.number,
    totalBonificado: PropTypes.number,
    areaTotal: PropTypes.number,
    vendidoChange: PropTypes.number,
    bonificadoChange: PropTypes.number,
    areaChange: PropTypes.number,
    vendasTimeline: PropTypes.arrayOf(PropTypes.object),
    produtosDistribuicao: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  })
};

export default MetricsOverview;