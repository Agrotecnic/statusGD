// src/components/EnhancedForms/VendedorFormEnhanced.js
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormField } from './FormField';
import firebaseService from '../../services/FirebaseService';

export const VendedorFormEnhanced = ({ 
  initialData, 
  onSubmit,
  onCancel 
}) => {
  // Estados
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({
    nome: '',
    regional: '',
    businessUnit: '',
    submit: ''
  });


  // Inicialização do formulário
  useEffect(() => {
    console.log('Dados iniciais recebidos:', initialData);
    setFormData(initialData);
    setHasChanges(false);
    setErrors({});
  }, [initialData]);

  // Função de validação do formulário
  const validateForm = useCallback(() => {
    console.log('Validando formulário:', formData);
    let isValid = true;
    const newErrors = {
      nome: '',
      regional: '',
      businessUnit: ''
    };

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    if (!formData.regional?.trim()) {
      newErrors.regional = 'Regional é obrigatória';
      isValid = false;
    }

    if (!formData.businessUnit?.trim()) {
      newErrors.businessUnit = 'Business Unit é obrigatória';
      isValid = false;
    }

    console.log('Erros de validação:', newErrors);
    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Handler para mudanças nos campos
  const handleChange = useCallback((field, value) => {
    if (isSaving) return;

    console.log(`Campo alterado - ${field}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setHasChanges(true);

    // Limpa o erro do campo
    setErrors(prev => ({
      ...prev,
      [field]: '',
      submit: ''
    }));
  }, [isSaving]);

  // Handler para submissão
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando submissão do formulário');
  
    if (!firebaseService.auth.currentUser) {
      console.error('Usuário não autenticado');
      return;
    }
  
    if (!validateForm()) {
      console.log('Validação falhou');
      return;
    }
  
    try {
      setIsSaving(true);
  
      // Prepara os dados para salvamento
      const vendedorData = {
        nome: formData.nome.trim(),
        regional: formData.regional.trim(),
        businessUnit: formData.businessUnit.trim(),
        dataAtualizacao: new Date().toISOString()
      };
  
      console.log('Dados preparados para salvamento:', vendedorData);
  
      // Usa o FirebaseService para atualizar
      await firebaseService.updateVendedor(vendedorData);
      
      // Chama o callback de sucesso
      await onSubmit(vendedorData);
      
      console.log('Dados salvos com sucesso');
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar dados do vendedor:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Erro ao salvar alterações. Tente novamente.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para cancelamento
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      const confirmCancel = window.confirm('Existem alterações não salvas. Deseja realmente cancelar?');
      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [hasChanges, onCancel]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <FormField
        label="Nome"
        name="nome"
        value={formData.nome || ''}
        onChange={(e) => handleChange('nome', e.target.value)}
        required
        error={errors.nome}
        disabled={isSaving}
      />

      <FormField
        label="Regional"
        name="regional"
        value={formData.regional || ''}
        onChange={(e) => handleChange('regional', e.target.value)}
        required
        error={errors.regional}
        disabled={isSaving}
      />

      <FormField
        label="Business Unit"
        name="businessUnit"
        value={formData.businessUnit || ''}
        onChange={(e) => handleChange('businessUnit', e.target.value)}
        required
        error={errors.businessUnit}
        disabled={isSaving}
      />

      <div className="flex justify-between items-center mt-6">
        {/* Status do formulário */}
        <div className="text-sm">
          {hasChanges && (
            <span className="text-yellow-600">Alterações não salvas</span>
          )}
          {isSaving && (
            <span className="text-blue-600">Salvando...</span>
          )}
        </div>

        {/* Botões de ação */}
        <div className="space-x-2">
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
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  );
};

VendedorFormEnhanced.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    regional: PropTypes.string,
    businessUnit: PropTypes.string,
    dataAtualizacao: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default VendedorFormEnhanced;