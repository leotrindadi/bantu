import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  periodDescription?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'bg-blue-100 text-blue-600',
  periodDescription = 'vs Mês Anterior',
  onClick,
  isSelected = false,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-3 transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <div className={`p-2.5 rounded-full ${color} bg-opacity-20 flex-shrink-0`}>
          {React.cloneElement(icon as React.ReactElement, { size: 22 })}
        </div>
        <p className="text-gray-500 text-base font-medium">{title}</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center justify-center mt-2 text-xs ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="ml-1">{Math.abs(change)}% {periodDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
