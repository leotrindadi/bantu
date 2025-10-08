import { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ReservationCard from '../components/ReservationCard';
import PageHeader from '../components/PageHeader';
import SearchAndFilters, { type FilterConfig } from '../components/SearchAndFilters';
import BookingForm from '../components/BookingForm';
import BookingDetails from '../components/BookingDetails';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { Booking, Room, Guest } from '../types';
import { bookingsApi } from '../../../services/api/bookings';
import { roomsApi } from '../../../services/api/rooms';
import { guestsApi } from '../../../services/api/guests';

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const reservationsPerPage = 4;

    // Carregar dados da API
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [bookingsData, roomsData, guestsData] = await Promise.all([
                bookingsApi.getAll(),
                roomsApi.getAll(),
                guestsApi.getAll()
            ]);
            // Mapear dados do backend (snake_case) para frontend (camelCase)
            const mappedBookings = bookingsData.map((b: any) => ({
                id: b.id,
                guestId: b.guest_id,
                roomId: b.room_id,
                checkIn: new Date(b.check_in),
                checkOut: new Date(b.check_out),
                status: b.status,
                totalAmount: Number(b.total_amount),
                guests: Number(b.guests_count),
                specialRequests: b.special_requests,
                paymentMethod: b.payment_method,
                consumablesCost: b.consumables_cost ? Number(b.consumables_cost) : undefined,
                createdAt: new Date(b.created_at),
                updatedAt: new Date(b.updated_at),
                guest: b.guest_name ? {
                    id: b.guest_id,
                    name: b.guest_name,
                    email: b.guest_email,
                    phone: b.guest_phone
                } : undefined,
                room: b.room_number ? {
                    id: b.room_id,
                    number: b.room_number,
                    type: b.room_type,
                    price: Number(b.room_price)
                } : undefined
            }));
            const mappedRooms = roomsData.map(r => ({
                ...r,
                price: Number(r.price),
                capacity: Number(r.capacity)
            }));
            setBookings(mappedBookings);
            setRooms(mappedRooms);
            setGuests(guestsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados. Verifique se o backend está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRoom = () => {
        setSelectedBooking(null);
        setShowBookingForm(true);
    };

    const handleViewReservationDetails = (reservation: Booking) => {
        setViewingBooking(reservation);
    };

    const handleEditReservation = (reservation: Booking) => {
        // Não permitir editar reservas finalizadas ou canceladas
        if (reservation.status === 'completed' || reservation.status === 'cancelled') {
            alert('Não é possível editar uma hospedagem finalizada ou cancelada.');
            return;
        }
        setViewingBooking(null);
        setSelectedBooking(reservation);
        setShowBookingForm(true);
    };

    // Filtrar reservas com base nos critérios de busca
    const filteredReservationsList = useMemo(() => {
        return bookings.filter((reservation: any) => {
            const matchesSearch = searchTerm === '' || 
                reservation.guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.room?.number.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
            const matchesType = typeFilter === 'all' || reservation.room?.type === typeFilter;
            
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [bookings, searchTerm, statusFilter, typeFilter]);

    // Calcular itens da página atual
    const indexOfLastReservation = currentPage * reservationsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
    const currentReservations = useMemo(() => {
        return filteredReservationsList.slice(indexOfFirstReservation, indexOfLastReservation);
    }, [filteredReservationsList, indexOfFirstReservation, indexOfLastReservation]);
    
    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredReservationsList.length / reservationsPerPage);

    // Garantir que a página atual não ultrapasse o total de páginas
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Funções de navegação
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const filters: FilterConfig[] = [
        {
            value: statusFilter,
            onChange: (value) => {
                setStatusFilter(value);
                setCurrentPage(1);
            },
            options: [
                { value: 'all', label: 'Todas' },
                { value: 'confirmed', label: 'Reserva' },
                { value: 'checked-in', label: 'Check-In' },
                { value: 'checked-out', label: 'Check-Out' },
                { value: 'completed', label: 'Finalizada' },
                { value: 'cancelled', label: 'Cancelada' },
            ],
        },
        {
            value: typeFilter,
            onChange: (value) => {
                setTypeFilter(value);
                setCurrentPage(1);
            },
            options: [
                { value: 'all', label: 'Todas' },
                { value: 'single', label: 'Simples' },
                { value: 'double', label: 'Casal' },
                { value: 'suite', label: 'Suíte' },
                { value: 'deluxe', label: 'Deluxe' },
            ],
        },
    ];

    const handleFormSubmit = async (bookingData: Partial<Booking>) => {
        try {
            // Mapear campos do frontend para o backend
            const apiData = {
                guest_id: bookingData.guestId,
                room_id: bookingData.roomId,
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                status: bookingData.status,
                total_amount: bookingData.totalAmount,
                guests_count: bookingData.guests,
                special_requests: bookingData.specialRequests
            };

            if (selectedBooking) {
                await bookingsApi.update(selectedBooking.id, apiData);
                alert('Hospedagem atualizada com sucesso!');
            } else {
                await bookingsApi.create(apiData);
                alert('Hospedagem criada com sucesso!');
            }
            setShowBookingForm(false);
            setSelectedBooking(null);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar hospedagem:', error);
            alert('Erro ao salvar hospedagem.');
        }
    };

    const handleFormCancel = () => {
        setShowBookingForm(false);
        setSelectedBooking(null);
    };

    const handleDeleteReservation = async (reservation: Booking) => {
        // Não permitir excluir reservas finalizadas
        if (reservation.status === 'completed') {
            alert('Não é possível excluir uma hospedagem finalizada.');
            return;
        }
        
        if (window.confirm('Tem certeza que deseja excluir esta hospedagem?')) {
            try {
                await bookingsApi.delete(reservation.id);
                
                // Liberar o quarto se a reserva estava com status checked-in
                if (reservation.status === 'checked-in' && reservation.roomId) {
                    const quartoCompleto = await roomsApi.getById(reservation.roomId);
                    
                    const roomData = {
                        number: quartoCompleto.number,
                        type: quartoCompleto.type,
                        status: 'available' as const,
                        price: Number(quartoCompleto.price),
                        capacity: Number(quartoCompleto.capacity),
                        amenities: quartoCompleto.amenities || [],
                        consumables: quartoCompleto.consumables || [],
                        description: quartoCompleto.description || ''
                    };
                    
                    await roomsApi.update(reservation.roomId, roomData);
                }
                
                alert('Hospedagem excluída com sucesso!');
                loadData();
            } catch (error) {
                console.error('Erro ao excluir hospedagem:', error);
                alert('Erro ao excluir hospedagem.');
            }
        }
    };

    if (viewingBooking) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="secondary"
                        onClick={() => setViewingBooking(null)}
                    >
                        ← Voltar para Lista
                    </Button>
                </div>
                <BookingDetails
                    booking={viewingBooking}
                    onEdit={handleEditReservation}
                    onStatusChange={() => {
                        loadData();
                        setViewingBooking(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Modal do Formulário de Reserva */}
            <Modal
                isOpen={showBookingForm}
                onClose={handleFormCancel}
                title={selectedBooking ? 'Editar Hospedagem' : 'Nova Hospedagem'}
                size="md"
            >
                <BookingForm
                    rooms={rooms}
                    guests={guests}
                    initialData={selectedBooking || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </Modal>
            <PageHeader
                title="Hospedagens"
                subtitle="Gerencie as hospedagens do hotel"
                buttonLabel="Nova Hospedagem"
                onButtonClick={handleAddRoom}
            />

            <SearchAndFilters
                searchValue={searchTerm}
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Buscar hospedagem..."
                filters={filters}
            />

            {/* Lista de Reservas */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Carregando hospedagens...</p>
                    </div>
                ) : filteredReservationsList.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
                        <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-700 mb-1">
                            Nenhuma hospedagem encontrada
                        </h3>
                        <p className="text-sm text-gray-500">
                            Tente ajustar os filtros ou termos de busca.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {currentReservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onViewDetails={handleViewReservationDetails}
                                onEdit={handleEditReservation}
                                onCancel={handleDeleteReservation}
                            />
                        ))}
                        
                        {/* Controles de Paginação */}
                        {totalPages > 1 && filteredReservationsList.length > 0 && (
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
}