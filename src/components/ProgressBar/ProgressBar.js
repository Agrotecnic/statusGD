// components/ProgressBar/ProgressBar.js
import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ percent, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500'
  };

  const bgColor = colors[color] || 'bg-blue-500';

  return (
    <div className="w-full bg-gray-200 rounded h-2 mt-1">
      <div
        className={`${bgColor} h-2 rounded`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow'])
};

ProgressBar.defaultProps = {
  color: 'blue'
};

export default ProgressBar;