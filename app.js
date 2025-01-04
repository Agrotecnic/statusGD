const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const debug = require('./middleware/debug');
const { auth } = require('./config/firebase');
const { checkAuth } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

// Configurar WebSocket Server
const wss = new WebSocket.Server({ server });

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

// Configurar CORS específico para GitHub Codespace
app.use((req, res, next) => {
    const host = req.headers.host;
    res.header('Access-Control-Allow-Origin', `https://${host}`);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

if (process.env.NODE_ENV !== 'test') {
    app.use(debug);
}

// Rota raiz
app.get('/', (req, res) => {
    res.status(302).redirect('/auth/login');
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Middleware de autenticação para dashboard
app.use('/dashboard', (req, res, next) => {
    if (!auth.currentUser) {
        return res.redirect('/auth/login?redirect=/dashboard');
    }
    next();
});

// Rotas do dashboard
app.get('/dashboard', (req, res) => {
    res.redirect('/dashboard/geral');
});

// Rota para o app React
app.get('/dashboard/*', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).render('error', {
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Inicialização do servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Servidor HTTP rodando na porta ${PORT}`);
    });

    // Tratamento de conexões WebSocket
    wss.on('connection', (ws) => {
        console.log('Nova conexão WebSocket estabelecida');
        
        ws.on('error', console.error);
        
        ws.on('close', () => {
            console.log('Conexão WebSocket fechada');
        });
    });
}

module.exports = { app, server, wss };