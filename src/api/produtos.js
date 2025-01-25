import { ref, remove } from 'firebase/database';
import { db } from '../config/firebase';
import axios from 'axios';

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

export const saveProduto = async (userId, produto) => {
  try {
    const response = await axios.post(`/api/users/${userId}/produtos`, produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    throw error;
  }
};