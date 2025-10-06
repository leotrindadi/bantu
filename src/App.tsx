import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { ProtectedRoute } from '@components/auth';
import HomePage from '@pages/index';
import LoginPage from '@pages/LoginPage';
import { HotelariaPage } from '@features/Hotelaria';
import { Module } from '@types';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hotelaria"
            element={
              <ProtectedRoute requiredModule={Module.HOTELARIA}>
                <HotelariaPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/armazem"
            element={
              <ProtectedRoute requiredModule={Module.ARMAZEM}>
                <div>Módulo Armazém em desenvolvimento</div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/comercial"
            element={
              <ProtectedRoute requiredModule={Module.COMERCIAL}>
                <div>Módulo Comercial em desenvolvimento</div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurante"
            element={
              <ProtectedRoute requiredModule={Module.RESTAURANTE}>
                <div>Módulo Restaurante em desenvolvimento</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;