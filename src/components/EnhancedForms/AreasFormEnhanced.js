// src/components/DashboardGeral/components/AreasFormEnhanced.js
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormField } from './FormField';
import firebaseService from '../../../services/FirebaseService';

export const AreasFormEnhanced = ({ 
  initialData, 
  onSubmit,
  onCancel 
}) => {
  // Estados
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Use o firebaseService para obter o userId
  const userId = firebaseService.auth.currentUser?.uid;
  
  // Estado para validação
  const [errors, setErrors] = useState({
    emAcompanhamento: '',
    aImplantar: '',
    finalizados: '',
    mediaHectaresArea: '',
    areaPotencialTotal: ''
  });


  // Atualiza o estado local quando initialData mudar
  useEffect(() => {
    console.log('Dados iniciais recebidos:', initialData);
    setFormData(initialData);
    setHasChanges(false);
    setErrors({});
  }, [initialData]);

  // Função para validar números
  const isValidNumber = useCallback((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, []);

  // Função de validação do formulário
  const validateForm = useCallback(() => {
    console.log('Validando formulário:', formData);
    let isValid = true;
    const newErrors = {
      emAcompanhamento: '',
      aImplantar: '',
      finalizados: '',
      mediaHectaresArea: '',
      areaPotencialTotal: ''
    };

    if (!isValidNumber(formData.emAcompanhamento)) {
      newErrors.emAcompanhamento = 'Valor inválido';
      isValid = false;
    }

    if (!isValidNumber(formData.aImplantar)) {
      newErrors.aImplantar = 'Valor inválido';
      isValid = false;
    }

    if (!isValidNumber(formData.finalizados)) {
      newErrors.finalizados = 'Valor inválido';
      isValid = false;
    }

    if (!isValidNumber(formData.mediaHectaresArea)) {
      newErrors.mediaHectaresArea = 'Valor inválido';
      isValid = false;
    }

    if (!isValidNumber(formData.areaPotencialTotal)) {
      newErrors.areaPotencialTotal = 'Valor inválido';
      isValid = false;
    }

    if (!firebaseService.auth.currentUser) {
      console.error('Usuário não autenticado');
      return;
    }

    console.log('Erros de validação:', newErrors);
    setErrors(newErrors);
    return isValid;
  }, [formData, isValidNumber]);

  // Handler para mudanças nos campos
  const handleChange = useCallback((field, value) => {
    if (isSaving) return;

    console.log(`Campo alterado - ${field}:`, value);
    
    let processedValue = value;
    if (['emAcompanhamento', 'aImplantar', 'finalizados', 'mediaHectaresArea', 'areaPotencialTotal'].includes(field)) {
      processedValue = value === '' ? 0 : Number(value);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: processedValue
      };
      console.log('Novo estado do formulário:', newData);
      return newData;
    });

    setHasChanges(true);

    // Limpa o erro do campo quando ele é alterado
    setErrors(prev => ({
      ...prev,
      [field]: '',
      submit: ''
    }));
  }, [isSaving]);

  // Handler para submissão manual
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando submissão do formulário');
  
    if (!userId) {
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
      const areasData = {
        emAcompanhamento: Number(formData.emAcompanhamento),
        aImplantar: Number(formData.aImplantar),
        finalizados: Number(formData.finalizados),
        mediaHectaresArea: Number(formData.mediaHectaresArea),
        areaPotencialTotal: Number(formData.areaPotencialTotal)
      };
  
      console.log('Dados preparados para salvamento:', areasData);
  
      // Usa o FirebaseService ao invés do update direto
      await firebaseService.updateAreas(areasData);
      
      // Chama o callback de sucesso
      await onSubmit(areasData);
      
      console.log('Dados salvos com sucesso');
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar áreas:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Áreas em Acompanhamento"
          name="emAcompanhamento"
          type="number"
          value={formData.emAcompanhamento}
          onChange={(e) => handleChange('emAcompanhamento', e.target.value)}
          required
          error={errors.emAcompanhamento}
          disabled={isSaving}
          min="0"
        />

        <FormField
          label="Áreas a Implantar"
          name="aImplantar"
          type="number"
          value={formData.aImplantar}
          onChange={(e) => handleChange('aImplantar', e.target.value)}
          required
          error={errors.aImplantar}
          disabled={isSaving}
          min="0"
        />

        <FormField
          label="Áreas Finalizadas"
          name="finalizados"
          type="number"
          value={formData.finalizados}
          onChange={(e) => handleChange('finalizados', e.target.value)}
          required
          error={errors.finalizados}
          disabled={isSaving}
          min="0"
        />

        <FormField
          label="Média de Hectares por Área"
          name="mediaHectaresArea"
          type="number"
          value={formData.mediaHectaresArea}
          onChange={(e) => handleChange('mediaHectaresArea', e.target.value)}
          required
          error={errors.mediaHectaresArea}
          disabled={isSaving}
          min="0"
          step="0.01"
        />

        <FormField
          label="Área Potencial Total"
          name="areaPotencialTotal"
          type="number"
          value={formData.areaPotencialTotal}
          onChange={(e) => handleChange('areaPotencialTotal', e.target.value)}
          required
          error={errors.areaPotencialTotal}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
      </div>

      {errors.submit && (
        <div className="mt-2 text-sm text-red-600">
          {errors.submit}
        </div>
      )}

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

AreasFormEnhanced.propTypes = {
  initialData: PropTypes.shape({
    emAcompanhamento: PropTypes.number,
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number,
    mediaHectaresArea: PropTypes.number,
    areaPotencialTotal: PropTypes.number
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AreasFormEnhanced;