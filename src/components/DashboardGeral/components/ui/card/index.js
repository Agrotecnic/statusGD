// src/components/DashboardGeral/components/ui/card/index.js
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ className = '', ...props }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({ className = '', ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
);

const CardTitle = ({ className = '', ...props }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);

const CardContent = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card, CardHeader, CardTitle, CardContent };