import apiClient from '../axios';
import { RoomCleaningLog } from '../../features/Hotelaria/types';

export const cleaningLogsApi = {
  // Buscar logs de limpeza por quarto
  getByRoom: async (roomId: string): Promise<RoomCleaningLog[]> => {
    const response = await apiClient.get(`/cleaning-logs/room/${roomId}`);
    return response.data;
  },

  // Buscar limpeza ativa (em andamento) de um quarto
  getActiveByRoom: async (roomId: string): Promise<RoomCleaningLog> => {
    const response = await apiClient.get(`/cleaning-logs/room/${roomId}/active`);
    return response.data;
  },

  // Iniciar nova limpeza
  start: async (data: { room_id: string; employee_id: string }): Promise<RoomCleaningLog> => {
    const response = await apiClient.post('/cleaning-logs', data);
    return response.data;
  },

  // Completar limpeza
  complete: async (id: string, notes?: string): Promise<RoomCleaningLog> => {
    const response = await apiClient.put(`/cleaning-logs/${id}/complete`, { notes });
    return response.data;
  },
};
