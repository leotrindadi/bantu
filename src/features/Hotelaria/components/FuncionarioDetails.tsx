import React from 'react';
import { formatDate } from '../../../lib/formatDate';
import { Users, Mail, Phone, FileText, MapPin, Briefcase, Globe } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  nacionalidade: string;
  funcao: string;
  endereco: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FuncionarioDetailsProps {
  funcionario: Funcionario;
  onEdit?: (funcionario: Funcionario) => void;
}

const getFuncaoLabel = (funcao: string) => {
  const funcoes: Record<string, string> = {
    'camareira': 'Camareira',
    'recepcionista': 'Recepcionista',
    'gerente': 'Gerente',
    'chef': 'Chef',
    'porteiro': 'Porteiro',
    'manobrista': 'Manobrista',
    'seguranca': 'Segurança',
  };
  return funcoes[funcao] || funcao;
};

const FuncionarioDetails: React.FC<FuncionarioDetailsProps> = ({ funcionario, onEdit }) => {
  const fields: EntityField[] = [
    {
      icon: Mail,
      label: 'E-mail',
      value: funcionario.email,
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: funcionario.telefone,
    },
    {
      icon: FileText,
      label: 'Documento',
      value: funcionario.documento,
    },
    {
      icon: Briefcase,
      label: 'Função',
      value: (
        <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
          {getFuncaoLabel(funcionario.funcao)}
        </span>
      ),
    },
  ];

  if (funcionario.nacionalidade) {
    fields.push({
      icon: Globe,
      label: 'Nacionalidade',
      value: funcionario.nacionalidade,
    });
  }

  if (funcionario.endereco) {
    fields.push({
      icon: MapPin,
      label: 'Endereço',
      value: funcionario.endereco,
    });
  }

  return (
    <EntityDetails
      title={funcionario.nome}
      subtitle={`Funcionário desde ${formatDate(funcionario.createdAt)}`}
      avatarIcon={Users}
      fields={fields}
      createdAt={funcionario.createdAt}
      updatedAt={funcionario.updatedAt}
      onEdit={onEdit ? () => onEdit(funcionario) : undefined}
    />
  );
};

export default FuncionarioDetails;
