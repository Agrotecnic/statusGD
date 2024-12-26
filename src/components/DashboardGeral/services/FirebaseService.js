// src/services/FirebaseService.js

import { ref, get, set, update, remove, query, orderByChild, push } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class FirebaseService {
  constructor() {
    this.db = getDatabase();
    this.auth = getAuth();
  }

  // Utilitários
  getCurrentUserId() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    return user.uid;
  }

  getUserPath(path) {
    const userId = this.getCurrentUserId();
    return `users/${userId}/${path}`;
  }

  // Método auxiliar para limpar dados undefined/null
  cleanData(data) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = typeof value === 'string' ? value.trim() : value;
      }
      return acc;
    }, {});
  }

  // Operações CRUD genéricas
  async writeData(path, data) {
    try {
      console.log('Iniciando gravação em:', path, 'com dados:', data);
      const userId = this.getCurrentUserId();
      const dbRef = ref(this.db, path);
      
      const cleanedData = this.cleanData(data);
      
      await set(dbRef, {
        ...cleanedData,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      });
      
      LoggerService.info(`Dados salvos em ${path}`, { cleanedData });
      console.log('Dados salvos com sucesso em:', path);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      LoggerService.error(`Erro ao salvar dados em ${path}`, { error });
      throw new Error(`Erro ao salvar dados: ${error.message}`);
    }
  }

  async readData(path) {
    try {
      console.log('Lendo dados de:', path);
      const dbRef = ref(this.db, path);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Dados lidos com sucesso:', data);
        return data;
      }
      
      console.log('Nenhum dado encontrado em:', path);
      return null;
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      LoggerService.log('error', `Erro ao ler dados de ${path}`, { error });
      throw new Error(`Erro ao ler dados: ${error.message}`);
    }
  }

  async updateData(path, updates) {
    try {
      console.log('Atualizando dados em:', path, 'com:', updates);
      const userId = this.getCurrentUserId();
      const dbRef = ref(this.db, path);
      
      const snapshot = await get(dbRef);
      const currentData = snapshot.exists() ? snapshot.val() : {};
      
      const cleanedUpdates = this.cleanData(updates);
      
      const updatedData = {
        ...currentData,
        ...cleanedUpdates,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      };
      
      await update(dbRef, updatedData);
      
      LoggerService.log('info', `Dados atualizados em ${path}`, { updatedData });
      console.log('Dados atualizados com sucesso:', updatedData);
      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      LoggerService.log('error', `Erro ao atualizar dados em ${path}`, { error });
      throw new Error(`Erro ao atualizar dados: ${error.message}`);
    }
  }

  async deleteData(path) {
    try {
      console.log('Removendo dados de:', path);
      const dbRef = ref(this.db, path);
      
      await remove(dbRef);
      
      LoggerService.log('info', `Dados removidos de ${path}`);
      console.log('Dados removidos com sucesso de:', path);
      return true;
    } catch (error) {
      console.error('Erro ao remover dados:', error);
      LoggerService.log('error', `Erro ao remover dados de ${path}`, { error });
      throw new Error(`Erro ao remover dados: ${error.message}`);
    }
  }

  // Operações específicas para Áreas
  async getAreas() {
    try {
      const areasPath = this.getUserPath('areas');
      const snapshot = await this.readData(areasPath);
      return snapshot;
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
      LoggerService.log('error', 'Erro ao buscar áreas', { error });
      throw new Error(`Falha ao buscar áreas: ${error.message}`);
    }
  }


