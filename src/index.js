import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';  // Note que removemos as chaves {} pois App é export default
import './styles/index.css';  // Importando os estilos

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);