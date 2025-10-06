import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, Module } from '@types';
import authService from '@services/authService';

// Cria o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica autenticação ao carregar
  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (storedUser && token) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Função de login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // IMPORTANTE: Em produção, usar authService.login()
      // Para desenvolvimento, usando mockLogin
      const loggedUser = await authService.mockLogin(credentials);
      
      setUser(loggedUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Função de logout
  const logout = (): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verifica acesso a módulo
  const hasModuleAccess = (module: Module): boolean => {
    return authService.hasModuleAccess(module);
  };

  // Verifica se é admin
  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  // Verifica se o usuário tem permissão para uma ação específica em um módulo
  const hasPermission = (module: string, permission: string): boolean => {
    if (!user) return false;
    
    // Admin tem todas as permissões
    if (user.role === 'admin') return true;
    
    // Verifica se o módulo existe nas permissões do usuário
    if (!user.permissions || !user.permissions[module]) return false;
    
    // Verifica se a permissão está na lista de permissões do módulo
    return user.permissions[module].includes(permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasModuleAccess,
    hasPermission,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
