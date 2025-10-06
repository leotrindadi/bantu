import React from 'react';
import { ShoppingCart, Package, Hotel, Utensils } from 'lucide-react';
import { ModuleCard } from '@components/ui';
import { Module } from '@types';
import useAuth from '@hooks/useAuth';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  module: Module;
}

interface ModulesSectionProps {
  onModuleClick: (path: string) => void;
  className?: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ onModuleClick, className = '' }) => {
  const { hasModuleAccess } = useAuth();

  const allModules: ModuleItem[] = [
    {
      id: 'hotelaria',
      title: 'Hotelaria',
      description: 'Gestão de quartos, reservas e hóspedes',
      icon: <Hotel className="w-6 h-6 text-purple-600" />,
      path: '/hotelaria',
      module: Module.HOTELARIA,
    },
    {
      id: 'comercial',
      title: 'Comercial',
      description: 'Vendas e relacionamento com clientes',
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      path: '/comercial',
      module: Module.COMERCIAL,
    },
    {
      id: 'armazem',
      title: 'Armazém/Estoque',
      description: 'Gestão de estoque e produtos',
      icon: <Package className="w-6 h-6 text-green-600" />,
      path: '/armazem',
      module: Module.ARMAZEM,
    },
    {
      id: 'restaurante',
      title: 'Restaurante',
      description: 'Gestão de mesas, pedidos e cardápio',
      icon: <Utensils className="w-6 h-6 text-orange-600" />,
      path: '/restaurante',
      module: Module.RESTAURANTE,
    },
  ];

  // Filtra os módulos com base nas permissões do usuário
  const modules = allModules.map(module => ({
    ...module,
    status: (hasModuleAccess(module.module) ? 'liberado' : 'bloqueado') as 'liberado' | 'bloqueado',
  }));

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            title={mod.title}
            description={mod.description}
            status={mod.status}
            icon={mod.icon}
            onClick={() => {
              if (mod.status === 'liberado') {
                onModuleClick(mod.path);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ModulesSection;
