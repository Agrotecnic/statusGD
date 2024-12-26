// src/components/Navigation/Navigation.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="font-bold text-xl">
                Status GD
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard-geral"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Análises
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-4">
              {user?.email} 
              {user?.role === 'admin' && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-500 rounded">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired
};

export default Navigation;