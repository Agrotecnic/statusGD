// src/components/ProdutoForm/ProdutoFormEnhanced.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ProdutoFormEnhanced = ({ 
  initialData, 
  onSubmit,
  onCancel,
  onDelete
}) => {
  // Estado do formulário com valores iniciais
  const [formData, setFormData] = useState({
    nome: '',
    cliente: '',
    valorVendido: 0,
    valorBonificado: 0,
    areas: 0
  });

  // Efeito para atualizar o formulário quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        nome: initialData.nome || '',
        cliente: initialData.cliente || '',
        valorVendido: initialData.valorVendido || 0,
        valorBonificado: initialData.valorBonificado || 0,
        areas: initialData.areas || 0
      });
    }
  }, [initialData]);
  
  // Estado para controlar mudanças não salvas
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Estado para controlar o processo de salvamento
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para mensagens de erro
  const [errors, setErrors] = useState({
    nome: '',
    cliente: '',
    valorVendido: '',
    valorBonificado: '',
    areas: ''
  });

  // Função para validar números
  const isValidNumber = (value) => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue >= 0;
  };

  // Função de validação do formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nome: '',
      cliente: '',
      valorVendido: '',
      valorBonificado: '',
      areas: ''
    };

    // Validação do nome do produto
    if (!formData.nome || formData.nome.trim() === '') {
      newErrors.nome = 'Nome do produto é obrigatório';
      isValid = false;
    }

    // Validação do nome do cliente
    if (!formData.cliente || formData.cliente.trim() === '') {
      newErrors.cliente = 'Nome do cliente é obrigatório';
      isValid = false;
    }

    // Validação do valor vendido
    if (!isValidNumber(formData.valorVendido)) {
      newErrors.valorVendido = 'Valor vendido inválido';
      isValid = false;
    }

    // Validação do valor bonificado
    if (!isValidNumber(formData.valorBonificado)) {
      newErrors.valorBonificado = 'Valor bonificado inválido';
      isValid = false;
    }

    // Validação do número de áreas
    if (!isValidNumber(formData.areas)) {
      newErrors.areas = 'Número de áreas inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler para mudanças nos campos
  const handleChange = (field, value) => {
    // Não atualiza se estiver salvando
    if (isSaving) return;

    // Processa o valor baseado no tipo do campo
    let processedValue = value;
    if (['valorVendido', 'valorBonificado', 'areas'].includes(field)) {
      processedValue = value === '' ? 0 : Number(value);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }

    // Atualiza o estado do formulário
    setFormData(prevData => ({
      ...prevData,
      [field]: processedValue
    }));

    // Marca que há mudanças não salvas
    setHasUnsavedChanges(true);

    // Limpa o erro do campo quando ele é alterado
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };

  // Handler para submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Incluir o ID se estiver editando
      const dataToSubmit = initialData.id 
        ? { ...formData, id: initialData.id }
        : formData;
      
      await onSubmit(dataToSubmit);
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar as alterações. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para cancelamento
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('Existem alterações não salvas. Deseja realmente cancelar?');
      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // Handler para deleção
  const handleDelete = () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este produto?');
    if (confirmDelete && onDelete) {
      onDelete();
    }
  };

  // Renderização do formulário
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo: Nome do Produto */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome do Produto
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          } focus:border-blue-500 focus:ring-blue-500`}
          disabled={isSaving}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
        )}
      </div>

      {/* Campo: Cliente */}
      <div>
        <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <input
          type="text"
          id="cliente"
          name="cliente"
          value={formData.cliente}
          onChange={(e) => handleChange('cliente', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.cliente ? 'border-red-500' : 'border-gray-300'
          } focus:border-blue-500 focus:ring-blue-500`}
          disabled={isSaving}
        />
        {errors.cliente && (
          <p className="mt-1 text-sm text-red-600">{errors.cliente}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo: Valor Vendido */}
        <div>
          <label htmlFor="valorVendido" className="block text-sm font-medium text-gray-700">
            Valor Vendido (R$)
          </label>
          <input
            type="number"
            id="valorVendido"
            name="valorVendido"
            value={formData.valorVendido}
            onChange={(e) => handleChange('valorVendido', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.valorVendido ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500`}
            min="0"
            step="0.01"
            disabled={isSaving}
          />
          {errors.valorVendido && (
            <p className="mt-1 text-sm text-red-600">{errors.valorVendido}</p>
          )}
        </div>

        {/* Campo: Valor Bonificado */}
        <div>
          <label htmlFor="valorBonificado" className="block text-sm font-medium text-gray-700">
            Valor Bonificado (R$)
          </label>
          <input
            type="number"
            id="valorBonificado"
            name="valorBonificado"
            value={formData.valorBonificado}
            onChange={(e) => handleChange('valorBonificado', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.valorBonificado ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500`}
            min="0"
            step="0.01"
            disabled={isSaving}
          />
          {errors.valorBonificado && (
            <p className="mt-1 text-sm text-red-600">{errors.valorBonificado}</p>
          )}
        </div>

        {/* Campo: Áreas */}
        <div>
          <label htmlFor="areas" className="block text-sm font-medium text-gray-700">
            Número de Áreas
          </label>
          <input
            type="number"
            id="areas"
            name="areas"
            value={formData.areas}
            onChange={(e) => handleChange('areas', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.areas ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-blue-500`}
            min="0"
            disabled={isSaving}
          />
          {errors.areas && (
            <p className="mt-1 text-sm text-red-600">{errors.areas}</p>
          )}
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-between items-center mt-6">
        {/* Indicador de mudanças não salvas */}
        <div className="text-sm">
          {hasUnsavedChanges && (
            <span className="text-yellow-600">Alterações não salvas</span>
          )}
        </div>

        {/* Botões */}
        <div className="space-x-2">
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              disabled={isSaving}
            >
              Excluir
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  );
};

ProdutoFormEnhanced.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.number,
    nome: PropTypes.string,
    cliente: PropTypes.string,
    valorVendido: PropTypes.number,
    valorBonificado: PropTypes.number,
    areas: PropTypes.number
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

ProdutoFormEnhanced.defaultProps = {
  initialData: {},
  onDelete: null
};

export default ProdutoFormEnhanced;