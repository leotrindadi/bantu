import React, { useState } from 'react';
import { Booking, Room, Guest } from '../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface BookingFormProps {
  rooms?: Room[];
  guests?: Guest[];
  initialData?: Partial<Booking>;
  onSubmit: (bookingData: Partial<Booking>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  rooms = [],
  guests = [],
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const getRoomTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'single': 'Solteiro',
      'double': 'Casal',
      'suite': 'Suíte',
      'deluxe': 'Luxo',
    };
    return types[type] || type;
  };

  const [formData, setFormData] = useState<Partial<Booking>>({
    guestId: initialData?.guestId || '',
    roomId: initialData?.roomId || '',
    checkIn: initialData?.checkIn || new Date(),
    checkOut: initialData?.checkOut || new Date(),
    guests: initialData?.guests || 1,
    specialRequests: initialData?.specialRequests || '',
    ...initialData,
  });

  const handleInputChange = (field: keyof Booking, value: string | number | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.guestId || !formData.roomId) {
      alert('Por favor, selecione um hóspede e um quarto.');
      return;
    }
    
    if (!formData.checkIn || !formData.checkOut) {
      alert('Por favor, selecione as datas de check-in e check-out.');
      return;
    }
    
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      alert('A data de check-out deve ser posterior à data de check-in.');
      return;
    }
    
    if (!formData.guests || formData.guests < 1) {
      alert('O número de hóspedes deve ser pelo menos 1.');
      return;
    }
    
    // Incluir o totalAmount calculado
    onSubmit({
      ...formData,
      totalAmount
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedRoom = rooms.find((room) => room.id === formData.roomId);
  const totalAmount = selectedRoom
    ? selectedRoom.price *
      Math.ceil(
        (new Date(formData.checkOut!).getTime() -
          new Date(formData.checkIn!).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos de Reserva */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hóspede
          </label>
          <select
            value={formData.guestId}
            onChange={(e) => handleInputChange('guestId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione um hóspede</option>
            {guests?.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.name} - {guest.document}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quarto
          </label>
          <select
            value={formData.roomId}
            onChange={(e) => handleInputChange('roomId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione um quarto</option>
            {rooms
              .filter((room) => room.status === 'available')
              .map((room) => (
                <option key={room.id} value={room.id}>
                  Quarto {room.number} - {getRoomTypeLabel(room.type)} (Kz {room.price}/noite)
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <Input
            type="date"
            value={formatDateForInput(new Date(formData.checkIn!))}
            onChange={(e) =>
              handleInputChange('checkIn', new Date(e.target.value))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <Input
            type="date"
            value={formatDateForInput(new Date(formData.checkOut!))}
            onChange={(e) =>
              handleInputChange('checkOut', new Date(e.target.value))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Hóspedes
          </label>
          <Input
            type="number"
            min="1"
            max={selectedRoom?.capacity || 10}
            value={formData.guests?.toString()}
            onChange={(e) =>
              handleInputChange('guests', parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Total
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 pointer-events-none">
            Kz {Number(totalAmount).toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Solicitações Especiais
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) =>
            handleInputChange('specialRequests', e.target.value)
          }
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descreva qualquer solicitação especial..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading
            ? 'Salvando...'
            : initialData?.id
            ? 'Atualizar Hospedagem'
            : 'Criar Hospedagem'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
