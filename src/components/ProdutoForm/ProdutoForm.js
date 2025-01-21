import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { fetchProdutos } from '../../models/Product'; // Certifique-se de que o caminho está correto

const ProdutoForm = ({ initialData = {}, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    cliente: initialData.cliente || '',
    valorVendido: initialData.valorVendido || 0,
    valorBonificado: initialData.valorBonificado || 0,
    areas: initialData.areas || 0,
    produtos: Array.isArray(initialData.produtos) ? initialData.produtos : [{ nome: '' }]
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const produtos = await fetchProdutos();
      setAllProducts(produtos);
    };

    fetchData();
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const filteredSuggestions = inputLength === 0 ? [] : allProducts.filter(
      product => product.nome.toLowerCase().includes(inputValue)
    );

    setSuggestions(filteredSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.nome;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion.nome}
    </div>
  );

  const handleAutosuggestChange = (index) => (event, { newValue }) => {
    const newProdutos = formData.produtos.map((produto, i) => (
      i === index ? { ...produto, nome: newValue } : produto
    ));
    setFormData(prev => ({
      ...prev,
      produtos: newProdutos
    }));
    setErrors(prev => ({ ...prev, produtos: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue;

    if (name === 'cliente') {
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
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cliente.trim()) newErrors.cliente = 'O nome do cliente é obrigatório.';
    if (formData.valorVendido < 0) newErrors.valorVendido = 'O valor não pode ser negativo.';
    if (formData.valorBonificado < 0) newErrors.valorBonificado = 'O valor não pode ser negativo.';
    if (formData.areas < 0) newErrors.areas = 'O número de áreas não pode ser negativo.';
    formData.produtos.forEach((produto, index) => {
      if (!produto.nome.trim()) {
        newErrors.produtos = newErrors.produtos || [];
        newErrors.produtos[index] = 'O nome do produto é obrigatório.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addProdutoField = () => {
    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, { nome: '' }]
    }));
  };

  const renderField = (name, label, type = 'text', defaultValue = '') => (
    <div key={name}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name] || defaultValue}
        onChange={handleChange}
        className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        aria-invalid={errors[name] ? 'true' : 'false'}
        aria-describedby={`${name}-error`}
      />
      {errors[name] && <p id={`${name}-error`} className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.produtos.map((produto, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="flex-grow">
            <label htmlFor={`produto-${index}`} className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                id: `produto-${index}`,
                name: `produto-${index}`,
                value: produto.nome,
                onChange: handleAutosuggestChange(index),
                className: `mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.produtos && errors.produtos[index] ? 'border-red-500' : 'border-gray-300'}`,
                'aria-invalid': errors.produtos && errors.produtos[index] ? 'true' : 'false',
                'aria-describedby': `produto-${index}-error`
              }}
            />
            {errors.produtos && errors.produtos[index] && <p id={`produto-${index}-error`} className="mt-1 text-sm text-red-600">{errors.produtos[index]}</p>}
          </div>
          {index === formData.produtos.length - 1 && (
            <button
              type="button"
              onClick={addProdutoField}
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              +
            </button>
          )}
        </div>
      ))}
      {renderField('cliente', 'Nome do Cliente')}
      {renderField('valorVendido', 'Valor Vendido', 'number', 0)}
      {renderField('valorBonificado', 'Valor Bonificado', 'number', 0)}
      {renderField('areas', 'Áreas', 'number', 0)}

      <div className="flex justify-end space-x-2 pt-4">
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
    cliente: PropTypes.string,
    valorVendido: PropTypes.number,
    valorBonificado: PropTypes.number,
    areas: PropTypes.number,
    produtos: PropTypes.arrayOf(PropTypes.shape({
      nome: PropTypes.string
    }))
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

ProdutoForm.defaultProps = {
  initialData: {},
  isLoading: false
};

export default ProdutoForm;