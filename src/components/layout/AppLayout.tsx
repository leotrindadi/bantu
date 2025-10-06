import React, { ReactNode } from 'react';
import { Header } from './';
import Footer from './Footer';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col">
          <Header />
          <main className={`container mx-auto px-4 py-6 flex-1 ${className}`}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
