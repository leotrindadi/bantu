import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import { AuthContextType } from '@types';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

export default useAuth;