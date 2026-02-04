
import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import Icon from '../../shared/Icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Switch } from '../../ui/Switch';
import { Endpoint } from './Step13ApiEndpoints';

interface NotificationEvent {
    id: string;
    name: string;
    description: string;
    channels: string[];
    recipient: string;
    template: string;
    apiEndpointId?: string;
}

interface Step19NotificationsProps {
    data: {
        channels?: string[];
        events?: NotificationEvent[];
        chatEnabled?: boolean;
        chatFeatures?: string[];
    };
    setData: (data: any) => void;
    endpoints: Endpoint[];
}

const CHANNEL_OPTIONS = ["In-app", "E-mail", "Push notification", "SMS", "WhatsApp"];
const RECIPIENT_OPTIONS = ["Usuário que disparou o evento", "Gerente de Projeto", "Membros da Equipe", "Todos os Admins"];
const CHAT_FEATURES_OPTIONS = ["Chat 1:1", "Chat em grupo", "Envio de arquivos", "Emojis/Reações", "Histórico de mensagens"];

// FIX: Removed default assignment `data = {}` to prevent TypeScript from inferring 'data' as an empty object type '{}', which caused property access errors for 'channels', 'events', 'chatFeatures', and 'chatEnabled'.
const Step19Notifications: React.FC<Step19NotificationsProps> = ({ data, setData, endpoints = [] }) => {
    const channels = data?.channels || [];
    const events = data?.events || [];

    const handleDataChange = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    const handleChannelChange = (channel: string) => {
        const newChannels = channels.includes(channel)
            ? channels.filter(c => c !== channel)
            : [...channels, channel];
        handleDataChange('channels', newChannels);
    };
    
    const handleChatFeatureChange = (feature: string) => {
        const currentFeatures = data?.chatFeatures || [];
        const newFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter(item => item !== feature)
            : [...currentFeatures, feature];
        handleDataChange('chatFeatures', newFeatures);
    };

    const handleAddEvent = () => {
        const newEvent: NotificationEvent = { id: Date.now().toString(), name: '', description: '', channels: [], recipient: '', template: '' };
        handleDataChange('events', [...events, newEvent]);
    };

    const handleRemoveEvent = (id: string) => {
        handleDataChange('events', events.filter(e => e.id !== id));
    };
    
    const handleEventChange = (id: string, field: keyof NotificationEvent, value: any) => {
        const updatedEvents = events.map(e => (e.id === id ? { ...e, [field]: value } : e));
        handleDataChange('events', updatedEvents);
    };
    
    const handleEventChannelChange = (id: string, channel: string) => {
        const event = events.find(e => e.id === id);
        if (!event) return;
        const eventChannels = event.channels || [];
        const newChannels = eventChannels.includes(channel) 
            ? eventChannels.filter(c => c !== channel) 
            : [...eventChannels, channel];
        handleEventChange(id, 'channels', newChannels);
    }

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-4">
                <Label>9.1 Canais de Notificação</Label>
                <p className="text-sm text-text-secondary">Por onde o sistema se comunicará com os usuários.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                    {CHANNEL_OPTIONS.map(channel => (
                        <div key={channel} className="flex items-center space-x-2 p-2 border border-card-border rounded bg-sidebar/30">
                            <Checkbox id={`channel-${channel}`} checked={channels.includes(channel)} onCheckedChange={() => handleChannelChange(channel)} />
                            <Label htmlFor={`channel-${channel}`} className="font-normal cursor-pointer text-xs">{channel}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>9.2 Gatilhos de Notificação</Label>
                <p className="text-sm text-text-secondary">Defina quais ações disparam mensagens automáticas.</p>
                
                <div className="space-y-4">
                    {events.map(event => (
                        <Card key={event.id} className="bg-sidebar/50 border-card-border">
                            <CardContent className="p-4">
                               <div className="flex justify-between items-start gap-4">
                                 <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Nome do Evento</Label><Input placeholder="Ex: Novo Pedido Criado" value={event.name} onChange={e => handleEventChange(event.id, 'name', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Endpoint Vinculado</Label><Select value={event.apiEndpointId} onValueChange={v => handleEventChange(event.id, 'apiEndpointId', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{endpoints.map(ep => <SelectItem key={ep.id} value={ep.id}>{`${ep.method} ${ep.path}`}</SelectItem>)}</SelectContent></Select></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Destinatário Principal</Label><Select value={event.recipient} onValueChange={v => handleEventChange(event.id, 'recipient', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{RECIPIENT_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Descrição Técnica</Label><Input placeholder="Log interno do evento..." value={event.description} onChange={e => handleEventChange(event.id, 'description', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-1.5"><Label className="text-xs">Template da Mensagem</Label><Textarea placeholder="Ex: Olá {{user_name}}, seu pedido {{order_id}} foi confirmado." value={event.template} onChange={e => handleEventChange(event.id, 'template', e.target.value)} /></div>
                                     <div className="space-y-2 pt-2 border-t border-card-border/50"><Label className="text-xs">Canais para este evento</Label><div className="flex flex-wrap gap-4 pt-1">{channels.map(channel => (<div key={channel} className="flex items-center space-x-2"><Checkbox id={`event-${event.id}-channel-${channel}`} checked={(event.channels || []).includes(channel)} onCheckedChange={() => handleEventChannelChange(event.id, channel)} /><Label htmlFor={`event-${event.id}-channel-${channel}`} className="font-normal cursor-pointer text-xs">{channel}</Label></div>))}</div></div>
                                 </div>
                                 <Button variant="ghost" size="sm" onClick={() => handleRemoveEvent(event.id)} className="hover:bg-red-500/10 text-red-500"><Icon name="trash" className="h-4 w-4" /></Button>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button variant="outline" onClick={handleAddEvent} className="w-full border-dashed"><Icon name="plus" className="h-4 w-4 mr-2" />Adicionar Novo Gatilho</Button>
            </div>
            
             <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>9.3 Chat em Tempo Real</Label>
                            <p className="text-sm text-text-secondary">Permitir mensagens diretas entre usuários.</p>
                        </div>
                        <Switch checked={data?.chatEnabled || false} onCheckedChange={(c) => handleDataChange('chatEnabled', c)} />
                    </div>
                    {data?.chatEnabled && (
                        <div className="pt-4 mt-4 border-t border-card-border/50 animate-in slide-in-from-top-2">
                            <Label className="text-xs">Recursos de Mensageria</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                                {CHAT_FEATURES_OPTIONS.map(feature => (
                                    <div key={feature} className="flex items-center space-x-2 p-2 border border-card-border rounded bg-background/50">
                                        <Checkbox id={`chat-feat-${feature}`} checked={(data?.chatFeatures || []).includes(feature)} onCheckedChange={() => handleChatFeatureChange(feature)} />
                                        <Label htmlFor={`chat-feat-${feature}`} className="font-normal cursor-pointer text-xs">{feature}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step19Notifications;