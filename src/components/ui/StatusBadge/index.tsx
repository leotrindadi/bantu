import React from 'react';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: 'liberado' | 'bloqueado';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusText = status === 'liberado' ? 'Liberado' : 'Bloqueado';
  
  return (
    <span className={`${styles.statusBadge} ${styles[status]} ${className}`}>
      {statusText}
    </span>
  );
};

export default StatusBadge;
