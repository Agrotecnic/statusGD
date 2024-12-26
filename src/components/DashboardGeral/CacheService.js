// src/components/DashboardGeral/CacheService.js

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.initialize();
  }

  initialize() {
    try {
      // Tenta recuperar dados do localStorage ao inicializar
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item = JSON.parse(stored);
            this.memoryCache.set(key, item);
          }
        } catch (error) {
          console.error(`Erro ao recuperar item ${key} do cache:`, error);
        }
      });
    } catch (error) {
      console.error('Erro ao inicializar cache:', error);
    }
  }

  set(key, value) {
    try {
      if (!key) {
        throw new Error('Key é obrigatória');
      }

      const item = {
        value,
        timestamp: Date.now()
      };

      this.memoryCache.set(key, item);
      localStorage.setItem(key, JSON.stringify(item));
      
      console.log(`Cache atualizado: ${key}`);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no cache:', error);
      return false;
    }
  }

  get(key) {
    try {
      if (!key) {
        throw new Error('Key é obrigatória');
      }

      let item = this.memoryCache.get(key);
      
      if (!item) {
        const stored = localStorage.getItem(key);
        if (stored) {
          item = JSON.parse(stored);
          this.memoryCache.set(key, item);
        }
      }

      return item ? item.value : null;
    } catch (error) {
      console.error('Erro ao recuperar do cache:', error);
      return null;
    }
  }

  remove(key) {
    try {
      if (!key) {
        throw new Error('Key é obrigatória');
      }

      this.memoryCache.delete(key);
      localStorage.removeItem(key);
      
      console.log(`Cache removido: ${key}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover do cache:', error);
      return false;
    }
  }

  clear() {
    try {
      this.memoryCache.clear();
      localStorage.clear();
      
      console.log('Cache limpo completamente');
      return true;
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      return false;
    }
  }

  getAll() {
    try {
      const result = {};
      this.memoryCache.forEach((item, key) => {
        result[key] = item.value;
      });
      return result;
    } catch (error) {
      console.error('Erro ao obter todos os items do cache:', error);
      return {};
    }
  }

  // Métodos auxiliares
  size() {
    return this.memoryCache.size;
  }

  has(key) {
    return this.memoryCache.has(key);
  }

  keys() {
    return Array.from(this.memoryCache.keys());
  }

  values() {
    return Array.from(this.memoryCache.values()).map(item => item.value);
  }
}

// Criar e exportar uma única instância
const cacheService = new CacheService();

// Log de inicialização
console.log('CacheService inicializado com métodos:', Object.keys(cacheService));
console.log('Cache size:', cacheService.size());

export default cacheService;