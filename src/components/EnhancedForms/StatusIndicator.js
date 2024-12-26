import React from 'react';
import PropTypes from 'prop-types';

export const StatusIndicator = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          text: 'Salvando...',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300'
        };
      case 'saved':
        return {
          text: 'Salvo com sucesso!',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300'
        };
      case 'error':
        return {
          text: 'Erro ao salvar',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
      {statusConfig.text}
    </div>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['idle', 'saving', 'saved', 'error']).isRequired
};

export default StatusIndicator;