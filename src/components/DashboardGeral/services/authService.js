import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';

export const loginWithRole = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Buscar role do usuário no Realtime Database
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        ...user,
        role: userData.role || 'user'
      };
    }
    
    return {
      ...user,
      role: 'user' // role padrão se não encontrar no banco
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const hasPermission = (permission, level) => {
  // Exemplo de lógica de verificação de permissão
  const permissionMap = {
    'dashboard': {
      'view': true,
      'edit': false
    },
    'users': {
      'view': false,
      'edit': false
    }
  };

  return permissionMap[permission]?.[level] || false;
};