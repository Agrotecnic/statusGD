import { getDatabase, ref, get, update } from 'firebase/database';

class DataMigrationService {
  constructor() {
    this.db = getDatabase();
  }

  async migrateUserData() {
    try {
      console.log('Iniciando processo de migração');
      const usersRef = ref(this.db, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        console.log('Nenhum dado para migrar');
        return { success: true, message: 'Nenhum dado para migrar' };
      }

      const updates = {};
      const users = snapshot.val();
      let migrationsNeeded = false;

      Object.entries(users).forEach(([userId, userData]) => {
        if (userData.areas) {
          // Verifica se precisa de migração
          const areas = userData.areas;
          const needsMigration = !areas.hasOwnProperty('finalizados') || 
                               typeof areas.emAcompanhamento !== 'number' ||
                               typeof areas.aImplantar !== 'number';

          if (needsMigration) {
            migrationsNeeded = true;
            updates[`users/${userId}/areas`] = {
              emAcompanhamento: Number(areas.emAcompanhamento || areas.Acompanhamento || 0),
              aImplantar: Number(areas.aImplantar || 0),
              finalizados: Number(areas.finalizados || 0),
              mediaHectaresArea: Number(areas.mediaHectaresArea || areas.médiahectaresdasArea || 0),
              areaPotencialTotal: Number(areas.areaPotencialTotal || 0)
            };
          }
        }

        if (userData.produtos && Array.isArray(userData.produtos)) {
          userData.produtos.forEach((produto, index) => {
            if (produto && (typeof produto.valorVendido !== 'number' || typeof produto.valorBonificado !== 'number')) {
              migrationsNeeded = true;
              updates[`users/${userId}/produtos/${index}`] = {
                ...produto,
                valorVendido: Number(produto.valorVendido || 0),
                valorBonificado: Number(produto.valorBonificado || 0)
              };
            }
          });
        }
      });

      if (!migrationsNeeded) {
        console.log('Dados já estão no formato correto');
        return { success: true, message: 'Dados já atualizados' };
      }

      // Aplica as atualizações
      await update(ref(this.db), updates);
      console.log('Migração concluída com sucesso');
      return { success: true, message: 'Dados atualizados com sucesso' };

    } catch (error) {
      console.error('Erro durante a migração:', error);
      return { 
        success: false, 
        message: 'Erro ao atualizar dados', 
        error: error.message 
      };
    }
  }
}

export default new DataMigrationService();
