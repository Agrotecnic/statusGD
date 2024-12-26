
import React from 'react';
import PropTypes from 'prop-types';

const TrendAnalysis = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Sem dados disponíveis para análise de tendências</div>;
  }

  return (
    <div className="trend-analysis">
      {data.map((item, index) => (
        <div key={index} className="trend-item">
          <h3>{item.period}</h3>
          <div className="trend-metrics">
            <p>Valor: {item.value?.toFixed(2)}</p>
            <p>Variação: {item.variation?.toFixed(2)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

TrendAnalysis.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      period: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      variation: PropTypes.number
    })
  ).isRequired
};

export default TrendAnalysis;