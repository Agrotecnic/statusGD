import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializar o Firebase apenas se não houver uma instância
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore
const db = getFirestore(app);

// Habilitar persistência offline somente uma vez
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Persistência múltipla não suportada');
        } else if (err.code === 'unimplemented') {
            console.warn('O navegador não suporta persistência');
        }
    });
}

// Configuração de retry
const dbConfig = {
    retryDelay: 1000,
    maxRetries: 5
};

export { app, db, dbConfig };