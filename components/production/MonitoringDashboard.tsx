import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

const efficiencyData = [
  { name: 'Seg', value: 92 },
  { name: 'Ter', value: 93 },
  { name: 'Qua', value: 95 },
  { name: 'Qui', value: 94 },
  { name: 'Sex', value: 96 },
  { name: 'Sab', value: 95 },
  { name: 'Dom', value: 94 },
];

const lineStatusData = [
  { name: 'Em Andamento', count: 5, fill: '#38bdf8' },
  { name: 'Concluídas', count: 2, fill: '#22c55e' },
  { name: 'Com Falha', count: 1, fill: '#ef4444' },
];

const liveEvents = [
    { time: 'agora', message: "Bloco 'Auth' concluído na Linha #3", status: 'success' },
    { time: '2m', message: "Linha #2 iniciada com sucesso", status: 'info' },
    { time: '5m', message: "Erro na Linha #5: API externa falhou", status: 'error' },
    { time: '8m', message: "Linha #1 concluída", status: 'success' },
    { time: '15m', message: "Novo bloco 'Pagamento' adicionado ao Construtor", status: 'info' },
];

const MonitoringDashboard: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'success': return <Icon name="checkCircle" className="h-4 w-4 text-green-400" />;
        case 'error': return <Icon name="alertCircle" className="h-4 w-4 text-red-400" />;
        case 'info': return <Icon name="activity" className="h-4 w-4 text-sky-400" />;
        default: return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocos Ativos</CardTitle>
            <Icon name="blocks" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-text-secondary">+3 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linhas em Produção</CardTitle>
            <Icon name="cpu" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-text-secondary">2 finalizadas hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência Geral</CardTitle>
            <Icon name="activity" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-text-secondary">+2% desde a semana passada</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Eficiência ao Longo do Tempo</CardTitle>
                  <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                   <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={efficiencyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} name="Eficiência (%)" />
                      </LineChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Status das Linhas de Montagem</CardTitle>
                  <CardDescription>Distribuição atual</CardDescription>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={lineStatusData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                          <Bar dataKey="count" name="Quantidade" />
                      </BarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>

      {/* Live Feed */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                  Feed de Eventos em Tempo Real
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
                  {liveEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                          <div className="flex items-center gap-3">
                              {getStatusIcon(event.status)}
                              <p className="text-sm">{event.message}</p>
                          </div>
                          <span className="text-xs text-text-secondary">{event.time}</span>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;