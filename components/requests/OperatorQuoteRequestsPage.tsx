import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { QuoteRequest } from '../../types';
import { Badge } from '../ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface OperatorQuoteRequestsPageProps {
    quoteRequests: QuoteRequest[];
    onCreateProposal: (quoteId: string) => void;
    onViewDetails: (quoteId: string) => void;
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


const OperatorQuoteRequestsPage: React.FC<OperatorQuoteRequestsPageProps> = ({ quoteRequests, onCreateProposal, onViewDetails }) => {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredQuoteRequests = useMemo(() => {
        if (statusFilter === 'all') return quoteRequests;
        return quoteRequests.filter(q => q.status === statusFilter);
    }, [quoteRequests, statusFilter]);

    const metrics = useMemo(() => {
        const total = quoteRequests.length;
        const pending = quoteRequests.filter(q => q.status === 'pending').length;
        const converted = quoteRequests.filter(q => q.status === 'converted').length;
        const conversionRate = total > 0 ? (converted / total) * 100 : 0;
        return { total, pending, converted, conversionRate };
    }, [quoteRequests]);

    const chartData = useMemo(() => {
        return [
            { name: 'Pendente', count: metrics.pending },
            { name: 'Convertida', count: metrics.converted },
        ];
    }, [metrics]);


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Central de Solicitações</h1>
                    <p className="text-text-secondary">Analise as solicitações dos clientes e crie propostas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Recebidas" value={metrics.total.toString()} icon="mail" />
                <StatCard title="Pendentes" value={metrics.pending.toString()} icon="clock" description="Aguardando criação de proposta" />
                <StatCard title="Convertidas" value={metrics.converted.toString()} icon="checkCircle" description="Propostas já foram geradas" />
                <StatCard title="Taxa de Conversão" value={`${metrics.conversionRate.toFixed(1)}%`} icon="trendingUp" />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Solicitações Recebidas</CardTitle>
                         <div className="flex items-center gap-4 pt-2">
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="converted">Convertida</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuoteRequests.map(request => (
                                <Card key={request.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{request.projectName}</CardTitle>
                                            <Badge variant={request.status === 'pending' ? 'outline' : 'default'} className={request.status === 'converted' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}>
                                                {request.status === 'pending' ? 'Pendente' : 'Convertida'}
                                            </Badge>
                                        </div>
                                        <CardDescription>{request.clientName}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-text-secondary line-clamp-3">{request.projectDescription}</p>
                                    </CardContent>
                                    <div className="p-4 border-t border-card-border flex flex-col sm:flex-row gap-2">
                                         <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(request.id)}>
                                            <Icon name="eye" className="h-4 w-4 mr-2"/> Ver Detalhes
                                        </Button>
                                        <Button 
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => onCreateProposal(request.id)}
                                            disabled={request.status === 'converted'}
                                        >
                                            <Icon name="file-text" className="h-4 w-4 mr-2"/>
                                            Criar Proposta
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                         {quoteRequests.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                <Icon name="mail" className="h-8 w-8 mx-auto mb-2" />
                                <p>Nenhuma solicitação de orçamento pendente.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OperatorQuoteRequestsPage;