async updateAreas(areasData) {
  try {
    // Verificar autenticação
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    console.log('Iniciando atualização de áreas:', areasData);
    
    // Limpar dados undefined/null
    const cleanData = Object.entries(areasData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    // Adicionar metadados
    const updatedData = {
      ...cleanData,
      lastUpdated: new Date().toISOString(),
      updatedBy: user.uid // Garantir que updatedBy sempre exista
    };

    // Atualizar no Firebase
    const areasRef = ref(this.db, `users/${user.uid}/areas`);
    await update(areasRef, updatedData);

    // Log de sucesso
    LoggerService.log('info', 'Áreas atualizadas com sucesso', { updatedData });
    console.log('Áreas atualizadas com sucesso:', updatedData);
    
    return updatedData;
  } catch (error) {
    // Log de erro
    console.error('Erro ao atualizar áreas:', error);
    LoggerService.log('error', 'Erro ao atualizar áreas', { error });
    throw new Error(`Falha ao atualizar áreas: ${error.message}`);
  }
}

  // Operações específicas para Vendedor
  async updateVendedor(vendedorData) {
    try {
      const vendedorPath = this.getUserPath('vendedor');
      
      const cleanedData = this.cleanData(vendedorData);
      const updatedData = await this.updateData(vendedorPath, cleanedData);
      
      LoggerService.log('info', 'Vendedor atualizado com sucesso', { updatedData });
      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      LoggerService.log('error', 'Erro ao atualizar vendedor', { error });
      throw new Error('Falha ao atualizar vendedor');
    }
  }

  // Operações específicas para Business Units (BUs)
  async getBUs() {
    try {
      const busPath = this.getUserPath('businessUnits');
      const snapshot = await this.readData(busPath);
      return snapshot;
    } catch (error) {
      console.error('Erro ao buscar BUs:', error);
      LoggerService.log('error', 'Erro ao buscar BUs', { error });
      throw new Error(`Falha ao buscar BUs: ${error.message}`);
    }
  }

  async updateBU(buData) {
    try {
      const buPath = this.getUserPath('businessUnits');
      
      const cleanedData = this.cleanData(buData);
      const updatedData = await this.updateData(buPath, cleanedData);
      
      LoggerService.log('info', 'BU atualizada com sucesso', { updatedData });
      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar BU:', error);
      LoggerService.log('error', 'Erro ao atualizar BU', { error });
      throw new Error(`Falha ao atualizar BU: ${error.message}`);
    }
  }

  // Operações específicas para Produtos
  async getProdutos() {
    try {
      const produtosPath = this.getUserPath('produtos');
      const snapshot = await this.readData(produtosPath);
      return snapshot;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      LoggerService.log('error', 'Erro ao buscar produtos', { error });
      throw new Error(`Falha ao buscar produtos: ${error.message}`);
    }
  }

  async getProdutoById(produtoId) {
    try {
      const produtoPath = this.getUserPath(`produtos/${produtoId}`);
      const snapshot = await this.readData(produtoPath);
      return snapshot;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      LoggerService.log('error', `Erro ao buscar produto ${produtoId}`, { error });
      throw new Error(`Falha ao buscar produto: ${error.message}`);
    }
  }

  async createProduto(produtoData) {
    try {
      const userId = this.getCurrentUserId();
      const produtosPath = this.getUserPath('produtos');
      const produtosRef = ref(this.db, produtosPath);
      
      const newProdutoRef = push(produtosRef);
      const produtoId = newProdutoRef.key;
      
      const cleanedData = this.cleanData(produtoData);
      
      const dataWithMetadata = {
        ...cleanedData,
        id: produtoId,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      };
      
      await set(newProdutoRef, dataWithMetadata);
      
      LoggerService.log('info', 'Novo produto criado', { produtoId, dataWithMetadata });
      return { id: produtoId, ...dataWithMetadata };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      LoggerService.log('error', 'Erro ao criar produto', { error });
      throw new Error(`Falha ao criar produto: ${error.message}`);
    }
  }

  async updateProduto(produtoId, produtoData) {
    try {
      const produtoPath = this.getUserPath(`produtos/${produtoId}`);
      
      const cleanedData = this.cleanData(produtoData);
      const updatedData = await this.updateData(produtoPath, cleanedData);
      
      LoggerService.log('info', `Produto ${produtoId} atualizado com sucesso`, { updatedData });
      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      LoggerService.log('error', `Erro ao atualizar produto ${produtoId}`, { error });
      throw new Error(`Falha ao atualizar produto: ${error.message}`);
    }
  }

  async deleteProduto(produtoId) {
    try {
      const produtoPath = this.getUserPath(`produtos/${produtoId}`);
      await this.deleteData(produtoPath);
      
      LoggerService.log('info', `Produto ${produtoId} removido com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      LoggerService.log('error', `Erro ao remover produto ${produtoId}`, { error });
      throw new Error(`Falha ao remover produto: ${error.message}`);
    }
  }

  // Busca avançada de produtos
  async searchProdutos(searchCriteria) {
    try {
      const produtosPath = this.getUserPath('produtos');
      const produtosRef = ref(this.db, produtosPath);
      
      let produtosQuery = produtosRef;
      if (searchCriteria.orderBy) {
        produtosQuery = query(produtosRef, orderByChild(searchCriteria.orderBy));
      }

      const snapshot = await get(produtosQuery);
      
      if (!snapshot.exists()) {
        return [];
      }

      let results = Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...value
      }));

      // Aplicar filtros adicionais
      if (searchCriteria.filters) {
        results = results.filter(produto => {
          return Object.entries(searchCriteria.filters).every(([key, value]) => {
            if (typeof value === 'string') {
              return produto[key]?.toLowerCase().includes(value.toLowerCase());
            }
            return produto[key] === value;
          });
        });
      }

      return results;
    } catch (error) {
      console.error('Erro na busca de produtos:', error);
      LoggerService.log('error', 'Erro na busca de produtos', { error, searchCriteria });
      throw new Error(`Falha na busca de produtos: ${error.message}`);
    }
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;