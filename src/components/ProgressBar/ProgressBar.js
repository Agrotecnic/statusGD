// components/ProgressBar/ProgressBar.js
import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ value, total, label, color = 'blue' }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    // Adicione mais cores conforme necessário
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color] || colorClasses['blue']} transition-all duration-300 ease-in-out`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string
};

export default ProgressBar;