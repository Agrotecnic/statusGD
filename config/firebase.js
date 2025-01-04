const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const admin = require('firebase-admin');

const firebaseConfig = {
  apiKey: "AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",
  authDomain: "status-gd.firebaseapp.com",
  databaseURL: "https://status-gd-default-rtdb.firebaseio.com",
  projectId: "status-gd",
  storageBucket: "status-gd.appspot.com",
  messagingSenderId: "956818896523",
  appId: "1:956818896523:web:81509b052009fddb22468e",
  measurementId: "G-ZS16WZWMPG"
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inicializa o Firebase Admin em produção
if (process.env.NODE_ENV === 'production') {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: firebaseConfig.databaseURL
        });
    } catch (error) {
        console.error('Erro ao inicializar Firebase Admin:', error.message);
    }
}

module.exports = { app, auth, admin };