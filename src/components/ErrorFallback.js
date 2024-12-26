// src/components/ErrorFallback.js
import React from 'react';

export const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Algo deu errado
      </h2>
      <p className="text-gray-600">
        Tente recarregar a página
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Recarregar
      </button>
    </div>
  </div>
);