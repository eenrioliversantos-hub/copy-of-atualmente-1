import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Contract } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


interface ClientContractsPageProps {
    contracts: Contract[];
    onSign: (contractId: string) => void;
    onViewDetails: (contractId: string) => void;
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
    switch (status) {
        case 'signed': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Assinado</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'expired': return <Badge variant="outline">Expirado</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

const COLORS = {
    pending: '#f59e0b',
    signed: '#22c55e',
    expired: '#64748b'
};

const ClientContractsPage: React.FC<ClientContractsPageProps> = ({ contracts, onSign, onViewDetails }) => {
    const metrics = useMemo(() => {
        return {
            pending: contracts.filter(c => c.status === 'pending').length,
            signed: contracts.filter(c => c.status === 'signed').length,
        }
    }, [contracts]);

    const chartData = useMemo(() => {
        const statuses = ['pending', 'signed', 'expired'];
        return statuses.map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: contracts.filter(c => c.status === status).length,
        })).filter(item => item.value > 0);
    }, [contracts]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Central de Contratos</h1>
                <p className="text-text-secondary">Visualize e gerencie seus contratos e aditivos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Contratos Pendentes" value={metrics.pending.toString()} icon="pen-tool" />
                <StatCard title="Contratos Ativos" value={metrics.signed.toString()} icon="checkCircle" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seus Contratos</CardTitle>
                            <CardDescription>Aqui estão todos os documentos legais associados aos seus projetos.</CardDescription>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contracts.map(contract => (
                            <Card key={contract.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                                        {getStatusBadge(contract.status)}
                                    </div>
                                    <p className="text-sm text-text-secondary">Projeto: {contract.projectName}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <div className="text-sm"><strong>Valor:</strong> <span className="text-green-400 font-semibold">R$ {contract.amount.toLocaleString()}</span></div>
                                     <div className="text-sm"><strong>Assinado em:</strong> {contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : 'N/A'}</div>
                                </CardContent>
                                <CardFooter className="border-t border-card-border p-3 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(contract.id)}>Detalhes</Button>
                                    {contract.status === 'pending' && (
                                        <Button size="sm" className="flex-1" onClick={() => onSign(contract.id)}>Assinar</Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {contracts.length === 0 && (
                        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-card-border rounded-lg">
                            <Icon name="book" className="h-8 w-8 mx-auto mb-2" />
                            <p>Nenhum contrato encontrado. Contratos são gerados após a aprovação de uma proposta.</p>
                        </div>
                    )}
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Contratos por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClientContractsPage;