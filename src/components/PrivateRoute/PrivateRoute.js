// src/components/PrivateRoute/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ user, children, adminOnly }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
  adminOnly: PropTypes.bool
};

PrivateRoute.defaultProps = {
  user: null,
  adminOnly: false
};

export default PrivateRoute;