import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar/ProgressBar';

const MetricasCard = ({ data, formatMoney, formatPercent }) => {  // Adicionado formatPercent aos props
  // Debug inicial dos dados
  useEffect(() => {
    console.log('MetricasCard - Dados recebidos:', {
      areasAcompanhamento: data.areasAcompanhamento,
      areasFinalizadas: data.areasFinalizadas,
      areasImplantar: data.areasImplantar,
      mediaHectaresArea: data.mediaHectaresArea,
      totalAreas: data.areasAcompanhamento + data.areasFinalizadas + data.areasImplantar
    });
  }, [data]);

  // Calcula o total de áreas somando todas as categorias
  const totalAreas = useMemo(() => {
    const acompanhamento = Number(data?.areasAcompanhamento || 0);
    const finalizadas = Number(data?.areasFinalizadas || 0);
    const implantar = Number(data?.areasImplantar || 0);
    
    const total = acompanhamento + finalizadas + implantar;
    
    console.log('Cálculo de Áreas:', {
      acompanhamento,
      finalizadas,
      implantar,
      total
    });
    
    return total;
  }, [data.areasAcompanhamento, data.areasFinalizadas, data.areasImplantar]);

  // Calcula o total de hectares
  const calculatedTotalHectares = useMemo(() => {
    const mediaHectares = Number(data?.mediaHectaresArea || 0);
    const total = totalAreas * mediaHectares;
    
    console.log('Cálculo de Hectares:', {
      totalAreas,
      mediaHectares,
      resultado: total
    });
    
    return total;
  }, [totalAreas, data.mediaHectaresArea]);

  // Função auxiliar para garantir valores numéricos válidos
  const ensureValidNumber = (value) => {
    if (value === undefined || value === null) {
      return 0;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  console.log('Debug - Valores:', {
    areasAcompanhamento: data?.areasAcompanhamento,
    areasFinalizadas: data?.areasFinalizadas,
    areasImplantar: data?.areasImplantar,
    totalAreas,
    mediaHectaresArea: data?.mediaHectaresArea,
    calculatedTotalHectares
  });

  // Calcula a porcentagem de realização da área
  const areaRealizationPercent = data.areaPotencialTotal > 0 
    ? (calculatedTotalHectares / ensureValidNumber(data.areaPotencialTotal)) * 100 
    : 0;

  // Calcula o valor médio por hectare e potencial de vendas
  const metricsFinanceiras = useMemo(() => {
    const totalHectares = calculatedTotalHectares || 0;
    const totalVendas = (data.totalVendido || 0) + (data.totalBonificado || 0);
    
    // Calcula o valor médio por hectare
    const valorMedioHectare = totalHectares > 0 ? totalVendas / totalHectares : 0;
    
    // Calcula o potencial de vendas total
    const potencialVendas = valorMedioHectare * ensureValidNumber(data.areaPotencialTotal);

    console.log('Cálculo Financeiro:', {
      totalHectares,
      totalVendas,
      valorMedioHectare,
      potencialVendas
    });

    return {
      valorMedioHectare,
      potencialVendasTotal: potencialVendas
    };
  }, [calculatedTotalHectares, data.totalVendido, data.totalBonificado, data.areaPotencialTotal]);

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Métricas</h2>
      
      <div className="space-y-4">
        {/* Distribuição de Vendas */}
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Distribuição de Vendas</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Vendido</span>
                <div>
                  <span className="font-semibold">{formatMoney(data.totalVendido)}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatPercent((data.totalVendido / data.totalGeral) * 100)})
                  </span>
                </div>
              </div>
              <ProgressBar
                value={data.totalVendido}
                total={data.totalGeral}
                color="green"
                showLabel={false}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Bonificado</span>
                <div>
                  <span className="font-semibold">{formatMoney(data.totalBonificado)}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatPercent((data.totalBonificado / data.totalGeral) * 100)})
                  </span>
                </div>
              </div>
              <ProgressBar
                value={data.totalBonificado}
                total={data.totalGeral}
                color="blue"
                showLabel={false}
              />
            </div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Geral</span>
                <span className="font-bold">{formatMoney(data.totalGeral)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Área */}
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Métricas de Área</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total em Hectares</p>
              <p className="font-semibold">{calculatedTotalHectares.toFixed(2)} ha</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Média Hectare das Áreas</p>
              <p className="font-semibold">{ensureValidNumber(data.mediaHectaresArea).toFixed(2)} ha</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Área Potencial Total</p>
            <p className="font-semibold">{ensureValidNumber(data.areaPotencialTotal).toFixed(2)} ha</p>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={calculatedTotalHectares}
              total={ensureValidNumber(data.areaPotencialTotal)}
              label="Realização da Área Potencial"
              color="yellow"
              showLabel={true}
              showPercent={true} // Adicionado para mostrar o percentual
            />
          </div>
        </div>

        {/* Métricas Financeiras */}
        <div>
          <h3 className="font-medium mb-2">Métricas Financeiras</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Valor Médio/Hectare</p>
              <p className="font-semibold">{formatMoney(metricsFinanceiras.valorMedioHectare)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Potencial de Vendas Total</p>
              <p className="font-semibold">{formatMoney(metricsFinanceiras.potencialVendasTotal)}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={data.totalGeral}
              total={metricsFinanceiras.potencialVendasTotal}
              label="Realização do Potencial de Vendas"
              color="indigo"
              showLabel={true}
              showPercent={true} // Adicionado para mostrar o percentual
            />
          </div>
        </div>
      </div>
    </div>
  );
};

MetricasCard.propTypes = {
  data: PropTypes.shape({
    areas: PropTypes.number,                    // Adicionado
    mediaHectaresArea: PropTypes.number,
    valorMedioHectare: PropTypes.number,
    totalVendido: PropTypes.number,
    totalBonificado: PropTypes.number,
    totalGeral: PropTypes.number,
    areaPotencialTotal: PropTypes.number,
    potencialVendasTotal: PropTypes.number,
    areasAcompanhamento: PropTypes.number,
    areasImplantar: PropTypes.number,
    areasFinalizadas: PropTypes.number
  }).isRequired,
  formatMoney: PropTypes.func.isRequired,
  formatPercent: PropTypes.func.isRequired  // Adicionado PropType para formatPercent
};

// Defina defaultProps para garantir valores padrão
MetricasCard.defaultProps = {
  data: {
    areasAcompanhamento: 0,
    areasFinalizadas: 0,
    areasImplantar: 0,
    mediaHectaresArea: 0,
    totalVendido: 0,
    totalBonificado: 0,
    totalGeral: 0,
    areaPotencialTotal: 0,
    potencialVendasTotal: 0,
    valorMedioHectare: 0
  }
};

export default MetricasCard;
