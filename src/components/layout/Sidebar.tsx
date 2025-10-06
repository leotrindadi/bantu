import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useAuth from '@hooks/useAuth';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  variant?: 'default' | 'primary';
}

interface SidebarProps {
  title: string;
  titleIcon?: LucideIcon;
  items: SidebarItem[];
  className?: string;
  defaultCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  title, 
  titleIcon: TitleIcon, 
  items, 
  className = "",
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Função de logout que desloga e redireciona para login
  const handleLogout = () => {
    logout(); // Desloga o usuário
    navigate('/login'); // Redireciona para a página de login
  };
  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white min-h-screen p-4 transition-all duration-300 ease-in-out flex flex-col ${className}`}>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            {TitleIcon && <TitleIcon className="w-6 h-6 flex-shrink-0" />}
            {!isCollapsed && <h2 className="text-lg font-bold truncate">{title}</h2>}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-700 transition-colors flex-shrink-0"
            title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      {/* Navegação principal */}
      <nav className="space-y-2 flex-1">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition-colors flex items-center ${
                isCollapsed ? 'justify-center' : 'space-x-2'
              } ${item.isActive ? 'bg-gray-700' : ''} ${item.className || ''} ${
                item.variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {ItemIcon && <ItemIcon className="w-4 h-4 flex-shrink-0" />}
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Separador e item de Logout fixo */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`w-full text-left py-2 px-4 rounded transition-colors flex items-center ${
            isCollapsed ? 'justify-center' : 'space-x-2'
          } text-red-400 hover:bg-red-900/20 hover:text-red-300`}
          title={isCollapsed ? 'Sair' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;