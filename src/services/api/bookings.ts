import apiClient from '../axios';
import { Booking } from '../../features/Hotelaria/types';

export const bookingsApi = {
  // Listar todas as reservas
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  // Buscar reserva por ID
  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Criar nova reserva
  create: async (booking: Partial<Booking>): Promise<Booking> => {
    const response = await apiClient.post('/bookings', booking);
    return response.data;
  },

  // Atualizar reserva
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    console.log('[API] Atualizando reserva:', { id, data: booking });
    const response = await apiClient.put(`/bookings/${id}`, booking);
    console.log('[API] Resposta:', response.data);
    return response.data;
  },

  // Excluir reserva
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};
