// src/components/DashboardGeral/services/FirebaseRealtimeService.js

import { getDatabase, ref, onValue, off } from 'firebase/database';
import { processRawData } from '../utils/dashboardDataProcessors';

class FirebaseRealtimeService {
  constructor() {
    this.db = getDatabase();
    this.subscribers = new Map();

    // Bind dos métodos
    this.subscribeToData = this.subscribeToData.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.clearAllSubscriptions = this.clearAllSubscriptions.bind(this);
    this.subscribeToConnectionStatus = this.subscribeToConnectionStatus.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        const connectedRef = ref(this.db, '.info/connected');
        onValue(connectedRef, (snap) => {
          if (snap.val() === true) {
            resolve(true);
          }
        }, (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  subscribeToData(path, callback, filters = {}) {
    if (!path || typeof callback !== 'function') {
      throw new Error('Path e callback são obrigatórios');
    }

    try {
      const dbRef = ref(this.db, path);
      const handleData = (snapshot) => {
        try {
          if (snapshot.exists()) {
            const rawData = snapshot.val();
            const processedData = processRawData(rawData, filters);
            callback(processedData);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Erro ao processar dados:', error);
          callback(null);
        }
      };

      onValue(dbRef, handleData);
      this.subscribers.set(path, { ref: dbRef, handler: handleData });
      
      return () => this.unsubscribe(path);
    } catch (error) {
      console.error('Erro ao subscrever aos dados:', error);
      return () => {};
    }
  }

  unsubscribe(path) {
    try {
      const subscription = this.subscribers.get(path);
      if (subscription) {
        const { ref: dbRef, handler } = subscription;
        off(dbRef, 'value', handler);
        this.subscribers.delete(path);
      }
    } catch (error) {
      console.error('Erro ao cancelar subscrição:', error);
    }
  }

  clearAllSubscriptions() {
    try {
      this.subscribers.forEach((subscription, path) => {
        this.unsubscribe(path);
      });
    } catch (error) {
      console.error('Erro ao limpar subscrições:', error);
    }
  }

  subscribeToConnectionStatus(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback é obrigatório');
    }

    try {
      const connectedRef = ref(this.db, '.info/connected');
      const handleConnection = (snap) => {
        callback(snap.val());
      };

      onValue(connectedRef, handleConnection);
      
      return () => {
        try {
          off(connectedRef, 'value', handleConnection);
        } catch (error) {
          console.error('Erro ao desinscrever do status de conexão:', error);
        }
      };
    } catch (error) {
      console.error('Erro ao subscrever ao status de conexão:', error);
      return () => {};
    }
  }

  async fetchData(path) {
    return new Promise((resolve, reject) => {
      try {
        const dbRef = ref(this.db, path);
        onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            resolve(null);
          }
          // Remover o listener após obter os dados
          off(dbRef);
        }, (error) => {
          reject(error);
        }, { onlyOnce: true });
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Criar e exportar instância única
const instance = new FirebaseRealtimeService();
export default instance;