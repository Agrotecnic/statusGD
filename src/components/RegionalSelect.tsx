import React from 'react';
import { getRegionalsForBU } from '../utils/normalizer';
import { Select } from './Select';

interface RegionalSelectProps {
  value: string;
  onChange: (value: string) => void;
  selectedBU: string;
}

export function RegionalSelect({ value, onChange, selectedBU }: RegionalSelectProps) {
  const availableRegionals = selectedBU ? getRegionalsForBU(selectedBU as any) : [];
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
