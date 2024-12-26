// src/components/DashboardGeral/components/AreasOverview.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626'];

const AreasOverview = ({ data }) => {
  const formatArea = (value) => {
    return `${value.toLocaleString('pt-BR')} ha`;
  };

  const pieData = [
    { name: 'Em Acompanhamento', value: data.emAcompanhamento },
    { name: 'A Implantar', value: data.aImplantar },
    { name: 'Finalizadas', value: data.finalizadas },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral de Áreas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
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
                          {`${name}: ${formatArea(value)}`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatArea(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dados por Regional */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.porRegional}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="regional" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatArea(value)} />
                  <Legend />
                  <Bar 
                    dataKey="emAcompanhamento" 
                    name="Em Acompanhamento" 
                    fill={COLORS[0]} 
                    stackId="a" 
                  />
                  <Bar 
                    dataKey="aImplantar" 
                    name="A Implantar" 
                    fill={COLORS[1]} 
                    stackId="a" 
                  />
                  <Bar 
                    dataKey="finalizadas" 
                    name="Finalizadas" 
                    fill={COLORS[2]} 
                    stackId="a" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total de Áreas</h3>
              <p className="mt-2 text-3xl font-bold">{formatArea(data.total)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Média por Área</h3>
              <p className="mt-2 text-3xl font-bold">{formatArea(data.media)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Maior Área</h3>
              <p className="mt-2 text-3xl font-bold">{formatArea(data.maior)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Menor Área</h3>
              <p className="mt-2 text-3xl font-bold">{formatArea(data.menor)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

AreasOverview.propTypes = {
  data: PropTypes.shape({
    emAcompanhamento: PropTypes.number.isRequired,
    aImplantar: PropTypes.number.isRequired,
    finalizadas: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    media: PropTypes.number.isRequired,
    maior: PropTypes.number.isRequired,
    menor: PropTypes.number.isRequired,
    porRegional: PropTypes.arrayOf(PropTypes.shape({
      regional: PropTypes.string.isRequired,
      emAcompanhamento: PropTypes.number.isRequired,
      aImplantar: PropTypes.number.isRequired,
      finalizadas: PropTypes.number.isRequired
    })).isRequired
  }).isRequired
};

export default AreasOverview;