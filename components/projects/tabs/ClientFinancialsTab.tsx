import React from 'react';
import { Project, Invoice } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';

interface ClientFinancialsTabProps {
    project: Project;
    invoices: Invoice[];
}

const mockProjectCosts = [
    { id: 'cost-1', description: 'Horas de Desenvolvimento (Sprint 1)', category: 'Desenvolvimento', date: '2024-07-15', amount: 12500 },
    { id: 'cost-2', description: 'Assinatura Vercel Pro', category: 'Hospedagem', date: '2024-07-01', amount: 150 },
    { id: 'cost-3', description: 'Registro de Domínio (meuprojeto.com)', category: 'Domínio', date: '2024-06-28', amount: 80 },
    { id: 'cost-4', description: 'Licença de Software (API de Pagamento)', category: 'Serviços', date: '2024-07-10', amount: 500 },
];


const ClientFinancialsTab: React.FC<ClientFinancialsTabProps> = ({ project, invoices }) => {

    const projectInvoices = (invoices || []).filter(i => i.projectId === project.id);
    const totalBilled = projectInvoices.reduce((acc, i) => acc + i.amount, 0);
    const totalPaid = projectInvoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Orçamento Total</p>
                        <p className="font-bold text-lg">R$ {Number(project.budget || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Total Faturado</p>
                        <p className="font-bold text-lg text-green-400">R$ {totalBilled.toLocaleString()}</p>
                    </div>
                     <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Total Pago</p>
                        <p className="font-bold text-lg text-sky-400">R$ {totalPaid.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Faturas do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Fatura</TableHead><TableHead>Emissão</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {projectInvoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell><TableCell>{invoice.issueDate}</TableCell><TableCell>{invoice.dueDate}</TableCell><TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                    <TableCell>{invoice.status === 'paid' ? <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge> : invoice.status === 'pending' ? <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge> : <Badge variant="destructive">Atrasada</Badge>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {projectInvoices.length === 0 && (<p className="text-center text-text-secondary py-8">Nenhuma fatura encontrada.</p>)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Custos Detalhados do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Categoria</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {mockProjectCosts.map(cost => (
                                <TableRow key={cost.id}>
                                    <TableCell>{cost.description}</TableCell><TableCell>{cost.category}</TableCell><TableCell>{cost.date}</TableCell><TableCell className="text-right">R$ {cost.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientFinancialsTab;