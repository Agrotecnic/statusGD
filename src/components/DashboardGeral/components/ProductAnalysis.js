// src/components/DashboardGeral/components/ProductAnalysis.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#8b5cf6', '#db2777'];

const ProductAnalysis = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  // Métricas calculadas
  const metrics = useMemo(() => {
    const totalVendido = data.reduce((sum, item) => sum + (item.vendido || 0), 0);
    const totalBonificado = data.reduce((sum, item) => sum + (item.bonificado || 0), 0);
    const totalArea = data.reduce((sum, item) => sum + (item.area || 0), 0);

    return data.map(item => ({
      ...item,
      percentualVendido: (item.vendido / totalVendido) * 100,
      percentualBonificado: (item.bonificado / totalBonificado) * 100,
      percentualArea: (item.area / totalArea) * 100
    }));
  }, [data]);

  // Dados agrupados por categoria
  const categoryData = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = {
          categoria: item.categoria,
          vendido: 0,
          bonificado: 0,
          area: 0
        };
      }
      acc[item.categoria].vendido += item.vendido || 0;
      acc[item.categoria].bonificado += item.bonificado || 0;
      acc[item.categoria].area += item.area || 0;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPIs Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Total Vendido</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(data.reduce((sum, item) => sum + (item.vendido || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Total Bonificado</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(data.reduce((sum, item) => sum + (item.bonificado || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Área Total</div>
            <div className="text-2xl font-bold mt-1">
              {data.reduce((sum, item) => sum + (item.area || 0), 0).toLocaleString('pt-BR')} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Produtos Ativos</div>
            <div className="text-2xl font-bold mt-1">
              {data.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={150} />
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                  <Bar dataKey="vendido" name="Vendido" fill="#16a34a" stackId="a" />
                  <Bar dataKey="bonificado" name="Bonificado" fill="#2563eb" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="vendido"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      categoria
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
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
                          {`${categoria} (${formatCurrency(value)})`}
                        </text>
                      );
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.categoria} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Vendido
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    % Vendas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Bonificado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    % Bonificação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Área (ha)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(item.vendido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatPercentage(item.percentualVendido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(item.bonificado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatPercentage(item.percentualBonificado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {item.area?.toLocaleString('pt-BR') || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ProductAnalysis.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
    vendido: PropTypes.number,
    bonificado: PropTypes.number,
    area: PropTypes.number
  })).isRequired
};

export default ProductAnalysis;