import { ref, remove } from 'firebase/database';
import { db } from '../config/firebase';

export const deleteProduto = async (userId, produtoId) => {
  try {
    console.log('userId:', userId);
    console.log('produtoId:', produtoId);
    const produtoRef = ref(db, `users/${userId}/produtos/${produtoId}`);
    console.log('Deletando produto...');
    console.log('produtoRef:', produtoRef.toString());
    await remove(produtoRef);
    console.log('Produto deletado com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};