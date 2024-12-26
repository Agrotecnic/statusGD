
import React from 'react';

interface RegionalAnalysisProps {
  data: { performance: number }[];
}

const RegionalAnalysis = ({ data }: RegionalAnalysisProps) => {
  if (!data || !data[0] || !data[0].performance) {
    return <div>Dados insuficientes para análise regional</div>;
  }

  return (
    <div>
      {/* Renderização da análise regional */}
    </div>
  );
};

export default RegionalAnalysis;