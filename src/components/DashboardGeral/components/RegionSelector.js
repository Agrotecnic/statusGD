// src/components/DashboardGeral/components/RegionSelector.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// Movido para fora do componente para evitar recriações
const REGION_DATA = {
  'BU1': [
    'RS NORTE',
    'RS SUL',
    'PR SUL SC',
    'PR NORTE SP EXP'
  ],
  'BU2': [
    'AC RO MT OESTE',
    'MS',
    'MT',
    'MT SUL',
    'GO'
  ],
  'BU3': [
    'MA PI TO PA',
    'CERRADO MG',
    'REGIONAL LESTE',
    'REGIONAL NORDEST'
  ]
};

const RegionSelector = ({ selectedBU, selectedRegional, onBUChange, onRegionalChange }) => {
  const availableRegionals = useMemo(() => {
    return selectedBU ? REGION_DATA[selectedBU] : [];
  }, [selectedBU]);

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Unit
        </label>
        <select
          value={selectedBU}
          onChange={(e) => onBUChange(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todas BUs</option>
          {Object.keys(REGION_DATA).map((bu) => (
            <option key={bu} value={bu}>{bu}</option>
          ))}
        </select>
      </div>

      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Regional
        </label>
        <select
          value={selectedRegional}
          onChange={(e) => onRegionalChange(e.target.value)}
          disabled={!selectedBU}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Todas Regionais</option>
          {availableRegionals.map((regional) => (
            <option key={regional} value={regional}>{regional}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

RegionSelector.propTypes = {
  selectedBU: PropTypes.string,
  selectedRegional: PropTypes.string,
  onBUChange: PropTypes.func.isRequired,
  onRegionalChange: PropTypes.func.isRequired
};

export default RegionSelector;