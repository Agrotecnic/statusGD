
import { IArea } from '../interfaces/IArea';
import Area from '../models/Area';

const updateArea = async (id: string, areaData: IArea) => {
  if (!areaData.updatedBy) {
    throw new Error('Campo updatedBy é obrigatório para atualização');
  }

  try {
    const result = await Area.findByIdAndUpdate(
      id,
      { ...areaData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!result) {
      throw new Error('Área não encontrada');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Falha ao atualizar área: ${error.message}`);
  }
}

export default updateArea;