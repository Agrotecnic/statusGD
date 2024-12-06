// src/components/PrivateRoute/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = (props) => {
  const { user, adminOnly } = props;

  // Se não há usuário, redireciona para a página inicial
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se a rota requer admin e o usuário não é admin, redireciona para o dashboard
  if (adminOnly && (!user.role || user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se passou pelas verificações, renderiza a rota
  return <Outlet />;
};

PrivateRoute.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  adminOnly: PropTypes.bool
};

PrivateRoute.defaultProps = {
  adminOnly: false
};

export default PrivateRoute;