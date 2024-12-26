import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AreaForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  console.log('AreaForm - Dados Iniciais:', initialData);

  const [formData, setFormData] = useState({
    emAcompanhamento: Number(initialData.emAcompanhamento) || 0,
    aImplantar: Number(initialData.aImplantar) || 0,
    finalizados: Number(initialData.finalizados) || 0,
    mediaHectaresArea: Number(initialData.mediaHectaresArea) || 0,
    areaPotencialTotal: Number(initialData.areaPotencialTotal) || 0
  });

  // Effect para atualizar o formData quando initialData mudar
  useEffect(() => {
    console.log('AreaForm - InitialData atualizado:', initialData);
    setFormData({
      emAcompanhamento: Number(initialData.emAcompanhamento) || 0,
      aImplantar: Number(initialData.aImplantar) || 0,
      finalizados: Number(initialData.finalizados) || 0,
      mediaHectaresArea: Number(initialData.mediaHectaresArea) || 0,
      areaPotencialTotal: Number(initialData.areaPotencialTotal) || 0
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : Number(value);
    console.log(`AreaForm - Atualizando ${name}:`, numericValue);
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const calculateTotalAreas = () => {
    const total = formData.emAcompanhamento + formData.aImplantar + formData.finalizados;
    console.log('AreaForm - Total de áreas calculado:', total);
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAreas = calculateTotalAreas();
    console.log('AreaForm - Submetendo dados:', { ...formData, totalAreas });
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
          name="emAcompanhamento"
          value={formData.emAcompanhamento}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          disabled={isLoading}
          required
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
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áreas Finalizados
        </label>
        <input
          type="number"
          name="finalizados"
          value={formData.finalizados}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          min="0"
          disabled={isLoading}
          required
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total de Áreas:</span>
          <span className="font-medium">{calculateTotalAreas()}</span>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
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
            disabled={isLoading}
            required
          />
        </div>

        <div className="mt-4">
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
            disabled={isLoading}
            required
          />
        </div>
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
    emAcompanhamento: PropTypes.number,
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number,
    mediaHectaresArea: PropTypes.number,
    areaPotencialTotal: PropTypes.number
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default AreaForm;