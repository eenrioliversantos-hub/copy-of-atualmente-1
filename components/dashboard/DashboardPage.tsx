import React from 'react';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import ProjectStatusList from './ProjectStatusList';
import ActivityFeed from './ActivityFeed';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Receita Total" value="R$ 115.750" change="+18% este mês" icon="dollar-sign" />
        <MetricCard title="Projetos Ativos" value="3" change="+1 este mês" icon="briefcase" />
        <MetricCard title="Clientes Ativos" value="5" change="+2 este mês" icon="users" />
        <MetricCard title="Tarefas Concluídas" value="128" change="+32 esta semana" icon="checkSquare" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ProjectStatusList />
        </div>
      </div>

      <div>
        <ActivityFeed />
      </div>
    </div>
  );
};

export default DashboardPage;
