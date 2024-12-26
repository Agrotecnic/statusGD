import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectProduto from '../SelectProduto';

const AddProdutoModal = ({ onSave, onClose, loading = false }) => {
  const [formData, setFormData] = useState({
    produtoId: '',
    cliente: '',
    valorVendido: 0,
    valorBonificado: 0,
    areas: 0
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação
    const newErrors = {};
    if (!formData.produtoId) newErrors.produtoId = 'Selecione um produto';
    if (!formData.cliente?.trim()) newErrors.cliente = 'Cliente é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Adicionar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
            <span className="sr-only">Fechar</span>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectProduto
            value={formData.produtoId}
            onChange={(value) => setFormData(prev => ({ ...prev, produtoId: value }))}
            error={errors.produtoId}
            disabled={loading}
          />

          {/* Restante do formulário */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <input
              type="text"
              value={formData.cliente}
              onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
              className={`mt-1 block w-full rounded-md ${errors.cliente ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            />
            {errors.cliente && <p className="text-red-500 text-xs mt-1">{errors.cliente}</p>}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddProdutoModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default AddProdutoModal;