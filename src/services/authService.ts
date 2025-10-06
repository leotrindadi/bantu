import axios from 'axios';
import { LoginCredentials, User, UserRole, Module } from '@types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Chaves para localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

class AuthService {
  // Login do usuário
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;

      // Armazena token e dados do usuário
      this.setToken(token);
      this.setUser(user);

      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Credenciais inválidas');
    }
  }

  // Logout do usuário
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Obtém o token armazenado
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Armazena o token
  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Obtém o usuário armazenado
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  // Armazena os dados do usuário
  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Verifica se o usuário tem acesso a um módulo específico
  hasModuleAccess(module: Module): boolean {
    const user = this.getUser();
    if (!user) return false;

    // Verifica se o módulo está na lista de módulos do usuário
    // Admin não tem acesso automático a todos os módulos
    return user.modules.includes(module);
  }

  // Verifica se o usuário é admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === UserRole.ADMIN;
  }

  // Simula login (para desenvolvimento - REMOVER EM PRODUÇÃO)
  async mockLogin(credentials: LoginCredentials): Promise<User> {
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Usuários de teste
    const mockUsers: Record<string, User> = {
      'admin@bantu.com': {
        id: '1',
        name: 'Administrador',
        email: 'admin@bantu.com',
        role: UserRole.ADMIN,
        modules: [Module.HOTELARIA], // Apenas módulo Hotelaria
        permissions: {
          hotelaria: ['dashboard', 'quartos', 'reservas', 'hospedes', 'consumiveis', 'funcionarios', 'relatorios', 'pos']
        }
      },
      'colaborador@bantu.com': {
        id: '2',
        name: 'Colaborador',
        email: 'colaborador@bantu.com',
        role: UserRole.COLABORADOR,
        modules: [Module.HOTELARIA], // Apenas módulo Hotelaria
        permissions: {
          hotelaria: ['dashboard', 'quartos', 'reservas', 'hospedes', 'pos'] // Apenas abas permitidas
        }
      },
    };

    const user = mockUsers[credentials.email];

    if (!user || credentials.password !== '123456') {
      throw new Error('Credenciais inválidas');
    }

    // Simula token JWT
    const mockToken = `mock_token_${user.id}_${Date.now()}`;
    this.setToken(mockToken);
    this.setUser(user);

    return user;
  }
}

export default new AuthService();
