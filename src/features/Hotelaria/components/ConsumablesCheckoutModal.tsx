import React, { useState, useEffect } from 'react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Package, Plus, Minus, DollarSign } from 'lucide-react';
import { consumablesApi } from '../../../services/api/consumables';

interface ConsumableItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
}

interface ConsumablesCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (consumables: { id: string; quantity: number; price: number }[], totalAmount: number) => void;
  roomConsumableIds: string[];
}

const ConsumablesCheckoutModal: React.FC<ConsumablesCheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roomConsumableIds,
}) => {
  const [consumables, setConsumables] = useState<ConsumableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && roomConsumableIds.length > 0) {
      loadConsumables();
    }
  }, [isOpen, roomConsumableIds]);

  const loadConsumables = async () => {
    try {
      setIsLoading(true);
      const allConsumables = await consumablesApi.getAll();
      
      // Filtrar apenas os consumíveis do quarto
      const roomConsumables = allConsumables
        .filter(c => roomConsumableIds.includes(c.id))
        .map(c => ({
          id: c.id,
          name: c.name,
          price: Number(c.price),
          quantity: 0,
          availableStock: Number(c.stock),
        }));
      
      setConsumables(roomConsumables);
    } catch (error) {
      console.error('Erro ao carregar consumíveis:', error);
      alert('Erro ao carregar consumíveis do quarto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setConsumables(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, quantity: Math.max(0, Math.min(newQuantity, c.availableStock)) }
          : c
      )
    );
  };

  const incrementQuantity = (id: string) => {
    const consumable = consumables.find(c => c.id === id);
    if (consumable && consumable.quantity < consumable.availableStock) {
      handleQuantityChange(id, consumable.quantity + 1);
    }
  };

  const decrementQuantity = (id: string) => {
    const consumable = consumables.find(c => c.id === id);
    if (consumable && consumable.quantity > 0) {
      handleQuantityChange(id, consumable.quantity - 1);
    }
  };

  const calculateTotal = () => {
    return consumables.reduce((total, c) => total + c.price * c.quantity, 0);
  };

  const handleConfirm = () => {
    const consumedItems = consumables
      .filter(c => c.quantity > 0)
      .map(c => ({
        id: c.id,
        quantity: c.quantity,
        price: c.price,
      }));

    const totalAmount = calculateTotal();
    onConfirm(consumedItems, totalAmount);
  };

  const handleCancel = () => {
    setConsumables(prev => prev.map(c => ({ ...c, quantity: 0 })));
    onClose();
  };

  const total = calculateTotal();
  const hasConsumables = consumables.length > 0;
  const hasSelectedItems = consumables.some(c => c.quantity > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Registrar Consumíveis"
      size="md"
    >
      <div className="space-y-4">
        {/* Descrição */}
        <p className="text-sm text-gray-600">
          Registre os consumíveis utilizados durante a hospedagem. As quantidades serão subtraídas do estoque.
        </p>

        {/* Lista de Consumíveis */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Carregando consumíveis...</p>
          </div>
        ) : !hasConsumables ? (
          <div className="text-center py-8">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Este quarto não possui consumíveis cadastrados.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {consumables.map((consumable) => (
              <div
                key={consumable.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{consumable.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      Kz {consumable.price.toFixed(2).replace('.', ',')} / unidade
                    </span>
                    <span className="text-xs text-gray-400">
                      Estoque: {consumable.availableStock}
                    </span>
                  </div>
                </div>

                {/* Controles de Quantidade */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQuantity(consumable.id)}
                    disabled={consumable.quantity === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <Input
                    type="number"
                    min="0"
                    max={consumable.availableStock}
                    value={consumable.quantity}
                    onChange={(e) => handleQuantityChange(consumable.id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center"
                  />
                  
                  <button
                    onClick={() => incrementQuantity(consumable.id)}
                    disabled={consumable.quantity >= consumable.availableStock}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Subtotal */}
                {consumable.quantity > 0 && (
                  <div className="ml-4 text-right min-w-[100px]">
                    <span className="text-sm font-semibold text-gray-900">
                      Kz {(consumable.price * consumable.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        {hasConsumables && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-base font-semibold text-gray-900">Total</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                Kz {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!hasConsumables}
          >
            {hasSelectedItems ? 'Confirmar e Finalizar' : 'Pular e Finalizar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConsumablesCheckoutModal;
