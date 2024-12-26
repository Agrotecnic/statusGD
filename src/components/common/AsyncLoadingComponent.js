import React from 'react';

const AsyncLoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

export default AsyncLoadingComponent;