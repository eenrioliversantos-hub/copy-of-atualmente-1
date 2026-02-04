
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Icon from "../shared/Icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table"

// --- MOCK DATA ---
const projectData = [
  { name: 'Jan', revenue: 4000, projects: 5 },
  { name: 'Feb', revenue: 3000, projects: 4 },
  { name: 'Mar', revenue: 5000, projects: 6 },
  { name: 'Apr', revenue: 4500, projects: 5 },
  { name: 'May', revenue: 6000, projects: 7 },
  { name: 'Jun', revenue: 5500, projects: 6 },
];

const projectsDetailed = [
    { id: '1', name: 'Sistema ERP - TechCorp', status: 'Em Andamento', progress: 75, budget: 45000, revenue: 33750, deadline: '2024-03-15' },
    { id: '2', name: 'E-commerce - Digital Store', status: 'Planejamento', progress: 25, budget: 28000, revenue: 7000, deadline: '2024-04-30' },
    { id: '3', name: 'App Mobile - StartupX', status: 'Concluído', progress: 100, budget: 35000, revenue: 34500, deadline: '2024-01-15' },
    { id: '4', name: 'Landing Page - Marketing Pro', status: 'Pausado', progress: 40, budget: 8000, revenue: 3200, deadline: '2024-02-20' },
];

const teamData = [
    { id: '1', name: 'Carlos Silva', role: 'Tech Lead', projects: 3, tasks: 45, onTimeRate: 93, rating: 4.8 },
    { id: '2', name: 'Ana Santos', role: 'Frontend', projects: 2, tasks: 38, onTimeRate: 92, rating: 4.6 },
    { id: '3', name: 'Pedro Costa', role: 'Backend', projects: 1, tasks: 41, onTimeRate: 95, rating: 4.7 },
    { id: '4', name: 'Maria Oliveira', role: 'Project Manager', projects: 4, tasks: 52, onTimeRate: 96, rating: 4.9 },
];

