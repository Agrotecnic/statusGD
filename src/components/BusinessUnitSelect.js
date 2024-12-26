import React from 'react';
import { VALID_BUS } from '../utils/normalizer';
import { Select } from './Select';

export function BusinessUnitSelect({ value, onChange }) {
  const buOptions = VALID_BUS.map(bu => ({
    value: bu,
    label: bu
  }));

  return (
    <Select
      id="business-unit"
      label="Business Unit"
      value={value}
      onChange={onChange}
      options={buOptions}
    />
  );
}