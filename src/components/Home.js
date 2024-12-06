import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div>
      <h1>Bem-vindo ao Sistema de Gestão de Vendas</h1>
      {currentUser ? (
        <div>
          <p>Olá, {currentUser.email}</p>
          {isAdmin && (
            <Link to="/dashboard-geral">
              <button>Ver Dashboard Geral</button>
            </Link>
          )}
        </div>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </div>
  );
}

export default Home;