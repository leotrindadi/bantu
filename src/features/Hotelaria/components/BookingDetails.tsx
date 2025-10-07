import React, { useState } from 'react';
import { Booking } from '../types';
import { formatDate } from '../../../lib/formatDate';
import { Calendar, User, DoorOpen, CreditCard, Users, FileText, AlertCircle, LogIn, LogOut, CheckCircle } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';
import Button from '@components/ui/Button';
import { bookingsApi } from '../../../services/api/bookings';
import { roomsApi } from '../../../services/api/rooms';

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
    'confirmed': 'text-blue-600 bg-blue-100',
    'checked-in': 'text-green-600 bg-green-100',
    'checked-out': 'text-yellow-600 bg-yellow-100',
    'completed': 'text-purple-600 bg-purple-100',
    'cancelled': 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onEdit, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);

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
    };
    return messages[status as keyof typeof messages] || 'Confirmar alteração?';
  };

  const getSuccessMessage = (status: Booking['status']) => {
    const messages = {
      'checked-in': 'Check-In realizado com sucesso!',
      'checked-out': 'Check-Out realizado com sucesso!',
      'completed': 'Hospedagem finalizada com sucesso!',
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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
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

      {/* Botões de Ação de Status */}
      {(canDoCheckIn() || canDoCheckOut() || canComplete()) && (
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
                onClick={() => handleStatusTransition('completed', 'cleaning')}
                disabled={isProcessing}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '200px' }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Hospedagem
              </Button>
            )}
          </div>
          {isProcessing && (
            <p className="text-sm text-gray-500 mt-3">Processando...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
