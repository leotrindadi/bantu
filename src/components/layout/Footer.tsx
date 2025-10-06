import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer 
      className="w-full px-6 py-4 bg-[#111827] text-white"
      style={{ backgroundColor: 'rgba(17, 24, 39, 1)' }}
    >
      <div className="w-full px-5 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <div className="text-lg">Bantu Software</div>
          <div className="text-sm text-white/80">Soluções Empresariais Para Angola</div>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-sm">© 2024 Bantu Software. Todos os direitos reservados.</div>
          <div className="text-sm text-white/80">Desenvolvido com ❤️ para empresas angolanas</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
