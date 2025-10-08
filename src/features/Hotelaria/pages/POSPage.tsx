import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Bed, Calendar, User, DollarSign, Search, Filter as FilterIcon, CreditCard, Banknote } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { roomsApi } from '../../../services/api/rooms';
import { guestsApi } from '../../../services/api/guests';
import { bookingsApi } from '../../../services/api/bookings';
import { Room, Guest } from '../types';

type StatusQuarto = 'disponivel' | 'ocupado' | 'limpeza' | 'manutencao';
type TipoQuarto = 'standard' | 'deluxe' | 'suite';

interface Quarto {
  id: string;
  numero: string;
  tipo: TipoQuarto;
  status: StatusQuarto;
  preco: number;
  capacidade: number;
  andar: number;
}

interface ReservaForm {
  quarto: Quarto | null;
  checkIn: string;
  checkOut: string;
  hospede: string;
  documento: string;
  telefone: string;
  email: string;
  nacionalidade: string;
}

const POSPage: React.FC = () => {
  const [selectedQuarto, setSelectedQuarto] = useState<Quarto | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<StatusQuarto | 'all'>('disponivel');
  const [filtroTipo, setFiltroTipo] = useState<TipoQuarto | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipoHospedagem, setTipoHospedagem] = useState<'reserva' | 'check-in'>('check-in');
  const [hospedes, setHospedes] = useState<Guest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredHospedes, setFilteredHospedes] = useState<Guest[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ReservaForm>({
    quarto: null,
    checkIn: '',
    checkOut: '',
    hospede: '',
    documento: '',
    telefone: '',
    email: '',
    nacionalidade: 'Angolano',
  });

  // Carregar quartos e hóspedes da API
  useEffect(() => {
    loadQuartos();
    loadHospedes();
  }, []);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para mapear tipos do banco de dados para tipos locais
  const mapStatusFromDB = (status: Room['status']): StatusQuarto => {
    const statusMap: Record<Room['status'], StatusQuarto> = {
      'available': 'disponivel',
      'occupied': 'ocupado',
      'cleaning': 'limpeza',
      'cleaning-in-progress': 'limpeza',
      'maintenance': 'manutencao',
    };
    return statusMap[status];
  };

  const mapTipoFromDB = (tipo: Room['type']): TipoQuarto => {
    const tipoMap: Record<Room['type'], TipoQuarto> = {
      'single': 'standard',
      'double': 'standard',
      'suite': 'suite',
      'deluxe': 'deluxe',
    };
    return tipoMap[tipo];
  };

  const loadQuartos = async () => {
    try {
      setIsLoading(true);
      const roomsData = await roomsApi.getAll();
      
      // Mapear dados do banco para o formato local
      const mappedQuartos: Quarto[] = roomsData.map((room: Room) => {
        // Extrair o andar do número do quarto (ex: "101" -> andar 1)
        const andar = Math.floor(parseInt(room.number) / 100);
        
        return {
          id: room.id,
          numero: room.number,
          tipo: mapTipoFromDB(room.type),
          status: mapStatusFromDB(room.status),
          preco: Number(room.price),
          capacidade: Number(room.capacity),
          andar: andar,
        };
      });
      
      setQuartos(mappedQuartos);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      alert('Erro ao carregar quartos. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHospedes = async () => {
    try {
      const guestsData = await guestsApi.getAll();
      setHospedes(guestsData);
    } catch (error) {
      console.error('Erro ao carregar hóspedes:', error);
    }
  };

  // Filtrar quartos
  const filteredQuartos = useMemo(() => {
    return quartos.filter((quarto) => {
      const matchesSearch = quarto.numero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filtroStatus === 'all' || quarto.status === filtroStatus;
      const matchesTipo = filtroTipo === 'all' || quarto.tipo === filtroTipo;
      
      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [quartos, searchTerm, filtroStatus, filtroTipo]);

  // Calcular dias de estadia
  const calcularDias = (): number => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Calcular total
  const calcularTotal = (): number => {
    if (!selectedQuarto) return 0;
    const dias = calcularDias();
    return dias * selectedQuarto.preco;
  };

  // Selecionar quarto
  const handleSelectQuarto = (quarto: Quarto) => {
    if (quarto.status !== 'disponivel') return;
    
    setSelectedQuarto(quarto);
    setFormData({
      ...formData,
      quarto: quarto,
    });
  };

  // Atualizar campo do formulário
  const handleFormChange = (field: keyof ReservaForm, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Filtrar hóspedes quando o campo nome é alterado
    if (field === 'hospede' && value.length > 0) {
      const filtered = hospedes
        .filter(h => h.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredHospedes(filtered);
      setShowSuggestions(filtered.length > 0);
    } else if (field === 'hospede') {
      setShowSuggestions(false);
    }
  };

  // Selecionar hóspede do autocomplete
  const handleSelectHospede = (hospede: Guest) => {
    setFormData({
      ...formData,
      hospede: hospede.name,
      documento: hospede.document,
      telefone: hospede.phone,
      email: hospede.email,
      nacionalidade: hospede.nationality || 'Angolano',
    });
    setShowSuggestions(false);
  };

  // Buscar ou criar hóspede
  const findOrCreateGuest = async (): Promise<string> => {
    // Primeiro, tentar encontrar hóspede existente pelo documento
    const existingGuest = hospedes.find(
      h => h.document.toLowerCase() === formData.documento.toLowerCase()
    );

    if (existingGuest) {
      return existingGuest.id;
    }

    // Se não encontrar, criar novo hóspede
    try {
      const newGuest = await guestsApi.create({
        name: formData.hospede,
        document: formData.documento,
        phone: formData.telefone || '',
        email: formData.email || '',
        nationality: formData.nacionalidade || 'Angolano',
      });

      // Atualizar lista local de hóspedes
      setHospedes([...hospedes, newGuest]);
      
      return newGuest.id;
    } catch (error) {
      console.error('Erro ao criar hóspede:', error);
      throw new Error('Não foi possível criar o hóspede');
    }
  };

  // Confirmar reserva
  const handleConfirmarReserva = async () => {
    // Validações
    if (!selectedQuarto) {
      alert('Selecione um quarto');
      return;
    }
    
    if (!formData.checkIn || !formData.checkOut) {
      alert('Informe as datas de check-in e check-out');
      return;
    }
    
    if (!formData.hospede || !formData.documento) {
      alert('Informe os dados do hóspede');
      return;
    }
    
    if (!formaPagamento) {
      alert('Selecione uma forma de pagamento');
      return;
    }
    
    const dias = calcularDias();
    if (dias <= 0) {
      alert('Data de check-out deve ser posterior ao check-in');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Passo 1: Buscar ou criar hóspede
      const guestId = await findOrCreateGuest();

      // Passo 2: Preparar dados para a API
      const total = calcularTotal();
      
      // Mapear tipo de hospedagem para status da booking
      const bookingStatus: 'checked-in' | 'confirmed' = tipoHospedagem === 'check-in' ? 'checked-in' : 'confirmed';
      
      // Preparar dados no formato da API (snake_case)
      const apiData = {
        guest_id: guestId,
        room_id: selectedQuarto.id,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        status: bookingStatus,
        total_amount: total,
        guests_count: selectedQuarto.capacidade,
        special_requests: '', // Deixar vazio ou null
        payment_method: formaPagamento,
      };

      // Passo 3: Criar booking na API
      const newBooking = await bookingsApi.create(apiData);
      console.log('Booking criada com sucesso:', newBooking);

      // Passo 4: Atualizar status do quarto se for check-in
      if (tipoHospedagem === 'check-in') {
        const quartoCompleto = await roomsApi.getById(selectedQuarto.id);
        
        // Converter dados do backend (pode vir em snake_case ou camelCase)
        const roomData = {
          number: quartoCompleto.number,
          type: quartoCompleto.type,
          status: 'occupied' as const,
          price: Number(quartoCompleto.price),
          capacity: Number(quartoCompleto.capacity),
          amenities: quartoCompleto.amenities || [],
          consumables: quartoCompleto.consumables || [],
          description: quartoCompleto.description || ''
        };
        
        await roomsApi.update(selectedQuarto.id, roomData);
      }

      // Passo 7: Recarregar dados do POS
      await loadQuartos();
      await loadHospedes();

      alert(`${tipoHospedagem === 'check-in' ? 'Check-In' : 'Reserva'} confirmada com sucesso!`);
      handleLimpar();
    } catch (error) {
      console.error('Erro ao processar hospedagem:', error);
      alert('Erro ao processar hospedagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpar formulário
  const handleLimpar = () => {
    setSelectedQuarto(null);
    setTipoHospedagem('check-in');
    setFormaPagamento('');
    setShowSuggestions(false);
    setFormData({
      quarto: null,
      checkIn: '',
      checkOut: '',
      hospede: '',
      documento: '',
      telefone: '',
      email: '',
      nacionalidade: 'Angolano',
    });
  };

  // Obter estilo por status
  const getStatusStyle = (status: StatusQuarto, isSelected: boolean): string => {
    const baseStyle = 'bg-white shadow-md';
    
    switch (status) {
      case 'disponivel':
        return `${baseStyle} border-gray-200 hover:border-blue-500 cursor-pointer ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''
        }`;
      case 'ocupado':
        return 'bg-red-50 border-red-200 cursor-not-allowed opacity-60';
      case 'limpeza':
        return 'bg-yellow-50 border-yellow-200 cursor-not-allowed opacity-60';
      case 'manutencao':
        return 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Obter label do status
  const getStatusLabel = (status: StatusQuarto): string => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'ocupado':
        return 'Ocupado';
      case 'limpeza':
        return 'Limpeza';
      case 'manutencao':
        return 'Manutenção';
      default:
        return status;
    }
  };

  // Obter label do tipo
  const getTipoLabel = (tipo: TipoQuarto): string => {
    switch (tipo) {
      case 'standard':
        return 'Standard';
      case 'deluxe':
        return 'Deluxe';
      case 'suite':
        return 'Suíte';
      default:
        return tipo;
    }
  };

  const dias = calcularDias();
  const total = calcularTotal();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">POS - Sistema de Hospedagens</h1>
        <p className="text-gray-600 mt-2">Selecione um quarto e crie uma nova hospedagem</p>
      </div>

      <div className="flex gap-6">
        {/* Coluna Esquerda - Grid de Quartos */}
        <div className="w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filtros e Busca */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por número do quarto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FilterIcon className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value as StatusQuarto | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="disponivel">Disponível</option>
                    <option value="ocupado">Ocupado</option>
                    <option value="limpeza">Limpeza</option>
                    <option value="manutencao">Manutenção</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value as TipoQuarto | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suíte</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de Quartos */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Carregando quartos...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {filteredQuartos.map((quarto) => (
                    <div
                      key={quarto.id}
                      onClick={() => handleSelectQuarto(quarto)}
                      className={`
                        relative p-4 border-2 rounded-lg transition-all
                        ${getStatusStyle(quarto.status, selectedQuarto?.id === quarto.id)}
                      `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Bed className="w-5 h-5 text-gray-700" />
                        <span className="text-xl font-bold text-gray-900">{quarto.numero}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">
                          {getTipoLabel(quarto.tipo)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {quarto.capacidade} pessoas
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          Kz {Number(quarto.preco).toFixed(2).replace('.', ',')}/dia
                        </div>
                        <div className={`text-xs font-medium mt-2 ${
                          quarto.status === 'disponivel' ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {getStatusLabel(quarto.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredQuartos.length === 0 && (
                  <div className="text-center py-12">
                    <Bed className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-700 mb-1">
                      Nenhum quarto encontrado
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tente ajustar os filtros ou termos de busca.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Coluna Direita - Formulário de Reserva */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhes da Hospedagem</h2>

            {!selectedQuarto ? (
              <div className="text-center py-12">
                <Bed className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Selecione um quarto para continuar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Informações do Quarto */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">Quarto {selectedQuarto.numero}</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>Tipo: <span className="font-medium">{getTipoLabel(selectedQuarto.tipo)}</span></div>
                    <div>Capacidade: <span className="font-medium">{selectedQuarto.capacidade} pessoas</span></div>
                    <div>Preço: <span className="font-medium">Kz {Number(selectedQuarto.preco).toFixed(2).replace('.', ',')}/dia</span></div>
                  </div>
                </div>

                {/* Tipo de Hospedagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Hospedagem
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTipoHospedagem('check-in')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        tipoHospedagem === 'check-in'
                          ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Check-In
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoHospedagem('reserva')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        tipoHospedagem === 'reserva'
                          ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Reserva
                    </button>
                  </div>
                </div>

                {/* Período da Reserva */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-in
                  </label>
                  <Input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleFormChange('checkIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-out
                  </label>
                  <Input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleFormChange('checkOut', e.target.value)}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                {dias > 0 && (
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                    Período: <span className="font-semibold">{dias} {dias === 1 ? 'dia' : 'dias'}</span>
                  </div>
                )}

                {/* Dados do Hóspede */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    <User className="inline w-4 h-4 mr-1" />
                    Dados do Hóspede
                  </h3>

                  <div className="space-y-3">
                    <div className="relative" ref={suggestionsRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <Input
                        type="text"
                        value={formData.hospede}
                        onChange={(e) => handleFormChange('hospede', e.target.value)}
                        placeholder="Nome do Hóspede"
                        className="w-full"
                        autoComplete="off"
                      />
                      
                      {/* Dropdown de Sugestões */}
                      {showSuggestions && filteredHospedes.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredHospedes.map((hospede) => (
                            <div
                              key={hospede.id}
                              onClick={() => handleSelectHospede(hospede)}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{hospede.name}</div>
                              <div className="text-xs text-gray-600">{hospede.document} • {hospede.phone}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento *
                      </label>
                      <Input
                        type="text"
                        value={formData.documento}
                        onChange={(e) => handleFormChange('documento', e.target.value)}
                        placeholder="BI/NIF"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <Input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleFormChange('telefone', e.target.value)}
                        placeholder="+244 XXX XXX XXX"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        placeholder="exemplo@gmail.com"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nacionalidade *
                      </label>
                      <select
                        value={formData.nacionalidade}
                        onChange={(e) => handleFormChange('nacionalidade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* Forma de Pagamento */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Forma de Pagamento
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="formaPagamento"
                        value="dinheiro"
                        checked={formaPagamento === 'dinheiro'}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        className="mr-3"
                      />
                      <Banknote className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Dinheiro</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="formaPagamento"
                        value="cartao-debito"
                        checked={formaPagamento === 'cartao-debito'}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        className="mr-3"
                      />
                      <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Cartão de Débito</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="formaPagamento"
                        value="cartao-credito"
                        checked={formaPagamento === 'cartao-credito'}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        className="mr-3"
                      />
                      <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Cartão de Crédito</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="formaPagamento"
                        value="transferencia"
                        checked={formaPagamento === 'transferencia'}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        className="mr-3"
                      />
                      <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Transferência Bancária</span>
                    </label>
                  </div>
                </div>

                {/* Resumo Financeiro */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Resumo Financeiro
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diária:</span>
                      <span className="font-medium">Kz {Number(selectedQuarto.preco).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantidade:</span>
                      <span className="font-medium">{dias} {dias === 1 ? 'dia' : 'dias'}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">Kz {Number(total).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handleConfirmarReserva}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processando...' : (tipoHospedagem === 'check-in' ? 'Confirmar Check-In' : 'Confirmar Reserva')}
                  </Button>
                  <Button
                    onClick={handleLimpar}
                    variant="secondary"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
