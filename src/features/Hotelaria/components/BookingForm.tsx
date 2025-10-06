import React, { useState, useEffect } from 'react';
import { Booking, Room, Guest } from '../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { User, Globe } from 'lucide-react';

interface BookingFormProps {
  rooms?: Room[];
  guests?: Guest[];
  initialData?: Partial<Booking>;
  onSubmit: (bookingData: Partial<Booking>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface NewGuestFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  nationality: string;
  address: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  rooms = [],
  guests = [],
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [showNewGuestForm, setShowNewGuestForm] = useState(false);
  const [newGuest, setNewGuest] = useState<NewGuestFormData>({
    name: '',
    email: '',
    phone: '',
    document: '',
    nationality: 'Brasileiro',
    address: ''
  });

  const [formData, setFormData] = useState<Partial<Booking>>({
    guestId: initialData?.guestId || '',
    roomId: initialData?.roomId || '',
    checkIn: initialData?.checkIn || new Date(),
    checkOut: initialData?.checkOut || new Date(),
    guests: initialData?.guests || 1,
    specialRequests: initialData?.specialRequests || '',
    ...initialData,
  });

  // Se não houver hóspedes cadastrados, mostra o formulário de novo hóspede
  useEffect(() => {
    if (guests?.length === 0) {
      setShowNewGuestForm(true);
    }
  }, [guests]);

  const handleInputChange = (field: keyof Booking, value: string | number | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewGuestChange = (field: keyof NewGuestFormData, value: string) => {
    setNewGuest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNewGuest = () => {
    // Validação básica
    if (!newGuest.name || !newGuest.email || !newGuest.phone || !newGuest.document) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Aqui você normalmente faria uma chamada para a API para criar o hóspede
    // Por enquanto, vamos simular um ID e adicionar à lista de hóspedes
    const newGuestId = `guest-${Date.now()}`;
    const createdGuest: Guest = {
      id: newGuestId,
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      document: newGuest.document,
      nationality: newGuest.nationality,
      address: newGuest.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Adiciona o novo hóspede à lista e seleciona-o
    guests = [...(guests || []), createdGuest];
    setFormData(prev => ({
      ...prev,
      guestId: newGuestId
    }));
    
    // Limpa o formulário de novo hóspede
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      document: '',
      nationality: 'Brasileiro',
      address: ''
    });
    
    setShowNewGuestForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se estiver mostrando o formulário de novo hóspede, tenta adicionar o hóspede
    if (showNewGuestForm) {
      handleAddNewGuest();
      return;
    }
    
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
        {/* Seção de Novo Hóspede - Largura Total */}
        {showNewGuestForm && (
          <div className="space-y-4 p-6 rounded-lg border-2 border-gray-300">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-base text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Cadastrar Novo Hóspede
              </h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <Input
                type="text"
                value={newGuest.name}
                onChange={(e) => handleNewGuestChange('name', e.target.value)}
                placeholder="Nome do hóspede"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <Input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => handleNewGuestChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <Input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => handleNewGuestChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento *
                </label>
                <Input
                  type="text"
                  value={newGuest.document}
                  onChange={(e) => handleNewGuestChange('document', e.target.value)}
                  placeholder="CPF/Passaporte"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidade *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={newGuest.nationality}
                    onChange={(e) => handleNewGuestChange('nationality', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Brasileiro">Brasileiro</option>
                    <option value="Estrangeiro">Estrangeiro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNewGuestForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleAddNewGuest}
              >
                Salvar Hospedagem
              </Button>
            </div>
          </div>
        )}

        {/* Campos de Reserva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!showNewGuestForm && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hóspede
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewGuestForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <User className="w-4 h-4 mr-1" />
                  Novo Hóspede
                </button>
              </div>
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
          )}

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
                    Quarto {room.number} - {room.type} (R$ {room.price}/noite)
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
              R$ {Number(totalAmount).toFixed(2)}
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
              : showNewGuestForm
              ? 'Salvar Hóspede'
              : initialData?.id
              ? 'Atualizar Hospedagem'
              : 'Criar Hospedagem'}
          </Button>
        </div>
      </form>
  );
};

export default BookingForm;