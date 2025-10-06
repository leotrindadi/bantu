import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { formatDate } from '../../../lib/formatDate';

export interface EntityField {
  icon: LucideIcon;
  label: string;
  value: string | ReactNode;
}

interface EntityDetailsProps {
  title: string;
  subtitle: string;
  avatarIcon: LucideIcon;
  avatarBgColor?: string;
  avatarIconColor?: string;
  fields: EntityField[];
  createdAt?: Date;
  updatedAt?: Date;
  onEdit?: () => void;
  editButtonLabel?: string;
}

const EntityDetails: React.FC<EntityDetailsProps> = ({
  title,
  subtitle,
  avatarIcon: AvatarIcon,
  avatarBgColor = 'bg-blue-100',
  avatarIconColor = 'text-blue-600',
  fields,
  createdAt,
  updatedAt,
  onEdit,
  editButtonLabel = 'Editar',
}) => {
  // Dividir campos em duas colunas
  const midpoint = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, midpoint);
  const rightFields = fields.slice(midpoint);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${avatarBgColor} rounded-full flex items-center justify-center`}>
            <AvatarIcon className={`w-6 h-6 ${avatarIconColor}`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {editButtonLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {leftFields.map((field, index) => {
            const FieldIcon = field.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <FieldIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{field.label}</p>
                  <div className="text-gray-900">{field.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {rightFields.map((field, index) => {
            const FieldIcon = field.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <FieldIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{field.label}</p>
                  <div className="text-gray-900">{field.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(createdAt || updatedAt) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            {createdAt && <span>Cadastrado em: {formatDate(createdAt)}</span>}
            {updatedAt && <span>Atualizado em: {formatDate(updatedAt)}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityDetails;
