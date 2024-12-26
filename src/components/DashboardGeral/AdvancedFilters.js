// src/components/DashboardGeral/AdvancedFilters.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/solid';

const AdvancedFilters = ({ 
  onFilterChange,
  availableRegions,
  availableMetrics,
  currentFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMetricToggle = (metricId) => {
    const updatedMetrics = currentFilters.selectedMetrics.includes(metricId)
      ? currentFilters.selectedMetrics.filter(id => id !== metricId)
      : [...currentFilters.selectedMetrics, metricId];
    
    onFilterChange({
      ...currentFilters,
      selectedMetrics: updatedMetrics
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center cursor-pointer"
           onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-medium">Filtros Avançados</h3>
        <ChevronDownIcon 
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Período de Análise */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Período de Análise</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={currentFilters.dateRange.start}
                  onChange={(e) => onFilterChange({
                    ...currentFilters,
                    dateRange: { ...currentFilters.dateRange, start: e.target.value }
                  })}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data Final</label>
                <input
                  type="date"
                  value={currentFilters.dateRange.end}
                  onChange={(e) => onFilterChange({
                    ...currentFilters,
                    dateRange: { ...currentFilters.dateRange, end: e.target.value }
                  })}
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Regiões */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regiões</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableRegions.map(region => (
                <label key={region.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentFilters.selectedRegions.includes(region.id)}
                    onChange={() => {
                      const updatedRegions = currentFilters.selectedRegions.includes(region.id)
                        ? currentFilters.selectedRegions.filter(id => id !== region.id)
                        : [...currentFilters.selectedRegions, region.id];
                      
                      onFilterChange({
                        ...currentFilters,
                        selectedRegions: updatedRegions
                      });
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{region.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Métricas de Análise */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Métricas</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableMetrics.map(metric => (
                <label key={metric.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentFilters.selectedMetrics.includes(metric.id)}
                    onChange={() => handleMetricToggle(metric.id)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{metric.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Opções Avançadas */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Opções Avançadas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Horizonte de Projeção
                </label>
                <select
                  value={currentFilters.projectionHorizon}
                  onChange={(e) => onFilterChange({
                    ...currentFilters,
                    projectionHorizon: e.target.value
                  })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="3">3 meses</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Intervalo de Confiança
                </label>
                <select
                  value={currentFilters.confidenceInterval}
                  onChange={(e) => onFilterChange({
                    ...currentFilters,
                    confidenceInterval: e.target.value
                  })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="0.90">90%</option>
                  <option value="0.95">95%</option>
                  <option value="0.99">99%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={() => onFilterChange({
                dateRange: { start: '', end: '' },
                selectedRegions: [],
                selectedMetrics: [],
                projectionHorizon: '6',
                confidenceInterval: '0.95'
              })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Limpar Filtros
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AdvancedFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  availableRegions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  availableMetrics: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  currentFilters: PropTypes.shape({
    dateRange: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }).isRequired,
    selectedRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedMetrics: PropTypes.arrayOf(PropTypes.string).isRequired,
    projectionHorizon: PropTypes.string.isRequired,
    confidenceInterval: PropTypes.string.isRequired
  }).isRequired
};

export default AdvancedFilters;