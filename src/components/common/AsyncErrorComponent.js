import React from 'react';
import PropTypes from 'prop-types';

const AsyncErrorComponent = ({ error, retry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
    <div className="flex flex-col items-center space-y-4">
      <div className="text-red-500">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-800">Erro ao carregar componente</h3>
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  </div>
);

AsyncErrorComponent.propTypes = {
  error: PropTypes.object.isRequired,
  retry: PropTypes.func
};

export default AsyncErrorComponent;