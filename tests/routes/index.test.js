// Mock Firebase primeiro
jest.mock('../../config/firebase', () => ({
    auth: { currentUser: null }
}));

// Importações
const request = require('supertest');
let app, server;

describe('Testes de Rotas Principais', () => {
    beforeAll(async () => {
        jest.isolateModules(() => {
            app = require('../../app');
        });
        server = app.listen(3001);
    });

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('deve redirecionar para /auth/login', async () => {
            await request(app)
                .get('/')
                .expect('Location', '/auth/login')
                .expect(302);
        });
    });

    describe('GET /dashboard', () => {
        it('deve redirecionar para login se não autenticado', async () => {
            await request(app)
                .get('/dashboard')
                .expect('Location', '/auth/login?redirect=/dashboard')
                .expect(302);
        });
    });

    describe('GET /404', () => {
        it('deve retornar página de erro', async () => {
            await request(app)
                .get('/rota-inexistente')
                .expect(404);
        });
    });

    describe('GET /produtos', () => {
        it('deve retornar lista de produtos', async () => {
            const response = await request(app)
                .get('/api/produtos')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /produtos/:marca', () => {
        it('deve retornar produtos por marca', async () => {
            const marca = 'AMINOAGRO';
            const response = await request(app)
                .get(`/api/produtos/${marca}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(p => p.marca === marca)).toBe(true);
        });
    });
});