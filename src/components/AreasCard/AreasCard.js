import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ values }) => {
  const total = values.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const calculateWidth = (value) => (total > 0 ? (value / total) * 100 : 0);

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
      {values.map((item, index) => (
        <div
          key={index}
          className={`h-full ${item.color} transition-all duration-300`}
          style={{ width: `${calculateWidth(item.value)}%` }}
          title={`${item.label}: ${calculateWidth(item.value).toFixed(1)}%`}
        />
      ))}
    </div>
  );
};

const AreasCard = ({ data, onEdit }) => {
  // Corrigido para usar emAcompanhamento
  const total = data.emAcompanhamento + data.aImplantar + data.finalizados;
  
  const progressValues = [
    {
      value: data.emAcompanhamento, // Corrigido aqui
      color: 'bg-yellow-500',
      label: 'Acompanhamento'
    },
    {
      value: data.aImplantar,
      color: 'bg-blue-500',
      label: 'A Implantar'
    },
    {
      value: data.finalizados,
      color: 'bg-green-500',
      label: 'Finalizados'
    }
  ];

  const calculatePercentage = (value) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

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
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="font-medium">Acompanhamento</p>
          <p className="text-2xl">{data.emAcompanhamento || '-'}</p> {/* Corrigido aqui */}
          <p className="text-sm text-gray-500">{calculatePercentage(data.emAcompanhamento)}%</p> {/* Corrigido aqui */}
        </div>
        <div>
          <p className="font-medium">A Implantar</p>
          <p className="text-2xl">{data.aImplantar || '-'}</p>
          <p className="text-sm text-gray-500">{calculatePercentage(data.aImplantar)}%</p>
        </div>
        <div>
          <p className="font-medium">Finalizados</p>
          <p className="text-2xl">{data.finalizados || '-'}</p>
          <p className="text-sm text-gray-500">{calculatePercentage(data.finalizados)}%</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-medium mb-2">Distribuição das Áreas</p>
        <ProgressBar values={progressValues} />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          {progressValues.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="font-medium">Média Hectare das Áreas</p>
        <p className="text-2xl">{data.mediaHectaresArea?.toFixed(2) || '-'} ha</p>
      </div>
    </div>
  );
};

AreasCard.propTypes = {
  data: PropTypes.shape({
    emAcompanhamento: PropTypes.number, // Corrigido aqui
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number,
    mediaHectaresArea: PropTypes.number
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

export default AreasCard;