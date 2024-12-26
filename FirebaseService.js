class FirebaseService {
  constructor(database) {
    this.database = database;
  }

  async updateAreas(areas, updatedBy = 'system') {
    try {
      // Validação dos campos
      if (!areas || !Array.isArray(areas)) {
        throw new Error('areas must be a valid array');
      }

      // Validação e normalização de cada área
      const validatedAreas = areas.map(area => {
        if (!area.id || !area.name) {
          throw new Error('each area must have id and name');
        }

        return {
          id: area.id,
          name: area.name,
          status: area.status || 'active',
          updatedBy: updatedBy,
          updatedAt: new Date().toISOString()
        };
      });

      // Criar objeto de atualização
      const updates = {};
      validatedAreas.forEach(area => {
        updates[`areas/${area.id}`] = area;
      });

      // Realizar atualização no Firebase
      await this.database.ref().update(updates);
      return { success: true, message: 'Areas updated successfully' };
    } catch (error) {
      console.error('Error updating areas:', error);
      throw new Error(`Failed to update areas: ${error.message}`);
    }
  }
}

module.exports = FirebaseService;
