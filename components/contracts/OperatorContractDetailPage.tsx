import React from 'react';
import { Contract, Invoice } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ScrollArea } from '../ui/ScrollArea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

interface OperatorContractDetailPageProps {
  contract: Contract;
  invoices: Invoice[];
  onBack: () => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'signed': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Assinado</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente de Assinatura</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const getInvoiceStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'overdue': return <Badge variant="destructive">Atrasada</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const mockHistory = [
    { event: 'Contrato Gerado', date: '2024-07-20 10:00', icon: 'file-text' },
    { event: 'Enviado para o Cliente', date: '2024-07-20 10:05', icon: 'share' },
    { event: 'Visualizado pelo Cliente', date: '2024-07-21 14:30', icon: 'eye' },
];

const OperatorContractDetailPage: React.FC<OperatorContractDetailPageProps> = ({ contract, invoices, onBack }) => {
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar aos Contratos
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">{contract.title}</h1>
                        <p className="text-sm text-text-secondary">Cliente: {contract.clientName} | Projeto: {contract.projectName}</p>
                    </div>
                </div>
                {getStatusBadge(contract.status)}
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Detalhes do Contrato</TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                            <TabsTrigger value="invoices">Faturas Vinculadas</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="details" className="mt-6 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card><CardHeader><CardTitle className="text-sm font-medium text-text-secondary">Valor do Contrato</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-400">R$ {contract.amount.toLocaleString()}</p></CardContent></Card>
                                <Card><CardHeader><CardTitle className="text-sm font-medium text-text-secondary">Projeto Associado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{contract.projectName}</p></CardContent></Card>
                                <Card><CardHeader><CardTitle className="text-sm font-medium text-text-secondary">Status</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{getStatusBadge(contract.status)}</div></CardContent></Card>
                            </div>
                            <Card>
                                <CardHeader><CardTitle>Termos e Condições</CardTitle></CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-80 p-4 bg-background rounded-md border border-card-border">
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{contract.terms}</p>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>Linha do Tempo</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-card-border"></div>
                                        {mockHistory.map((item, index) => (
                                            <div key={index} className="relative mb-6">
                                                <div className="absolute -left-2.5 top-1.5 w-5 h-5 bg-accent rounded-full ring-4 ring-background"></div>
                                                <div className="ml-8">
                                                    <p className="font-semibold flex items-center gap-2"><Icon name={item.icon} className="h-4 w-4" /> {item.event}</p>
                                                    <p className="text-sm text-text-secondary">{item.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                         {contract.status === 'signed' && (
                                            <div className="relative">
                                                <div className="absolute -left-2.5 top-1.5 w-5 h-5 bg-green-500 rounded-full ring-4 ring-background"></div>
                                                <div className="ml-8">
                                                    <p className="font-semibold flex items-center gap-2"><Icon name="checkCircle" className="h-4 w-4" /> Contrato Assinado</p>
                                                    <p className="text-sm text-text-secondary">{new Date(contract.signedAt!).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="invoices" className="mt-6">
                             <Card>
                                <CardHeader><CardTitle>Faturas do Projeto</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Fatura</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {invoices.map(invoice => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                     {contract.status === 'pending' && (
                        <Card className="mt-8 bg-accent/10 border-accent/30">
                            <CardHeader>
                                <CardTitle className="text-accent">Ações do Operador</CardTitle>
                                <CardDescription>Este contrato está aguardando a assinatura do cliente.</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end">
                                <Button size="lg" onClick={() => alert('Lembrete enviado!')}>
                                    <Icon name="mail" className="h-5 w-5 mr-2" />
                                    Enviar Lembrete de Assinatura
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                     {contract.status === 'signed' && (
                        <Card className="mt-8 bg-green-500/10 border-green-500/30">
                            <CardHeader>
                                <CardTitle className="text-green-300">Contrato Ativo</CardTitle>
                                <CardDescription>Este contrato foi assinado pelo cliente em {new Date(contract.signedAt!).toLocaleDateString()}.</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OperatorContractDetailPage;