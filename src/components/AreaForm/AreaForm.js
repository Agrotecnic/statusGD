import React, { useState } from 'react';

const AreaForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    emAcompanhamento: initialData.emAcompanhamento || '',
    aImplantar: initialData.aImplantar || '',
    hectaresPorArea: initialData.hectaresPorArea || '',
    areaPotencialTotal: initialData.areaPotencialTotal || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Converte strings vazias para 0 antes de enviar
    const formattedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key] === '' ? 0 : parseFloat(formData[key]);
      return acc;
    }, {});
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Editar Áreas</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Em Acompanhamento
        </label>
        <input
          type="number"
          name="emAcompanhamento"
          value={formData.emAcompanhamento}
          onChange={handleChange}
          min="0"
          step="1"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          A Implantar
        </label>
        <input
          type="number"
          name="aImplantar"
          value={formData.aImplantar}
          onChange={handleChange}
          min="0"
          step="1"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hectares por Área
        </label>
        <input
          type="number"
          name="hectaresPorArea"
          value={formData.hectaresPorArea}
          onChange={handleChange}
          min="0"
          step="0.1"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Área Potencial Total
        </label>
        <input
          type="number"
          name="areaPotencialTotal"
          value={formData.areaPotencialTotal}
          onChange={handleChange}
          min="0"
          step="0.1"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default AreaForm;