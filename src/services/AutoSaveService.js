// src/services/AutoSaveService.js
import { getDatabase, ref, set, get } from 'firebase/database';
import { debounce } from 'lodash';

class AutoSaveService {
  constructor(userId) {
    this.db = getDatabase();
    this.userId = userId;
    // Debounce de 2 segundos para não sobrecarregar o banco
    this.debouncedSave = debounce(this.saveData.bind(this), 2000);
  }

  // Salvar dados como rascunho
  async saveData(data) {
    if (!this.userId) return null;

    try {
      const draftRef = ref(this.db, `drafts/${this.userId}`);
      await set(draftRef, {
        data,
        timestamp: Date.now(),
        lastModified: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      return false;
    }
  }

  // Carregar último rascunho
  async loadDraft() {
    if (!this.userId) return null;

    try {
      const draftRef = ref(this.db, `drafts/${this.userId}`);
      const snapshot = await get(draftRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar rascunho:', error);
      return null;
    }
  }

  // Limpar rascunho após salvar definitivamente
  async clearDraft() {
    if (!this.userId) return;

    try {
      const draftRef = ref(this.db, `drafts/${this.userId}`);
      await set(draftRef, null);
      return true;
    } catch (error) {
      console.error('Erro ao limpar rascunho:', error);
      return false;
    }
  }

  // Verificar se existe rascunho
  async checkForDraft() {
    const draft = await this.loadDraft();
    return !!draft;
  }
}