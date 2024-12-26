import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar/ProgressBar';

const AreasCard = ({ data, formatPercent, onEdit, disabled }) => {
  // Função auxiliar para garantir valores numéricos válidos
  const ensureValidNumber = (value) => {
    if (value === undefined || value === null) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Calcula o total de áreas
  const totalAreas = 
    ensureValidNumber(data.emAcompanhamento) + 
    ensureValidNumber(data.finalizadas) + 
    ensureValidNumber(data.aImplantar);

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
      
      <div className="grid grid-cols-1 gap-4">
        {areaItems.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="text-right">
                <span className="font-semibold">{ensureValidNumber(item.value)}</span>
                <span className="text-sm text-gray-500 ml-2">({formatPercent(item.percent)})</span>
              </div>
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
    </div>
  );
};

AreasCard.propTypes = {
  data: PropTypes.shape({
    emAcompanhamento: PropTypes.number,
    finalizadas: PropTypes.number,
    aImplantar: PropTypes.number
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