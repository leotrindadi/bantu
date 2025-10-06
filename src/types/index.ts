// Enums
export enum UserRole {
  ADMIN = 'admin',
  COLABORADOR = 'colaborador',
}

export enum Module {
  HOTELARIA = 'hotelaria',
  ARMAZEM = 'armazem',
  COMERCIAL = 'comercial',
  RESTAURANTE = 'restaurante',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  modules: Module[];
  permissions: {
    [key: string]: string[]; // Ex: { hotelaria: ['dashboard', 'quartos', ...] }
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasModuleAccess: (module: Module) => boolean;
  hasPermission: (module: string, permission: string) => boolean;
  isAdmin: () => boolean;
}
