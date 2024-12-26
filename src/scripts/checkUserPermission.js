// src/scripts/checkUserPermission.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

// Configuração do Firebase (igual ao seu projeto)
const firebaseConfig = {
  apiKey: "SEU_API_KEY",
  authDomain: "status-gd.firebaseapp.com",
  databaseURL: "https://status-gd-default-rtdb.firebaseio.com",
  projectId: "status-gd",
  storageBucket: "status-gd.appspot.com",
  messagingSenderId: "956818896523",
  appId: "1:956818896523:web:81509b052009fddb22468e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const checkUserPermission = async (email) => {
  try {
    // Primeiro, faça login para autenticar
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      'SUA_SENHA_AQUI' // Substitua pela senha real
    );
    const user = userCredential.user;

    // Buscar dados do usuário
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('Detalhes completos do usuário:', {
        email: userData.email,
        role: userData.role,
        uid: user.uid
      });

      return userData.role === 'admin';
    } else {
      console.log('Usuário não encontrado no banco de dados');
      return false;
    }
  } catch (error) {
    console.error('Erro na verificação:', error);
    return false;
  }
};

// Execute com o email desejado
checkUserPermission('deyvidrb@icloud.com');