// src/hooks/useFirebase.js
import { useState, useEffect } from 'react';
import { auth, database } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update, get } from 'firebase/database';

export const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateProduto = async (produtoId, dados) => {
    if (isUpdating) {
      throw new Error('Uma atualização já está em andamento');
    }
    
    try {
      setIsUpdating(true);
      const produtoRef = ref(database, `produtos/${produtoId}`);
      
      const snapshot = await get(produtoRef);
      if (!snapshot.exists()) {
        throw new Error('Produto não encontrado');
      }

      const dadosAtuais = snapshot.val();
      
      // Nova lógica de comparação para números
      const mudancasNecessarias = Object.keys(dados).some(key => {
        // Se os valores forem números, compara com uma pequena margem de tolerância
        if (typeof dados[key] === 'number' && typeof dadosAtuais[key] === 'number') {
          return Math.abs(dados[key] - dadosAtuais[key]) >= 0.01;
        }
        // Para outros tipos de dados, compara normalmente
        return dados[key] !== dadosAtuais[key];
      });

      if (!mudancasNecessarias) {
        return false;
      }
      
      await update(produtoRef, dados);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const getProdutos = async () => {
    try {
      const produtosRef = ref(database, 'produtos');
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

  return {
    user,
    auth,
    database,
    loading,
    isUpdating,
    updateProduto,
    getProdutos
  };
};

export default useFirebase;