import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Alterado aqui
import App from './App';
import './styles/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter> {/* Alterado aqui */}
      <App />
    </HashRouter>
  </React.StrictMode>
);