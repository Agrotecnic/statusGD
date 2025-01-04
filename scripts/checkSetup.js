const fs = require('fs');
const path = require('path');
const colors = require('colors');

console.log('\n=== Verificação de Configuração do Status GD ===\n'.blue);

// 1. Verificar dependências
console.log('📦 Verificando dependências necessárias...'.yellow);
const requiredDependencies = [
    'express',
    'ejs',
    'firebase',
    'firebase-admin',
    'dotenv'
];

try {
    const package = require('../package.json');
    const installed = Object.keys(package.dependencies || {});
    const missing = requiredDependencies.filter(dep => !installed.includes(dep));
    
    if (missing.length) {
        console.log('❌ Dependências faltando:'.red);
        console.log(missing.join(', ').red);
        console.log('\nInstale usando:'.yellow);
        console.log(`npm install ${missing.join(' ')}`.green);
    } else {
        console.log('✅ Todas as dependências estão instaladas'.green);
    }
} catch (error) {
    console.log('❌ Erro ao ler package.json'.red);
}

// 2. Verificar estrutura de pastas
console.log('\n📁 Verificando estrutura de pastas...'.yellow);
const requiredDirs = [
    'views',
    'routes',
    'public',
    'config'
];

const requiredFiles = [
    'views/newLogin.ejs',
    'views/forgotPassword.ejs',
    'views/error.ejs',
    'views/dashboard.ejs',
    'routes/auth.js',
    'app.js',
    '.env'
];

requiredDirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, '..', dir))) {
        console.log(`✅ Diretório ${dir} encontrado`.green);
    } else {
        console.log(`❌ Diretório ${dir} não encontrado`.red);
        console.log(`Crie usando: mkdir ${dir}`.yellow);
    }
});

console.log('\n📄 Verificando arquivos necessários...'.yellow);
requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
        console.log(`✅ Arquivo ${file} encontrado`.green);
    } else {
        console.log(`❌ Arquivo ${file} não encontrado`.red);
    }
});

// 3. Verificar variáveis de ambiente
console.log('\n🔐 Verificando variáveis de ambiente...'.yellow);
const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_DATABASE_URL',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
];

try {
    require('dotenv').config();
    const missing = requiredEnvVars.filter(v => !process.env[v]);
    
    if (missing.length) {
        console.log('❌ Variáveis de ambiente faltando:'.red);
        console.log(missing.join('\n').red);
        console.log('\nAdicione estas variáveis ao arquivo .env'.yellow);
    } else {
        console.log('✅ Todas as variáveis de ambiente configuradas'.green);
    }
} catch (error) {
    console.log('❌ Erro ao ler arquivo .env'.red);
}

// 4. Verificar conexão com Firebase
console.log('\n🔥 Testando conexão com Firebase...'.yellow);
const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin');

try {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    
    if (app) {
        console.log('✅ Conexão com Firebase Client estabelecida'.green);
    }

    // Tenta inicializar o Firebase Admin
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
        });
        console.log('✅ Conexão com Firebase Admin estabelecida'.green);
    } catch (adminError) {
        console.log('⚠️ Firebase Admin não inicializado (pode ser ignorado em desenvolvimento)'.yellow);
    }
} catch (error) {
    console.log('❌ Erro ao inicializar Firebase:'.red);
    console.log(error.message.red);
}

console.log('\n📝 Instruções adicionais:'.yellow);
console.log('1. Execute npm install para instalar dependências faltantes');
console.log('2. Crie diretórios e arquivos faltantes');
console.log('3. Configure as variáveis de ambiente no arquivo .env');
console.log('4. Execute npm start para iniciar o servidor\n');
