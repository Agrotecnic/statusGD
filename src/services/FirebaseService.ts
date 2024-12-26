// src/services/FirebaseService.js
import { db } from '../firebase';
import { collection, doc, getDocs, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

class FirebaseService {
  constructor() {
    this.db = db;
    this.auth = getAuth();
  }

  // Método para atualizar áreas
  async updateAreas(areasData) {
    try {
      const userId = this.auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Referência para o documento do usuário
      const userAreasRef = doc(this.db, 'users', userId, 'areas', 'current');
      
      // Prepara os dados para atualização
      const updateData = {
        ...areasData,
        updatedAt: serverTimestamp(),
        updatedBy: userId
      };

      // Atualiza o documento
      await updateDoc(userAreasRef, updateData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar áreas:', error);
      throw new Error(`Falha ao atualizar áreas: ${error.message}`);
    }
  }

  // Método para atualizar vendedor
  async updateVendedor(vendedorData) {
    try {
      const userId = this.auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Referência para o documento do vendedor
      const vendedorRef = doc(this.db, 'users', userId, 'vendedor', 'info');

      // Prepara os dados para atualização
      const updateData = {
        ...vendedorData,
        updatedAt: serverTimestamp(),
        updatedBy: userId
      };

      // Atualiza o documento
      await updateDoc(vendedorRef, updateData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      throw new Error(`Falha ao atualizar vendedor: ${error.message}`);
    }
  }

  // Método para buscar dados do vendedor
  async getVendedor() {
    try {
      const userId = this.auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const vendedorRef = doc(this.db, 'users', userId, 'vendedor', 'info');
      const vendedorDoc = await getDoc(vendedorRef);

      if (!vendedorDoc.exists()) {
        return null;
      }

      return vendedorDoc.data();
    } catch (error) {
      console.error('Erro ao buscar dados do vendedor:', error);
      throw new Error(`Falha ao buscar dados do vendedor: ${error.message}`);
    }
  }

  // Método para buscar áreas
  async getAreas() {
    try {
      const userId = this.auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const areasRef = doc(this.db, 'users', userId, 'areas', 'current');
      const areasDoc = await getDoc(areasRef);

      if (!areasDoc.exists()) {
        return null;
      }

      return areasDoc.data();
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
      throw new Error(`Falha ao buscar áreas: ${error.message}`);
    }
  }
}

export default new FirebaseService();
