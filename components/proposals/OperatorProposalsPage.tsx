import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Proposal } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface OperatorProposalsPageProps {
    proposals: Proposal[];
    onSend: (proposalId: string) => void;
    onViewDetails: (proposalId: string) => void;
}

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'approved': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Aprovada</Badge>;
        case 'sent': return <Badge variant="secondary" className="bg-sky-500/10 text-sky-400">Enviada</Badge>;
        case 'draft': return <Badge variant="outline">Rascunho</Badge>;
        case 'rejected': return <Badge variant="destructive">Rejeitada</Badge>;
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


const OperatorProposalsPage: React.FC<OperatorProposalsPageProps> = ({ proposals, onSend, onViewDetails }) => {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProposals = useMemo(() => {
        if (statusFilter === 'all') return proposals;
        return proposals.filter(p => p.status === statusFilter);
    }, [proposals, statusFilter]);
    
    const metrics = useMemo(() => {
        const sentProposals = proposals.filter(p => p.status === 'sent');
        const approvedProposals = proposals.filter(p => p.status === 'approved');
        const totalSentOrApproved = sentProposals.length + approvedProposals.length;
        
        return {
            openValue: sentProposals.reduce((acc, p) => acc + p.budget, 0),
            conversionRate: totalSentOrApproved > 0 ? (approvedProposals.length / totalSentOrApproved) * 100 : 0,
            sentCount: sentProposals.length,
            draftCount: proposals.filter(p => p.status === 'draft').length,
        };
    }, [proposals]);

    const chartData = useMemo(() => {
        const statuses = ['draft', 'sent', 'approved', 'rejected'];
        return statuses.map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            count: proposals.filter(p => p.status === status).length
        }));
    }, [proposals]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Central de Propostas</h1>
                    <p className="text-text-secondary">Crie e gerencie suas propostas de serviço.</p>
                </div>
                <Button className="gap-2">
                    <Icon name="plus" className="h-4 w-4" />
                    Nova Proposta Manual
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Valor em Aberto" value={`R$ ${metrics.openValue.toLocaleString()}`} icon="dollar-sign" description="Soma das propostas enviadas" />
                <StatCard title="Taxa de Conversão" value={`${metrics.conversionRate.toFixed(1)}%`} icon="trendingUp" description="Propostas aprovadas vs. enviadas" />
                <StatCard title="Propostas Enviadas" value={metrics.sentCount.toString()} icon="share" description="Aguardando resposta do cliente" />
                <StatCard title="Rascunhos" value={metrics.draftCount.toString()} icon="edit" description="Propostas a serem finalizadas" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciamento de Propostas</CardTitle>
                            <div className="flex items-center gap-4 pt-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filtrar por status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Status</SelectItem>
                                        <SelectItem value="draft">Rascunho</SelectItem>
                                        <SelectItem value="sent">Enviada</SelectItem>
                                        <SelectItem value="approved">Aprovada</SelectItem>
                                        <SelectItem value="rejected">Rejeitada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProposals.map(proposal => (
                            <Card key={proposal.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                                        {getStatusBadge(proposal.status)}
                                    </div>
                                    <p className="text-sm text-text-secondary">{proposal.clientName}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <div className="text-sm"><strong>Valor:</strong> <span className="text-green-400 font-semibold">R$ {proposal.budget.toLocaleString()}</span></div>
                                    <div className="text-sm"><strong>Prazo:</strong> {new Date(proposal.deadline).toLocaleDateString()}</div>
                                </CardContent>
                                <CardFooter className="border-t border-card-border p-3 flex gap-2">
                                     {proposal.status === 'draft' && (
                                        <Button variant="outline" size="sm" onClick={() => onSend(proposal.id)} className="flex-1">
                                            <Icon name="share" className="h-4 w-4 mr-2" />
                                            Enviar
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(proposal.id)}>
                                        <Icon name="eye" className="h-4 w-4 mr-2" />
                                        Detalhes
                                    </Button>
                                    <Button variant="ghost" size="sm"><Icon name="edit" className="h-4 w-4" /></Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                     {filteredProposals.length === 0 && (
                        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-card-border rounded-lg">
                            <Icon name="file-text" className="h-8 w-8 mx-auto mb-2" />
                            <p>Nenhuma proposta encontrada para este filtro.</p>
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Propostas por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Bar dataKey="count" fill="#38bdf8" name="Quantidade" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OperatorProposalsPage;