// --- COMPONENT ---
export default function OperatorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const financialOverviewData = [
    { name: 'Jan', revenue: 4000, cost: 2400 },
    { name: 'Feb', revenue: 3000, cost: 1398 },
    { name: 'Mar', revenue: 5000, cost: 3800 },
    { name: 'Apr', revenue: 4500, cost: 3000 },
    { name: 'May', revenue: 6000, cost: 4100 },
    { name: 'Jun', revenue: 5500, cost: 3500 },
  ];
  
  const projectProfitabilityData = [
      { name: 'ERP TechCorp', profit: 11250 },
      { name: 'E-commerce', profit: 6000 },
      { name: 'App Mobile', profit: 6500 },
      { name: 'Landing Page', profit: 1600 },
  ];

  const handleExport = () => {
    let dataToExport = [];
    let filename = "report.csv";
    let headers = "";

    if (activeTab === 'projects') {
        headers = "ID,Nome,Status,Progresso,Orçamento,Receita,Prazo\n";
        dataToExport = projectsDetailed;
        filename = "projects_report.csv";
    } else if (activeTab === 'team') {
        headers = "ID,Nome,Cargo,Projetos,Tarefas,Pontualidade (%),Avaliação\n";
        dataToExport = teamData;
        filename = "team_report.csv";
    } else {
        alert("Exportação disponível apenas para as abas de Projetos e Equipe.");
        return;
    }

    const csvContent = headers + dataToExport.map(row => Object.values(row).join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planejamento": return "text-blue-400";
      case "Em Andamento": return "text-yellow-400";
      case "Concluído": return "text-green-400";
      case "Pausado": return "text-text-secondary";
      default: return "text-text-primary";
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-text-secondary mt-1">Insights sobre seus projetos, clientes e performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
            <Icon name="download" className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Receita Total</CardTitle><Icon name="dollar-sign" className="h-4 w-4 text-text-secondary" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">R$ 115.750</div><p className="text-xs text-text-secondary">+18% vs mês anterior</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Projetos Ativos</CardTitle><Icon name="checkSquare" className="h-4 w-4 text-text-secondary" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">3</div><p className="text-xs text-text-secondary">+1 este mês</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Satisfação do Cliente</CardTitle><Icon name="star" className="h-4 w-4 text-text-secondary" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">4.8/5</div><p className="text-xs text-text-secondary">Baseado em 24 avaliações</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Produtividade</CardTitle><Icon name="trendingUp" className="h-4 w-4 text-text-secondary" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">94%</div><p className="text-xs text-text-secondary">Tarefas entregues no prazo</p></CardContent>
            </Card>
        </div>


      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Receita Mensal</CardTitle>
                        <CardDescription>Receita dos últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={projectData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Projetos por Status</CardTitle>
                        <CardDescription>Distribuição atual dos projetos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex justify-between items-center text-sm"><span>Em Andamento</span><Badge variant="secondary">1</Badge></div>
                        <Progress value={25} />
                        <div className="flex justify-between items-center text-sm"><span>Planejamento</span><Badge variant="secondary">1</Badge></div>
                        <Progress value={25} />
                        <div className="flex justify-between items-center text-sm"><span>Concluídos</span><Badge variant="secondary">1</Badge></div>
                        <Progress value={25} />
                         <div className="flex justify-between items-center text-sm"><span>Pausado</span><Badge variant="secondary">1</Badge></div>
                        <Progress value={25} />
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Análise de Projetos</CardTitle>
                    <CardDescription>Métricas detalhadas por projeto</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progresso</TableHead>
                                <TableHead>Orçamento</TableHead>
                                <TableHead>Receita</TableHead>
                                <TableHead>Prazo Final</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projectsDetailed.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell><Badge variant="outline" className={getStatusColor(p.status)}>{p.status}</Badge></TableCell>
                                    <TableCell><Progress value={p.progress} className="h-2 w-24" /></TableCell>
                                    <TableCell>R$ {p.budget.toLocaleString()}</TableCell>
                                    <TableCell className="text-green-400">R$ {p.revenue.toLocaleString()}</TableCell>
                                    <TableCell>{p.deadline}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Produtividade da Equipe</CardTitle>
                    <CardDescription>Métricas de performance por membro da equipe</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Membro</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Projetos</TableHead>
                                <TableHead>Tarefas Concluídas</TableHead>
                                <TableHead>Pontualidade</TableHead>
                                <TableHead>Avaliação Média</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamData.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.name}</TableCell>
                                    <TableCell className="text-text-secondary">{t.role}</TableCell>
                                    <TableCell>{t.projects}</TableCell>
                                    <TableCell>{t.tasks}</TableCell>
                                    <TableCell className={t.onTimeRate >= 95 ? 'text-green-400' : 'text-yellow-400'}>{t.onTimeRate}%</TableCell>
                                    <TableCell className="text-yellow-400 flex items-center gap-1">{t.rating} <Icon name="star" className="h-3 w-3" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Lucratividade Total</CardTitle><Icon name="dollar-sign" className="h-4 w-4 text-text-secondary" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-400">R$ 25.350</div><p className="text-xs text-text-secondary">Margem de 21.9%</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Custos Totais</CardTitle><Icon name="trendingDown" className="h-4 w-4 text-text-secondary" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">R$ 90.400</div><p className="text-xs text-text-secondary">+5% vs mês anterior</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Ticket Médio</CardTitle><Icon name="briefcase" className="h-4 w-4 text-text-secondary" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">R$ 29.187</div><p className="text-xs text-text-secondary">Por projeto</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Projetos Lucrativos</CardTitle><Icon name="checkCircle" className="h-4 w-4 text-text-secondary" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">4 / 4</div><p className="text-xs text-text-secondary">100% de sucesso</p></CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Receita vs Custo por Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={financialOverviewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Bar dataKey="revenue" fill="#38bdf8" name="Receita" />
                                <Bar dataKey="cost" fill="#ef4444" name="Custo" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Lucratividade por Projeto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={projectProfitabilityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                                <Bar dataKey="profit" fill="#22c55e" name="Lucro" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
