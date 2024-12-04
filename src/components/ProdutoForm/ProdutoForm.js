import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProdutoForm = ({ initialData = {}, onSubmit, onCancel, onDelete, isLoading }) => {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    valorVendido: initialData.valorVendido || 0,
    valorBonificado: initialData.valorBonificado || 0,
    areas: initialData.areas || 0
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue;

    if (name === 'nome') {
      processedValue = value;
    } else {
      processedValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpar erro do campo quando ele for editado
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'O nome do produto é obrigatório.';
    if (formData.valorVendido < 0) newErrors.valorVendido = 'O valor não pode ser negativo.';
    if (formData.valorBonificado < 0) newErrors.valorBonificado = 'O valor não pode ser negativo.';
    if (formData.areas < 0) newErrors.areas = 'O número de áreas não pode ser negativo.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (name, label, type = 'text', min = null) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        min={min}
        aria-invalid={errors[name] ? 'true' : 'false'}
        aria-describedby={`${name}-error`}
      />
      {errors[name] && <p id={`${name}-error`} className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderField('nome', 'Nome do Produto')}
      {renderField('valorVendido', 'Valor Vendido', 'number', 0)}
      {renderField('valorBonificado', 'Valor Bonificado', 'number', 0)}
      {renderField('areas', 'Áreas', 'number', 0)}

      <div className="flex justify-end space-x-2 pt-4">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Excluir
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

ProdutoForm.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    valorVendido: PropTypes.number,
    valorBonificado: PropTypes.number,
    areas: PropTypes.number
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isLoading: PropTypes.bool
};

ProdutoForm.defaultProps = {
  initialData: {},
  isLoading: false
};

export default ProdutoForm;