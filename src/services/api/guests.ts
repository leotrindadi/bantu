import apiClient from '../axios';
import { Guest } from '../../features/Hotelaria/types';

export const guestsApi = {
  // Listar todos os hóspedes
  getAll: async (): Promise<Guest[]> => {
    const response = await apiClient.get('/guests');
    return response.data;
  },

  // Buscar hóspede por ID
  getById: async (id: string): Promise<Guest> => {
    const response = await apiClient.get(`/guests/${id}`);
    return response.data;
  },

  // Criar novo hóspede
  create: async (guest: Partial<Guest>): Promise<Guest> => {
    const response = await apiClient.post('/guests', guest);
    return response.data;
  },

  // Atualizar hóspede
  update: async (id: string, guest: Partial<Guest>): Promise<Guest> => {
    const response = await apiClient.put(`/guests/${id}`, guest);
    return response.data;
  },

  // Excluir hóspede
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/guests/${id}`);
  },
};
