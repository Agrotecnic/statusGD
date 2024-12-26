
interface IArea {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string; // Campo obrigatório
  updatedAt?: Date;
}