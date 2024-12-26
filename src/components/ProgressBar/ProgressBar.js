// components/ProgressBar/ProgressBar.js
import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ 
  value, 
  total, 
  label, 
  color = 'blue', 
  showLabel = true,
  showPercent = true // Novo prop para controlar exibição do percentual
}) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          {showPercent && <span>{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color] || 'bg-blue-500'} transition-all duration-300`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  showLabel: PropTypes.bool,
  showPercent: PropTypes.bool
};

export default ProgressBar;