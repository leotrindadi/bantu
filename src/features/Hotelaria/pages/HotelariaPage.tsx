import React, { useState } from 'react';
import { Hotel, Bed, Users, Calendar, Home, ShoppingCart, UserCog, FileText, CreditCard } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import DashboardPage from './DashboardPage';
import RoomsPage from './RoomsPage';
import BookingsPage from './BookingsPage';
import GuestsPage from './GuestsPage';
import ConsumiveisPage from './ConsumiveisPage';
import FuncionariosPage from './FuncionariosPage';
import RelatoriosPage from './RelatoriosPage';
import POSPage from './POSPage';
import useAuth from '../../../hooks/useAuth';
import { UserRole } from '@types';


type TabType = 'dashboard' | 'quartos' | 'reservas' | 'hospedes' | 'consumiveis' | 'funcionarios' | 'relatorios' | 'pos';

const HotelariaPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'quartos':
        return <RoomsPage />;
      case 'reservas':
        return <BookingsPage />;
      case 'hospedes':
        return <GuestsPage />;
      case 'consumiveis':
        return <ConsumiveisPage />;
      case 'funcionarios':
        return <FuncionariosPage />;
      case 'relatorios':
        return <RelatoriosPage />;
      case 'pos':
        return <POSPage />;
      default:
        return <DashboardPage />;
    }
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => setActiveTab('dashboard'),
      isActive: activeTab === 'dashboard'
    },
    {
      id: 'quartos',
      label: 'Quartos',
      icon: Bed,
      onClick: () => setActiveTab('quartos'),
      isActive: activeTab === 'quartos'
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: Calendar,
      onClick: () => setActiveTab('reservas'),
      isActive: activeTab === 'reservas'
    },
    {
      id: 'hospedes',
      label: 'Hóspedes',
      icon: Users,
      onClick: () => setActiveTab('hospedes'),
      isActive: activeTab === 'hospedes'
    },
    {
      id: 'consumiveis',
      label: 'Consumíveis',
      icon: ShoppingCart,
      onClick: () => setActiveTab('consumiveis'),
      isActive: activeTab === 'consumiveis'
    },
    {
      id: 'funcionarios',
      label: 'Funcionários',
      icon: UserCog,
      onClick: () => setActiveTab('funcionarios'),
      isActive: activeTab === 'funcionarios'
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: FileText,
      onClick: () => setActiveTab('relatorios'),
      isActive: activeTab === 'relatorios'
    },
    {
      id: 'pos',
      label: 'POS',
      icon: CreditCard,
      onClick: () => setActiveTab('pos'),
      isActive: activeTab === 'pos'
    }
  ];

  // Filtra as abas com base nas permissões do usuário
  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!user) return false;
    // Se for admin, mostra todas as abas
    if (user.role === UserRole.ADMIN) return true;
    // Se não for admin, verifica se a aba está nas permissões
    return user.permissions?.hotelaria?.includes(item.id);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        title="Hotelaria"
        titleIcon={Hotel}
        items={filteredSidebarItems}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HotelariaPage;
