import React, { useState, useEffect } from 'react';
import { Room, Employee, RoomCleaningLog } from '../types';
import { DoorOpen, Hash, Bed, CreditCard, Users, AlertCircle, List, FileText, Package, Sparkles, CheckCircle } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { cleaningLogsApi } from '../../../services/api/cleaning-logs';
import { employeesApi } from '../../../services/api/employees';

interface RoomDetailsProps {
  room: Room;
  onEdit?: (room: Room) => void;
  onStatusChange?: () => void;
}

const getTypeLabel = (type: Room['type']) => {
  const labels = {
    'single': 'Simples',
    'double': 'Casal',
    'suite': 'Suíte',
    'deluxe': 'Deluxe',
  };
  return labels[type] || type;
};

const getStatusLabel = (status: Room['status']) => {
  const labels = {
    'available': 'Disponível',
    'occupied': 'Ocupado',
    'maintenance': 'Manutenção',
    'cleaning': 'Limpeza',
    'cleaning-in-progress': 'Limpeza em Andamento',
  };
  return labels[status] || status;
};

const getStatusColor = (status: Room['status']) => {
  const colors = {
    'available': 'bg-green-50 text-green-700 border border-green-200',
    'occupied': 'bg-red-50 text-red-700 border border-red-200',
    'maintenance': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'cleaning': 'bg-blue-50 text-blue-700 border border-blue-200',
    'cleaning-in-progress': 'bg-orange-50 text-orange-700 border border-orange-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onEdit, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [cleaningNotes, setCleaningNotes] = useState('');
  const [activeCleaningLog, setActiveCleaningLog] = useState<RoomCleaningLog | null>(null);
  const [cleaningHistory, setCleaningHistory] = useState<RoomCleaningLog[]>([]);

  // Carregar funcionários e log de limpeza ativo
  useEffect(() => {
    if (room.status === 'cleaning') {
      loadEmployees();
    } else if (room.status === 'cleaning-in-progress') {
      loadActiveCleaningLog();
    }
    // Sempre carregar histórico
    loadCleaningHistory();
  }, [room.id, room.status]);

  const loadEmployees = async () => {
    try {
      const data = await employeesApi.getAll();
      // Filtrar apenas funcionários ativos
      setEmployees(data.filter(e => e.status === 'active'));
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const loadActiveCleaningLog = async () => {
    try {
      const log = await cleaningLogsApi.getActiveByRoom(room.id);
      setActiveCleaningLog(log);
    } catch (error) {
      console.error('Erro ao carregar log de limpeza:', error);
    }
  };

  const loadCleaningHistory = async () => {
    try {
      const history = await cleaningLogsApi.getByRoom(room.id);
      setCleaningHistory(history);
    } catch (error) {
      console.error('Erro ao carregar histórico de limpeza:', error);
    }
  };

  const handleStartCleaning = async () => {
    if (!selectedEmployee) {
      alert('Selecione um funcionário');
      return;
    }

    console.log('Iniciando limpeza:', {
      room_id: room.id,
      employee_id: selectedEmployee
    });

    try {
      setIsProcessing(true);
      const result = await cleaningLogsApi.start({
        room_id: room.id,
        employee_id: selectedEmployee
      });
      console.log('Limpeza iniciada:', result);
      setShowEmployeeModal(false);
      setSelectedEmployee('');
      alert('Limpeza iniciada com sucesso!');
      // Recarregar dados
      if (onStatusChange) {
        await onStatusChange();
      }
    } catch (error: any) {
      console.error('Erro detalhado ao iniciar limpeza:', error);
      const errorMessage = error?.response?.data?.details || error?.response?.data?.error || error?.message || 'Erro desconhecido';
      alert(`Erro ao iniciar limpeza: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteCleaning = async () => {
    if (!activeCleaningLog) return;

    try {
      setIsProcessing(true);
      await cleaningLogsApi.complete(activeCleaningLog.id, cleaningNotes);
      setShowNotesModal(false);
      setCleaningNotes('');
      alert('Limpeza concluída com sucesso!');
      // Recarregar dados
      if (onStatusChange) {
        await onStatusChange();
      }
    } catch (error) {
      console.error('Erro ao completar limpeza:', error);
      alert('Erro ao completar limpeza');
    } finally {
      setIsProcessing(false);
    }
  };
  const fields: EntityField[] = [
    {
      icon: Hash,
      label: 'Número',
      value: room.number,
    },
    {
      icon: Bed,
      label: 'Tipo',
      value: getTypeLabel(room.type),
    },
    {
      icon: AlertCircle,
      label: 'Status',
      value: (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(room.status)}`}>
          {getStatusLabel(room.status)}
        </span>
      ),
    },
    {
      icon: CreditCard,
      label: 'Preço por Noite',
      value: `Kz ${room.price.toFixed(2).replace('.', ',')}`,
    },
    {
      icon: Users,
      label: 'Capacidade',
      value: `${room.capacity} ${room.capacity === 1 ? 'pessoa' : 'pessoas'}`,
    },
    {
      icon: List,
      label: 'Comodidades',
      value: room.amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
            >
              {amenity}
            </span>
          ))}
        </div>
      ) : 'Nenhuma',
    },
  ];

  if (room.consumablesDisplay && room.consumablesDisplay.length > 0) {
    fields.push({
      icon: Package,
      label: 'Consumíveis Disponíveis',
      value: (
        <div className="flex flex-wrap gap-2">
          {room.consumablesDisplay.map((consumable, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
            >
              {consumable}
            </span>
          ))}
        </div>
      ),
    });
  }

  if (room.description) {
    fields.push({
      icon: FileText,
      label: 'Descrição',
      value: room.description,
    });
  }

  return (
    <>
      <EntityDetails
        title={`Quarto ${room.number}`}
        subtitle={getTypeLabel(room.type)}
        avatarIcon={DoorOpen}
        fields={fields}
        createdAt={room.createdAt}
        updatedAt={room.updatedAt}
        onEdit={onEdit ? () => onEdit(room) : undefined}
      />
      
      {/* Botões de Ação para Limpeza */}
      {room.status === 'cleaning' && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Limpeza</h3>
          <Button
            onClick={() => setShowEmployeeModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '180px' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Realizar Limpeza
          </Button>
        </div>
      )}
      
      {room.status === 'cleaning-in-progress' && activeCleaningLog && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Limpeza</h3>
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-600">Limpeza em andamento por:</p>
            <p className="font-medium">{activeCleaningLog.employee?.name || 'Funcionário não encontrado'}</p>
          </div>
          <Button
            onClick={() => setShowNotesModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', minWidth: '180px' }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirmar Limpeza
          </Button>
        </div>
      )}
      
      {/* Modal de Seleção de Funcionário */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title="Selecionar Funcionário para Limpeza"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funcionário Responsável
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um funcionário</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEmployeeModal(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStartCleaning}
              disabled={!selectedEmployee || isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Iniciar Limpeza'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de Anotações de Limpeza */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title="Confirmar Limpeza do Quarto"
        size="sm"
      >
        <div className="space-y-4">
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-600">Limpeza realizada por:</p>
            <p className="font-medium">{activeCleaningLog?.employee?.name || 'Funcionário não encontrado'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anotações (opcional)
            </label>
            <textarea
              value={cleaningNotes}
              onChange={(e) => setCleaningNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações sobre a limpeza..."
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowNotesModal(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCompleteCleaning}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Limpeza'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Histórico de Limpezas */}
      {cleaningHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Limpezas</h3>
          <div className="space-y-3">
            {cleaningHistory.map((log) => (
              <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.employee?.name || 'Funcionário não identificado'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {log.employee?.position || ''}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(log.started_at).toLocaleDateString('pt-AO', { timeZone: 'Africa/Luanda' })}</p>
                    <p>{new Date(log.started_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Luanda' })}</p>
                  </div>
                </div>
                {log.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                    <p className="font-medium text-gray-600 mb-1">Anotações:</p>
                    <p>{log.notes}</p>
                  </div>
                )}
                {log.completed_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Concluída em: {new Date(log.completed_at).toLocaleDateString('pt-AO', { timeZone: 'Africa/Luanda' })} às {new Date(log.completed_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Luanda' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RoomDetails;
