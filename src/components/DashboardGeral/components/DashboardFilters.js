import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DashboardFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  businessUnits,
  regionais,
  produtos
}) => {
  // Estados locais para controle de validação
  const [validationErrors, setValidationErrors] = useState({});
  const [availableRegionals, setAvailableRegionals] = useState(regionais || []);

  // Efeito para atualizar regionais disponíveis quando a BU mudar
  useEffect(() => {
    if (filters.selectedBU && businessUnits[filters.selectedBU]) {
      setAvailableRegionals(businessUnits[filters.selectedBU]);
    } else {
      setAvailableRegionals(regionais || []);
    }
  }, [filters.selectedBU, businessUnits, regionais]);

  // Função de validação dos filtros
  const validateFilters = (currentFilters) => {
    const errors = {};

    // Validação de datas
    if (currentFilters.startDate && currentFilters.endDate) {
      if (new Date(currentFilters.startDate) > new Date(currentFilters.endDate)) {
        errors.date = 'Data inicial não pode ser maior que a data final';
      }
    }

    // Validação de valores
    if (currentFilters.minValue && currentFilters.maxValue) {
      if (Number(currentFilters.minValue) > Number(currentFilters.maxValue)) {
        errors.value = 'Valor mínimo não pode ser maior que o valor máximo';
      }
    }

    // Validação de área
    if (currentFilters.minArea && currentFilters.maxArea) {
      if (Number(currentFilters.minArea) > Number(currentFilters.maxArea)) {
        errors.area = 'Área mínima não pode ser maior que a área máxima';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler para mudanças nos filtros
  const handleFilterChange = (field, value) => {
    
    // Limpar regional quando mudar BU
    if (field === 'selectedBU' && filters.selectedRegional) {
      onFilterChange({
        ...filters,
        [field]: value,
        selectedRegional: ''
      });
    } else {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  // Handler para formatação do período
  const formatPeriodDisplay = (period) => {
    if (!period) return '';
    return period.replace('_', ' ').toUpperCase();
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Filtros Principais (BU, Regional, Produto) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Business Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Unit
            </label>
            <select
              value={filters.selectedBU || ''}
              onChange={(e) => handleFilterChange('selectedBU', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todas as BUs</option>
              {Object.keys(businessUnits).map((bu) => (
                <option key={bu} value={bu}>
                  {bu}
                </option>
              ))}
            </select>
          </div>

          {/* Regional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regional
            </label>
            <select
              value={filters.selectedRegional || ''}
              onChange={(e) => handleFilterChange('selectedRegional', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={!filters.selectedBU}
            >
              <option value="">Todas as Regionais</option>
              {availableRegionals.map((regional) => (
                <option key={regional} value={regional}>
                  {regional}
                </option>
              ))}
            </select>
          </div>

          {/* Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto
            </label>
            <select
              value={filters.selectedProduto || ''}
              onChange={(e) => handleFilterChange('selectedProduto', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos os Produtos</option>
              {produtos?.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de Data e Período */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.date ? 'border-red-500' : ''
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.date ? 'border-red-500' : ''
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={filters.periodo || 'ultimo_trimestre'}
              onChange={(e) => handleFilterChange('periodo', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ultimo_trimestre">Último Trimestre</option>
              <option value="ultimo_semestre">Último Semestre</option>
              <option value="ultimo_ano">Último Ano</option>
            </select>
          </div>
          {validationErrors.date && (
            <div className="col-span-3">
              <p className="text-sm text-red-600">{validationErrors.date}</p>
            </div>
          )}
        </div>

        {/* Filtros de Valor e Área */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Valores */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mínimo
            </label>
            <input
              type="number"
              value={filters.minValue || ''}
              onChange={(e) => handleFilterChange('minValue', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.value ? 'border-red-500' : ''
              }`}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Máximo
            </label>
            <input
              type="number"
              value={filters.maxValue || ''}
              onChange={(e) => handleFilterChange('maxValue', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.value ? 'border-red-500' : ''
              }`}
              min="0"
              step="0.01"
            />
          </div>

          {/* Áreas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área Mínima (ha)
            </label>
            <input
              type="number"
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.area ? 'border-red-500' : ''
              }`}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área Máxima (ha)
            </label>
            <input
              type="number"
              value={filters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                validationErrors.area ? 'border-red-500' : ''
              }`}
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Mensagens de erro */}
          {validationErrors.value && (
            <div className="col-span-2">
              <p className="text-sm text-red-600">{validationErrors.value}</p>
            </div>
          )}
          {validationErrors.area && (
            <div className="col-span-2">
              <p className="text-sm text-red-600">{validationErrors.area}</p>
            </div>
          )}
        </div>

        {/* Filtros Ativos */}
        <div className="flex flex-wrap gap-2">
          {filters.selectedBU && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              BU: {filters.selectedBU}
            </span>
          )}
          {filters.selectedRegional && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Regional: {filters.selectedRegional}
            </span>
          )}
          {filters.selectedProduto && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Produto: {produtos?.find(p => p.id === filters.selectedProduto)?.nome || filters.selectedProduto}
            </span>
          )}
          {filters.periodo && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Período: {formatPeriodDisplay(filters.periodo)}
            </span>
          )}
          {filters.startDate && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              De: {new Date(filters.startDate).toLocaleDateString()}
            </span>
          )}
          {filters.endDate && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Até: {new Date(filters.endDate).toLocaleDateString()}
            </span>
          )}
          {(filters.minValue || filters.maxValue) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Valor: {filters.minValue ? `Min: ${filters.minValue}` : ''} 
              {filters.minValue && filters.maxValue ? ' - ' : ''}
              {filters.maxValue ? `Max: ${filters.maxValue}` : ''}
            </span>
          )}
          {(filters.minArea || filters.maxArea) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Área: {filters.minArea ? `Min: ${filters.minArea}ha` : ''} 
              {filters.minArea && filters.maxArea ? ' - ' : ''}
              {filters.maxArea ? `Max: ${filters.maxArea}ha` : ''}
            </span>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setValidationErrors({});
              onResetFilters();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Limpar Filtros
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateFilters(filters)) {
                onApplyFilters(filters);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

DashboardFilters.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    selectedBU: PropTypes.string,
    selectedRegional: PropTypes.string,
    selectedProduto: PropTypes.string,
    periodo: PropTypes.string,
    minValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  businessUnits: PropTypes.object.isRequired,
  regionais: PropTypes.array.isRequired,
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nome: PropTypes.string.isRequired
    })
  ).isRequired
 };
 
 DashboardFilters.defaultProps = {
  businessUnits: {},
  regionais: [],
  produtos: []
 };
 
 export default DashboardFilters;