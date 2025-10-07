import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import SearchAndFilters, { type FilterConfig } from '../components/SearchAndFilters';
import ConsumivelForm from '../components/ConsumivelForm';
import ConsumivelDetails from '../components/ConsumivelDetails';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { ShoppingCart, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react';
import { consumablesApi } from '../../../services/api/consumables';

type ConsumivelStatus = 'disponivel' | 'indisponivel' | 'em-falta';

interface Consumivel {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  codigoBarras: string;
  status: ConsumivelStatus;
  quantidadeEstoque: number;
  categoria: string;
  imagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsumiveisPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ConsumivelStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConsumivelForm, setShowConsumivelForm] = useState(false);
  const [editingConsumivel, setEditingConsumivel] = useState<Consumivel | null>(null);
  const [viewingConsumivel, setViewingConsumivel] = useState<Consumivel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consumiveis, setConsumiveis] = useState<Consumivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itensPorPagina = 10;

  useEffect(() => {
    loadConsumiveis();
  }, []);

  const loadConsumiveis = async () => {
    try {
      setIsLoading(true);
      const data = await consumablesApi.getAll();
      const mapped = data.map((c: any) => ({
        id: c.id,
        nome: c.name,
        descricao: c.description || '',
        preco: Number(c.price),
        codigoBarras: '',
        status: c.stock > 0 ? 'disponivel' : 'em-falta' as ConsumivelStatus,
        quantidadeEstoque: Number(c.stock),
        categoria: c.category,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      }));
      setConsumiveis(mapped);
    } catch (error) {
      console.error('Erro ao carregar consumíveis:', error);
      alert('Erro ao carregar consumíveis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar consumíveis com base nos critérios de busca
  const filteredConsumiveis = useMemo(() => {
    return consumiveis.filter((consumivel) => {
      const matchesSearch = 
        consumivel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumivel.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumivel.codigoBarras.includes(searchTerm);
      
      const matchesCategoria = categoriaFilter === 'all' || 
        consumivel.categoria === categoriaFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        consumivel.status === statusFilter;
      
      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }, [consumiveis, searchTerm, categoriaFilter, statusFilter]);

  // Calcular itens da página atual
  const indexOfLastItem = currentPage * itensPorPagina;
  const indexOfFirstItem = indexOfLastItem - itensPorPagina;
  const currentConsumiveis = useMemo(() => {
    return filteredConsumiveis.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredConsumiveis, indexOfFirstItem, indexOfLastItem]);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredConsumiveis.length / itensPorPagina);

  // Garantir que a página atual não ultrapasse o total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Funções de navegação
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Obter categorias únicas dos consumíveis
  const categorias = useMemo(() => {
    const uniqueCategories = Array.from(new Set(consumiveis.map(c => c.categoria)));
    return uniqueCategories.sort();
  }, [consumiveis]);

  // Configuração dos filtros
  const filters: FilterConfig[] = [
    {
      value: categoriaFilter,
      onChange: (value) => {
        setCategoriaFilter(value);
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todas' },
        ...categorias.map(cat => ({
          value: cat,
          label: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }))
      ],
    },
    {
      value: statusFilter,
      onChange: (value) => {
        setStatusFilter(value as ConsumivelStatus | 'all');
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'disponivel', label: 'Disponível' },
        { value: 'indisponivel', label: 'Indisponível' },
        { value: 'em-falta', label: 'Em Falta' },
      ],
    },
  ];

  const handleAddConsumivel = () => {
    setEditingConsumivel(null);
    setShowConsumivelForm(true);
  };

  const handleViewConsumivel = (consumivel: Consumivel) => {
    setViewingConsumivel(consumivel);
  };

  const handleEditConsumivel = (consumivel: Consumivel) => {
    setViewingConsumivel(null);
    setEditingConsumivel(consumivel);
    setShowConsumivelForm(true);
  };

  const handleDeleteConsumivel = async (consumivel: Consumivel) => {
    if (window.confirm(`Tem certeza que deseja excluir "${consumivel.nome}"?`)) {
      try {
        await consumablesApi.delete(consumivel.id);
        alert('Consumível excluído com sucesso!');
        loadConsumiveis();
      } catch (error) {
        console.error('Erro ao excluir consumível:', error);
        alert('Erro ao excluir consumível.');
      }
    }
  };

  const handleSubmitConsumivel = async (consumivelData: Partial<Consumivel>) => {
    setIsSubmitting(true);

    try {
      // Mapear dados do frontend para o backend
      const apiData = {
        name: consumivelData.nome,
        category: consumivelData.categoria,
        price: consumivelData.preco,
        stock: consumivelData.quantidadeEstoque,
        min_stock: 10,
        unit: 'un',
        description: consumivelData.descricao
      };

      if (editingConsumivel) {
        await consumablesApi.update(editingConsumivel.id, apiData);
        alert('Consumível atualizado com sucesso!');
      } else {
        await consumablesApi.create(apiData);
        alert('Consumível cadastrado com sucesso!');
      }

      setShowConsumivelForm(false);
      setEditingConsumivel(null);
      loadConsumiveis();
    } catch (error) {
      console.error('Erro ao salvar consumível:', error);
      alert('Ocorreu um erro ao salvar o consumível. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowConsumivelForm(false);
    setEditingConsumivel(null);
  };

  if (viewingConsumivel) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => setViewingConsumivel(null)}
          >
            ← Voltar para Lista
          </Button>
        </div>
        <ConsumivelDetails
          consumivel={viewingConsumivel}
          onEdit={handleEditConsumivel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modal do Formulário de Consumível */}
      <Modal
        isOpen={showConsumivelForm}
        onClose={handleCancelForm}
        title={editingConsumivel ? 'Editar Consumível' : 'Novo Consumível'}
        size="md"
      >
        <ConsumivelForm
          initialData={editingConsumivel}
          onSubmit={handleSubmitConsumivel}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      </Modal>

      <PageHeader
        title="Consumíveis"
        subtitle="Gerencie os itens consumíveis do hotel"
        buttonLabel="Novo Consumível"
        onButtonClick={handleAddConsumivel}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Buscar por nome, descrição ou código de barras..."
        filters={filters}
        searchWidth="w-[500px]"
      />

      {/* Lista de Consumíveis */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Carregando consumíveis...</p>
        </div>
      ) : filteredConsumiveis.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-700 mb-1">
            Nenhum consumível encontrado
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
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentConsumiveis.map((consumivel) => (
                  <tr key={consumivel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consumivel.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {consumivel.descricao}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {consumivel.categoria.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      Kz {Number(consumivel.preco).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={consumivel.quantidadeEstoque <= 10 ? 'text-red-600 font-semibold' : ''}>
                        {consumivel.quantidadeEstoque} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewConsumivel(consumivel)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditConsumivel(consumivel)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteConsumivel(consumivel)}
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
          {totalPages > 1 && filteredConsumiveis.length > 0 && (
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

export default ConsumiveisPage;
