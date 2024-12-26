import { useState, useEffect, useCallback } from 'react';

const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  const connect = useCallback(() => {
    try {
      // Construir URL baseada no ambiente atual
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      console.log('Tentando conectar WebSocket em:', wsUrl);
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket conectado com sucesso');
        setConnected(true);
        setError(null);
      };

      socket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (e) {
          console.error('Erro ao processar dados do WebSocket:', e);
          setError('Erro ao processar dados');
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket desconectado, código:', event.code);
        setConnected(false);
        
        // Só tenta reconectar se não foi um fechamento limpo
        if (event.code !== 1000) {
          console.log('Tentando reconectar em 3 segundos...');
          setTimeout(connect, 3000);
        }
      };

      socket.onerror = (event) => {
        console.error('Erro WebSocket:', event);
        setError('Erro na conexão WebSocket');
        setConnected(false);
        
        // Fecha a conexão com erro para permitir reconexão
        socket.close();
      };

      setWs(socket);
    } catch (err) {
      console.error('Erro ao criar conexão WebSocket:', err);
      setError('Erro ao criar conexão WebSocket');
      
      // Tenta reconectar após erro
      setTimeout(connect, 3000);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws) {
        console.log('Fechando conexão WebSocket...');
        ws.close(1000, 'Componente desmontado');
      }
    };
  }, [connect, ws]);

  // Função para enviar dados
  const sendData = useCallback((data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        setError('Erro ao enviar dados');
      }
    } else {
      console.warn('WebSocket não está conectado ao tentar enviar dados');
      setError('WebSocket não está conectado');
    }
  }, [ws]);

  return { 
    connected, 
    data, 
    error,
    sendData,
    // Função para forçar reconexão
    reconnect: connect
  };
};

export default useWebSocket;