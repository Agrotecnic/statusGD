// src/utils/initializeData.js
import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

export const initializeUserData = async (uid) => {
  const userDataRef = ref(db, `vendedores/${uid}`);
  
  const initialData = {
    vendedorInfo: {
      nome: '',
      regional: '',
      businessUnit: '',
      dataAtualizacao: new Date().toISOString()
    },
    areas: {
      emAcompanhamento: 0,
      aImplantar: 0,
      finalizados: 0,
      mediaHectaresArea: 0,
      areaPotencialTotal: 0
    },
    produtos: [],
    images: {
      area1: null,
      area2: null,
      area3: null,
      area4: null
    },
    metrics: {
      vendido: 0,
      bonificado: 0,
      total: 0,
      realizacao: 0
    }
  };

  try {
    await set(userDataRef, initialData);
    return initialData;
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
    throw error;
  }
};