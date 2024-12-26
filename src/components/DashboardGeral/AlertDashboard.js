// src/components/DashboardGeral/AlertDashboard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  ExclamationCircleIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/solid';

const AlertDashboard = ({ alerts = [] }) => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const typeMatch = selectedType === 'all' || alert.type === selectedType;
    return severityMatch && typeMatch;
  });

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300'
  };

  const typeIcons = {
    performance: ChartBarIcon,
    trend: ArrowTrendingDownIcon,
    opportunity: ArrowTrendingUpIcon,
    risk: ExclamationCircleIcon
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Alertas e Notificações</h2>
        
        {/* Filtros */}
        <div className="flex space-x-4">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">Todas Severidades</option>
            <option value="critical">Crítico</option>
            <option value="high">Alto</option>
            <option value="medium">Médio</option>
            <option value="low">Baixo</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">Todos Tipos</option>
            <option value="performance">Performance</option>
            <option value="trend">Tendência</option>
            <option value="opportunity">Oportunidade</option>
            <option value="risk">Risco</option>
          </select>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Nenhum alerta encontrado com os filtros selecionados
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const Icon = typeIcons[alert.type] || ExclamationCircleIcon;
            
            return (
              <div
                key={index}
                className={`p-4 border rounded-lg ${severityColors[alert.severity]} flex items-start`}
              >
                <Icon className="w-6 h-6 mr-3 flex-shrink-0" />
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{alert.message}</h3>
                    <span className="text-sm">
                      {alert.metric}: {typeof alert.value === 'number' ? 
                        alert.value.toFixed(1) + '%' : 
                        alert.value}
                    </span>
                  </div>

                  {alert.recommendations && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Recomendações:</p>
                      <ul className="list-disc list-inside text-sm ml-2 mt-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumo */}
      <div className="mt-6 pt-4 border-t grid grid-cols-4 gap-4">
        {Object.entries(severityColors).map(([severity, colors]) => {
          const count = alerts.filter(a => a.severity === severity).length;
          return (
            <div key={severity} className={`p-3 rounded-lg ${colors}`}>
              <div className="text-sm font-medium capitalize">{severity}</div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

AlertDashboard.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['performance', 'trend', 'opportunity', 'risk']).isRequired,
    severity: PropTypes.oneOf(['critical', 'high', 'medium', 'low']).isRequired,
    message: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    metric: PropTypes.string.isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.string)
  }))
};

AlertDashboard.defaultProps = {
  alerts: []
};

export default AlertDashboard;