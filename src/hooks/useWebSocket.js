import React, { useState } from 'react';
import useWebSocket from './useWebSocket';

const WebSocketComponent = () => {
  const { connected, data, error, sendData, reconnect } = useWebSocket();
  const [message, setMessage] = useState('');

  // Função para enviar mensagem
  const handleSend = () => {
    if (message.trim() !== '') {
      sendData({ message }); // Envia como objeto JSON
      setMessage(''); // Limpa o campo de mensagem
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WebSocket Interface</h1>
      
      {/* Status de Conexão */}
      <p>Status: 
        <span style={{ color: connected ? 'green' : 'red', fontWeight: 'bold' }}>
          {connected ? ' Conectado' : ' Desconectado'}
        </span>
      </p>
      
      {/* Erros */}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      
      {/* Última Mensagem Recebida */}
      {data && (
        <pre style={{
          backgroundColor: '#f4f4f4',
          padding: '10px',
          borderRadius: '5px',
          overflowX: 'auto',
        }}>
          Última mensagem: {JSON.stringify(data, null, 2)}
        </pre>
      )}
      
      {/* Campo para enviar mensagem */}
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Digite sua mensagem"
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginRight: '10px',
          width: '300px',
        }}
      />
      <button 
        onClick={handleSend} 
        disabled={!connected} 
        style={{
          padding: '10px 20px',
          backgroundColor: connected ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: connected ? 'pointer' : 'not-allowed',
        }}
      >
        Enviar
      </button>

      {/* Botão de Reconectar */}
      {!connected && (
        <button 
          onClick={reconnect} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Reconectar
        </button>
      )}
    </div>
  );
};

export default WebSocketComponent;
