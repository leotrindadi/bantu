import React, { useState, useEffect } from 'react';
import { Bed, Users, Calendar, DollarSign, ChevronDown } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import MetricChart from '../components/MetricChart';
import Button from '../../../components/ui/Button';
import { dashboardApi, DashboardMetrics, RecentActivity, ChartDataPoint } from '../../../services/api/dashboard';

type PeriodType = 'today' | 'week' | 'month';

interface PeriodOption {
  value: PeriodType;
  label: string;
  description: string;
}

const periodOptions: PeriodOption[] = [
  { value: 'today', label: 'Hoje', description: 'vs Ontem' },
  { value: 'week', label: 'Esta Semana', description: 'vs Semana Anterior' },
  { value: 'month', label: 'Este Mês', description: 'vs Mês Anterior' },
];


const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [comparisonData, setComparisonData] = useState<DashboardMetrics | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchDashboardData(selectedPeriod);
    fetchRecentActivities();
  }, []);

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(selectedPeriod);
      fetchRecentActivities();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchDashboardData = async (period: PeriodType) => {
    try {
      // Apenas mostrar loading se não houver dados ainda
      if (!comparisonData) {
        setLoading(true);
      }
      const data = await dashboardApi.getMetrics(period);
      setComparisonData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const activities = await dashboardApi.getRecentActivities();
      setRecentActivities(activities);
    } catch (error) {
      console.error('Erro ao carregar atividades recentes:', error);
    }
  };

  const getActivityLabel = (status: RecentActivity['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Reserva';
      case 'checked-in':
        return 'Check-In';
      case 'checked-out':
        return 'Check-Out';
      case 'completed':
        return 'Finalizada';
      default:
        return status;
    }
  };

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-600';
      case 'checked-in':
        return 'bg-green-100 text-green-600';
      case 'checked-out':
        return 'bg-yellow-100 text-yellow-600';
      case 'completed':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePeriodChange = async (period: PeriodType) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
    await fetchDashboardData(period);
    // Recarregar gráfico se houver métrica selecionada
    if (selectedMetric) {
      await fetchChartData(period, selectedMetric as any);
    }
  };

  const fetchChartData = async (period: PeriodType, metric: string) => {
    try {
      const data = await dashboardApi.getChartData(period, metric as any);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do gráfico:', error);
    }
  };

  const handleMetricClick = async (metricKey: string) => {
    if (selectedMetric === metricKey) {
      // Deselecionar
      setSelectedMetric(null);
      setChartData([]);
    } else {
      // Selecionar nova métrica
      setSelectedMetric(metricKey);
      await fetchChartData(selectedPeriod, metricKey);
    }
  };

  const metricConfig = {
    occupancy: { title: 'Ocupação', color: '#3b82f6' },
    checkIns: { title: 'Check-Ins', color: '#10b981' },
    checkOuts: { title: 'Check-Outs', color: '#8b5cf6' },
    revenue: { title: 'Receita', color: '#f59e0b' },
  };

  const metrics = comparisonData ? [
    {
      key: 'occupancy',
      title: 'Ocupação',
      value: comparisonData.occupied,
      change: comparisonData.changes.occupied,
      icon: <Bed size={24} />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      key: 'checkIns',
      title: 'Check-Ins',
      value: comparisonData.checkIns,
      change: comparisonData.changes.checkIns,
      icon: <Users size={24} />,
      color: 'bg-green-100 text-green-600',
    },
    {
      key: 'checkOuts',
      title: 'Check-Outs',
      value: comparisonData.checkOuts,
      change: comparisonData.changes.checkOuts,
      icon: <Calendar size={24} />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      key: 'revenue',
      title: 'Receita',
      value: comparisonData.revenue,
      change: comparisonData.changes.revenue,
      icon: <DollarSign size={24} />,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ] : [];

  const getPeriodDescription = () => {
    return periodOptions.find(p => p.value === selectedPeriod)?.description || 'vs Mês Anterior';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral das operações do hotel
          </p>
        </div>

        {/* Seletor de Período */}
        <div className="relative mt-8">
          <Button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center justify-between px-4 py-2 text-sm w-[150px]"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <>
                <span>{periodOptions.find(p => p.value === selectedPeriod)?.label}</span>
                <ChevronDown size={16} className="ml-2 flex-shrink-0" />
              </>
            )}
          </Button>

          {showPeriodDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedPeriod === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards de Métricas */}
      {loading && !comparisonData ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              color={metric.color}
              periodDescription={getPeriodDescription()}
              onClick={() => handleMetricClick(metric.key)}
              isSelected={selectedMetric === metric.key}
            />
          ))}
        </div>
      )}

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico da Métrica Selecionada */}
        <div className="lg:col-span-2">
          {selectedMetric && chartData.length > 0 ? (
            <MetricChart
              data={chartData}
              period={selectedPeriod}
              metric={selectedMetric as any}
              title={metricConfig[selectedMetric as keyof typeof metricConfig]?.title || ''}
              color={metricConfig[selectedMetric as keyof typeof metricConfig]?.color || '#3b82f6'}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center">
                <p className="text-gray-400 text-lg mb-2">📊 Selecione uma métrica</p>
                <p className="text-gray-500 text-sm">Clique em um dos cards acima para visualizar o gráfico</p>
              </div>
            </div>
          )}
        </div>

        {/* Últimas Atividades */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Últimas Atividades</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        getActivityColor(activity.status)
                      }`}>
                        {getActivityLabel(activity.status)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium text-sm">Quarto {activity.room_number}</p>
                    <p className="text-xs text-gray-500">{activity.guest_name}</p>
                    {activity.status === 'confirmed' && (
                      <p className="text-xs text-gray-400 mt-1">
                        Check-in: {new Date(activity.check_in).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
