import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Invoice } from '../../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ClientInvoicesPageProps {
    invoices: Invoice[];
    onPay: (invoiceId: string) => void;
    onViewDetails: (invoiceId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: string; }> = ({ title, value, icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        <Icon name={icon} className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
);


const getStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'overdue': return <Badge variant="destructive">Atrasada</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const ClientInvoicesPage: React.FC<ClientInvoicesPageProps> = ({ invoices, onPay, onViewDetails }) => {
    const metrics = useMemo(() => {
        return {
            pendingValue: invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0),
            overdueCount: invoices.filter(i => i.status === 'overdue').length,
            totalPaid: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0),
        };
    }, [invoices]);

    const chartData = useMemo(() => {
        const statuses = ['paid', 'pending', 'overdue'];
        return statuses.map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: invoices.filter(i => i.status === status).length,
            fill: status === 'paid' ? '#22c55e' : status === 'pending' ? '#f59e0b' : '#ef4444',
        }));
    }, [invoices]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Central de Faturamento</h1>
                <p className="text-text-secondary">Consulte seu histórico de faturamento e realize pagamentos.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Pendente" value={`R$ ${metrics.pendingValue.toLocaleString()}`} icon="clock" />
                <StatCard title="Faturas Vencidas" value={metrics.overdueCount.toString()} icon="alertCircle" />
                <StatCard title="Total Pago (Ano)" value={`R$ ${metrics.totalPaid.toLocaleString()}`} icon="checkCircle" />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Histórico de Faturas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Número</TableHead>
                                    <TableHead>Projeto</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map(invoice => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id}</TableCell>
                                        <TableCell>{invoice.projectName}</TableCell>
                                        <TableCell className="text-text-secondary">{invoice.dueDate}</TableCell>
                                        <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            {(invoice.status === 'pending' || invoice.status === 'overdue') && 
                                                <Button size="sm" onClick={() => onPay(invoice.id)}>Pagar Agora</Button>
                                            }
                                            <Button variant="ghost" size="sm" onClick={() => onViewDetails(invoice.id)}><Icon name="eye" className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="sm"><Icon name="download" className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {invoices.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                <Icon name="creditCard" className="h-8 w-8 mx-auto mb-2" />
                                <p>Nenhuma fatura encontrada.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Faturas por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Bar dataKey="value" name="Quantidade" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClientInvoicesPage;