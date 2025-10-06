import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@components/layout';
import { ModulesSection, ContactSection } from '@components/sections';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <AppLayout>
      <div className="space-y-50">
        <div className="max-w-3xl mx-auto text-center p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Módulos Disponíveis
          </h1>
          <p className="text-gray-600">
            Selecione um módulo para começar a gerenciar seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <ModulesSection onModuleClick={handleModuleClick} />
          </div>
          
          <div className="max-w-3xl mx-auto w-full">
            <ContactSection />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;