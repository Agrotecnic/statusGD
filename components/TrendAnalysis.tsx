
import React from 'react';

interface TrendAnalysisProps {
  data: any;
}

const TrendAnalysis = ({ data }: TrendAnalysisProps) => {
  const dataArray = Array.isArray(data) ? data : [data];
  
  if (!dataArray.length) {
    return <div>Dados insuficientes para análise de tendência</div>;
  }

  // Use dataArray em vez de data no resto do componente
  // ...existing code...
};

export default TrendAnalysis;