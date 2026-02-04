import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Invoice } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface OperatorInvoicesPageProps {
    invoices: Invoice[];
    onMarkAsPaid: (invoiceId: string) => void;
    onViewDetails: (invoiceId: string) => void;
}

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'overdue': return <Badge variant="destructive">Atrasada</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const StatCard: React.FC<{ title: string; value: string; icon: string; description?: string; }> = ({ title, value, icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        <Icon name={icon} className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
      </CardContent>
    </Card>
);

const revenueData = [
  { name: 'Mar', received: 18000 },
  { name: 'Abr', received: 22000 },
  { name: 'Mai', received: 19000 },
  { name: 'Jun', received: 25000 },
  { name: 'Jul', received: 23000 },
  { name: 'Ago', received: 2500 },
];


const OperatorInvoicesPage: React.FC<OperatorInvoicesPageProps> = ({ invoices, onMarkAsPaid, onViewDetails }) => {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredInvoices = useMemo(() => {
        if (statusFilter === 'all') return invoices;
        return invoices.filter(i => i.status === statusFilter);
    }, [invoices, statusFilter]);

    const metrics = useMemo(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        
        const receivedThisMonth = invoices
            .filter(i => i.status === 'paid' && i.issueDate >= firstDayOfMonth)
            .reduce((acc, i) => acc + i.amount, 0);
            
        const pendingValue = invoices
            .filter(i => i.status === 'pending' || i.status === 'overdue')
            .reduce((acc, i) => acc + i.amount, 0);
            
        const overdueCount = invoices.filter(i => i.status === 'overdue').length;

        return { receivedThisMonth, pendingValue, overdueCount };
    }, [invoices]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Central de Faturamento</h1>
                    <p className="text-text-secondary">Gerencie todas as faturas de seus clientes.</p>
                </div>
                <Button className="gap-2">
                    <Icon name="plus" className="h-4 w-4" />
                    Nova Fatura Manual
                </Button>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Recebido (Mês)" value={`R$ ${metrics.receivedThisMonth.toLocaleString()}`} icon="dollar-sign" />
                <StatCard title="Pendente de Recebimento" value={`R$ ${metrics.pendingValue.toLocaleString()}`} icon="clock" />
                <StatCard title="Faturas Atrasadas" value={metrics.overdueCount.toString()} icon="alertCircle" />
                <StatCard title="Total Faturado (Ano)" value={`R$ 130.000`} icon="barChart" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Faturas</CardTitle>
                    <div className="flex items-center pt-2">
                         <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="paid">Paga</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="overdue">Atrasada</SelectItem>
                                <SelectItem value="draft">Rascunho</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Emissão</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.clientName}</TableCell>
                                    <TableCell>{invoice.projectName}</TableCell>
                                    <TableCell>{invoice.issueDate}</TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
                                    <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {invoice.status === 'pending' && (
                                            <>
                                            <Button variant="outline" size="sm" onClick={() => onMarkAsPaid(invoice.id)}>Marcar como Paga</Button>
                                            <Button variant="outline" size="sm" onClick={() => alert('Lembrete enviado!')}>Lembrete</Button>
                                            </>
                                        )}
                                        <Button variant="ghost" size="sm"><Icon name="edit" className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(invoice.id)}><Icon name="eye" className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {invoices.length === 0 && (
                        <div className="text-center py-12 text-text-secondary">
                            <Icon name="dollar-sign" className="h-8 w-8 mx-auto mb-2" />
                            <p>Nenhuma fatura gerada. Faturas iniciais são criadas quando um cliente aprova uma proposta.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Receita Recebida por Mês</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                            <Line type="monotone" dataKey="received" stroke="#38bdf8" strokeWidth={2} name="Receita" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default OperatorInvoicesPage;