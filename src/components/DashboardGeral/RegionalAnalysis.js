import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, PieChart, Pie 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const RegionalAnalysis = ({ data = [], titulo = 'Análise Regional' }) => {
  const [activeView, setActiveView] = useState('vendas');
  const [chartType, setChartType] = useState('bar');

  // Verificar se data existe e tem o formato esperado
  const hasValidData = Array.isArray(data) && data.length > 0 && data[0]?.performance;

  if (!hasValidData) {
    return <div>Sem dados disponíveis</div>;
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0%';
    return `${Number(value).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Calculando totais para percentuais
  const totalVendas = data.reduce((sum, item) => sum + (item.vendas || 0), 0);
  const totalAreas = data.reduce((sum, item) => sum + (item.areas || 0), 0);

  // Preparando dados para visualização
  const chartData = data.map((item, index) => ({
    ...item,
    percentualVendas: (item.vendas / totalVendas) * 100,
    percentualAreas: (item.areas / totalAreas) * 100,
    cor: COLORS[index % COLORS.length]
  }));

  // Funções auxiliares para renderização
  const getDataKey = () => {
    switch (activeView) {
      case 'vendas': return 'vendas';
      case 'areas': return 'areas';
      case 'performance': return 'performance';
      default: return 'vendas';
    }
  };

  const getFormatter = () => {
    switch (activeView) {
      case 'vendas': return formatCurrency;
      case 'areas': return formatNumber;
      case 'performance': return formatPercentage;
      default: return (value) => value;
    }
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="regional" />
        <YAxis tickFormatter={getFormatter()} />
        <Tooltip 
          formatter={getFormatter()}
          labelFormatter={(label) => `Regional: ${label}`}
        />
        <Legend />
        <Bar dataKey={getDataKey()} fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.cor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey={getDataKey()}
          nameKey="regional"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            regional
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#000"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
              >
                {regional} ({getFormatter()(value)})
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.cor} />
          ))}
        </Pie>
        <Tooltip formatter={getFormatter()} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
        
        {/* Controles */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Visualizar:</span>
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value)}
              className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="vendas">Vendas</option>
              <option value="areas">Áreas</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Tipo de Gráfico:</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="bar">Barras</option>
              <option value="pie">Pizza</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      {chartType === 'bar' ? renderBarChart() : renderPieChart()}

      {/* Tabela de Dados */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regional
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Áreas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chartData.map((item) => (
              <tr key={item.regional} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.regional}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatCurrency(item.vendas)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatNumber(item.areas)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatPercentage(item.performance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {formatCurrency(totalVendas)}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {formatNumber(totalAreas)}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {formatPercentage(data.reduce((acc, item) => acc + (item.performance || 0), 0) / data.length)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

RegionalAnalysis.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    regional: PropTypes.string.isRequired,
    vendas: PropTypes.number.isRequired,
    areas: PropTypes.number.isRequired,
    performance: PropTypes.number.isRequired
  })),
  titulo: PropTypes.string
};

RegionalAnalysis.defaultProps = {
  data: [],
  titulo: 'Análise Regional'
};

export default RegionalAnalysis;