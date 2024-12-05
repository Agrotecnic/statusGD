import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AreaForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    Acompanhamento: Number(initialData.Acompanhamento) || 0,
    aImplantar: Number(initialData.aImplantar) || 0,
    finalizados: Number(initialData.finalizados) || 0, // Novo campo
    mediaHectaresArea: Number(initialData.mediaHectaresArea) || 0,
    areaPotencialTotal: Number(initialData.areaPotencialTotal) || 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : Number(value);
    console.log(`Atualizando ${name}:`, numericValue);
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submetendo dados:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áreas em Acompanhamento
        </label>
        <input
          type="number"
          name="Acompanhamento"
          value={formData.Acompanhamento}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áreas a Implantar
        </label>
        <input
          type="number"
          name="aImplantar"
          value={formData.aImplantar}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          step="0.01"
        />
      </div>

      {/* Novo campo para Áreas Finalizadas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áreas Finalizadas
        </label>
        <input
          type="number"
          name="finalizados"
          value={formData.finalizados}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Média Hectare das Áreas
        </label>
        <input
          type="number"
          name="mediaHectaresArea"
          value={formData.mediaHectaresArea}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Área Potencial Total
        </label>
        <input
          type="number"
          name="areaPotencialTotal"
          value={formData.areaPotencialTotal}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          step="0.01"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
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

AreaForm.propTypes = {
  initialData: PropTypes.shape({
    Acompanhamento: PropTypes.number,
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number, // Adicionado aos PropTypes
    mediaHectaresArea: PropTypes.number,
    areaPotencialTotal: PropTypes.number
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default AreaForm;