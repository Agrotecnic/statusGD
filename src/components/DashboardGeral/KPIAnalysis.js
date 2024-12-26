import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const KPIAnalysis = ({ data }) => {
  const formatValue = (value, type) => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(value);
      default:
        return value;
    }
  };

  const getVariationColor = (variation) => {
    if (variation > 0) return 'text-green-500';
    if (variation < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getVariationIcon = (variation) => {
    if (variation > 0) {
      return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    }
    if (variation < 0) {
      return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const kpis = [
    {
      title: 'Total de Vendas',
      value: data.totalVendas || 0,
      type: 'currency',
      variation: data.variacaoVendas || 0,
      previousValue: data.vendasPeriodoAnterior || 0,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total de Áreas',
      value: data.totalAreas || 0,
      type: 'number',
      variation: data.variacaoAreas || 0,
      previousValue: data.areasPeriodoAnterior || 0,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Realização de Meta',
      value: data.realizacaoMeta || 0,
      type: 'percentage',
      variation: data.variacaoRealizacao || 0,
      previousValue: data.realizacaoPeriodoAnterior || 0,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Ticket Médio',
      value: data.ticketMedio || 0,
      type: 'currency',
      variation: data.variacaoTicket || 0,
      previousValue: data.ticketPeriodoAnterior || 0,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className={`p-4 rounded-lg border ${kpi.bgColor} ${kpi.borderColor}`}
        >
          <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
          
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-gray-900">
              {formatValue(kpi.value, kpi.type)}
            </p>
            
            {kpi.variation !== 0 && (
              <div className="flex items-center">
                {getVariationIcon(kpi.variation)}
                <span className={`ml-1 text-sm ${getVariationColor(kpi.variation)}`}>
                  {formatValue(Math.abs(kpi.variation), 'percentage')}
                </span>
              </div>
            )}
          </div>

          {kpi.previousValue !== undefined && (
            <p className="mt-1 text-xs text-gray-500">
              Anterior: {formatValue(kpi.previousValue, kpi.type)}
            </p>
          )}
        </div>
      ))}

      {/* Alertas e Recomendações */}
      {data.alerts?.length > 0 && (
        <div className="col-span-full mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800">Alertas e Recomendações</h4>
            <ul className="mt-2 space-y-2">
              {data.alerts.map((alert, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  {alert.message}
                  {alert.recommendation && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Recomendação: {alert.recommendation}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

KPIAnalysis.propTypes = {
  data: PropTypes.shape({
    totalVendas: PropTypes.number,
    totalAreas: PropTypes.number,
    realizacaoMeta: PropTypes.number,
    ticketMedio: PropTypes.number,
    variacaoVendas: PropTypes.number,
    variacaoAreas: PropTypes.number,
    variacaoRealizacao: PropTypes.number,
    variacaoTicket: PropTypes.number,
    vendasPeriodoAnterior: PropTypes.number,
    areasPeriodoAnterior: PropTypes.number,
    realizacaoPeriodoAnterior: PropTypes.number,
    ticketPeriodoAnterior: PropTypes.number,
    alerts: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
      recommendation: PropTypes.string
    }))
  }).isRequired
};

export default KPIAnalysis;