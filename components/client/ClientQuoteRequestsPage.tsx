import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { QuoteRequest } from '../../types';

interface ClientQuoteRequestsPageProps {
    quoteRequests: QuoteRequest[];
    onViewDetails: (quoteId: string) => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'converted': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Convertida</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const ClientQuoteRequestsPage: React.FC<ClientQuoteRequestsPageProps> = ({ quoteRequests, onViewDetails }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Minhas Solicitações</h1>
                <p className="text-text-secondary">Acompanhe o status das suas solicitações de orçamento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quoteRequests.map(request => (
                    <Card key={request.id} className="flex flex-col">
                        <CardHeader>
                             <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{request.projectName}</CardTitle>
                                {getStatusBadge(request.status)}
                            </div>
                            <CardDescription>Enviada em: {new Date(request.createdAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-text-secondary line-clamp-3">"{request.projectDescription}"</p>
                        </CardContent>
                        <div className="p-4 border-t border-card-border">
                            <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(request.id)}>
                                <Icon name="eye" className="h-4 w-4 mr-2"/>
                                Ver Detalhes
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {quoteRequests.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-card-border rounded-lg">
                    <Icon name="mail" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Nenhuma solicitação encontrada</h3>
                    <p className="text-text-secondary">Você pode solicitar um novo orçamento a partir do seu dashboard.</p>
                </div>
            )}
        </div>
    );
};

export default ClientQuoteRequestsPage;