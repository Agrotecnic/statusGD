import React, { useState } from 'react';
import { BusinessUnitSelect } from './BusinessUnitSelect';
import { RegionalSelect } from './RegionalSelect';

export function FormBURegional({ onSubmit, initialBU = '', initialRegional = '' }) {
  const [selectedBU, setSelectedBU] = useState(initialBU);
  const [selectedRegional, setSelectedRegional] = useState(initialRegional);

  const handleBUChange = (newBU) => {
    setSelectedBU(newBU);
    setSelectedRegional('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ bu: selectedBU, regional: selectedRegional });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <BusinessUnitSelect
          value={selectedBU}
          onChange={handleBUChange}
        />
      </div>
      <div className="form-row">
        <RegionalSelect
          value={selectedRegional}
          onChange={setSelectedRegional}
          selectedBU={selectedBU}
        />
      </div>
      <div className="form-row">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!selectedBU || !selectedRegional}
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}
