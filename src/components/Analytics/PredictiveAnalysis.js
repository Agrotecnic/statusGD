
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWebSocket from '../../hooks/useWebSocket';

const PredictiveAnalysis = ({ historicalData = [], wsUrl }) => {
  const [predictions, setPredictions] = useState([]);
  const { connected, data: wsData, error } = useWebSocket(wsUrl);

  useEffect(() => {
    if (wsData) {
      setPredictions(prevPredictions => [...prevPredictions, wsData]);
    }
  }, [wsData]);

  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return <div>Sem dados históricos disponíveis</div>;
  }

  return (
    <div className="predictive-analysis">
      <div className="connection-status">
        {error ? (
          <p className="error">Erro na conexão: {error}</p>
        ) : (
          <p className={connected ? 'connected' : 'disconnected'}>
            Status: {connected ? 'Conectado' : 'Desconectado'}
          </p>
        )}
      </div>

      <div className="historical-data">
        <h3>Dados Históricos</h3>
        {historicalData.map((item, index) => (
          <div key={`hist-${index}`} className="data-item">
            <p>Período: {item.period}</p>
            <p>Valor: {item.value?.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {predictions.length > 0 && (
        <div className="predictions">
          <h3>Previsões em Tempo Real</h3>
          {predictions.map((pred, index) => (
            <div key={`pred-${index}`} className="prediction-item">
              <p>Previsão: {pred.value?.toFixed(2)}</p>
              <p>Confiança: {pred.confidence?.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PredictiveAnalysis.propTypes = {
  historicalData: PropTypes.arrayOf(
    PropTypes.shape({
      period: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired,
  wsUrl: PropTypes.string.isRequired
};

export default PredictiveAnalysis;