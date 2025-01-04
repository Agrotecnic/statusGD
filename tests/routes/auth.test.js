/* eslint-env jest */

// Mocks primeiro
const mockAuth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn()
};

jest.mock('../../config/firebase', () => ({
    auth: mockAuth
}));

// Importações
const request = require('supertest');
let app;

jest.isolateModules(() => {
    app = require('../../app');
});

jest.mock('../../middleware/auth', () => ({
    checkAuth: (req, res, next) => next()
}));

describe('Testes de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.currentUser = null;
  });

  describe('GET /auth/login', () => {
    it('deve renderizar página de login para usuário não autenticado', async () => {
      await request(app)
        .get('/auth/login')
        .expect(200);
    });

    it('deve redirecionar para dashboard se usuário já estiver autenticado', async () => {
      mockAuth.currentUser = { uid: '123' };
      
      await request(app)
        .get('/auth/login')
        .expect(302)
        .expect('Location', '/dashboard/geral');
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      mockAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
        user: { uid: '123' }
      });

      await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(302)
        .expect('Location', '/dashboard/geral');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce(
        new Error('auth/wrong-password')
      );

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpass'
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Email ou senha inválidos');
    });
  });

  describe('GET /auth/forgot-password', () => {
    it('deve renderizar página de recuperação de senha', async () => {
      await request(app)
        .get('/auth/forgot-password')
        .expect(200);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('deve enviar email de recuperação com sucesso', async () => {
      mockAuth.sendPasswordResetEmail.mockResolvedValueOnce();

      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.text).toContain('Email de recuperação enviado');
    });

    it('deve retornar erro para email não encontrado', async () => {
      mockAuth.sendPasswordResetEmail.mockRejectedValueOnce(
        new Error('auth/user-not-found')
      );

      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'wrong@example.com' });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Email não encontrado');
    });
  });

  describe('GET /auth/logout', () => {
    it('deve fazer logout e redirecionar para login', async () => {
      await request(app)
        .get('/auth/logout')
        .expect(302)
        .expect('Location', '/auth/login');

      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });
});
