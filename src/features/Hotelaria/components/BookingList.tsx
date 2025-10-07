import React from 'react';
import { Booking } from '../types';
import { formatDate } from '../../../lib/formatDate';
import { Calendar, User, MapPin, Clock } from 'lucide-react';

interface BookingListProps {
  bookings: Booking[];
  onViewDetails?: (booking: Booking) => void;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, onViewDetails }) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Reserva';
      case 'checked-in':
        return 'Check-in';
      case 'checked-out':
        return 'Check-out';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma reserva encontrada
        </h3>
        <p className="text-gray-600">
          Não há reservas para exibir no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onViewDetails?.(booking)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reserva #{booking.id.slice(-8)}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <User className="w-4 h-4" />
                <span>{booking.guest?.name || 'Hóspede não informado'}</span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusText(booking.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Quarto</p>
                <p className="text-sm">
                  {booking.room?.number || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-sm">{formatDate(booking.checkIn)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Check-out</p>
                <p className="text-sm">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <span className="text-sm">
                {booking.guests} {booking.guests === 1 ? 'hóspede' : 'hóspedes'}
              </span>
              {booking.specialRequests && (
                <span className="text-sm ml-4">• Solicitações especiais</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                Kz {Number(booking.totalAmount).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;