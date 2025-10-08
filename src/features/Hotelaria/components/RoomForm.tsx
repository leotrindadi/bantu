import React, { useState, useEffect } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Modal from '@components/ui/Modal';
import ConsumivelSelector from './ConsumivelSelector';
import { Home, Layers, Bed, Star, Users, DollarSign, FileText, Package } from 'lucide-react';
import { Room } from '../types';

interface Consumivel {
  id: string;
  nome: string;
  categoria: string;
}

interface RoomFormProps {
  initialData?: Room | null;
  consumiveis: Consumivel[];
  onSubmit: (roomData: Partial<Room>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({
  initialData,
  consumiveis,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [showConsumivelSelector, setShowConsumivelSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    number: '',
    floor: '',
    bedType: 'casal',
    type: 'single' as Room['type'],
    status: 'available' as Room['status'],
    capacity: '1',
    price: '',
    description: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedConsumables, setSelectedConsumables] = useState<string[]>([]);

  // Preencher formulário quando houver dados iniciais (modo edição)
  useEffect(() => {
    if (initialData) {
      // Extrair andar do número do quarto
      const floor = Math.floor(parseInt(initialData.number) / 100);
      
      setFormData({
        number: initialData.number,
        floor: floor.toString() || '',
        bedType: 'casal', // valor padrão
        type: initialData.type,
        status: initialData.status,
        capacity: initialData.capacity.toString(),
        price: initialData.price.toString(),
        description: initialData.description || '',
      });
      setSelectedAmenities(initialData.amenities || []);
      setSelectedConsumables(initialData.consumables || []);
    }
  }, [initialData]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleConsumivelConfirm = (selectedIds: string[]) => {
    console.log('Consumíveis confirmados:', selectedIds);
    setSelectedConsumables(selectedIds);
    setShowConsumivelSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('RoomForm - handleSubmit chamado');
    console.log('RoomForm - selectedConsumables:', selectedConsumables);

    // Validação
    if (!formData.number || !formData.floor || !formData.price) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      alert('O preço deve ser maior que zero.');
      return;
    }

    if (parseInt(formData.capacity) < 1) {
      alert('A capacidade deve ser pelo menos 1.');
      return;
    }

    // Converter dados para o formato correto
    const submitData = {
      number: formData.number,
      floor: parseInt(formData.floor),
      bedType: formData.bedType,
      type: formData.type,
      status: formData.status,
      capacity: parseInt(formData.capacity),
      price: parseFloat(formData.price),
      amenities: selectedAmenities,
      consumables: selectedConsumables,
      description: formData.description,
    };

    console.log('RoomForm - submitData:', submitData);
    onSubmit(submitData);
  };

  const getSelectedConsumiveisNames = () => {
    return consumiveis
      .filter(c => selectedConsumables.includes(c.id))
      .map(c => c.nome);
  };

  const amenitiesList = [
    'WiFi',
    'TV',
    'Ar Condicionado',
    'Frigobar',
    'Cofre',
    'Banheira',
    'Vista para o Mar',
    'Varanda',
    'Secador de Cabelo',
  ];

  return (
    <>
      {/* Modal Secundário de Consumíveis */}
      <Modal
        isOpen={showConsumivelSelector}
        onClose={() => setShowConsumivelSelector(false)}
        title="Selecionar Consumíveis do Quarto"
        size="md"
      >
        <ConsumivelSelector
          consumiveis={consumiveis}
          selectedIds={selectedConsumables}
          onConfirm={handleConsumivelConfirm}
          onCancel={() => setShowConsumivelSelector(false)}
        />
      </Modal>

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Número, Andar e Tipo de Cama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Home className="inline w-4 h-4 mr-1" />
              Número *
            </label>
            <Input
              type="text"
              value={formData.number}
              onChange={(e) => handleFormChange('number', e.target.value)}
              placeholder="Ex: 101"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Layers className="inline w-4 h-4 mr-1" />
              Andar *
            </label>
            <Input
              type="number"
              min="0"
              value={formData.floor}
              onChange={(e) => handleFormChange('floor', e.target.value)}
              placeholder="Ex: 1"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Bed className="inline w-4 h-4 mr-1" />
              Tipo de Cama *
            </label>
            <select
              value={formData.bedType}
              onChange={(e) => handleFormChange('bedType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="solteiro">Solteiro</option>
              <option value="casal">Casal</option>
              <option value="queen">Queen</option>
              <option value="king">King</option>
            </select>
          </div>
        </div>

        {/* Nível, Capacidade e Preço */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Star className="inline w-4 h-4 mr-1" />
              Nível *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleFormChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="single">Simples</option>
              <option value="double">Duplo</option>
              <option value="suite">Suíte</option>
              <option value="deluxe">Luxo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline w-4 h-4 mr-1" />
              Capacidade *
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.capacity}
              onChange={(e) => handleFormChange('capacity', e.target.value)}
              placeholder="1"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Preço/Noite (Kz) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleFormChange('price', e.target.value)}
              placeholder="0.00"
              className="w-full"
              required
            />
          </div>
        </div>

        {/* Comodidades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comodidades
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {amenitiesList.map(amenity => (
              <label
                key={amenity}
                className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Consumíveis Disponíveis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="inline w-4 h-4 mr-1" />
            Consumíveis Disponíveis no Quarto
          </label>
          <div className="border rounded-lg p-4 bg-gray-50">
            {selectedConsumables.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Nenhum consumível selecionado</p>
              </div>
            ) : (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  {selectedConsumables.length} {selectedConsumables.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedConsumiveisNames().map((nome, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {nome}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConsumivelSelector(true)}
              className="w-full"
            >
              Selecionar Consumíveis
            </Button>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            placeholder="Descrição do quarto (opcional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading
              ? 'Salvando...'
              : initialData
              ? 'Atualizar'
              : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RoomForm;
