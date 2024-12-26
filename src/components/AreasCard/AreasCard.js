import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar/ProgressBar';

const AreasCard = ({ data, formatPercent, onEdit, disabled }) => {
  // Garante que todos os valores sejam números
  const emAcompanhamento = Number(data?.emAcompanhamento || 0);
  const aImplantar = Number(data?.aImplantar || 0);
  const finalizados = Number(data?.finalizados || 0); // Corrigido para usar finalizados
  
  // Calcula o total incluindo finalizados
  const total = emAcompanhamento + aImplantar + finalizados;
  
  // Calcula as porcentagens
  const calcPercent = (value) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

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
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Em Acompanhamento</p>
          <p className="text-lg font-semibold">{emAcompanhamento} ({formatPercent(calcPercent(emAcompanhamento))})</p>
          <ProgressBar 
            percent={calcPercent(emAcompanhamento)} 
            color="blue"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">A Implantar</p>
          <p className="text-lg font-semibold">{aImplantar} ({formatPercent(calcPercent(aImplantar))})</p>
          <ProgressBar 
            percent={calcPercent(aImplantar)} 
            color="yellow"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Finalizados</p>
          <p className="text-lg font-semibold">{finalizados} ({formatPercent(calcPercent(finalizados))})</p>
          <ProgressBar 
            percent={calcPercent(finalizados)} 
            color="green"
          />
        </div>
        <div className="border-t pt-2">
          <p className="text-sm text-gray-600">Total de Áreas</p>
          <p className="text-xl font-bold">{total}</p>
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