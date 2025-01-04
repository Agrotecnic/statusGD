import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';

// Configuração do ambiente de teste
configure({ testIdAttribute: 'data-testid' });

// Mock do window
global.window = {
  matchMedia: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })),
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
};

// Mock do document
global.document = {
  ...global.document,
  createElement: jest.fn().mockImplementation(tag => ({
    setAttribute: jest.fn(),
    getElementsByTagName: jest.fn(() => []),
    parentElement: {
      removeChild: jest.fn()
    }
  }))
};

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
