// src/components/EnhancedDataEntry/EnhancedFormWithAutoSave.js
import React from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';
import EnhancedForm from './EnhancedForm';
import StatusIndicator from './StatusIndicator';

const EnhancedFormWithAutoSave = ({ userId, initialData, onSave }) => {
  const { data, setData, saveStatus, saveManually } = useAutoSave(userId, initialData);

  const handleSubmit = async (formData) => {
    // Salvar definitivamente
    const success = await saveManually();
    if (success) {
      onSave(formData);
    }
  };

  return (
    <div className="relative">
      {/* Indicador de Status */}
      <div className="fixed top-4 right-4 z-50">
        <StatusIndicator status={saveStatus} />
      </div>

      {/* Formulário Principal */}
      <EnhancedForm
        initialData={data}
        onChange={setData}
        onSubmit={handleSubmit}
      />

      {/* Alerta de Rascunho não Salvo */}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          Algumas alterações não foram salvas. Tente novamente.
        </div>
      )}
    </div>
  );
};

export default EnhancedFormWithAutoSave;