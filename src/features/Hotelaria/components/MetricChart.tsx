import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ChartDataPoint } from '../../../services/api/dashboard';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricChartProps {
  data: ChartDataPoint[];
  period: 'today' | 'week' | 'month';
  metric: 'occupancy' | 'checkIns' | 'checkOuts' | 'revenue';
  title: string;
  color: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ data, period, metric, title }) => {
  // Configuração de cores por métrica
  const metricColors: Record<string, { bg: string; border: string }> = {
    occupancy: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6' },
    checkIns: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981' },
    checkOuts: { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6' },
    revenue: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b' },
  };

  const colors = metricColors[metric] || metricColors.occupancy;

  // Preencher dados faltantes para período "today"
  const fillMissingHours = (data: ChartDataPoint[]): ChartDataPoint[] => {
    if (period !== 'today') return data;
    
    const filledData: ChartDataPoint[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      const existing = data.find(d => d.hour === hour);
      filledData.push(existing || { hour, value: 0 });
    }
    return filledData;
  };

  const processedData = period === 'today' ? fillMissingHours(data) : data;

  // Formatar labels baseado no período
  const formatLabel = (dataPoint: ChartDataPoint, index: number): string => {
    if (period === 'today' && dataPoint.hour !== undefined) {
      // Mostrar apenas horários chave
      const keyHours = [0, 6, 12, 18];
      if (keyHours.includes(dataPoint.hour)) {
        return `${dataPoint.hour.toString().padStart(2, '0')}:00`;
      }
      return '';
    } else if (dataPoint.date) {
      const date = new Date(dataPoint.date);
      const day = date.getDate();
      
      if (period === 'week') {
        // Semana: mostrar dia + mês abreviado quando muda o mês
        const prevDateStr = index > 0 ? processedData[index - 1]?.date : null;
        const prevDate = prevDateStr ? new Date(prevDateStr) : null;
        
        if (index === 0 || (prevDate && prevDate.getMonth() !== date.getMonth())) {
          return `${day} ${date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}`;
        }
        return day.toString();
      }
      
      if (period === 'month') {
        // Mês: primeiro dia com mês, resto só número
        if (index === 0) {
          return `${day} ${date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}`;
        }
        return day.toString();
      }
      
      return day.toString();
    }
    return '';
  };

  const chartData = {
    labels: processedData.map((d, i) => formatLabel(d, i)),
    datasets: [
      {
        label: '',
        data: processedData.map(d => d.value),
        borderColor: colors.border,
        backgroundColor: colors.bg,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.border,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        filter: () => {
          return true;
        },
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const value = context.parsed.y;
            
            switch (metric) {
              case 'revenue':
                return `R$ ${value.toFixed(2).replace('.', ',')}`;
              case 'occupancy':
                return value === 1 ? '1 Ocupação' : `${value} Ocupações`;
              case 'checkIns':
                return value === 1 ? '1 Check-In' : `${value} Check-Ins`;
              case 'checkOuts':
                return value === 1 ? '1 Check-Out' : `${value} Check-Outs`;
              default:
                return `${value}`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">
          {period === 'today' && 'Últimas 24 horas'}
          {period === 'week' && 'Últimos 7 dias'}
          {period === 'month' && 'Este mês'}
        </p>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MetricChart;
