import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { formatDate } from '../../../lib/formatDate';
import { Calendar, User, DoorOpen, CreditCard, Users, FileText, AlertCircle, LogIn, LogOut, CheckCircle, XCircle } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';
import Button from '@components/ui/Button';
import { bookingsApi } from '../../../services/api/bookings';
import { roomsApi } from '../../../services/api/rooms';
import { consumablesApi } from '../../../services/api/consumables';
import ConsumablesCheckoutModal from './ConsumablesCheckoutModal';

interface BookingDetailsProps {
  booking: Booking;
  onEdit?: (booking: Booking) => void;
  onStatusChange?: () => void;
}

const getStatusLabel = (status: Booking['status']) => {
  const labels = {
    'confirmed': 'Reserva',
    'checked-in': 'Check-In Realizado',
    'checked-out': 'Check-Out Realizado',
    'completed': 'Finalizada',
    'cancelled': 'Cancelada',
  };
  return labels[status] || status;
};

const getStatusColor = (status: Booking['status']) => {
  const colors = {
    'confirmed': 'bg-blue-50 text-blue-700 border border-blue-200',
    'checked-in': 'bg-green-50 text-green-700 border border-green-200',
    'checked-out': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'completed': 'bg-purple-50 text-purple-700 border border-purple-200',
    'cancelled': 'bg-red-50 text-red-700 border border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onEdit, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConsumablesModal, setShowConsumablesModal] = useState(false);
  const [roomConsumables, setRoomConsumables] = useState<string[]>([]);

  // Carregar consumíveis do quarto ao montar o componente
  useEffect(() => {
    const loadRoomConsumables = async () => {
      if (booking.roomId) {
        try {
          const room = await roomsApi.getById(booking.roomId);
          setRoomConsumables(room.consumables || []);
        } catch (error) {
          console.error('Erro ao carregar consumíveis do quarto:', error);
        }
      }
    };

    loadRoomConsumables();
  }, [booking.roomId]);

  const handleStatusTransition = async (newStatus: Booking['status'], roomStatus?: 'occupied' | 'cleaning' | 'available') => {
    if (!window.confirm(getConfirmationMessage(newStatus))) {
      return;
    }

    try {
      setIsProcessing(true);

      // Atualizar status da reserva
      const apiData = {
        guest_id: booking.guestId,
        room_id: booking.roomId,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        status: newStatus,
        total_amount: booking.totalAmount,
        guests_count: booking.guests,
        special_requests: booking.specialRequests,
        payment_method: booking.paymentMethod,
      };

      await bookingsApi.update(booking.id, apiData);

      // Atualizar status do quarto se necessário
      if (roomStatus && booking.roomId) {
        const quartoCompleto = await roomsApi.getById(booking.roomId);
        
        const roomData = {
          number: quartoCompleto.number,
          type: quartoCompleto.type,
          status: roomStatus,
          price: Number(quartoCompleto.price),
          capacity: Number(quartoCompleto.capacity),
          amenities: quartoCompleto.amenities || [],
          consumables: quartoCompleto.consumables || [],
          description: quartoCompleto.description || ''
        };
        
        await roomsApi.update(booking.roomId, roomData);
      }

      alert(getSuccessMessage(newStatus));
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da hospedagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfirmationMessage = (status: Booking['status']) => {
    const messages = {
      'checked-in': 'Confirmar Check-In desta hospedagem?',
      'checked-out': 'Confirmar Check-Out desta hospedagem? O quarto ficará em status de limpeza.',
      'completed': 'Finalizar esta hospedagem? O quarto ficará disponível novamente.',
      'cancelled': 'Tem certeza que deseja CANCELAR esta hospedagem? Esta ação não pode ser desfeita e a hospedagem não será mais contabilizada no dashboard.',
    };
    return messages[status as keyof typeof messages] || 'Confirmar alteração?';
  };

  const getSuccessMessage = (status: Booking['status']) => {
    const messages = {
      'checked-in': 'Check-In realizado com sucesso!',
      'checked-out': 'Check-Out realizado com sucesso!',
      'completed': 'Hospedagem finalizada com sucesso!',
      'cancelled': 'Hospedagem cancelada com sucesso!',
    };
    return messages[status as keyof typeof messages] || 'Status atualizado!';
  };

  const canDoCheckIn = () => {
    return booking.status === 'confirmed';
  };

  const canDoCheckOut = () => {
    return booking.status === 'checked-in';
  };

  const canComplete = () => {
    return booking.status === 'checked-out';
  };

  const canCancel = () => {
    return booking.status === 'confirmed' || booking.status === 'checked-in';
  };

  const handleCompleteBooking = () => {
    // Abrir modal de consumíveis antes de finalizar
    setShowConsumablesModal(true);
  };

  const handleConsumablesConfirm = async (
    consumables: { id: string; quantity: number; price: number }[],
    consumablesTotal: number
  ) => {
    try {
      setIsProcessing(true);
      setShowConsumablesModal(false);


      // Atualizar estoque dos consumíveis
      for (const item of consumables) {
        const consumable = await consumablesApi.getById(item.id);
        const newStock = Number(consumable.stock) - item.quantity;
        
        await consumablesApi.update(item.id, {
          ...consumable,
          stock: newStock,
        });
      }

      // Atualizar valor total da reserva (incluindo consumíveis)
      const newTotalAmount = booking.totalAmount + consumablesTotal;

      // Atualizar status da reserva para completed
      const apiData = {
        guest_id: booking.guestId,
        room_id: booking.roomId,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        status: 'completed' as const,
        total_amount: newTotalAmount,
        guests_count: booking.guests,
        special_requests: booking.specialRequests,
        payment_method: booking.paymentMethod,
        consumables_cost: consumablesTotal,
      };

      await bookingsApi.update(booking.id, apiData);

      // Atualizar status do quarto para limpeza
      if (booking.roomId) {
        const quartoCompleto = await roomsApi.getById(booking.roomId);
        
        const roomData = {
          number: quartoCompleto.number,
          type: quartoCompleto.type,
          status: 'cleaning' as const,
          price: Number(quartoCompleto.price),
          capacity: Number(quartoCompleto.capacity),
          amenities: quartoCompleto.amenities || [],
          consumables: quartoCompleto.consumables || [],
          description: quartoCompleto.description || ''
        };
        
        await roomsApi.update(booking.roomId, roomData);
      }

      alert('Hospedagem finalizada com sucesso!');
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Erro ao finalizar hospedagem:', error);
      alert('Erro ao finalizar hospedagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm(getConfirmationMessage('cancelled'))) {
      return;
    }

    try {
      setIsProcessing(true);

      // Atualizar status da reserva para cancelada
      const apiData = {
        guest_id: booking.guestId,
        room_id: booking.roomId,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        status: 'cancelled' as const,
        total_amount: booking.totalAmount,
        guests_count: booking.guests,
        special_requests: booking.specialRequests,
        payment_method: booking.paymentMethod,
      };

      await bookingsApi.update(booking.id, apiData);

      // Se o quarto estava ocupado, liberar para disponível
      if (booking.status === 'checked-in' && booking.roomId) {
        const quartoCompleto = await roomsApi.getById(booking.roomId);
        
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
        
        await roomsApi.update(booking.roomId, roomData);
      }

      alert(getSuccessMessage('cancelled'));
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Erro ao cancelar hospedagem:', error);
      alert('Erro ao cancelar hospedagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fields: EntityField[] = [
    {
      icon: User,
      label: 'Hóspede',
      value: booking.guest?.name || `ID: ${booking.guestId}`,
    },
    {
      icon: DoorOpen,
      label: 'Quarto',
      value: booking.room?.number || `ID: ${booking.roomId}`,
    },
    {
      icon: Calendar,
      label: 'Check-In',
      value: formatDate(booking.checkIn),
    },
    {
      icon: Calendar,
      label: 'Check-Out',
      value: formatDate(booking.checkOut),
    },
    {
      icon: AlertCircle,
      label: 'Status',
      value: (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      ),
    },
    {
      icon: CreditCard,
      label: 'Valor Total',
      value: `Kz ${booking.totalAmount.toFixed(2).replace('.', ',')}`,
    },
    {
      icon: Users,
      label: 'Número de Hóspedes',
      value: booking.guests.toString(),
    },
  ];

  if (booking.specialRequests) {
    fields.push({
      icon: FileText,
      label: 'Solicitações Especiais',
      value: booking.specialRequests,
    });
  }

  // Calcular custos separados
  const consumablesCost = booking.consumablesCost || 0;
  const roomCost = booking.totalAmount - consumablesCost;
  
  // Formatar data e hora
  const formatDateTime = (date: Date) => {
    const dateStr = new Date(date).toLocaleDateString('pt-AO', { timeZone: 'Africa/Luanda' });
    const timeStr = new Date(date).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Luanda' });
    return { date: dateStr, time: timeStr };
  };

  return (
    <div>
      <EntityDetails
        title={`Reserva #${booking.id.slice(0, 8)}`}
        subtitle={`${booking.guest?.name || 'Hóspede'} - ${booking.room?.number || 'Quarto'}`}
        avatarIcon={Calendar}
        fields={fields}
        createdAt={booking.createdAt}
        updatedAt={booking.updatedAt}
        onEdit={onEdit && booking.status !== 'completed' && booking.status !== 'cancelled' ? () => onEdit(booking) : undefined}
      />

      {/* Histórico de Custos */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Custos</h3>
        <div className="space-y-3">
          {/* Custo do Quarto (Check-in/Reserva) - SEMPRE EXIBIDO */}
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">
                  {booking.status === 'confirmed' ? 'Reserva' : 'Check-in'}
                </p>
                <p className="text-sm text-gray-600">
                  Custo com Quarto
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  Kz {roomCost.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(booking.createdAt).date} às {formatDateTime(booking.createdAt).time}
                </p>
              </div>
            </div>
          </div>

          {/* Custo com Consumíveis - SEGUNDA ENTRADA SEPARADA (se houver) */}
          {consumablesCost > 0 && (
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">
                    Hospedagem Finalizada
                  </p>
                  <p className="text-sm text-gray-600">
                    Custo com Consumíveis
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Kz {consumablesCost.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(booking.updatedAt).date} às {formatDateTime(booking.updatedAt).time}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação de Status */}
      {(canDoCheckIn() || canDoCheckOut() || canComplete() || canCancel()) && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Status</h3>
          <div className="flex flex-wrap gap-3">
            {canDoCheckIn() && (
              <Button
                onClick={() => handleStatusTransition('checked-in', 'occupied')}
                disabled={isProcessing}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '180px' }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Fazer Check-In
              </Button>
            )}

            {canDoCheckOut() && (
              <Button
                onClick={() => handleStatusTransition('checked-out', 'cleaning')}
                disabled={isProcessing}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '180px' }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Fazer Check-Out
              </Button>
            )}

            {canComplete() && (
              <Button
                onClick={handleCompleteBooking}
                disabled={isProcessing}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '200px' }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Hospedagem
              </Button>
            )}

            {canCancel() && (
              <Button
                onClick={handleCancelBooking}
                disabled={isProcessing}
                variant="secondary"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '200px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar Hospedagem
              </Button>
            )}
          </div>
          {isProcessing && (
            <p className="text-sm text-gray-500 mt-3">Processando...</p>
          )}
        </div>
      )}

      {/* Modal de Consumíveis */}
      <ConsumablesCheckoutModal
        isOpen={showConsumablesModal}
        onClose={() => setShowConsumablesModal(false)}
        onConfirm={handleConsumablesConfirm}
        roomConsumableIds={roomConsumables}
      />
    </div>
  );
};

export default BookingDetails;
