import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    let unsubscribe;

    const loadUserData = async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = ref(db, `users/${user.uid}`);
        unsubscribe = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log('Dados do usuário carregados:', data);
            setUserData(data);
          } else {
            console.log('Nenhum dado encontrado para o usuário');
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Erro ao carregar dados:', error);
          setError(error);
          setLoading(false);
        });
      } catch (error) {
        console.error('Erro ao configurar listener:', error);
        setError(error);
        setLoading(false);
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged(loadUserData);

    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeAuth();
    };
  }, [auth, db]); // Adicionadas as dependências auth e db

  const saveUserData = async (data) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        ...userData,
        ...data,
        lastUpdated: new Date().toISOString()
      });

      console.log('Dados salvos com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearUserData = () => {
    setUserData(null);
    setError(null);
  };

  return {
    userData,
    loading,
    error,
    saveUserData,
    clearUserData
  };
};

export default useUserProfile;