import React from 'react';
import { Proposal, QuoteRequest } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface ProposalDetailPageProps {
  proposal: Proposal;
  relatedQuote?: QuoteRequest;
  onBack: () => void;
  userType: 'operator' | 'client';
  onSend?: (proposalId: string) => void;
  onApprove?: (proposal: Proposal) => void;
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

const DetailItem: React.FC<{ label: string, value?: string | number, className?: string }> = ({ label, value, className }) => {
    if (!value) return null;
    return (
        <div className={className}>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
};

const ProposalDetailPage: React.FC<ProposalDetailPageProps> = ({ proposal, relatedQuote, onBack, userType, onSend, onApprove }) => {
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar para Propostas
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">{proposal.title}</h1>
                        <p className="text-sm text-text-secondary">Proposta para: {proposal.clientName} | ID: {proposal.id}</p>
                    </div>
                </div>
                {getStatusBadge(proposal.status)}
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <Tabs defaultValue="scope" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="scope">Escopo e Detalhes</TabsTrigger>
                            <TabsTrigger value="timeline">Cronograma e Equipe</TabsTrigger>
                            <TabsTrigger value="origin">Origem</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="scope" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detalhes da Proposta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Card className="p-4 bg-sidebar"><p className="text-sm text-text-secondary">Valor</p><p className="font-bold text-lg text-green-400">R$ {proposal.budget.toLocaleString()}</p></Card>
                                        <Card className="p-4 bg-sidebar"><p className="text-sm text-text-secondary">Prazo Final</p><p className="font-bold text-lg">{new Date(proposal.deadline).toLocaleDateString()}</p></Card>
                                        <Card className="p-4 bg-sidebar"><p className="text-sm text-text-secondary">Complexidade</p><p className="font-bold text-lg">{proposal.scopeDetails?.complexity}</p></Card>
                                        <Card className="p-4 bg-sidebar"><p className="text-sm text-text-secondary">Horas</p><p className="font-bold text-lg">{proposal.scopeDetails?.estimatedHours}h</p></Card>
                                    </div>
                                    <DetailItem label="Descrição Completa" value={proposal.description} />
                                    <DetailItem label="Proposta de Valor" value={proposal.scopeDetails?.valueProposition} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="timeline" className="mt-6">
                            <Card>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DetailItem label="Cronograma Estimado" value={proposal.scopeDetails?.timeline} />
                                    <DetailItem label="Equipe Sugerida" value={proposal.scopeDetails?.team} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="origin" className="mt-6">
                            {relatedQuote ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Solicitação de Orçamento Original</CardTitle>
                                        <CardDescription>ID: {relatedQuote.id}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-text-secondary italic">"{relatedQuote.projectDescription}"</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <p className="text-center text-text-secondary py-8">Esta proposta foi criada manualmente.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                    
                    {userType === 'client' && proposal.status === 'sent' && (
                        <Card className="mt-8 bg-accent/10 border-accent/30">
                            <CardHeader><CardTitle className="text-accent">Ação Necessária</CardTitle><CardDescription>Esta proposta está aguardando sua revisão.</CardDescription></CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" size="lg">Solicitar Alterações</Button>
                                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove && onApprove(proposal)}><Icon name="checkCircle" className="h-5 w-5 mr-2" />Aprovar Proposta</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {userType === 'operator' && proposal.status === 'draft' && (
                        <Card className="mt-8 bg-accent/10 border-accent/30">
                            <CardHeader><CardTitle className="text-accent">Ação Necessária</CardTitle><CardDescription>Esta proposta é um rascunho. Envie para o cliente quando estiver pronta.</CardDescription></CardHeader>
                            <CardFooter className="flex justify-end">
                                <Button size="lg" onClick={() => onSend && onSend(proposal.id)}><Icon name="share" className="h-5 w-5 mr-2" />Enviar para o Cliente</Button>
                            </CardFooter>
                        </Card>
                    )}

                </div>
            </main>
        </div>
    );
};

export default ProposalDetailPage;