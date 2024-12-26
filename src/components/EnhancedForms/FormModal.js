// src/components/EnhancedForms/FormModal.js
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SelectProduto from '../SelectProduto';

const FormModal = ({ 
  type,
  data = {},
  onSave,
  onClose,
  loading: externalLoading = false,
  errors: externalErrors = {},
  produtos,
  onDelete
}) => {
  const [formData, setFormData] = useState(data);
  const [isDirty, setIsDirty] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
      if (isNaN(processedValue)) processedValue = 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    setIsDirty(true);

    setLocalErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      delete newErrors.submit;
      return newErrors;
    });
  }, []);

  const validateData = useCallback(() => {
    const errors = {};
    const fields = formData;

    switch (type) {
      case 'vendedor':
        if (!fields.nome?.trim()) errors.nome = 'Nome é obrigatório';
        if (!fields.regional?.trim()) errors.regional = 'Regional é obrigatória';
        if (!fields.businessUnit?.trim()) errors.businessUnit = 'Business Unit é obrigatória';
        break;

      case 'areas':
        if (typeof fields.emAcompanhamento !== 'number' || fields.emAcompanhamento < 0) 
          errors.emAcompanhamento = 'Valor inválido';
        if (typeof fields.aImplantar !== 'number' || fields.aImplantar < 0) 
          errors.aImplantar = 'Valor inválido';
        if (typeof fields.finalizados !== 'number' || fields.finalizados < 0) 
          errors.finalizados = 'Valor inválido';
        if (typeof fields.areaPotencialTotal !== 'number' || fields.areaPotencialTotal < 0) 
          errors.areaPotencialTotal = 'Valor inválido';
        break;

        case 'produto':
          if (!fields.produtoId) errors.produtoId = 'Selecione um produto';
          if (!fields.cliente?.trim()) errors.cliente = 'Cliente é obrigatório';
          if (typeof fields.valorVendido !== 'number' || fields.valorVendido < 0)
            errors.valorVendido = 'Valor inválido';
          if (typeof fields.valorBonificado !== 'number' || fields.valorBonificado < 0)
            errors.valorBonificado = 'Valor inválido';
          if (typeof fields.areas !== 'number' || fields.areas < 0)
            errors.areas = 'Valor inválido';
          break;

      default:
        break;
    }

    return errors;
  }, [formData, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || externalLoading) return;
    
    try {
      setIsSubmitting(true);
      
      // Validar dados
      const validationErrors = validateData();
      if (Object.keys(validationErrors).length > 0) {
        setLocalErrors(validationErrors);
        return;
      }

      // Limpar dados undefined/null
      const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const success = await onSave(cleanData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setLocalErrors(prev => ({
        ...prev,
        submit: error.message || 'Erro ao salvar alterações'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combinar erros locais e externos
  const allErrors = { ...localErrors, ...externalErrors };
  const isLoading = isSubmitting || externalLoading;

  const renderProdutosList = (produtos, onDelete) => {
    return (
      <div className="produtos-list">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-item">
            <span>{produto.nome}</span>
            <button onClick={() => onDelete(produto.id)}>Excluir</button>
          </div>
        ))}
      </div>
    );
  };

  const renderFields = () => {
    switch (type) {
      case 'vendedor':
        return (
          <>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.nome ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.nome && (
                <p className="text-red-500 text-xs mt-1">{allErrors.nome}</p>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Regional</label>
              <input
                type="text"
                name="regional"
                value={formData.regional || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.regional ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.regional && (
                <p className="text-red-500 text-xs mt-1">{allErrors.regional}</p>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Business Unit</label>
              <input
                type="text"
                name="businessUnit"
                value={formData.businessUnit || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.businessUnit ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.businessUnit && (
                <p className="text-red-500 text-xs mt-1">{allErrors.businessUnit}</p>
              )}
            </div>
          </>
        );

      case 'areas':
        return (
          <>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Em Acompanhamento</label>
              <input
                type="number"
                name="emAcompanhamento"
                value={formData.emAcompanhamento || 0}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.emAcompanhamento ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.emAcompanhamento && (
                <p className="text-red-500 text-xs mt-1">{allErrors.emAcompanhamento}</p>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">A Implantar</label>
              <input
                type="number"
                name="aImplantar"
                value={formData.aImplantar || 0}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.aImplantar ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.aImplantar && (
                <p className="text-red-500 text-xs mt-1">{allErrors.aImplantar}</p>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Finalizados</label>
              <input
                type="number"
                name="finalizados"
                value={formData.finalizados || 0}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.finalizados ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.finalizados && (
                <p className="text-red-500 text-xs mt-1">{allErrors.finalizados}</p>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Área Potencial Total</label>
              <input
                type="number"
                name="areaPotencialTotal"
                value={formData.areaPotencialTotal || 0}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  allErrors?.areaPotencialTotal ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {allErrors?.areaPotencialTotal && (
                <p className="text-red-500 text-xs mt-1">{allErrors.areaPotencialTotal}</p>
              )}
            </div>
          </>
        );

        case 'produto':
          return (
            <>
              <div className="form-group">
                <SelectProduto
                  value={formData.produtoId}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      produtoId: value
                    }));
                    setIsDirty(true);
                  }}
                  error={allErrors?.produtoId}
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    allErrors?.cliente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {allErrors?.cliente && (
                  <p className="text-red-500 text-xs mt-1">{allErrors.cliente}</p>
                )}
              </div>
  
              {/* Campos de valor */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Valor Vendido</label>
                <input
                  type="number"
                  name="valorVendido"
                  value={formData.valorVendido || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    allErrors?.valorVendido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {allErrors?.valorVendido && (
                  <p className="text-red-500 text-xs mt-1">{allErrors.valorVendido}</p>
                )}
              </div>
  
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Valor Bonificado</label>
                <input
                  type="number"
                  name="valorBonificado"
                  value={formData.valorBonificado || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    allErrors?.valorBonificado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {allErrors?.valorBonificado && (
                  <p className="text-red-500 text-xs mt-1">{allErrors.valorBonificado}</p>
                )}
              </div>
  
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Áreas</label>
                <input
                  type="number"
                  name="areas"
                  value={formData.areas || 0}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    allErrors?.areas ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {allErrors?.areas && (
                  <p className="text-red-500 text-xs mt-1">{allErrors.areas}</p>
                )}
              </div>
            </>
          );

      case 'produtos':
        return renderProdutosList(produtos, onDelete);

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {type === 'vendedor' ? 'Editar Informações do Vendedor' :
             type === 'areas' ? 'Editar Áreas' : 'Editar Produto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            type="button"
            disabled={isLoading}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {allErrors?.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {allErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            {isDirty && (
              <span className="text-yellow-600 text-sm mr-auto self-center">
                Alterações não salvas
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormModal.propTypes = {
  type: PropTypes.oneOf(['vendedor', 'areas', 'produto', 'produtos']).isRequired,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
  produtos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    nome: PropTypes.string,
    // adicione outras propriedades necessárias
  })),
  onDelete: PropTypes.func
};

export default FormModal;