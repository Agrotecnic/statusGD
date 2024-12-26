import { useCallback, useState, useRef, useEffect } from 'react';

export const useAutoSave = (data, onSave) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [lastSavedData, setLastSavedData] = useState(data);
  const [error, setError] = useState(null);

  // Ref para a função de salvamento
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Validador da função onSave
  const validateSaveFunction = useCallback((fn) => {
    if (typeof fn !== 'function') {
      throw new Error('onSave deve ser uma função');
    }
    return true;
  }, []);

  // Função de salvamento com validação melhorada
  const saveData = useCallback(async (dataToSave) => {
    if (!dataToSave) {
      const error = new Error('Dados inválidos para salvamento');
      console.error('Erro de validação:', error);
      setError(error.message);
      return false;
    }

    try {
      validateSaveFunction(onSaveRef.current);
      
      setIsSaving(true);
      setSaveStatus('saving');
      setError(null);

      console.log('Iniciando salvamento:', {
        dados: dataToSave,
        timestamp: new Date().toISOString()
      });

      const result = await Promise.resolve(onSaveRef.current(dataToSave));
      
      console.log('Resultado do salvamento:', {
        sucesso: !!result,
        resultado: result,
        timestamp: new Date().toISOString()
      });

      if (result === false) {
        throw new Error('Operação de salvamento retornou falha');
      }

      setLastSavedData(dataToSave);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;

    } catch (err) {
      const errorMessage = err.message || 'Erro ao salvar os dados';
      console.error('Erro detalhado do salvamento:', {
        mensagem: errorMessage,
        erro: err,
        dados: dataToSave,
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
      setSaveStatus('error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [validateSaveFunction]);

  // Função para forçar o salvamento com validações adicionais
  const forceSave = useCallback(async () => {
    try {
      if (!data) {
        throw new Error('Nenhum dado fornecido para salvamento');
      }

      // Comparação mais precisa dos dados
      const currentDataStr = JSON.stringify(data);
      const lastSavedDataStr = JSON.stringify(lastSavedData);
      
      console.log('Comparando dados:', {
        atual: data,
        último: lastSavedData,
        temMudanças: currentDataStr !== lastSavedDataStr
      });

      if (currentDataStr === lastSavedDataStr) {
        console.log('Nenhuma mudança detectada nos dados');
        return true; // Retorna sucesso pois não há necessidade de salvar
      }

      const result = await saveData(data);
      if (result || result === undefined) {
        console.log('Dados salvos com sucesso');
        return true;
      }
      
      throw new Error('Falha na operação de salvamento');
    } catch (err) {
      console.error('Erro ao forçar salvamento:', err);
      setError(err.message);
      throw err;
    }
  }, [data, lastSavedData, saveData]);

  return {
    isSaving,
    saveStatus,
    forceSave,
    error,
    hasUnsavedChanges: JSON.stringify(data) !== JSON.stringify(lastSavedData)
  };
};

export default useAutoSave;