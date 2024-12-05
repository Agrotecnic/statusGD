import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar/ProgressBar';

const MetricasCard = ({ data, formatMoney }) => {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Métricas</h2>
      
      <div className="space-y-4">
        {/* Distribuição de Vendas */}
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Distribuição de Vendas</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vendido</span>
                <span className="font-semibold">{formatMoney(data.totalVendido)}</span>
              </div>
              <ProgressBar
                value={data.totalVendido}
                total={data.totalGeral}
                label="Vendido"
                color="green"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bonificado</span>
                <span className="font-semibold">{formatMoney(data.totalBonificado)}</span>
              </div>
              <ProgressBar
                value={data.totalBonificado}
                total={data.totalGeral}
                label="Bonificado"
                color="blue"
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
              <p className="font-semibold">{data.totalHectares.toFixed(2)} ha</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Média Hectare das Áreas</p>
              <p className="font-semibold">{data.mediaHectaresArea.toFixed(2)} ha</p>
            </div>
          </div>
             <div className="mt-2">
             <p className="text-sm text-gray-600">Área Potencial Total</p>
             <p className="font-semibold">{data.areaPotencialTotal.toFixed(2)} ha</p>
          </div>
        </div>
          <div className="mt-3">
            <ProgressBar
              value={data.totalHectares}
              total={data.areaPotencialTotal}
              label="Realização da Área Potencial"
              color="yellow"
            />
          </div>
        </div>

        {/* Métricas Financeiras */}
        <div>
          <h3 className="font-medium mb-2">Métricas Financeiras</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Valor Médio/Hectare</p>
              <p className="font-semibold">{formatMoney(data.valorMedioHectare)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Potencial de Vendas Total</p>
              <p className="font-semibold">{formatMoney(data.potencialVendasTotal)}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={data.totalGeral}
              total={data.potencialVendasTotal}
              label="Realização do Potencial de Vendas"
              color="indigo"
            />
          </div>
        </div>
      </div>

  );
};

MetricasCard.propTypes = {
  data: PropTypes.shape({
    totalHectares: PropTypes.number.isRequired,
    mediaHectaresArea: PropTypes.number.isRequired,
    valorMedioHectare: PropTypes.number.isRequired,
    potencialVendasTotal: PropTypes.number.isRequired,
    totalVendido: PropTypes.number.isRequired,
    totalBonificado: PropTypes.number.isRequired,
    totalGeral: PropTypes.number.isRequired,
    areaPotencialTotal: PropTypes.number.isRequired,
  }).isRequired,
  formatMoney: PropTypes.func.isRequired,
};

export default MetricasCard;
