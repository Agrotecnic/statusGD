import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar/ProgressBar';

<<<<<<< HEAD
const AreasCard = ({ data, formatPercent, onEdit, disabled }) => {
  // Função auxiliar para garantir valores numéricos válidos
  const ensureValidNumber = (value) => {
    if (value === undefined || value === null) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
=======
const ProgressBar = ({ values }) => {
  const total = values.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const calculateWidth = (value) => (total > 0 ? (value / total) * 100 : 0);
>>>>>>> 346a7925ffc3843dd8cc0b31cd1cd6415bfa7c1a

  // Calcula o total de áreas
  const totalAreas = 
    ensureValidNumber(data.emAcompanhamento) + 
    ensureValidNumber(data.finalizadas) + 
    ensureValidNumber(data.aImplantar);

<<<<<<< HEAD
  // Calcula os percentuais
  const getPercentage = (value) => {
    if (totalAreas === 0) return 0;
    return (ensureValidNumber(value) / totalAreas) * 100;
  };

  const areaItems = [
    {
      label: 'Em Acompanhamento',
      value: data.emAcompanhamento,
      color: 'blue',
      percent: getPercentage(data.emAcompanhamento)
=======
const AreasCard = ({ data, onEdit }) => {
  // Corrigido para usar emAcompanhamento
  const total = data.emAcompanhamento + data.aImplantar + data.finalizados;
  
  const progressValues = [
    {
      value: data.emAcompanhamento, // Corrigido aqui
      color: 'bg-yellow-500',
      label: 'Acompanhamento'
>>>>>>> 346a7925ffc3843dd8cc0b31cd1cd6415bfa7c1a
    },
    {
      label: 'Finalizadas',
      value: data.finalizadas,
      color: 'green',
      percent: getPercentage(data.finalizadas)
    },
    {
      label: 'A Implantar',
      value: data.aImplantar,
      color: 'yellow',
      percent: getPercentage(data.aImplantar)
    }
  ];

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Áreas</h2>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600 hide-on-print"
          disabled={disabled}
        >
          Editar
        </button>
      </div>
<<<<<<< HEAD
      
      <div className="grid grid-cols-1 gap-4">
        {areaItems.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="text-right">
                <span className="font-semibold">{ensureValidNumber(item.value)}</span>
                <span className="text-sm text-gray-500 ml-2">({formatPercent(item.percent)})</span>
              </div>
=======
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
>>>>>>> 346a7925ffc3843dd8cc0b31cd1cd6415bfa7c1a
            </div>
            <ProgressBar
              value={item.value}
              total={totalAreas}
              color={item.color}
              showLabel={false} // Adicionado para remover o label da barra
            />
          </div>
        ))}
        
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">Total de Áreas</p>
          <p className="font-bold">{totalAreas}</p>
        </div>
      </div>
<<<<<<< HEAD
=======
      <div className="mt-4">
        <p className="font-medium">Média Hectare das Áreas</p>
        <p className="text-2xl">{data.mediaHectaresArea?.toFixed(2) || '-'} ha</p>
      </div>
>>>>>>> 346a7925ffc3843dd8cc0b31cd1cd6415bfa7c1a
    </div>
  );
};

AreasCard.propTypes = {
  data: PropTypes.shape({
<<<<<<< HEAD
    emAcompanhamento: PropTypes.number,
    finalizadas: PropTypes.number,
    aImplantar: PropTypes.number
=======
    emAcompanhamento: PropTypes.number, // Corrigido aqui
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number,
    mediaHectaresArea: PropTypes.number
>>>>>>> 346a7925ffc3843dd8cc0b31cd1cd6415bfa7c1a
  }).isRequired,
  formatPercent: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

AreasCard.defaultProps = {
  data: {
    emAcompanhamento: 0,
    finalizadas: 0,
    aImplantar: 0
  },
  disabled: false
};

export default AreasCard;