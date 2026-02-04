import React from 'react';
import { QuoteRequest, Proposal } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface QuoteRequestDetailPageProps {
  quote: QuoteRequest;
  relatedProposal?: Proposal;
  onBack: () => void;
  userType: 'operator' | 'client';
  onCreateProposal?: (quoteId: string) => void;
  onViewProposal?: (proposalId: string) => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'converted': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Convertida</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const QuoteRequestDetailPage: React.FC<QuoteRequestDetailPageProps> = ({ quote, relatedProposal, onBack, userType, onCreateProposal, onViewProposal }) => {
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar para Solicitações
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">{quote.projectName}</h1>
                        <p className="text-sm text-text-secondary">Solicitação de: {quote.clientName} | ID: {quote.id}</p>
                    </div>
                </div>
                {getStatusBadge(quote.status)}
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Descrição da Solicitação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary italic">"{quote.projectDescription}"</p>
                        </CardContent>
                    </Card>

                    {userType === 'operator' && quote.status === 'pending' && (
                        <Card className="bg-accent/10 border-accent/30">
                            <CardHeader>
                                <CardTitle className="text-accent">Ação Necessária</CardTitle>
                                <CardDescription>Esta solicitação está pendente e precisa de uma proposta.</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end">
                                <Button size="lg" onClick={() => onCreateProposal && onCreateProposal(quote.id)}>
                                    <Icon name="file-text" className="h-5 w-5 mr-2" />
                                    Criar Proposta
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {quote.status === 'converted' && relatedProposal && (
                         <Card>
                            <CardHeader>
                                <CardTitle>Proposta Vinculada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Esta solicitação foi convertida na proposta <Badge variant="outline">{relatedProposal.id}</Badge>.</p>
                                <div className="mt-4">
                                    <Button variant="outline" onClick={() => onViewProposal && onViewProposal(relatedProposal.id)}>
                                        <Icon name="eye" className="h-4 w-4 mr-2" />
                                        Ver Proposta
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuoteRequestDetailPage;