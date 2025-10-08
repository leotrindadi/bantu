import React, { useState, useEffect } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { User, Mail, Phone, FileText, Globe, MapPin, Briefcase } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  nacionalidade: string;
  funcao: string;
  endereco: string;
  imagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FuncionarioFormProps {
  initialData?: Funcionario | null;
  onSubmit: (funcionarioData: Partial<Funcionario>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    nacionalidade: 'Angolano',
    funcao: 'recepcionista',
    endereco: '',
  });

  const [showCustomFuncao, setShowCustomFuncao] = useState(false);
  const [customFuncao, setCustomFuncao] = useState('');
  const [customFuncaoOptions, setCustomFuncaoOptions] = useState<string[]>([]);

  // Funções padrão
  const funcoesPadrao = ['recepcionista', 'camareira', 'gerente', 'chef', 'porteiro', 'manobrista', 'seguranca'];

  // Preencher formulário quando houver dados iniciais (modo edição)
  useEffect(() => {
    if (initialData) {
      const isCustomFuncao = !funcoesPadrao.includes(initialData.funcao);
      
      setFormData({
        nome: initialData.nome,
        email: initialData.email,
        telefone: initialData.telefone,
        documento: initialData.documento,
        nacionalidade: initialData.nacionalidade,
        funcao: initialData.funcao,
        endereco: initialData.endereco,
      });
      
      // Se for função customizada, adicionar às opções
      if (isCustomFuncao) {
        setCustomFuncaoOptions([initialData.funcao]);
      }
    }
  }, [initialData]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Mostrar campo customizado se selecionar "Nova Função"
    if (field === 'funcao') {
      if (value === 'nova') {
        setShowCustomFuncao(true);
      } else {
        setShowCustomFuncao(false);
        setCustomFuncao('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.nome || !formData.email || !formData.telefone || !formData.documento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar função customizada
    if (formData.funcao === 'nova' && !customFuncao.trim()) {
      alert('Por favor, digite o nome da nova função.');
      return;
    }

    const submitData = {
      ...formData,
      funcao: formData.funcao === 'nova' ? customFuncao.trim().toLowerCase().replace(/\s+/g, '-') : formData.funcao,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Nome Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <User className="inline w-4 h-4 mr-1" />
          Nome Completo *
        </label>
        <Input
          type="text"
          value={formData.nome}
          onChange={(e) => handleFormChange('nome', e.target.value)}
          placeholder="Nome completo do funcionário"
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
            placeholder="email@hotel.com"
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
            value={formData.telefone}
            onChange={(e) => handleFormChange('telefone', e.target.value)}
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
            value={formData.documento}
            onChange={(e) => handleFormChange('documento', e.target.value)}
            placeholder="BI/NIF"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="inline w-4 h-4 mr-1" />
            Nacionalidade *
          </label>
          <select
            value={formData.nacionalidade}
            onChange={(e) => handleFormChange('nacionalidade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Função */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Briefcase className="inline w-4 h-4 mr-1" />
          Função *
        </label>
        <select
          value={formData.funcao}
          onChange={(e) => handleFormChange('funcao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="nova">Nova Função</option>
          {customFuncaoOptions.map(funcao => (
            <option key={funcao} value={funcao}>
              {funcao.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
          <option value="recepcionista">Recepcionista</option>
          <option value="camareira">Camareira</option>
          <option value="gerente">Gerente</option>
          <option value="chef">Chef</option>
          <option value="porteiro">Porteiro</option>
          <option value="manobrista">Manobrista</option>
          <option value="seguranca">Segurança</option>
        </select>
        
        {showCustomFuncao && (
          <input
            type="text"
            value={customFuncao}
            onChange={(e) => setCustomFuncao(e.target.value)}
            placeholder="Digite a nova função"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
            required
          />
        )}
      </div>

      {/* Endereço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          Endereço
        </label>
        <Input
          type="text"
          value={formData.endereco}
          onChange={(e) => handleFormChange('endereco', e.target.value)}
          placeholder="Endereço completo (opcional)"
          className="w-full"
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
  );
};

export default FuncionarioForm;
