import { useState, useMemo, useEffect } from 'react';
import { Room } from '../types';
import RoomCard from '../components/RoomCard';
import RoomForm from '../components/RoomForm';
import RoomDetails from '../components/RoomDetails';
import PageHeader from '../components/PageHeader';
import SearchAndFilters, { type FilterConfig } from '../components/SearchAndFilters';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { roomsApi } from '../../../services/api/rooms';
import { consumablesApi } from '../../../services/api/consumables';

const RoomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Room['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Room['type'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [consumiveis, setConsumiveis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const roomsPerPage = 4;

  // Carregar quartos da API
  useEffect(() => {
    loadRooms();
    loadConsumiveis();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const [roomsData, consumablesData] = await Promise.all([
        roomsApi.getAll(),
        consumablesApi.getAll()
      ]);
      
      // Criar mapa de IDs para nomes de consumíveis
      const consumablesMap = new Map(
        consumablesData.map(c => [c.id, c.name])
      );
      
      // Converter tipos do banco de dados, mantendo IDs originais e adicionando nomes para exibição
      const mappedData = roomsData.map((room: any) => {
        const consumableIds = room.consumables || [];
        // Filtrar apenas consumíveis que ainda existem
        const validConsumableIds = consumableIds.filter((id: string) => consumablesMap.has(id));
        const consumableNames = validConsumableIds.map((id: string) => 
          consumablesMap.get(id)
        );
        
        return {
          ...room,
          price: Number(room.price),
          capacity: Number(room.capacity),
          consumables: validConsumableIds, // Manter apenas IDs válidos
          consumablesDisplay: consumableNames, // Nomes para exibição
          createdAt: new Date(room.created_at),
          updatedAt: new Date(room.updated_at)
        };
      });
      
      setRooms(mappedData);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      alert('Erro ao carregar quartos. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConsumiveis = async () => {
    try {
      const data = await consumablesApi.getAll();
      setConsumiveis(data.map(c => ({ id: c.id, nome: c.name, categoria: c.category })));
    } catch (error) {
      console.error('Erro ao carregar consumíveis:', error);
    }
  };

  // Filtrar quartos com base nos critérios de busca
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, searchTerm, statusFilter, typeFilter]);

  // Calcular itens da página atual
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = useMemo(() => {
    return filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  }, [filteredRooms, indexOfFirstRoom, indexOfLastRoom]);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  // Garantir que a página atual não ultrapasse o total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Funções de navegação
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleViewDetails = (room: Room) => {
    setViewingRoom(room);
  };

  const handleDeleteRoom = async (room: Room) => {
    if (window.confirm(`Tem certeza que deseja excluir o quarto ${room.number}?`)) {
      try {
        await roomsApi.delete(room.id);
        alert('Quarto excluído com sucesso!');
        loadRooms();
      } catch (error) {
        console.error('Erro ao excluir quarto:', error);
        alert('Erro ao excluir quarto.');
      }
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowRoomForm(true);
  };

  const handleEditRoom = (room: Room) => {
    setViewingRoom(null);
    setEditingRoom(room);
    setShowRoomForm(true);
  };

  const handleSubmitRoom = async (roomData: Partial<Room>) => {
    setIsSubmitting(true);

    try {
      // Mapear dados do frontend para o backend
      const apiData = {
        number: roomData.number,
        type: roomData.type,
        status: roomData.status,
        price: roomData.price,
        capacity: roomData.capacity,
        amenities: roomData.amenities,
        consumables: roomData.consumables,
        description: roomData.description
      };

      let response;
      if (editingRoom) {
        response = await roomsApi.update(editingRoom.id, apiData as any);
        console.log('Resposta do backend (update):', response);
        alert('Quarto atualizado com sucesso!');
      } else {
        response = await roomsApi.create(apiData as any);
        console.log('Resposta do backend (create):', response);
        alert('Quarto cadastrado com sucesso!');
      }

      setShowRoomForm(false);
      setEditingRoom(null);
      await loadRooms();
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
      alert('Ocorreu um erro ao salvar o quarto. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowRoomForm(false);
    setEditingRoom(null);
  };

  const filters: FilterConfig[] = [
    {
      value: statusFilter,
      onChange: (value) => {
        setStatusFilter(value as Room['status'] | 'all');
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'available', label: 'Disponível' },
        { value: 'occupied', label: 'Ocupado' },
        { value: 'maintenance', label: 'Manutenção' },
        { value: 'cleaning', label: 'Limpeza' },
        { value: 'cleaning-in-progress', label: 'Limpando' },
      ],
    },
    {
      value: typeFilter,
      onChange: (value) => {
        setTypeFilter(value as Room['type'] | 'all');
        setCurrentPage(1);
      },
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'single', label: 'Simples' },
        { value: 'double', label: 'Casal' },
        { value: 'suite', label: 'Suíte' },
        { value: 'deluxe', label: 'Luxo' },
      ],
    },
  ];

  const handleStatusChange = async () => {
    await loadRooms();
    // Forçar atualização do quarto sendo visualizado
    if (viewingRoom) {
      try {
        const updatedRoomData: any = await roomsApi.getById(viewingRoom.id);
        const updatedRoom: Room = {
          ...updatedRoomData,
          price: Number(updatedRoomData.price),
          capacity: Number(updatedRoomData.capacity),
          createdAt: new Date(updatedRoomData.createdAt || updatedRoomData.created_at),
          updatedAt: new Date(updatedRoomData.updatedAt || updatedRoomData.updated_at)
        };
        setViewingRoom(updatedRoom);
      } catch (error) {
        console.error('Erro ao atualizar quarto:', error);
      }
    }
  };

  if (viewingRoom) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => setViewingRoom(null)}
          >
            ← Voltar para Lista
          </Button>
        </div>
        <RoomDetails
          room={viewingRoom}
          onEdit={handleEditRoom}
          onStatusChange={handleStatusChange}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modal do Formulário de Quarto */}
      <Modal
        isOpen={showRoomForm}
        onClose={handleCancelForm}
        title={editingRoom ? 'Editar Quarto' : 'Novo Quarto'}
        size="lg"
      >
        <RoomForm
          initialData={editingRoom}
          consumiveis={consumiveis}
          onSubmit={handleSubmitRoom}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      </Modal>

      <PageHeader
        title="Quartos"
        subtitle="Gerencie os quartos do hotel"
        buttonLabel="Novo Quarto"
        onButtonClick={handleAddRoom}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Buscar quarto..."
        filters={filters}
      />


      {/* Lista de Quartos */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Carregando quartos...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-700 mb-1">
              Nenhum quarto encontrado
            </h3>
            <p className="text-sm text-gray-500">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onViewDetails={handleViewDetails}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            ))}
            
            {/* Controles de Paginação */}
            {totalPages > 1 && filteredRooms.length > 0 && (
              <div className="flex justify-between items-center mt-6 px-2">
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
    </div>
  );
};

export default RoomsPage;