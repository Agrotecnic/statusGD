
import React from 'react';

interface PredictiveAnalysisProps {
  historicalData: any; // Defina o tipo apropriado para os dados históricos
}

const PredictiveAnalysis = ({ historicalData }: PredictiveAnalysisProps) => {
  const dataArray = Array.isArray(historicalData) ? historicalData : [historicalData];
  
  if (!dataArray.length) {
    return <div>Dados históricos insuficientes para análise preditiva</div>;
  }

  // Use dataArray em vez de historicalData no resto do componente
  // ...existing code...
};

export default PredictiveAnalysis;