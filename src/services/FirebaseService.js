import { getDatabase, ref, update, get } from 'firebase/database';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import LoggerService from '../components/DashboardGeral/services/LoggerService';

class FirebaseService {
  constructor() {
    this.db = getDatabase();
    this.firestore = getFirestore();
  }

  async updateData(path, data) {
    const dbRef = ref(this.db, path);
    await update(dbRef, data);
    return data;
  }

  async writeData(path, data) {
    return this.updateData(path, data);
  }

  async getData(path) {
    const dbRef = ref(this.db, path);
    const snapshot = await get(dbRef);
    return snapshot.val();
  }

  async updateVendedor(vendedorData) {
    try {
      const vendedorRef = doc(this.firestore, 'vendedores', vendedorData.id);
      await updateDoc(vendedorRef, vendedorData);
      return {
        success: true,
        message: 'Vendedor atualizado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      throw new Error('Falha ao atualizar vendedor');
    }
  }

  async updateAreas(areasData, userId) {
    try {
      const areasRef = ref(this.db, 'areas');
      const updatedData = {
        ...areasData,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      };

      await update(areasRef, updatedData);
      
      LoggerService.log('info', 'Áreas atualizadas', {
        userId,
        data: updatedData
      });

      return {
        success: true,
        message: 'Áreas atualizadas com sucesso',
        data: updatedData
      };
    } catch (error) {
      LoggerService.log('error', 'Erro ao atualizar áreas', { error });
      throw new Error('Falha ao atualizar áreas: ' + error.message);
    }
  }

  async getAreas() {
    try {
      const areasRef = ref(this.db, 'areas');
      const snapshot = await get(areasRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      LoggerService.log('info', 'Áreas recuperadas com sucesso');
      return snapshot.val();
    } catch (error) {
      LoggerService.log('error', 'Erro ao buscar áreas', { error });
      throw new Error('Falha ao buscar áreas: ' + error.message);
    }
  }

  async updateBU(buData, userId) {
    try {
      const buRef = ref(this.db, 'businessUnits');
      const updatedData = {
        ...buData,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      };

      await update(buRef, updatedData);
      
      LoggerService.log('info', 'Business Unit atualizada', {
        userId,
        data: updatedData
      });

      return {
        success: true,
        message: 'Business Unit atualizada com sucesso',
        data: updatedData
      };
    } catch (error) {
      LoggerService.log('error', 'Erro ao atualizar Business Unit', { error });
      throw new Error('Falha ao atualizar Business Unit: ' + error.message);
    }
  }

  async getBUs() {
    try {
      const busRef = ref(this.db, 'businessUnits');
      const snapshot = await get(busRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      LoggerService.log('info', 'Business Units recuperadas com sucesso');
      return snapshot.val();
    } catch (error) {
      LoggerService.log('error', 'Erro ao buscar Business Units', { error });
      throw new Error('Falha ao buscar Business Units: ' + error.message);
    }
  }

  // Método auxiliar para validar dados antes de salvar
  validateData(data, type) {
    switch (type) {
      case 'areas':
        if (!data.emAcompanhamento && data.emAcompanhamento !== 0) {
          throw new Error('Campo emAcompanhamento é obrigatório');
        }
        if (!data.aImplantar && data.aImplantar !== 0) {
          throw new Error('Campo aImplantar é obrigatório');
        }
        if (!data.finalizados && data.finalizados !== 0) {
          throw new Error('Campo finalizados é obrigatório');
        }
        break;
      case 'bu':
        if (!data.nome) {
          throw new Error('Nome da Business Unit é obrigatório');
        }
        if (!data.codigo) {
          throw new Error('Código da Business Unit é obrigatório');
        }
        break;
      default:
        break;
    }
    return true;
  }
}

export default new FirebaseService();
