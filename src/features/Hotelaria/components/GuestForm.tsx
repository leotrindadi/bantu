import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { User, Globe, Mail, Phone, FileText, MapPin } from 'lucide-react';

interface GuestFormProps {
  initialData?: Guest | null;
  onSubmit: (guestData: Partial<Guest>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const GuestForm: React.FC<GuestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    nationality: 'Angolano',
    address: '',
  });

  // Preencher formulário quando houver dados iniciais (modo edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        document: initialData.document,
        nationality: initialData.nationality,
        address: initialData.address || '',
      });
    }
  }, [initialData]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.name || !formData.email || !formData.phone || !formData.document) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <User className="inline w-4 h-4 mr-1" />
          Nome Completo *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleFormChange('name', e.target.value)}
          placeholder="Nome do Hóspede"
          className="w-full"
          required
        />
      </div>

      {/* Email e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline w-4 h-4 mr-1" />
            E-mail *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            placeholder="exemplo@gmail.com"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="inline w-4 h-4 mr-1" />
            Telefone *
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            placeholder="+244 XXX XXX XXX"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Documento e Nacionalidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Documento *
          </label>
          <Input
            type="text"
            value={formData.document}
            onChange={(e) => handleFormChange('document', e.target.value)}
            placeholder="NIF/Passaporte"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="inline w-4 h-4 mr-1" />
            Nacionalidade *
          </label>
          <div className="relative">
            <select
              value={formData.nationality}
              onChange={(e) => handleFormChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              required
            >
              <option value="Angolano">Angolano</option>
              <option value="Americano">Americano</option>
              <option value="Argentino">Argentino</option>
              <option value="Brasileiro">Brasileiro</option>
              <option value="Canadense">Canadense</option>
              <option value="Espanhol">Espanhol</option>
              <option value="Francês">Francês</option>
              <option value="Inglês">Inglês</option>
              <option value="Italiano">Italiano</option>
              <option value="Alemão">Alemão</option>
              <option value="Japonês">Japonês</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          Endereço
        </label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => handleFormChange('address', e.target.value)}
          placeholder="Opcional"
          className="w-full"
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
  );
};

export default GuestForm;
