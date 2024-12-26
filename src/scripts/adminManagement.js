// src/scripts/adminManagement.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';

// Configuração do Firebase
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

// Credenciais do usuário admin que fará as alterações
const ADMIN_EMAIL = 'deyvidrb@icloud.com';  // Substitua pelo email do admin
const ADMIN_PASSWORD = 'admin123';  // Substitua pela senha do admin

const authenticateAdmin = async () => {
  try {
    console.log('\nAutenticando como admin...');
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Autenticado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na autenticação:', error.message);
    return false;
  }
};

const updateToAdmin = async (userEmail) => {
  try {
    // Primeiro autentica
    const isAuthenticated = await authenticateAdmin();
    if (!isAuthenticated) {
      console.error('❌ Falha na autenticação. Verifique as credenciais de admin.');
      return false;
    }

    console.log('\nBuscando usuário existente...');
    
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const userEntry = Object.entries(users).find(([, userData]) => userData.email === userEmail);
      
      if (userEntry) {
        const [userId, userData] = userEntry;
        
        // Atualiza para admin
        await update(ref(db, `users/${userId}`), {
          ...userData,
          role: 'admin',
          updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Usuário atualizado para admin com sucesso!');
        console.log({
          uid: userId,
          email: userEmail,
          role: 'admin'
        });
        return true;
      }
      console.log('❌ Usuário não encontrado');
    }
    return false;
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error.message);
    if (error.message.includes('Permission denied')) {
      console.log('⚠️ Dica: Verifique se o usuário admin tem as permissões necessárias no Firebase.');
    }
    return false;
  }
};

// Executa direto a atualização com o email fornecido
const email = process.argv[2];

if (!email) {
  console.log('Por favor, forneça um email: node adminManagement.js <email>');
  process.exit(1);
}

updateToAdmin(email).then(success => {
  process.exit(success ? 0 : 1);
});