import apiClient from '../axios';

export interface Consumable {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export const consumablesApi = {
  // Listar todos os consumíveis
  getAll: async (): Promise<Consumable[]> => {
    const response = await apiClient.get('/consumables');
    return response.data;
  },

  // Buscar consumível por ID
  getById: async (id: string): Promise<Consumable> => {
    const response = await apiClient.get(`/consumables/${id}`);
    return response.data;
  },

  // Criar novo consumível
  create: async (consumable: Partial<Consumable>): Promise<Consumable> => {
    const response = await apiClient.post('/consumables', consumable);
    return response.data;
  },

  // Atualizar consumível
  update: async (id: string, consumable: Partial<Consumable>): Promise<Consumable> => {
    const response = await apiClient.put(`/consumables/${id}`, consumable);
    return response.data;
  },

  // Excluir consumível
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/consumables/${id}`);
  },
};
