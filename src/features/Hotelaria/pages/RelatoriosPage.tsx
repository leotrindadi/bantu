import React, { useState } from 'react';
import { Calendar, Bed, Sparkles, Users, FileText, Download, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface RelatorioCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lastUpdate?: string;
}

interface MesOption {
  value: string;
  label: string;
}

const RelatoriosPage: React.FC = () => {
  const [selectedMes, setSelectedMes] = useState('atual');
  const [showMesDropdown, setShowMesDropdown] = useState(false);

  const mesesOptions: MesOption[] = [
    { value: 'atual', label: 'Mês Atual' },
    { value: 'janeiro', label: 'Janeiro 2025' },
    { value: 'dezembro', label: 'Dezembro 2024' },
    { value: 'novembro', label: 'Novembro 2024' },
    { value: 'outubro', label: 'Outubro 2024' },
    { value: 'setembro', label: 'Setembro 2024' },
  ];
  const relatorios: RelatorioCard[] = [
    {
      id: 'hospedagens',
      title: 'Reservas',
      description: 'Relatório completo de check-ins, check-outs e estadias',
      icon: <Calendar size={24} />,
      color: 'bg-blue-100 text-blue-600',
      lastUpdate: 'Atualizado há 2 horas',
    },
    {
      id: 'quartos',
      title: 'Quartos',
      description: 'Ocupação, disponibilidade e status dos quartos',
      icon: <Bed size={24} />,
      color: 'bg-green-100 text-green-600',
      lastUpdate: 'Atualizado há 1 hora',
    },
    {
      id: 'limpezas',
      title: 'Limpezas',
      description: 'Histórico e agenda de limpezas realizadas',
      icon: <Sparkles size={24} />,
      color: 'bg-purple-100 text-purple-600',
      lastUpdate: 'Atualizado há 30 minutos',
    },
    {
      id: 'hospedes',
      title: 'Hóspedes',
      description: 'Cadastros, estatísticas e histórico de hóspedes',
      icon: <Users size={24} />,
      color: 'bg-yellow-100 text-yellow-600',
      lastUpdate: 'Atualizado há 3 horas',
    },
  ];

  const handleMesChange = (mes: string) => {
    setSelectedMes(mes);
    setShowMesDropdown(false);
    console.log('Mês selecionado:', mes);
  };

  const handleExportarPDF = (relatorioId: string) => {
    console.log('Exportar PDF:', relatorioId);
    // Implementar lógica de exportação em PDF
  };

  const handleExportarExcel = (relatorioId: string) => {
    console.log('Exportar Excel:', relatorioId);
    // Implementar lógica de exportação em Excel
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Gere e exporte relatórios do sistema
          </p>
        </div>

        {/* Seletor de Mês */}
        <div className="relative mt-8">
          <Button
            onClick={() => setShowMesDropdown(!showMesDropdown)}
            className="flex items-center justify-between px-4 py-2 text-sm w-[180px]"
          >
            <span>{mesesOptions.find(m => m.value === selectedMes)?.label}</span>
            <ChevronDown size={16} className="ml-2 flex-shrink-0" />
          </Button>

          {showMesDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              {mesesOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMesChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedMes === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatorios.map((relatorio) => (
          <div
            key={relatorio.id}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 ease-in-out hover:shadow-xl"
          >
            {/* Ícone e Título */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded ${relatorio.color.split(' ')[0]}`}>
                {React.cloneElement(relatorio.icon as React.ReactElement, { 
                  className: relatorio.color.split(' ')[1],
                  size: 28
                })}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {relatorio.title}
              </h3>
            </div>

            {/* Descrição */}
            <p className="text-sm text-gray-500 mb-6">
              {relatorio.description}
            </p>

            {/* Botões de Exportação */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleExportarPDF(relatorio.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm font-medium">PDF</span>
              </button>
              
              <button
                onClick={() => handleExportarExcel(relatorio.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm font-medium">Excel</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Informações Adicionais */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Sobre os Relatórios
            </h4>
            <p className="text-sm text-blue-800">
              Os relatórios são gerados com base nos dados mais recentes do sistema. 
              Você pode visualizá-los diretamente no navegador ou exportá-los em formato PDF ou Excel para análise offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;
