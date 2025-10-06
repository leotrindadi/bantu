import React from 'react';
import { ShoppingCart, Tag, CreditCard, Package, AlertCircle, FileText, Barcode } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';

type ConsumivelStatus = 'disponivel' | 'indisponivel' | 'em-falta';

interface Consumivel {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  codigoBarras: string;
  status: ConsumivelStatus;
  quantidadeEstoque: number;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsumivelDetailsProps {
  consumivel: Consumivel;
  onEdit?: (consumivel: Consumivel) => void;
}

const getStatusLabel = (status: ConsumivelStatus) => {
  const labels = {
    'disponivel': 'Disponível',
    'indisponivel': 'Indisponível',
    'em-falta': 'Em Falta',
  };
  return labels[status] || status;
};

const getStatusColor = (status: ConsumivelStatus) => {
  const colors = {
    'disponivel': 'text-green-600 bg-green-100',
    'indisponivel': 'text-orange-600 bg-orange-100',
    'em-falta': 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const ConsumivelDetails: React.FC<ConsumivelDetailsProps> = ({ consumivel, onEdit }) => {
  const fields: EntityField[] = [
    {
      icon: Tag,
      label: 'Categoria',
      value: consumivel.categoria.replace('-', ' ').charAt(0).toUpperCase() + consumivel.categoria.replace('-', ' ').slice(1),
    },
    {
      icon: CreditCard,
      label: 'Preço',
      value: `R$ ${consumivel.preco.toFixed(2).replace('.', ',')}`,
    },
    {
      icon: Package,
      label: 'Estoque',
      value: (
        <span className={consumivel.quantidadeEstoque <= 10 ? 'text-red-600 font-semibold' : ''}>
          {consumivel.quantidadeEstoque} un.
        </span>
      ),
    },
    {
      icon: AlertCircle,
      label: 'Status',
      value: (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(consumivel.status)}`}>
          {getStatusLabel(consumivel.status)}
        </span>
      ),
    },
  ];

  if (consumivel.codigoBarras) {
    fields.push({
      icon: Barcode,
      label: 'Código de Barras',
      value: consumivel.codigoBarras,
    });
  }

  if (consumivel.descricao) {
    fields.push({
      icon: FileText,
      label: 'Descrição',
      value: consumivel.descricao,
    });
  }

  return (
    <EntityDetails
      title={consumivel.nome}
      subtitle={consumivel.categoria.replace('-', ' ').charAt(0).toUpperCase() + consumivel.categoria.replace('-', ' ').slice(1)}
      avatarIcon={ShoppingCart}
      fields={fields}
      createdAt={consumivel.createdAt}
      updatedAt={consumivel.updatedAt}
      onEdit={onEdit ? () => onEdit(consumivel) : undefined}
    />
  );
};

export default ConsumivelDetails;
