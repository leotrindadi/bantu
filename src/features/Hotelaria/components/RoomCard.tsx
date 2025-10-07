import React from 'react';
import { Room } from '../types';
import { Bed, Users, Eye, Edit2, Trash2 } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onViewDetails?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onViewDetails, onEdit, onDelete }) => {
  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'occupied':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'maintenance':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'cleaning':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cleaning-in-progress':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupado';
      case 'maintenance':
        return 'Manutenção';
      case 'cleaning':
        return 'Limpeza';
      case 'cleaning-in-progress':
        return 'Limpando';
      default:
        return status;
    }
  };

  const getRoomTypeText = (type: Room['type']) => {
    switch (type) {
      case 'single':
        return 'Simples';
      case 'double':
        return 'Casal';
      case 'suite':
        return 'Suíte';
      case 'deluxe':
        return 'Luxo';
      default:
        return type;
    }
  };

  const getRoomTypeColor = () => {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  };

  return (
    <div className="bg-white rounded-lg border border-transparent p-6 transition-all duration-200 ease-in-out hover:border-blue-500 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Quarto {room.number}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoomTypeColor()}`}>
            {getRoomTypeText(room.type)}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
            room.status
          )}`}
        >
          {getStatusText(room.status)}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Bed className="w-4 h-4" />
          <span className="text-sm">{getRoomTypeText(room.type)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-sm">{room.capacity} pessoas</span>
        </div>
      </div>

      {room.amenities.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Comodidades:</p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs text-blue-700 border border-blue-200"
              >
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {room.consumablesDisplay && room.consumablesDisplay.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Consumíveis:</p>
          <div className="flex flex-wrap gap-2">
            {room.consumablesDisplay.map((consumable, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs text-blue-700 border border-blue-200"
              >
                <span>{consumable}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {room.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div>
          <span className="text-xl font-bold text-gray-900">
            Kz {Number(room.price).toFixed(2).replace('.', ',')}
          </span>
          <span className="text-gray-600 text-sm">/noite</span>
        </div>
        <div className="flex items-center space-x-3">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(room)}
              className="text-blue-600 hover:text-blue-900"
              title="Visualizar"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(room)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Editar"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(room)}
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

export default RoomCard;