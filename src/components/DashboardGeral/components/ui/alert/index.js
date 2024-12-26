// src/components/DashboardGeral/components/ui/alert/index.js
import React from 'react';
import PropTypes from 'prop-types';

export const Alert = ({ variant = 'default', children, className = '', ...props }) => {
  const baseClasses = 'p-4 rounded-lg border';
  const variantClasses = {
    default: 'bg-gray-100 border-gray-200 text-gray-800',
    destructive: 'bg-red-100 border-red-200 text-red-800',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    success: 'bg-green-100 border-green-200 text-green-800',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);

Alert.propTypes = {
  variant: PropTypes.oneOf(['default', 'destructive', 'warning', 'success']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Alert;