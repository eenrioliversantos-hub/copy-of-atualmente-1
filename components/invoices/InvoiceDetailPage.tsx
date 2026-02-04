import React from 'react';
import { Invoice, Project } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface InvoiceDetailPageProps {
  invoice: Invoice;
  relatedProject?: Project;
  onBack: () => void;
  userType: 'operator' | 'client';
  onMarkAsPaid?: (invoiceId: string) => void;
  onPay?: (invoiceId: string) => void;
}

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': return <Badge variant="secondary" className="bg-green-500/10 text-green-400 text-base px-3 py-1">Paga</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 text-base px-3 py-1">Pendente</Badge>;
        case 'overdue': return <Badge variant="destructive" className="text-base px-3 py-1">Atrasada</Badge>;
        default: return <Badge variant="outline" className="text-base px-3 py-1">{status}</Badge>;
    }
}

const InvoiceDetailPage: React.FC<InvoiceDetailPageProps> = ({ invoice, relatedProject, onBack, userType, onMarkAsPaid, onPay }) => {
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar para Faturamento
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">Detalhes da Fatura #{invoice.id}</h1>
                        <p className="text-sm text-text-secondary">Cliente: {invoice.clientName}</p>
                    </div>
                </div>
                <Button variant="outline"><Icon name="download" className="h-4 w-4 mr-2" />Baixar PDF</Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="flex flex-row justify-between items-start p-8 bg-sidebar/50">
                        <div>
                            <h2 className="text-2xl font-bold">FATURA</h2>
                            <p className="text-text-secondary font-mono">{invoice.id}</p>
                        </div>
                        <div className="text-right">
                             {getStatusBadge(invoice.status)}
                             <p className="text-sm text-text-secondary mt-2">Valor Total</p>
                             <p className="text-3xl font-bold text-green-400">R$ {invoice.amount.toLocaleString()}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                         <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm text-text-secondary mb-2">Cobrado de</h3>
                                <p className="font-semibold">{invoice.clientName}</p>
                            </div>
                             <div>
                                <h3 className="text-sm text-text-secondary mb-2">Detalhes</h3>
                                <p><strong>Data de Emissão:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                                <p><strong>Data de Vencimento:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Itens da Fatura</h3>
                            <div className="border rounded-lg">
                                <div className="p-4 flex justify-between font-medium bg-sidebar">
                                    <span>Descrição</span>
                                    <span>Valor</span>
                                </div>
                                <div className="p-4 flex justify-between">
                                    <span>{invoice.projectName}</span>
                                    <span>R$ {invoice.amount.toLocaleString()}</span>
                                </div>
                                 <div className="p-4 flex justify-between font-bold text-lg border-t border-card-border bg-sidebar">
                                    <span>Total</span>
                                    <span>R$ {invoice.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    {userType === 'client' && invoice.status !== 'paid' && (
                         <CardFooter className="p-8 border-t border-card-border">
                            <Button size="lg" className="w-full" onClick={() => onPay && onPay(invoice.id)}>
                                <Icon name="creditCard" className="h-5 w-5 mr-2" />
                                Pagar Fatura Agora
                            </Button>
                        </CardFooter>
                    )}
                    {userType === 'operator' && invoice.status !== 'paid' && (
                         <CardFooter className="p-8 border-t border-card-border flex justify-end gap-2">
                            <Button variant="outline" size="lg" onClick={() => alert('Lembrete enviado!')}>
                                <Icon name="mail" className="h-5 w-5 mr-2" />
                                Enviar Lembrete
                            </Button>
                            <Button size="lg" onClick={() => onMarkAsPaid && onMarkAsPaid(invoice.id)}>
                                <Icon name="checkCircle" className="h-5 w-5 mr-2" />
                                Marcar como Paga
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </main>
        </div>
    );
};

export default InvoiceDetailPage;