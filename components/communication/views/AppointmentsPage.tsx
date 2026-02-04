import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton, DialogFooter } from '../../ui/Dialog';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Appointment } from '../../../types';

interface AppointmentsPageProps {
    appointments: Appointment[];
    onScheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ appointments, onScheduleAppointment }) => {
    const [isScheduling, setIsScheduling] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 1)); // July 2024 for demo
    const [newAppointment, setNewAppointment] = useState({ title: '', type: '', date: '', time: '', notes: '', with: [] });

    const handleSchedule = () => {
        if (newAppointment.title && newAppointment.date && newAppointment.time) {
            onScheduleAppointment(newAppointment);
            setIsScheduling(false);
            setNewAppointment({ title: '', type: '', date: '', time: '', notes: '', with: [] }); // Reset form
        } else {
            alert("Por favor, preencha os campos obrigatórios.");
        }
    };

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const calendarDays = Array.from({ length: firstDayOfMonth }, () => null)
        .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };
    
    const upcomingAppointments = appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8 h-full flex flex-col">
             <Dialog open={isScheduling} onClose={() => setIsScheduling(false)}>
                <DialogHeader>
                    <DialogTitle>Agendar Nova Reunião</DialogTitle>
                    <DialogDescription>Selecione um tipo de reunião e um horário disponível.</DialogDescription>
                    <DialogCloseButton />
                </DialogHeader>
                <DialogContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="title">Título da Reunião</Label>
                        <Input id="title" value={newAppointment.title} onChange={(e) => setNewAppointment(p => ({...p, title: e.target.value}))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Reunião</Label>
                        <Select onValueChange={(v) => setNewAppointment(p => ({...p, type: v}))}>
                            <SelectTrigger id="type"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Acompanhamento">Reunião de Acompanhamento</SelectItem>
                                <SelectItem value="Demonstração">Demonstração de Funcionalidade</SelectItem>
                                <SelectItem value="Planejamento">Reunião de Planejamento</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" value={newAppointment.date} onChange={(e) => setNewAppointment(p => ({...p, date: e.target.value}))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Horário</Label>
                            <Input id="time" type="time" value={newAppointment.time} onChange={(e) => setNewAppointment(p => ({...p, time: e.target.value}))} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notas (opcional)</Label>
                        <Textarea id="notes" placeholder="Tópicos que você gostaria de discutir..." value={newAppointment.notes} onChange={(e) => setNewAppointment(p => ({...p, notes: e.target.value}))} />
                    </div>
                </DialogContent>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancelar</Button>
                    <Button onClick={handleSchedule}>Confirmar Agendamento</Button>
                </DialogFooter>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agendamentos</h1>
                    <p className="text-text-secondary">Gerencie suas reuniões com a equipe e clientes.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsScheduling(true)}>
                    <Icon name="plus" className="h-4 w-4" />
                    Agendar Reunião
                </Button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                     <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}><Icon name="chevronLeft" className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="sm" onClick={() => changeMonth(1)}><Icon name="chevronRight" className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-card-border border-t border-card-border">
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-xs font-bold text-text-secondary py-2 bg-sidebar">{day}</div>
                            ))}
                            {calendarDays.map((day, index) => {
                                const dayAppointments = day ? appointments.filter(a => {
                                    const aDate = new Date(a.date);
                                    return aDate.getFullYear() === currentDate.getFullYear() &&
                                           aDate.getMonth() === currentDate.getMonth() &&
                                           aDate.getDate() + 1 === day // Date object month is 0-indexed, so we add 1
                                }) : [];
                                
                                return (
                                    <div key={index} className={`bg-sidebar p-2 overflow-y-auto ${day ? 'hover:bg-slate-700' : 'bg-sidebar/50'}`}>
                                        <div className="font-semibold text-right text-sm">{day}</div>
                                        <div className="space-y-1 mt-1">
                                            {dayAppointments.map(apt => (
                                                <div key={apt.id} className="bg-accent/20 border-l-2 border-accent text-accent-foreground p-1 rounded">
                                                    <p className="text-xs font-semibold truncate">{apt.title}</p>
                                                    <p className="text-xs opacity-80">{apt.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximas Reuniões</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingAppointments.length > 0 ? upcomingAppointments.map(apt => (
                                <div key={apt.id} className="p-3 bg-sidebar/50 rounded-md border border-card-border">
                                    <p className="font-semibold text-sm">{apt.title}</p>
                                    <div className="text-xs text-text-secondary flex items-center gap-2 mt-1">
                                        <Icon name="calendar" className="h-3 w-3" />
                                        <span>{new Date(apt.date).toLocaleDateString()} às {apt.time}</span>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-center text-text-secondary py-4">Nenhuma reunião agendada.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;