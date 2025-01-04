import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "status-gd.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://status-gd-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "status-gd",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "status-gd.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "956818896523",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:956818896523:web:81509b052009fddb22468e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-ZS16WZWMPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Otimizar conexão Firebase
const connectedRef = ref(database, '.info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    // Conexão estabelecida
  }
}, { onlyOnce: true });

// Configurar persistência local
try {
  const setPersistence = database._delegate.setPersistence;
  if (setPersistence) {
    setPersistence('local');
  }
} catch (error) {
  console.warn('Persistência local não suportada');
}

// Configurar persistência e reconexão
const connectedRef = ref(database, '.info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log('Conectado ao Firebase');
  } else {
    console.log('Desconectado do Firebase');
  }
});

// Configurar retry em caso de falha
database.ref('.info/connected').on('value', (snap) => {
  if (!snap.val()) {
    setTimeout(() => {
      console.log('Tentando reconectar...');
      database.goOnline();
    }, 2000);
  }
});

// Função para verificar conexão
const verificarConexao = async () => {
  try {
    if (!auth.currentUser) return false;
    const userRef = ref(database, `users/${auth.currentUser.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Erro na conexão:', error.message);
    return false;
  }
};

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Firebase Auth: Usuário autenticado', user.uid);
  } else {
    console.log('Firebase Auth: Usuário não autenticado');
  }
});

verificarConexao();

export { auth, database, verificarConexao };
export default app;