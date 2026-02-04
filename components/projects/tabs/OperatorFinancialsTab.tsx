import React from 'react';
import { Project } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';

interface OperatorFinancialsTabProps {
    project: Project;
}

const OperatorFinancialsTab: React.FC<OperatorFinancialsTabProps> = ({ project }) => {
    // Mock data as props are not available
    const mockContract = {
        title: `Contrato para ${project.name}`,
        amount: project.budget,
        terms: 'Termos padrão de serviço...',
    };

    const mockInvoices = [
        { id: 'FAT-001', issueDate: '2024-07-01', dueDate: '2024-07-15', amount: 2500, status: 'paid' },
        { id: 'FAT-002', issueDate: '2024-08-01', dueDate: '2024-08-15', amount: 2500, status: 'pending' }
    ];

    const mockProjectCosts = [
        { id: 'cost-1', description: 'Horas de Desenvolvimento (Sprint 1)', category: 'Desenvolvimento', date: '2024-07-15', amount: 12500, paidBy: 'Operador' },
        { id: 'cost-2', description: 'Assinatura Vercel Pro', category: 'Hospedagem', date: '2024-07-01', amount: 150, paidBy: 'Cliente' },
        { id: 'cost-3', description: 'Registro de Domínio', category: 'Domínio', date: '2024-06-28', amount: 80, paidBy: 'Operador' },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contrato do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Título:</strong> {mockContract.title}</p>
                    <p><strong>Valor:</strong> R$ {Number(mockContract.amount).toLocaleString()}</p>
                    <p className="mt-2 text-text-secondary whitespace-pre-wrap">{mockContract.terms}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Faturas Emitidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Fatura</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {mockInvoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
                                    <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                    <TableCell>{invoice.status === 'paid' ? <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge> : <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Custos do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Categoria</TableHead><TableHead>Data</TableHead><TableHead>Pago por</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {mockProjectCosts.map(cost => (
                                <TableRow key={cost.id}>
                                    <TableCell>{cost.description}</TableCell>
                                    <TableCell>{cost.category}</TableCell>
                                    <TableCell>{cost.date}</TableCell>
                                    <TableCell>{cost.paidBy}</TableCell>
                                    <TableCell className="text-right">R$ {cost.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default OperatorFinancialsTab;