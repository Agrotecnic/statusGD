// src/components/EnhancedDataEntry/FormField.js
import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const FormField = ({
  label,
  name,
  value,
  type = 'text',
  onChange,
  error,
  help,
  required = false
}) => {
  // Estado do campo: erro, sucesso ou neutro
  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (value && !error) return 'border-green-500';
    return 'border-gray-300';
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center mb-1">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {help && (
          <div className="group relative ml-2">
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="invisible group-hover:visible absolute z-50 w-48 p-2 mt-1 
                          text-sm bg-gray-800 text-white rounded-md -right-1">
              {help}
            </div>
          </div>
        )}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 rounded-md border ${getBorderColor()} 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors duration-200`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// src/components/EnhancedDataEntry/ProgressBar.js
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
      </div>
    </div>
  );
};

// src/components/EnhancedDataEntry/StatusIndicator.js
const StatusIndicator = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'saving':
        return {
          color: 'text-yellow-500',
          message: 'Salvando alterações...',
          icon: '🔄'
        };
      case 'saved':
        return {
          color: 'text-green-500',
          message: 'Todas as alterações salvas',
          icon: '✓'
        };
      case 'error':
        return {
          color: 'text-red-500',
          message: 'Erro ao salvar',
          icon: '⚠️'
        };
      default:
        return {
          color: 'text-gray-500',
          message: '',
          icon: ''
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className={`flex items-center ${details.color} text-sm`}>
      <span className="mr-2">{details.icon}</span>
      {details.message}
    </div>
  );
};