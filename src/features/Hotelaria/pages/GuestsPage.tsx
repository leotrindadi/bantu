import { useState, useMemo, useEffect } from 'react';
import { Guest } from '../types';
import GuestDetails from '../components/GuestDetails';
import GuestForm from '../components/GuestForm';
import PageHeader from '../components/PageHeader';
import SearchAndFilters, { type FilterConfig } from '../components/SearchAndFilters';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { Users, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react';
import { guestsApi } from '../../../services/api/guests';

const GuestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'all' | 'newest' | 'oldest'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const guestsPerPage = 10;

  // Carregar hóspedes da API
  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setIsLoading(true);
      const data = await guestsApi.getAll();
      // Converter datas de string para Date
      const mappedGuests = data.map((guest: any) => ({
        ...guest,
        createdAt: guest.created_at ? new Date(guest.created_at) : (guest.createdAt ? new Date(guest.createdAt) : new Date()),
        updatedAt: guest.updated_at ? new Date(guest.updated_at) : (guest.updatedAt ? new Date(guest.updatedAt) : new Date()),
      }));
      setGuests(mappedGuests);
    } catch (error) {
      console.error('Erro ao carregar hóspedes:', error);
      alert('Erro ao carregar hóspedes. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredGuests = useMemo(() => {
    const filtered = guests.filter((guest) => {
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.document.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesNationality = nationalityFilter === 'all' || 
        guest.nationality.toLowerCase().includes(nationalityFilter.toLowerCase());
      
      return matchesSearch && matchesNationality;
    });

    // Ordenar por data de criação
    if (sortOrder === 'all') {
      return filtered; // Sem ordenação específica, mantém ordem original
    }
    
    return filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });
  }, [guests, searchTerm, nationalityFilter, sortOrder]);

  // Calcular itens da página atual
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = useMemo(() => {
    return filteredGuests.slice(indexOfFirstGuest, indexOfLastGuest);
  }, [filteredGuests, indexOfFirstGuest, indexOfLastGuest]);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  // Garantir que a página atual não ultrapasse o total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Funções de navegação
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(null);
    setEditingGuest(guest);
    setShowGuestForm(true);
  };

  const handleAddGuest = () => {
    setEditingGuest(null);
    setShowGuestForm(true);
  };

  const handleSubmitGuest = async (guestData: Partial<Guest>) => {
    setIsSubmitting(true);

    try {
      if (editingGuest) {
        await guestsApi.update(editingGuest.id, guestData);
        alert('Hóspede atualizado com sucesso!');
      } else {
        await guestsApi.create(guestData);
        alert('Hóspede cadastrado com sucesso!');
      }

      setShowGuestForm(false);
      setEditingGuest(null);
      loadGuests();
    } catch (error) {
      console.error('Erro ao salvar hóspede:', error);
      alert('Ocorreu um erro ao salvar o hóspede. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowGuestForm(false);
    setEditingGuest(null);
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (window.confirm(`Tem certeza que deseja excluir ${guest.name}?`)) {
      try {
        await guestsApi.delete(guest.id);
        alert('Hóspede excluído com sucesso!');
        loadGuests();
      } catch (error) {
        console.error('Erro ao excluir hóspede:', error);
        alert('Erro ao excluir hóspede.');
      }
    }
  };

  if (selectedGuest) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => setSelectedGuest(null)}
          >
            ← Voltar para Lista
          </Button>
        </div>
        <GuestDetails
          guest={selectedGuest}
          onEdit={handleEditGuest}
        />
      </div>
    );
  }

  const filters: FilterConfig[] = [
    {
      value: nationalityFilter,
      onChange: (value) => {
        setNationalityFilter(value);
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'brasileiro', label: 'Brasileiro' },
        { value: 'americano', label: 'Americano' },
        { value: 'espanhol', label: 'Espanhol' },
        { value: 'argentino', label: 'Argentino' },
      ],
    },
    {
      value: sortOrder,
      onChange: (value) => {
        setSortOrder(value as 'all' | 'newest' | 'oldest');
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'newest', label: 'Mais Recente' },
        { value: 'oldest', label: 'Mais Antigo' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modal do Formulário de Hóspede */}
      <Modal
        isOpen={showGuestForm}
        onClose={handleCancelForm}
        title={editingGuest ? 'Editar Hóspede' : 'Novo Hóspede'}
        size="md"
      >
        <GuestForm
          initialData={editingGuest}
          onSubmit={handleSubmitGuest}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      </Modal>

      <PageHeader
        title="Hóspedes"
        subtitle="Gerencie os hóspedes do hotel"
        buttonLabel="Novo Hóspede"
        onButtonClick={handleAddGuest}
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

      {/* Lista de Hóspedes */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Carregando hóspedes...</p>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-700 mb-1">
            Nenhum hóspede encontrado
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
                    Hóspede
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
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
                {currentGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {guest.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guest.document}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guest.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewGuest(guest)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditGuest(guest)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest)}
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
          {totalPages > 1 && filteredGuests.length > 0 && (
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

export default GuestsPage;

