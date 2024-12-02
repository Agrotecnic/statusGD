import React, { useState } from 'react';

const ProdutoForm = ({ initialData, onSubmit, onCancel, onDelete, isLoading }) => {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    valorVendido: initialData?.valorVendido || 0,
    valorBonificado: initialData?.valorBonificado || 0,
    areas: initialData?.areas || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nome' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Editar Produto' : 'Novo Produto'}
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Produto
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Vendido
        </label>
        <input
          type="number"
          name="valorVendido"
          value={formData.valorVendido}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Bonificado
        </label>
        <input
          type="number"
          name="valorBonificado"
          value={formData.valorBonificado}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Áreas
        </label>
        <input
          type="number"
          name="areas"
          value={formData.areas}
          onChange={handleChange}
          min="0"
          step="1"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Excluir
          </button>
        )}
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

export default ProdutoForm;