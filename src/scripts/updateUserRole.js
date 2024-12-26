import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';

// Configuração do Firebase (a mesma do seu projeto)
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Função para atualizar role
export const updateUserRole = async (email, role, adminEmail, adminPassword) => {
  try {
    // Autentique-se primeiro com uma conta admin
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

    const usersRef = ref(db, 'users');

    // Encontre o usuário
    const snapshot = await get(usersRef);
    const users = snapshot.val();
    const userEntry = Object.entries(users).find(
      ([, userData]) => userData.email === email
    );

    if (userEntry) {
      const [userId] = userEntry;
      
      // Atualize o role
      await update(ref(db, `users/${userId}`), { role });
      console.log(`Role atualizado para ${email}: ${role}`);
      return true;
    } else {
      console.log(`Usuário ${email} não encontrado`);
      return false;
    }
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    return false;
  }
};

// Se quiser rodar diretamente pelo script
const main = async () => {
  const email = process.argv[2];
  const role = process.argv[3];
  
  if (!email || !role) {
    console.log('Use: node updateUserRole.js email@exemplo.com admin');
    process.exit(1);
  }

  await updateUserRole(
    email, 
    role, 
    'deyvidrb@icloud.com', 
    '08Agrobueno'
  );
};

if (require.main === module) {
  main();
}