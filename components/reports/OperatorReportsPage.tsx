import React, { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Label } from '../ui/Label';

const reportCategories = [
    {
        title: "Relatórios de Projetos",
        reports: [
            { title: "Progresso Geral", icon: "briefcase", metric: "78%", label: "Conclusão Média", data: [{ v: 30 }, { v: 50 }, { v: 45 }, { v: 60 }, { v: 78 }] },
            { title: "Orçamento vs. Realizado", icon: "dollar-sign", metric: "+12%", label: "Acima do Orçamento", data: [{ v: 10 }, { v: 20 }, { v: 15 }, { v: 30 }, { v: 40 }] },
            { title: "Prazos de Entrega", icon: "calendar", metric: "3", label: "Projetos Atrasados", data: [{ v: 1 }, { v: 0 }, { v: 2 }, { v: 1 }, { v: 3 }] },
            { title: "Tarefas por Status", icon: "checkSquare", metric: "125", label: "Tarefas Ativas", data: [{ v: 80 }, { v: 100 }, { v: 90 }, { v: 110 }, { v: 125 }] },
        ]
    },
    {
        title: "Relatórios Financeiros",
        reports: [
            { title: "Receita Mensal", icon: "trendingUp", metric: "R$ 45.8k", label: "+8% vs Mês Anterior", data: [{ v: 35 }, { v: 40 }, { v: 38 }, { v: 42 }, { v: 45.8 }] },
            { title: "Lucratividade por Projeto", icon: "barChart", metric: "28%", label: "Margem Média", data: [{ v: 22 }, { v: 25 }, { v: 30 }, { v: 27 }, { v: 28 }] },
            { title: "Custos Operacionais", icon: "trendingDown", metric: "R$ 18.2k", label: "-3% vs Mês Anterior", data: [{ v: 20 }, { v: 19 }, { v: 19.5 }, { v: 18.5 }, { v: 18.2 }] },
        ]
    },
    {
        title: "Relatórios de Equipe",
        reports: [
            { title: "Produtividade da Equipe", icon: "users", metric: "8.2", label: "Tarefas/Membro/Semana", data: [{ v: 7 }, { v: 7.5 }, { v: 8 }, { v: 8.5 }, { v: 8.2 }] },
            { title: "Horas Registradas", icon: "clock", metric: "1,240h", label: "Total no Período", data: [{ v: 1100 }, { v: 1150 }, { v: 1200 }, { v: 1180 }, { v: 1240 }] },
        ]
    },
     {
        title: "Relatórios de Clientes",
        reports: [
            { title: "Satisfação do Cliente (CSAT)", icon: "star", metric: "4.8/5", label: "Excelente", data: [{ v: 4.5 }, { v: 4.6 }, { v: 4.7 }, { v: 4.9 }, { v: 4.8 }] },
            { title: "Volume por Cliente", icon: "briefcase", metric: "R$ 23.1k", label: "Ticket Médio", data: [{ v: 20 }, { v: 22 }, { v: 21 }, { v: 24 }, { v: 23.1 }] },
        ]
    }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-card-border p-2 rounded-md">
        <p className="text-xs text-text-secondary">{`${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ReportCard: React.FC<{ title: string, icon: string, metric: string, label: string, data: { v: number }[] }> = ({ title, icon, metric, label, data }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Icon name={icon} className="h-5 w-5 text-accent" />
                <CardTitle className="text-base">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
            <div>
                <p className="text-3xl font-bold">{metric}</p>
                <p className="text-xs text-text-secondary">{label}</p>
                <div className="h-20 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}/>
                            <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-card-border">
                <Button variant="outline" size="sm" className="flex-1 gap-2"><Icon name="download" className="h-3 w-3" />Exportar (PDF)</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2"><Icon name="share" className="h-3 w-3" />Compartilhar</Button>
            </div>
        </CardContent>
    </Card>
);

const OperatorReportsPage = () => {
    const [dateFilter, setDateFilter] = useState("30d");
    return (
        <div className="space-y-8 animate-in fade-in-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Central de Relatórios</h1>
                    <p className="text-text-secondary mt-1">Analise a performance de seus projetos, equipe e finanças.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2"><Icon name="share" className="h-4 w-4" />Compartilhar Dashboard</Button>
                    <Button className="gap-2"><Icon name="download" className="h-4 w-4" />Exportar Todos</Button>
                </div>
            </div>
            
            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                     <div className="flex items-center gap-4">
                        <Label className="text-sm">Período:</Label>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                                <SelectItem value="12m">Últimos 12 meses</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </CardContent>
            </Card>

            {/* Reports Sections */}
            {reportCategories.map(category => (
                <div key={category.title}>
                    <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.reports.map(report => (
                            <ReportCard key={report.title} {...report} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OperatorReportsPage;