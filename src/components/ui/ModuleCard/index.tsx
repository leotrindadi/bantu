import React, { ReactNode } from 'react';
import styles from './ModuleCard.module.css';
import StatusBadge from '@components/ui/StatusBadge';

interface ModuleCardProps {
  title: string;
  description: string;
  status: 'liberado' | 'bloqueado';
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  status,
  icon,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (status === 'bloqueado' || !onClick) return;
    onClick();
  };

  return (
    <div 
      className={`${styles.moduleCard} ${status === 'bloqueado' ? styles.disabled : ''} ${className}`}
      onClick={handleClick}
      aria-disabled={status === 'bloqueado'}
    >
      <div className={styles.moduleIcon}>
        {icon}
      </div>
      <h3 className={styles.moduleTitle}>{title}</h3>
      <p className={styles.moduleDescription}>{description}</p>
      <div className={styles.moduleFooter}>
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default ModuleCard;
