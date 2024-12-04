import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Suas configurações do Firebase aqui
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize os serviços
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Habilite a persistência offline do Firestore
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.error('Persistência falhou, possivelmente múltiplas abas abertas');
    } else if (err.code == 'unimplemented') {
      console.error('O navegador atual não suporta todos os recursos necessários');
    }
  });

// Exporte os serviços para uso em outros arquivos
export { db, auth, storage };