// src/components/DashboardGeral/components/DashboardForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RegionSelector from './RegionSelector';
import ProductSelector from './ProductSelector';
import { Card, CardContent } from './ui/card';

const DashboardForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    vendedor: initialData.vendedor || '',
    bu: initialData.bu || '',
    regional: initialData.regional || '',
    produto: initialData.produto || '',
    marca: initialData.marca || '',
    categoria: initialData.categoria || '',
    valorVendido: initialData.valorVendido || '',
    valorBonificado: initialData.valorBonificado || '',
    areas: initialData.areas || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Região */}
          <div className="mb-6">
            <RegionSelector
              selectedBU={formData.bu}
              selectedRegional={formData.regional}
              onBUChange={(value) => handleChange('bu', value)}
              onRegionalChange={(value) => handleChange('regional', value)}
            />
          </div>

          {/* Seletor de Produto */}
          <div className="mb-6">
            <ProductSelector
              selectedProduct={formData.produto}
              onProductSelect={(value) => handleChange('produto', value)}
              selectedMarca={formData.marca}
              onMarcaSelect={(value) => handleChange('marca', value)}
              selectedCategoria={formData.categoria}
              onCategoriaSelect={(value) => handleChange('categoria', value)}
            />
          </div>

          {/* Campos de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Vendido
              </label>
              <input
                type="number"
                value={formData.valorVendido}
                onChange={(e) => handleChange('valorVendido', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Bonificado
              </label>
              <input
                type="number"
                value={formData.valorBonificado}
                onChange={(e) => handleChange('valorBonificado', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Áreas (ha)
              </label>
              <input
                type="number"
                value={formData.areas}
                onChange={(e) => handleChange('areas', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({})}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

DashboardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    vendedor: PropTypes.string,
    bu: PropTypes.string,
    regional: PropTypes.string,
    produto: PropTypes.string,
    marca: PropTypes.string,
    categoria: PropTypes.string,
    valorVendido: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valorBonificado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    areas: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default DashboardForm;