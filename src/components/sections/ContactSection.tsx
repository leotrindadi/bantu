import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className = '' }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 w-2/3 mx-auto border border-gray-100 my-6 
      transition-all duration-200 ease-in-out cursor-pointer h-40 flex items-center justify-center
      hover:transform hover:-translate-y-0.5 hover:shadow-md hover:border-blue-100
      ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-50 p-2 rounded-full mb-2">
          <MessageCircle className="text-blue-600 w-6 h-6" />
        </div>
        <h3 className="text-base font-medium text-gray-900">Precisa de ajuda?</h3>
        <p className="text-sm text-gray-500">Entre em contato com nosso suporte</p>
      </div>
    </div>
  );
};

export default ContactSection;
