import React from 'react';

const LoadingDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-lg text-gray-600">Carregando dados do dashboard...</p>
    </div>
  </div>
);

export default LoadingDashboard;
