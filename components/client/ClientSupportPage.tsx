import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const tickets = [
    { id: 'TKT-003', subject: 'Exportação de relatório não funciona', status: 'Aberto', priority: 'Alta', lastUpdate: '2h atrás' },
    { id: 'TKT-002', subject: 'Dúvida sobre fatura FAT-003', status: 'Em Andamento', priority: 'Média', lastUpdate: '1 dia atrás' },
    { id: 'TKT-001', subject: 'Erro ao fazer login', status: 'Resolvido', priority: 'Alta', lastUpdate: '3 dias atrás' },
];

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Aberto': return <Badge variant="secondary" className="bg-red-500/10 text-red-400">{status}</Badge>;
        case 'Em Andamento': return <Badge variant="secondary" className="bg-sky-500/10 text-sky-400">{status}</Badge>;
        case 'Resolvido': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">{status}</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const getPriorityBadge = (priority: string) => {
    switch(priority) {
        case 'Alta': return <Badge variant="destructive">{priority}</Badge>;
        case 'Média': return <Badge variant="secondary">{priority}</Badge>;
        case 'Baixa': return <Badge variant="outline">{priority}</Badge>;
        default: return <Badge variant="outline">{priority}</Badge>;
    }
}

const ClientSupportPage = () => {
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    return (
        <div className="space-y-8">
            <Dialog open={isCreatingTicket} onClose={() => setIsCreatingTicket(false)}>
                <DialogHeader>
                    <DialogTitle>Abrir Novo Ticket de Suporte</DialogTitle>
                    <DialogDescription>Descreva seu problema ou dúvida e nossa equipe responderá em breve.</DialogDescription>
                    <DialogCloseButton />
                </DialogHeader>
                 <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input id="subject" placeholder="Ex: Erro ao gerar fatura" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="priority">Prioridade</Label>
                        <Select>
                            <SelectTrigger id="priority"><SelectValue placeholder="Selecione a prioridade..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" placeholder="Descreva o problema em detalhes..." />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="attachment">Anexo (opcional)</Label>
                        <Input id="attachment" type="file" />
                    </div>
                </DialogContent>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingTicket(false)}>Cancelar</Button>
                    <Button onClick={() => setIsCreatingTicket(false)}>Enviar Ticket</Button>
                </DialogFooter>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Suporte</h1>
                    <p className="text-text-secondary">Abra e acompanhe seus tickets de suporte.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsCreatingTicket(true)}>
                    <Icon name="plus" className="h-4 w-4" />
                    Abrir Ticket
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Seus Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Prioridade</TableHead>
                                <TableHead>Última Atualização</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map(ticket => (
                                <TableRow key={ticket.id} className="cursor-pointer hover:bg-sidebar/50">
                                    <TableCell className="font-medium">{ticket.id}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                    <TableCell className="text-text-secondary">{ticket.lastUpdate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Icon name="eye" className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientSupportPage;
