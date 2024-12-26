import React from 'react';
import { VALID_BUS } from '../utils/normalizer';
import { Select } from './Select';

interface BusinessUnitSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function BusinessUnitSelect({ value, onChange }: BusinessUnitSelectProps) {
  return (
    <Select
      id="business-unit"
      label="Business Unit"
      value={value}
      onChange={onChange}
      options={VALID_BUS.map(bu => ({
        value: bu,
        label: bu
      }))}
    />
  );
}
