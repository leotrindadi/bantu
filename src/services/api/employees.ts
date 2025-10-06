import apiClient from '../axios';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document: string;
  position: string;
  department?: string;
  salary?: number;
  hire_date: Date;
  status: 'active' | 'inactive' | 'on-leave';
  created_at: Date;
  updated_at: Date;
}

export const employeesApi = {
  // Listar todos os funcionários
  getAll: async (): Promise<Employee[]> => {
    const response = await apiClient.get('/employees');
    return response.data;
  },

  // Buscar funcionário por ID
  getById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  // Criar novo funcionário
  create: async (employee: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.post('/employees', employee);
    return response.data;
  },

  // Atualizar funcionário
  update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.put(`/employees/${id}`, employee);
    return response.data;
  },

  // Excluir funcionário
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};
