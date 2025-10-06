import apiClient from '../axios';
import { Room } from '../../features/Hotelaria/types';

export const roomsApi = {
  // Listar todos os quartos
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get('/rooms');
    return response.data;
  },

  // Buscar quarto por ID
  getById: async (id: string): Promise<Room> => {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  },

  // Criar novo quarto
  create: async (room: Partial<Room>): Promise<Room> => {
    const response = await apiClient.post('/rooms', room);
    return response.data;
  },

  // Atualizar quarto
  update: async (id: string, room: Partial<Room>): Promise<Room> => {
    const response = await apiClient.put(`/rooms/${id}`, room);
    return response.data;
  },

  // Excluir quarto
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};
