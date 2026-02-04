import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton, DialogFooter } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const appointments = [
    { id: 1, title: 'Reunião de Acompanhamento - ERP', date: '25/07/2024', time: '14:00', with: 'Maria Oliveira' },
    { id: 2, title: 'Demonstração do Módulo de Vendas', date: '01/08/2024', time: '10:00', with: 'Carlos Silva' },
];

const ClientAppointmentsPage = () => {
    const [isScheduling, setIsScheduling] = useState(false);

    return (
        <div className="space-y-8">
             <Dialog open={isScheduling} onClose={() => setIsScheduling(false)}>
                <DialogHeader>
                    <DialogTitle>Agendar Nova Reunião</DialogTitle>
                    <DialogDescription>Selecione um tipo de reunião e um horário disponível.</DialogDescription>
                    <DialogCloseButton />
                </DialogHeader>
                <DialogContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Reunião</Label>
                        <Select>
                            <SelectTrigger id="type"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="follow-up">Reunião de Acompanhamento</SelectItem>
                                <SelectItem value="demo">Demonstração de Funcionalidade</SelectItem>
                                <SelectItem value="planning">Reunião de Planejamento</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Horário</Label>
                            <Input id="time" type="time" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notas (opcional)</Label>
                        <Textarea id="notes" placeholder="Tópicos que você gostaria de discutir..." />
                    </div>
                </DialogContent>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancelar</Button>
                    <Button onClick={() => setIsScheduling(false)}>Confirmar Agendamento</Button>
                </DialogFooter>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agendamentos</h1>
                    <p className="text-text-secondary">Gerencie suas reuniões com a equipe.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsScheduling(true)}>
                    <Icon name="plus" className="h-4 w-4" />
                    Agendar Reunião
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximas Reuniões</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {appointments.map(apt => (
                                <div key={apt.id} className="p-3 bg-sidebar/50 rounded-md border border-card-border">
                                    <p className="font-semibold">{apt.title}</p>
                                    <div className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                                        <Icon name="calendar" className="h-4 w-4" />
                                        <span>{apt.date} às {apt.time}</span>
                                    </div>
                                     <div className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                                        <Icon name="user" className="h-4 w-4" />
                                        <span>Com {apt.with}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Calendário</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="text-center py-24 bg-sidebar/50 rounded-lg border border-dashed border-card-border">
                                <Icon name="calendar" className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                                <p className="text-text-secondary">Visualização de calendário em desenvolvimento.</p>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClientAppointmentsPage;
