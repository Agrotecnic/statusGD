import React from 'react';

const ProgressBar = ({ value }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-500"
      style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
    />
  </div>
);

const AreasCard = ({ data, onEdit }) => {
  const calculatePercentageImplantation = () => {
    const total = (data?.emAcompanhamento || 0) + (data?.aImplantar || 0);
    const implanted = data?.emAcompanhamento || 0;
    return total > 0 ? (implanted / total) * 100 : 0;
  };

  const formatPercent = (value) => `${value.toFixed(2)}%`;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Áreas</h2>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600 print-hidden"
        >
          Editar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Em Acompanhamento</p>
          <p className="text-2xl">{data?.emAcompanhamento || '-'}</p>
        </div>
        <div>
          <p className="font-medium">A Implantar</p>
          <p className="text-2xl">{data?.aImplantar || '-'}</p>
        </div>
        <div>
          <p className="font-medium">Média Hectare das Áreas</p>
          <p className="text-2xl">{data?.mediaHectaresArea?.toFixed(2) || '-'} ha</p>
        </div>
        <div className="col-span-2">
          <p className="font-medium">Implantação</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl">{formatPercent(calculatePercentageImplantation())}</p>
            <div className="flex-grow">
              <ProgressBar value={calculatePercentageImplantation()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasCard;