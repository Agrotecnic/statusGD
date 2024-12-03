import React from 'react';

const ProgressBar = ({ value = 0, color = 'bg-blue-500' }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
    <div
      className={`h-full ${color}`}
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const MetricasCard = ({ data, formatMoney, formatPercent }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Métricas</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Total Vendido</p>
          <p className="text-2xl">{formatMoney(data.totalVendido)}</p>
          <div className="mt-1">
            <ProgressBar value={data.percentualVendido} />
            <p className="text-sm text-gray-600">{formatPercent(data.percentualVendido)}</p>
          </div>
        </div>
        <div>
          <p className="font-medium">Total Bonificado</p>
          <p className="text-2xl">{formatMoney(data.totalBonificado)}</p>
          <div className="mt-1">
            <ProgressBar value={data.percentualBonificado} color="bg-green-500" />
            <p className="text-sm text-gray-600">{formatPercent(data.percentualBonificado)}</p>
          </div>
        </div>
        <div>
          <p className="font-medium">Total Geral</p>
          <p className="text-2xl">{formatMoney(data.totalGeral)}</p>
        </div>
        <div>
          <p className="font-medium">Total em Hectares</p>
          <p className="text-2xl">{data.totalHectares?.toFixed(2) || '0.00'}</p>
        </div>
        <div>
          <p className="font-medium">Valor Médio/Hectare</p>
          <p className="text-2xl">{formatMoney(data.valorMedioHectare)}</p>
        </div>
        <div>
          <p className="font-medium">Área Potencial Total (ha)</p>
          <p className="text-2xl">{data.areaPotencialTotal?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="col-span-2">
          <p className="font-medium">Potencial de Vendas Total</p>
          <p className="text-2xl">{formatMoney(data.potencialVendasTotal)}</p>
          <div className="mt-1">
            <ProgressBar value={data.percentualRealizacao} color="bg-blue-600" />
            <p className="text-sm text-gray-600">
              {formatPercent(data.percentualRealizacao)} realizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasCard;