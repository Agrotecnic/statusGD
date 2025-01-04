const request = require('supertest');
const express = require('express');
const { getAuth } = require('firebase/auth');

// Criar app express para testes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock do Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined)
  }))
}));

// Rotas para teste
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.get('/auth/login', (req, res) => {
  res.status(200).send('Login Page');
});

describe('Testes de Rotas', () => {
  it('GET / deve redirecionar para /auth/login', async () => {
    const response = await request(app)
      .get('/')
      .expect(302)
      .expect('Location', '/auth/login');
  });

  it('GET /auth/login deve retornar 200', async () => {
    const response = await request(app)
      .get('/auth/login')
      .expect(200);
  });
});
