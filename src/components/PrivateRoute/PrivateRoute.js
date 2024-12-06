// src/components/PrivateRoute/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = (props) => {
  // Ao invés de desestruturar diretamente nos parâmetros,
  // desestruturamos dentro da função
  const { user, adminOnly } = props;

  // Se não há usuário
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se requer admin e o usuário não é admin
  if (adminOnly && (!user.role || user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  user: PropTypes.object,
  adminOnly: PropTypes.bool
};

PrivateRoute.defaultProps = {
  user: null,
  adminOnly: false
};

export default PrivateRoute;