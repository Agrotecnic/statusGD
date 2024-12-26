import React from 'react';
import { getRegionalsForBU } from '../utils/normalizer';
import { Select } from './Select';

export function RegionalSelect({ value, onChange, selectedBU }) {
  const availableRegionals = selectedBU ? getRegionalsForBU(selectedBU) : [];
  const regionalOptions = availableRegionals.map(regional => ({
    value: regional,
    label: regional
  }));

  return (
    <Select
      id="regional"
      label="Regional"
      value={value}
      onChange={onChange}
      options={regionalOptions}
    />
  );
}
