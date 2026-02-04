import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';

interface CommunicationDashboardProps {
    setActiveView: (view: string) => void;
}

const CommunicationDashboard: React.FC<CommunicationDashboardProps> = ({ setActiveView }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard de Comunicação</h1>
                <p className="text-text-secondary">Sua visão geral de todas as interações recentes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-accent transition-colors cursor-pointer" onClick={() => setActiveView('messages')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon name="messageCircle" className="h-5 w-5" />
                            Mensagens Não Lidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">5</p>
                        <p className="text-sm text-text-secondary">em 3 conversas</p>
                    </CardContent>
                </Card>
                <Card className="hover:border-accent transition-colors cursor-pointer" onClick={() => setActiveView('appointments')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon name="calendarDays" className="h-5 w-5" />
                            Próximos Agendamentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">2</p>
                        <p className="text-sm text-text-secondary">para esta semana</p>
                    </CardContent>
                </Card>
                <Card className="hover:border-accent transition-colors cursor-pointer" onClick={() => setActiveView('tickets')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon name="ticket" className="h-5 w-5" />
                            Tickets Abertos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">3</p>
                        <p className="text-sm text-text-secondary">Aguardando resposta</p>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button className="gap-2" onClick={() => setActiveView('messages')}><Icon name="plus" className="h-4 w-4"/>Nova Mensagem</Button>
                    <Button variant="outline" className="gap-2" onClick={() => setActiveView('appointments')}><Icon name="calendar" className="h-4 w-4"/>Agendar Reunião</Button>
                    <Button variant="outline" className="gap-2" onClick={() => setActiveView('tickets')}><Icon name="ticket" className="h-4 w-4"/>Abrir Ticket</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommunicationDashboard;