import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Proposal } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ClientProposalsPageProps {
    proposals: Proposal[];
    onApprove: (proposal: Proposal) => void;
    onViewDetails: (proposalId: string) => void;
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

const COLORS = {
    sent: '#38bdf8',
    approved: '#22c55e',
    rejected: '#ef4444',
    draft: '#64748b'
};

const ClientProposalsPage: React.FC<ClientProposalsPageProps> = ({ proposals, onApprove, onViewDetails }) => {
    const metrics = useMemo(() => {
        const pending = proposals.filter(p => p.status === 'sent');
        return {
            pendingCount: pending.length,
            pendingValue: pending.reduce((acc, p) => acc + p.budget, 0),
        };
    }, [proposals]);

    const chartData = useMemo(() => {
        const statuses = ['sent', 'approved', 'rejected'];
        return statuses.map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: proposals.filter(p => p.status === status).length
        })).filter(item => item.value > 0);
    }, [proposals]);
    
    const pendingProposals = proposals.filter(p => p.status === 'sent');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Central de Propostas</h1>
                <p className="text-text-secondary">Revise e aprove as propostas de serviço enviadas para você.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Propostas Pendentes" value={metrics.pendingCount.toString()} icon="mail" description="Aguardando sua revisão" />
                <StatCard title="Valor em Aberto" value={`R$ ${metrics.pendingValue.toLocaleString()}`} icon="dollar-sign" description="Soma das propostas pendentes" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Propostas Pendentes</CardTitle>
                            <CardDescription>Abaixo estão as propostas aguardando sua aprovação.</CardDescription>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {pendingProposals.map(proposal => (
                            <Card key={proposal.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                                    <CardDescription>Enviada em {new Date().toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <div className="text-sm"><strong>Valor:</strong> <span className="text-green-400 font-semibold">R$ {proposal.budget.toLocaleString()}</span></div>
                                    <div className="text-sm"><strong>Prazo:</strong> {new Date(proposal.deadline).toLocaleDateString()}</div>
                                </CardContent>
                                <CardFooter className="border-t border-card-border p-3 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(proposal.id)}>Visualizar</Button>
                                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onApprove(proposal)}>Aprovar</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {pendingProposals.length === 0 && (
                        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-card-border rounded-lg">
                            <Icon name="file-text" className="h-8 w-8 mx-auto mb-2" />
                            <p>Nenhuma proposta pendente no momento.</p>
                        </div>
                    )}
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Propostas por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
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

export default ClientProposalsPage;