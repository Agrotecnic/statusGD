
import React from 'react';
import PropTypes from 'prop-types';

const RegionalAnalysis = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Sem dados disponíveis para análise regional</div>;
  }

  return (
    <div className="regional-analysis">
      {data.map((item, index) => (
        <div key={index} className="regional-item">
          <h3>{item.region}</h3>
          <div className="performance-metrics">
            <p>Performance: {item.performance?.toFixed(2)}%</p>
            <p>Total Vendas: {item.sales?.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

RegionalAnalysis.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      region: PropTypes.string.isRequired,
      performance: PropTypes.number.isRequired,
      sales: PropTypes.number
    })
  ).isRequired
};

export default RegionalAnalysis;