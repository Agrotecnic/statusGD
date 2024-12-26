// src/components/NotificationSystem/NotificationCenter.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

const NotificationCenter = ({ alerts, onNotificationRead, onNotificationClear }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Processar novos alertas em notificações
    const newNotifications = alerts
      .filter(alert => alert.severity === 'critical' || alert.severity === 'high')
      .map(alert => ({
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        read: false,
        ...alert
      }));

    setNotifications(prev => [...newNotifications, ...prev]);
    setUnreadCount(prev => prev + newNotifications.length);
  }, [alerts]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      setUnreadCount(prev => prev - 1);
      const updated = notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      onNotificationRead(notification);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    onNotificationClear();
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notificações</h3>
            <button
              onClick={clearAllNotifications}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpar Todas
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma notificação no momento
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 
                    ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-start">
                    {notification.severity === 'critical' ? (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-orange-500 mr-2" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {notification.recommendations && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p className="font-medium">Ações Recomendadas:</p>
                          <ul className="list-disc list-inside ml-2">
                            {notification.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotificationCenter.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      severity: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      recommendations: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  onNotificationRead: PropTypes.func.isRequired,
  onNotificationClear: PropTypes.func.isRequired
};

export default NotificationCenter;