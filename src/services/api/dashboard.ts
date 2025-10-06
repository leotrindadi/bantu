import apiClient from '../axios';

export interface DashboardMetrics {
  occupied: string;
  checkIns: string;
  checkOuts: string;
  revenue: string;
  cleanings: string;
  changes: {
    occupied: number;
    checkIns: number;
    checkOuts: number;
    revenue: number;
    cleanings: number;
  };
}

export interface RecentActivity {
  id: string;
  check_in: Date;
  check_out: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'completed';
  created_at: Date;
  updated_at: Date;
  room_number: string;
  guest_name: string;
}

export interface ChartDataPoint {
  hour?: number;
  date?: string;
  value: number;
}

export const dashboardApi = {
  // Buscar métricas do dashboard
  getMetrics: async (period: 'today' | 'week' | 'month'): Promise<DashboardMetrics> => {
    const response = await apiClient.get(`/dashboard/metrics?period=${period}`);
    return response.data;
  },

  // Buscar atividades recentes
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    const response = await apiClient.get('/dashboard/recent-activities');
    return response.data;
  },

  // Buscar dados de gráfico por métrica e período
  getChartData: async (
    period: 'today' | 'week' | 'month',
    metric: 'occupancy' | 'checkIns' | 'checkOuts' | 'revenue'
  ): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/dashboard/chart-data?period=${period}&metric=${metric}`);
    return response.data;
  },
};
