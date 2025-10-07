import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import SearchAndFilters, { type FilterConfig } from '../components/SearchAndFilters';
import FuncionarioForm from '../components/FuncionarioForm';
import FuncionarioDetails from '../components/FuncionarioDetails';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { Users, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react';
import { employeesApi } from '../../../services/api/employees';

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  nacionalidade: string;
  funcao: string;
  endereco: string;
  imagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FuncionariosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [funcaoFilter, setFuncaoFilter] = useState('all');
  const [nacionalidadeFilter, setNacionalidadeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFuncionarioForm, setShowFuncionarioForm] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [viewingFuncionario, setViewingFuncionario] = useState<Funcionario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const funcionariosPorPagina = 10;

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      setIsLoading(true);
      const data = await employeesApi.getAll();
      const mapped = data.map((e: any) => ({
        id: e.id,
        nome: e.name,
        email: e.email,
        telefone: e.phone || '',
        documento: e.document,
        nacionalidade: e.nationality || 'Não informado',
        funcao: e.position,
        endereco: e.address || '',
        createdAt: new Date(e.created_at),
        updatedAt: new Date(e.updated_at)
      }));
      setFuncionarios(mapped);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar funcionários com base nos critérios de busca
  const filteredFuncionarios = useMemo(() => {
    return funcionarios.filter((funcionario) => {
      const matchesSearch = 
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.documento.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFuncao = funcaoFilter === 'all' || 
        funcionario.funcao === funcaoFilter;
      
      const matchesNacionalidade = nacionalidadeFilter === 'all' || 
        funcionario.nacionalidade.toLowerCase().includes(nacionalidadeFilter.toLowerCase());
      
      return matchesSearch && matchesFuncao && matchesNacionalidade;
    });
  }, [funcionarios, searchTerm, funcaoFilter, nacionalidadeFilter]);

  // Calcular itens da página atual
  const indexOfLastFuncionario = currentPage * funcionariosPorPagina;
  const indexOfFirstFuncionario = indexOfLastFuncionario - funcionariosPorPagina;
  const currentFuncionarios = useMemo(() => {
    return filteredFuncionarios.slice(indexOfFirstFuncionario, indexOfLastFuncionario);
  }, [filteredFuncionarios, indexOfFirstFuncionario, indexOfLastFuncionario]);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredFuncionarios.length / funcionariosPorPagina);

  // Garantir que a página atual não ultrapasse o total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Funções de navegação
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Obter funções únicas dos funcionários
  const funcoes = useMemo(() => {
    const uniqueFuncoes = Array.from(new Set(funcionarios.map(f => f.funcao)));
    return uniqueFuncoes.sort();
  }, [funcionarios]);

  // Configuração dos filtros
  const filters: FilterConfig[] = [
    {
      value: funcaoFilter,
      onChange: (value) => {
        setFuncaoFilter(value);
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todas' },
        ...funcoes.map(funcao => ({
          value: funcao,
          label: funcao.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }))
      ],
    },
    {
      value: nacionalidadeFilter,
      onChange: (value) => {
        setNacionalidadeFilter(value);
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'brasileiro', label: 'Brasileiro' },
        { value: 'espanhol', label: 'Espanhol' },
        { value: 'frances', label: 'Francês' },
        { value: 'italiano', label: 'Italiano' },
      ],
    },
  ];

  const handleAddFuncionario = () => {
    setEditingFuncionario(null);
    setShowFuncionarioForm(true);
  };

  const handleViewFuncionario = (funcionario: Funcionario) => {
    setViewingFuncionario(funcionario);
  };

  const handleEditFuncionario = (funcionario: Funcionario) => {
    setViewingFuncionario(null);
    setEditingFuncionario(funcionario);
    setShowFuncionarioForm(true);
  };

  const handleDeleteFuncionario = async (funcionario: Funcionario) => {
    if (window.confirm(`Tem certeza que deseja excluir "${funcionario.nome}"?`)) {
      try {
        await employeesApi.delete(funcionario.id);
        alert('Funcionário excluído com sucesso!');
        loadFuncionarios();
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário.');
      }
    }
  };

  const handleSubmitFuncionario = async (funcionarioData: Partial<Funcionario>) => {
    setIsSubmitting(true);

    try {
      // Mapear dados do frontend para o backend
      const apiData = {
        name: funcionarioData.nome,
        email: funcionarioData.email,
        phone: funcionarioData.telefone,
        document: funcionarioData.documento,
        nationality: funcionarioData.nacionalidade,
        address: funcionarioData.endereco,
        position: funcionarioData.funcao,
        department: 'Geral',
        salary: 2500,
        hire_date: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      if (editingFuncionario) {
        await employeesApi.update(editingFuncionario.id, apiData as any);
        alert('Funcionário atualizado com sucesso!');
      } else {
        await employeesApi.create(apiData as any);
        alert('Funcionário cadastrado com sucesso!');
      }

      setShowFuncionarioForm(false);
      setEditingFuncionario(null);
      loadFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      alert('Ocorreu um erro ao salvar o funcionário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowFuncionarioForm(false);
    setEditingFuncionario(null);
  };

  const getFuncaoLabel = (funcao: string) => {
    const funcoes: Record<string, string> = {
      'camareira': 'Camareira',
      'recepcionista': 'Recepcionista',
      'gerente': 'Gerente',
      'chef': 'Chef',
      'porteiro': 'Porteiro',
      'manobrista': 'Manobrista',
      'seguranca': 'Segurança',
    };
    // Se não estiver no dicionário, formatar o texto
    return funcoes[funcao] || funcao.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (viewingFuncionario) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => setViewingFuncionario(null)}
          >
            ← Voltar para Lista
          </Button>
        </div>
        <FuncionarioDetails
          funcionario={viewingFuncionario}
          onEdit={handleEditFuncionario}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modal do Formulário de Funcionário */}
      <Modal
        isOpen={showFuncionarioForm}
        onClose={handleCancelForm}
        title={editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
        size="md"
      >
        <FuncionarioForm
          initialData={editingFuncionario}
          onSubmit={handleSubmitFuncionario}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      </Modal>

      <PageHeader
        title="Funcionários"
        subtitle="Gerencie os funcionários do hotel"
        buttonLabel="Novo Funcionário"
        onButtonClick={handleAddFuncionario}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Buscar por nome, email ou documento..."
        filters={filters}
        searchWidth="w-[500px]"
      />

      {/* Lista de Funcionários */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Carregando funcionários...</p>
        </div>
      ) : filteredFuncionarios.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-700 mb-1">
            Nenhum funcionário encontrado
          </h3>
          <p className="text-sm text-gray-500">
            Tente ajustar os filtros ou termos de busca.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nacionalidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {funcionario.nome}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{funcionario.email}</div>
                      <div className="text-sm text-gray-500">{funcionario.telefone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {funcionario.documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
                        {getFuncaoLabel(funcionario.funcao)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {funcionario.nacionalidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewFuncionario(funcionario)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditFuncionario(funcionario)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFuncionario(funcionario)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Controles de Paginação */}
          {totalPages > 1 && filteredFuncionarios.length > 0 && (
            <div className="flex justify-between items-center mt-6 px-6 pb-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ChevronLeft size={18} className="mr-1" />
                Anterior
              </button>
              
              <div className="flex items-center justify-center">
                <span className="text-xs text-gray-400">Página {currentPage} de {totalPages}</span>
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Próxima
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FuncionariosPage;
