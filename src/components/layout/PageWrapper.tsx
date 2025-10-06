import React from 'react';
import { Header, Sidebar, type SidebarItem } from './';
import type { LucideIcon } from 'lucide-react';

interface PageWrapperProps {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarTitleIcon?: LucideIcon;
  sidebarItems: SidebarItem[];
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  sidebarTitle, 
  sidebarTitleIcon, 
  sidebarItems
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        title={sidebarTitle}
        titleIcon={sidebarTitleIcon}
        items={sidebarItems}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default PageWrapper;