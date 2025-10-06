import React from 'react';
import { Guest } from '../types';
import { formatDate } from '../../../lib/formatDate';
import { User, Mail, Phone, FileText, MapPin, Globe } from 'lucide-react';
import EntityDetails, { EntityField } from './EntityDetails';

interface GuestDetailsProps {
  guest: Guest;
  onEdit?: (guest: Guest) => void;
}

const GuestDetails: React.FC<GuestDetailsProps> = ({ guest, onEdit }) => {
  const fields: EntityField[] = [
    {
      icon: Mail,
      label: 'E-mail',
      value: guest.email,
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: guest.phone,
    },
    {
      icon: FileText,
      label: 'Documento',
      value: guest.document,
    },
    {
      icon: Globe,
      label: 'Nacionalidade',
      value: guest.nationality,
    },
  ];

  if (guest.address) {
    fields.push({
      icon: MapPin,
      label: 'Endereço',
      value: guest.address,
    });
  }

  return (
    <EntityDetails
      title={guest.name}
      subtitle={`Cliente desde ${formatDate(guest.createdAt)}`}
      avatarIcon={User}
      fields={fields}
      createdAt={guest.createdAt}
      updatedAt={guest.updatedAt}
      onEdit={onEdit ? () => onEdit(guest) : undefined}
    />
  );
};

export default GuestDetails;