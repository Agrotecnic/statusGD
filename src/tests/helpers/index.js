
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => delete store[key]),
    clear: jest.fn(() => { store = {}; })
  };
};

export const generateTestData = {
  user: () => ({
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User'
  }),
  produto: () => ({
    id: 'test-product',
    nome: 'Test Product',
    valor: 100
  })
};