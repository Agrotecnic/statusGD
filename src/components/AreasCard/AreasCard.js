import React from 'react';

const ProgressBar = ({ value = 0 }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-500"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const AreasCard = ({ data, formatPercent = value => `${value?.toFixed(1) || 0}%`, onEdit }) => {
  const percentualImplantacao = data?.emAcompanhamento && data?.aImplantar
    ? (data.emAcompanhamento / (data.emAcompanhamento + data.aImplantar)) * 100
    : 0;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Áreas</h2>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600"
        >
          Editar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Em Acompanhamento</p>
          <p className="text-2xl">{data?.emAcompanhamento || 0}</p>
        </div>
        <div>
          <p className="font-medium">A Implantar</p>
          <p className="text-2xl">{data?.aImplantar || 0}</p>
        </div>
        <div>
          <p className="font-medium">Hectares por Área</p>
          <p className="text-2xl">{data?.hectaresPorArea || 0}</p>
        </div>
        <div className="col-span-2">
          <p className="font-medium">Implantação</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl">{formatPercent(percentualImplantacao)}</p>
            <div className="flex-grow">
              <ProgressBar value={percentualImplantacao} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasCard;