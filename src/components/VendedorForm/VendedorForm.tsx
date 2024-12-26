import React, { useState } from 'react';
import { BusinessUnitSelect } from '../BusinessUnitSelect';
import { RegionalSelect } from '../RegionalSelect';

interface VendedorFormProps {
  initialData: {
    nome: string;
    regional: string;
    businessUnit: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function VendedorForm({ initialData, onSubmit, onCancel, isLoading }: VendedorFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    regional: initialData.regional || '',
    businessUnit: initialData.businessUnit || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleBUChange = (bu: string) => {
    setFormData(prev => ({
      ...prev,
      businessUnit: bu,
      regional: '' // Reseta a regional quando mudar a BU
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            className="form-control"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-row">
        <BusinessUnitSelect
          value={formData.businessUnit}
          onChange={handleBUChange}
        />
      </div>

      <div className="form-row">
        <RegionalSelect
          value={formData.regional}
          onChange={(regional) => setFormData(prev => ({ ...prev, regional }))}
          selectedBU={formData.businessUnit}
        />
      </div>

      <div className="form-row flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !formData.nome || !formData.businessUnit || !formData.regional}
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
