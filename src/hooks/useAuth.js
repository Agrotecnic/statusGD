import { useEffect, useCallback, useState } from 'react';
import * as AuthService from '../services/authService'; // Verifique o caminho
import { useDashboardState } from './useDashboardState';
import { db } from '../config/firebase';
import { ref, get } from 'firebase/database';

export function useAuth() {
  const { auth, updateAuth } = useDashboardState();
  const [userDetails, setUserDetails] = useState(null);

  // Função para buscar detalhes completos do usuário
  const fetchUserDetails = useCallback(async (user) => {
    if (!user) return null;
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // Log detalhado para verificação
        console.log('Detalhes completos do usuário:', {
          email: user.email,
          uid: user.uid,
          role: userData.role || 'Sem role definida',
          dadosCompletos: userData
        });
        const fullUserDetails = {
          ...user,
          role: userData.role || 'user',
          additionalInfo: userData
        };
        setUserDetails(fullUserDetails);
        
        // Atualiza o estado global
        updateAuth({ user: fullUserDetails });
        
        return fullUserDetails;
      }
      return user;
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      return user;
    }
  }, [updateAuth]);

  // Login com verificação adicional
  const login = async (credentials) => {
    try {
      const user = await AuthService.loginWithRole(credentials.email, credentials.password);
      console.log('Login Details:', {
        email: user.email,
        uid: user.uid,
        role: user.role
      });

      // Atualiza o estado global e local
      updateAuth({ user });
      setUserDetails(user);

      return user;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  // Logout padrão
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      // Limpa o estado de autenticação
      updateAuth({ user: null });
      setUserDetails(null);
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }, [updateAuth]);

  // Verificação de permissão
  const checkPermission = useCallback((permission, level) => {
    return AuthService.hasPermission(permission, level);
  }, []);

  // Efeito para buscar detalhes quando o usuário mudar
  useEffect(() => {
    if (auth.user) {
      fetchUserDetails(auth.user);
    }
  }, [auth.user, fetchUserDetails]);

  return {
    user: userDetails || auth.user,
    permissions: auth.permissions || [],
    isAuthenticated: !!auth.user,
    login,
    logout,
    checkPermission
  };
}

export default useAuth;