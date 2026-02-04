
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import Avatar from '../shared/Avatar';
import Icon from '../shared/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import CommunicationHub from '../communication/CommunicationHub';
import { 
    Message, Conversation, Appointment, SupportTicket, KnowledgeBaseArticle, Client 
} from '../../types';
import { TeamMember } from '../team/OperatorTeamPage';
import Header from '../layout/Header';


const ADMIN_NAV = [
    { 
        category: 'Master Admin', 
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'shield' },
            { id: 'cockpit', label: 'Cockpit', icon: 'barChart' },
            { id: 'academia', label: 'Academia Principal', icon: 'graduationCap' }
        ]
    },
    { 
        category: 'Operadores', 
        items: [
            { id: 'usuarios', label: 'Usuários', icon: 'users' }
        ]
    },
    { 
        category: 'Sistema', 
        items: [
            { id: 'database', label: 'Banco de Dados', icon: 'database' },
            { id: 'analytics', label: 'Analytics', icon: 'trendingUp' },
            { id: 'reports', label: 'Relatórios', icon: 'file-text' }
        ]
    },
    {
        category: 'Colaboração',
        items: [
            { id: 'communication', label: 'Comunicação', icon: 'messageSquare' }
        ]
    }
];

const adminSettingsNav = [
    { id: 'settings', label: 'Configurações', icon: 'settings' }
];

const MasterAdminDashboardContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const systemStats = [
    { title: "Total de Operadores", value: "1,247", change: "+12% este mês", icon: "crown" },
    { title: "Receita Total", value: "R$ 2.4M", change: "+18% vs mês anterior", icon: "dollar-sign" },
    { title: "Usuários Ativos", value: "15,432", change: "+8% esta semana", icon: "users" },
    { title: "Uptime do Sistema", value: "99.98%", change: "Últimos 30 dias", icon: "activity" },
  ];

  const topOperators = [
    { id: "1", name: "DevFactory Solutions", email: "admin@devfactory.com", plan: "Enterprise", revenue: "R$ 45.000", users: 25, projects: 48, satisfaction: 4.9, status: "active" },
    { id: "2", name: "TechCorp Digital", email: "admin@techcorp.com", plan: "Professional", revenue: "R$ 28.000", users: 12, projects: 32, satisfaction: 4.7, status: "active" },
    { id: "3", name: "StartupX Labs", email: "admin@startupx.com", plan: "Professional", revenue: "R$ 22.000", users: 8, projects: 24, satisfaction: 4.8, status: "active" },
  ];

  const systemAlerts = [
    { id: "1", type: "warning", title: "Alto uso de CPU no Servidor 3", description: "CPU acima de 85% por mais de 10 minutos", time: "5 min atrás", severity: "medium" },
    { id: "2", type: "info", title: "Backup automático concluído", description: "Backup diário executado com sucesso", time: "2 horas atrás", severity: "low" },
    { id: "3", type: "error", title: "Falha na sincronização de dados", description: "Erro na sincronização com API externa", time: "4 horas atrás", severity: "high" },
  ];

  const recentActivity = [
    { action: "Novo operador registrado", details: "Digital Innovations - Plano Professional", time: "15 min atrás", icon: "crown" },
    { action: "Upgrade de plano", details: "TechCorp mudou para Enterprise", time: "1 hora atrás", icon: "trendingUp" },
    { action: "Ticket de suporte resolvido", details: "Problema de integração solucionado", time: "2 horas atrás", icon: "shield" },
    { action: "Manutenção programada", details: "Atualização do servidor de banco de dados", time: "6 horas atrás", icon: "database" },
  ];

  const serverMetrics = [
    { name: "Servidor Web 1", cpu: 45, memory: 62, disk: 78, status: "healthy" },
    { name: "Servidor Web 2", cpu: 38, memory: 55, disk: 82, status: "healthy" },
    { name: "Servidor DB", cpu: 72, memory: 84, disk: 45, status: "warning" },
    { name: "Servidor Cache", cpu: 25, memory: 41, disk: 35, status: "healthy" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-400 bg-green-500/10";
      case "warning": return "text-yellow-400 bg-yellow-500/10";
      case "error": return "text-red-400 bg-red-500/10";
      default: return "text-text-secondary bg-slate-500/10";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "low": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default: return "text-text-secondary bg-slate-500/10 border-card-border";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <Icon name="alertCircle" className="h-4 w-4 text-red-500" />;
      case "warning": return <Icon name="alertCircle" className="h-4 w-4 text-yellow-500" />;
      case "info": return <Icon name="activity" className="h-4 w-4 text-blue-500" />;
      default: return <Icon name="activity" className="h-4 w-4 text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">Dashboard Master Admin</h1>
          <p className="text-text-secondary">Visão geral completa da plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-accent/50 text-accent"><Icon name="eye" className="h-4 w-4" />Monitoramento</Button>
          <Button className="gap-2"><Icon name="settings" className="h-4 w-4" />Configurações</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">{stat.title}</CardTitle><div className="p-2 rounded-lg bg-accent/10"><Icon name={stat.icon} className={`h-4 w-4 text-accent`} /></div></CardHeader><CardContent><div className="text-2xl font-bold">{stat.value}</div><p className="text-xs text-text-secondary">{stat.change}</p></CardContent></Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="overflow-x-auto pb-2">
            <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="operators">Operadores</TabsTrigger>
                <TabsTrigger value="system">Sistema</TabsTrigger>
                <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="crown" className="h-5 w-5 text-accent" />Top Operadores</CardTitle><CardDescription>Operadores com melhor performance</CardDescription></CardHeader>
              <CardContent><div className="space-y-4">{topOperators.map((operator, index) => (<div key={operator.id} className="flex items-center justify-between p-3 bg-sidebar/50 rounded-lg"><div className="flex items-center space-x-3"><div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">{index + 1}</div><div><div className="font-medium">{operator.name}</div><div className="text-sm text-text-secondary">{operator.email}</div></div></div><div className="text-right"><div className="font-semibold text-accent">{operator.revenue}</div><Badge variant="outline" className="text-xs">{operator.plan}</Badge></div></div>))}</div></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="activity" className="h-5 w-5 text-accent" />Atividade Recente</CardTitle><CardDescription>Últimas ações na plataforma</CardDescription></CardHeader>
              <CardContent><div className="space-y-4">{recentActivity.map((activity, index) => (<div key={index} className="flex items-start space-x-3"><div className="p-2 bg-accent/10 rounded-lg"><Icon name={activity.icon} className="h-4 w-4 text-accent" /></div><div className="flex-1"><p className="text-sm font-medium">{activity.action}</p><p className="text-xs text-text-secondary">{activity.details}</p><p className="text-xs text-text-secondary mt-1">{activity.time}</p></div></div>))}</div></CardContent>
            </Card>
          </div>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="server" className="h-5 w-5 text-accent" />Métricas dos Servidores</CardTitle><CardDescription>Status em tempo real da infraestrutura</CardDescription></CardHeader>
            <CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{serverMetrics.map((server, index) => (<div key={index} className="p-4 border border-card-border rounded-lg"><div className="flex items-center justify-between mb-3"><h4 className="font-medium text-sm">{server.name}</h4><Badge className={getStatusColor(server.status)} variant="outline">{server.status}</Badge></div><div className="space-y-3"><div><div className="flex justify-between text-xs mb-1"><span>CPU</span><span>{server.cpu}%</span></div><Progress value={server.cpu} className="h-2" /></div><div><div className="flex justify-between text-xs mb-1"><span>Memória</span><span>{server.memory}%</span></div><Progress value={server.memory} className="h-2" /></div><div><div className="flex justify-between text-xs mb-1"><span>Disco</span><span>{server.disk}%</span></div><Progress value={server.disk} className="h-2" /></div></div></div>))}</div></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="operators" className="space-y-6">
          <Card><CardHeader><CardTitle>Todos os Operadores</CardTitle><CardDescription>Gestão completa dos operadores da plataforma</CardDescription></CardHeader>
            <CardContent><div className="space-y-4">{topOperators.map((operator) => (<div key={operator.id} className="border border-card-border rounded-lg p-4"><div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3"><Avatar src="" alt={operator.name} fallback={operator.name.charAt(0)} /><div><h3 className="font-semibold">{operator.name}</h3><p className="text-sm text-text-secondary">{operator.email}</p></div></div><Badge className="bg-accent text-white">{operator.plan}</Badge></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div><p className="text-sm text-text-secondary">Receita</p><p className="font-semibold text-accent">{operator.revenue}</p></div><div><p className="text-sm text-text-secondary">Usuários</p><p className="font-semibold">{operator.users}</p></div><div><p className="text-sm text-text-secondary">Projetos</p><p className="font-semibold">{operator.projects}</p></div><div><p className="text-sm text-text-secondary">Satisfação</p><div className="flex items-center gap-1"><span className="font-semibold">{operator.satisfaction}</span><Icon name="star" className="h-4 w-4 text-yellow-500 fill-current" /></div></div></div></div>))}</div></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="database" className="h-5 w-5 text-accent" />Status do Sistema</CardTitle></CardHeader>
              <CardContent><div className="space-y-4"><div className="flex items-center justify-between"><span>API Principal</span><Badge className="bg-green-500/10 text-green-400">Online</Badge></div><div className="flex items-center justify-between"><span>Banco de Dados</span><Badge className="bg-green-500/10 text-green-400">Online</Badge></div><div className="flex items-center justify-between"><span>Cache Redis</span><Badge className="bg-green-500/10 text-green-400">Online</Badge></div><div className="flex items-center justify-between"><span>CDN</span><Badge className="bg-green-500/10 text-green-400">Online</Badge></div><div className="flex items-center justify-between"><span>Backup</span><Badge className="bg-blue-500/10 text-blue-400">Executando</Badge></div></div></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="barChart" className="h-5 w-5 text-accent" />Métricas Globais</CardTitle></CardHeader>
              <CardContent><div className="space-y-4"><div><div className="flex justify-between text-sm mb-2"><span>Uso de Banda</span><span>2.4 TB / 10 TB</span></div><Progress value={24} className="h-2" /></div><div><div className="flex justify-between text-sm mb-2"><span>Armazenamento</span><span>1.8 TB / 5 TB</span></div><Progress value={36} className="h-2" /></div><div><div className="flex justify-between text-sm mb-2"><span>Requisições/min</span><span>15,432</span></div><Progress value={65} className="h-2" /></div><div><div className="flex justify-between text-sm mb-2"><span>Uptime</span><span>99.98%</span></div><Progress value={99.98} className="h-2" /></div></div></CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="alertCircle" className="h-5 w-5 text-accent" />Alertas do Sistema</CardTitle><CardDescription>Monitoramento de eventos e problemas da plataforma</CardDescription></CardHeader>
            <CardContent><div className="space-y-4">{systemAlerts.map((alert) => (<div key={alert.id} className="border border-card-border rounded-lg p-4"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-3">{getAlertIcon(alert.type)}<div><h4 className="font-medium">{alert.title}</h4><p className="text-sm text-text-secondary">{alert.description}</p></div></div><div className="flex items-center gap-2"><Badge className={getSeverityColor(alert.severity)} variant="outline">{alert.severity}</Badge><div className="flex items-center gap-1 text-xs text-text-secondary"><Icon name="clock" className="h-3 w-3" />{alert.time}</div></div></div></div>))}</div></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


interface AdminDashboardProps {
  onLogout: () => void;
   // Communication Hub Props
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  appointments: Appointment[];
  tickets: SupportTicket[];
  knowledgeBase: KnowledgeBaseArticle[];
  teamMembers: TeamMember[];
  clients: Client[];
  onSendMessage: (conversationId: string, text: string) => void;
  onScheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdate' | 'createdAt'>) => void;
}

const NavItem: React.FC<{ item: { id: string; label: string; icon: string; }; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full focus:outline-none focus:ring-2 focus:ring-accent ${
                isActive
                ? "bg-accent/20 text-accent"
                : "text-text-secondary hover:bg-slate-700 hover:text-text-primary"
            }`}
        >
            <Icon
            name={item.icon}
            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
            }`}
            />
            {item.label}
        </button>
    );
};

const SidebarContent: React.FC<{
    currentView: string;
    setCurrentView: (view: string, context?: any) => void;
    onClose?: () => void;
}> = ({ currentView, setCurrentView, onClose }) => (
     <div className="flex flex-col flex-grow bg-sidebar pt-5 pb-4 overflow-y-auto h-full border-r border-card-border">
        <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Icon name="shield" className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Nexus</h1>
                    <Badge className="text-xs bg-accent text-white">Master Admin</Badge>
                </div>
            </div>
             {onClose && (
                <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-white">
                    <Icon name="x" className="h-6 w-6" />
                </button>
            )}
        </div>
        <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-6">
                {ADMIN_NAV.map((category) => (
                     <div key={category.category}>
                        <p className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">{category.category}</p>
                        <div className="mt-2 space-y-1">
                            {category.items.map((item) => (
                                <NavItem
                                    key={item.id}
                                    item={item}
                                    isActive={currentView === item.id}
                                    onClick={() => {
                                        setCurrentView(item.id);
                                        onClose?.();
                                    }}
                                />
                            ))}
                        </div>
                     </div>
                ))}
            </nav>
            <div className="px-2">
                <div className="border-t border-card-border pt-4">
                    <p className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Administração</p>
                    <nav className="mt-2 space-y-1">
                         {adminSettingsNav.map((item) => (
                            <NavItem
                                key={item.id}
                                item={item}
                                isActive={currentView === item.id}
                                onClick={() => {
                                    setCurrentView(item.id);
                                    onClose?.();
                                }}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { onLogout } = props;
    const [view, setView] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSetView = (view: string, context = {}) => {
        setView(view);
    };

    const renderContent = () => {
        switch(view) {
            case 'dashboard':
                return <MasterAdminDashboardContent />;
            case 'communication':
                return <CommunicationHub onBack={() => setView('dashboard')} {...props} />;
            default:
                return (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Página de {view}</h2>
                        <p className="text-text-secondary">Conteúdo em desenvolvimento.</p>
                    </div>
                );
        }
    };
    
    const fullScreenViews = ['communication'];
    if (fullScreenViews.includes(view)) {
        return renderContent();
    }
    
    return (
         <div className="flex h-screen bg-background text-text-primary">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <SidebarContent currentView={view} setCurrentView={handleSetView} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                 <Header
                    title={ADMIN_NAV.flatMap(c => c.items).find(i => i.id === view)?.label || 'Dashboard'}
                    onLogout={onLogout}
                    setCurrentView={handleSetView}
                    onMenuClick={() => setSidebarOpen(true)}
                 />
                {/* Conteúdo da página */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
export default AdminDashboard;
