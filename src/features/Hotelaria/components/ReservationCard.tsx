import React from 'react';
import { Booking, Room, Guest } from '../types';
import { Calendar, User, CreditCard, Eye, Edit2, Trash2 } from 'lucide-react';

interface ReservationCardProps {
  reservation: Booking & { room?: Room; guest?: Guest };
  onViewDetails?: (reservation: Booking) => void;
  onEdit?: (reservation: Booking) => void;
  onCancel?: (reservation: Booking) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onEdit,
  onCancel,
}) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'checked-in':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'checked-out':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Reserva';
      case 'checked-in':
        return 'Check-In';
      case 'checked-out':
        return 'Check-Out';
      case 'completed':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '--/--/----';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method) return 'Não informado';
    const methods: Record<string, string> = {
      'dinheiro': 'Dinheiro',
      'cartao-credito': 'Cartão de Crédito',
      'cartao-debito': 'Cartão de Débito',
      'pix': 'PIX',
      'transferencia': 'Transferência',
    };
    return methods[method] || method;
  };

  return (
    <div className="bg-white rounded-lg border border-transparent p-6 transition-all duration-200 ease-in-out hover:border-blue-500 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {reservation.guest?.name || 'Hóspede não informado'}
          </h3>
          <p className="text-gray-600">
            Quarto {reservation.room?.number || '--'}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
            reservation.status
          )}`}
        >
          {getStatusText(reservation.status)}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-gray-600">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="text-sm">
            {reservation.guests} {reservation.guests === 1 ? 'hóspede' : 'hóspedes'}
          </span>
        </div>
        {reservation.paymentMethod && (
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">{formatPaymentMethod(reservation.paymentMethod)}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Período:</p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
            <Calendar className="w-3 h-3" />
            <span>Check-in: {formatDate(reservation.checkIn)}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
            <Calendar className="w-3 h-3" />
            <span>Check-out: {formatDate(reservation.checkOut)}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 invisible">
        Espaço reservado
      </p>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(reservation.totalAmount)}
          </span>
          <span className="text-gray-600 text-sm">/total</span>
        </div>
        <div className="flex items-center space-x-3">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(reservation)}
              className="text-blue-600 hover:text-blue-900"
              title="Visualizar"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
          {onEdit && reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
            <button
              onClick={() => onEdit(reservation)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Editar"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
          {onCancel && reservation.status !== 'completed' && (
            <button
              onClick={() => onCancel(reservation)}
              className="text-red-600 hover:text-red-900"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
