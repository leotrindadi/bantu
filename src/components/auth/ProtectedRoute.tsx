import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { Module } from '@types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: Module;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredModule,
  adminOnly = false 
}) => {
  const { isAuthenticated, isLoading, hasModuleAccess, isAdmin } = useAuth();

  // Aguarda verificação de autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se requer acesso de admin
  if (adminOnly && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Acesso Negado</h2>
          <p className="text-red-600">Você não tem permissão para acessar esta área.</p>
          <p className="text-sm text-red-500 mt-2">Apenas administradores podem acessar.</p>
        </div>
      </div>
    );
  }

  // Verifica acesso ao módulo específico
  if (requiredModule && !hasModuleAccess(requiredModule)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Módulo Não Autorizado</h2>
          <p className="text-yellow-600">Você não tem acesso a este módulo.</p>
          <p className="text-sm text-yellow-500 mt-2">Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
