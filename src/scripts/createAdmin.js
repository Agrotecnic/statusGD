// src/scripts/adminManagement.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get, update } from 'firebase/database';

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

// Função para criar novo usuário admin
const createAdminUser = async (email, password) => {
  try {
    console.log('\nCriando novo usuário admin...');
    
    // Criar usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Usuário criado com sucesso');
    
    // Adicionar role de admin no Realtime Database
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      email: email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    
    console.log('✅ Admin criado com sucesso:');
    console.log({
      uid: user.uid,
      email: email,
      role: 'admin'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
    return false;
  }
};

// Função para atualizar usuário existente para admin
const updateToAdmin = async (userEmail) => {
  try {
    console.log('\nBuscando usuário existente...');
    
    // Busca todos os usuários
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
      } else {
        console.log('❌ Usuário não encontrado');
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    return false;
  }
};

// Função principal que gerencia as operações
const manageAdmin = async () => {
  const args = process.argv.slice(2);
  const operation = args[0];
  const email = args[1];
  const password = args[2];

  if (!operation || !email) {
    console.log(`
Usage:
  Create new admin:   node adminManagement.js create <email> <password>
  Update to admin:    node adminManagement.js update <email>
    `);
    process.exit(1);
  }

  let success = false;

  switch (operation) {
    case 'create':
      if (!password) {
        console.log('❌ Password is required for create operation');
        process.exit(1);
      }
      success = await createAdminUser(email, password);
      break;
      
    case 'update':
      success = await updateToAdmin(email);
      break;
      
    default:
      console.log('❌ Invalid operation. Use "create" or "update"');
      process.exit(1);
  }

  process.exit(success ? 0 : 1);
};

// Executa o script
manageAdmin();