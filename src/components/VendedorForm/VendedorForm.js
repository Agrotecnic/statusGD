import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BU_REGIONAL_MAPPING } from '../../utils/normalizer';

const VendedorForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState(initialData);
  const [availableRegionals, setAvailableRegionals] = useState([]);

  // Lista de Business Units disponíveis
  const businessUnits = Object.keys(BU_REGIONAL_MAPPING);

  // Atualiza as regionais disponíveis quando a BU muda
  useEffect(() => {
    if (formData.businessUnit) {
      const regionals = BU_REGIONAL_MAPPING[formData.businessUnit] || [];
      setAvailableRegionals(regionals);
      
      // Se a regional atual não está na lista de disponíveis, limpa a seleção
      if (!regionals.includes(formData.regional)) {
        setFormData(prev => ({ ...prev, regional: '' }));
      }
    }
  }, [formData.businessUnit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Editar Informações do Vendedor</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Unit
        </label>
        <select
          name="businessUnit"
          value={formData.businessUnit || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isLoading}
        >
          <option value="">Selecione uma Business Unit</option>
          {businessUnits.map(bu => (
            <option key={bu} value={bu}>
              {bu}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Regional
        </label>
        <select
          name="regional"
          value={formData.regional || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          required
          disabled={isLoading || !formData.businessUnit}
        >
          <option value="">Selecione uma Regional</option>
          {availableRegionals.map(regional => (
            <option key={regional} value={regional}>
              {regional}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

VendedorForm.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    regional: PropTypes.string,
    businessUnit: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default VendedorForm;