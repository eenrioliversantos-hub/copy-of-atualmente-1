import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

const ClientSettingsPage = () => {
    const [profile, setProfile] = useState({ name: 'João Silva', company: 'TechCorp', email: 'joao@techcorp.com', phone: '(11) 99999-9999' });
    const [notifications, setNotifications] = useState({ invoices: true, projects: true, messages: false });

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-text-secondary">Gerencie seu perfil, segurança e notificações.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Icon name="user" className="h-5 w-5 text-accent" />Meu Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar src="https://i.pravatar.cc/150?u=client" fallback="JS" alt="João Silva" size="lg" />
                        <Button variant="outline" size="sm" className="gap-2"><Icon name="upload" className="h-4 w-4" />Alterar Foto</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" value={profile.name} /></div>
                        <div className="space-y-2"><Label htmlFor="company">Empresa</Label><Input id="company" value={profile.company} /></div>
                        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profile.email} /></div>
                        <div className="space-y-2"><Label htmlFor="phone">Telefone</Label><Input id="phone" value={profile.phone} /></div>
                    </div>
                    <div className="flex justify-end">
                        <Button className="gap-2"><Icon name="checkCircle" className="h-4 w-4" />Salvar Alterações</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Icon name="lock" className="h-5 w-5 text-accent" />Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Label htmlFor="current-password">Senha Atual</Label><Input id="current-password" type="password" /></div>
                    <div className="space-y-2"><Label htmlFor="new-password">Nova Senha</Label><Input id="new-password" type="password" /></div>
                    <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar Nova Senha</Label><Input id="confirm-password" type="password" /></div>
                    <div className="flex justify-end">
                        <Button className="gap-2">Alterar Senha</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Icon name="bell" className="h-5 w-5 text-accent" />Notificações</CardTitle>
                    <CardDescription>Escolha como você quer ser notificado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-sidebar rounded-lg border border-card-border">
                        <div>
                            <Label htmlFor="notif-invoices" className="font-medium cursor-pointer">Novas Faturas</Label>
                            <p className="text-sm text-text-secondary">Receber um email quando uma nova fatura for emitida.</p>
                        </div>
                        <Switch id="notif-invoices" checked={notifications.invoices} onCheckedChange={(c) => setNotifications(p => ({...p, invoices: c}))} />
                    </div>
                     <div className="flex items-center justify-between p-4 bg-sidebar rounded-lg border border-card-border">
                        <div>
                            <Label htmlFor="notif-projects" className="font-medium cursor-pointer">Atualizações de Projeto</Label>
                            <p className="text-sm text-text-secondary">Receber emails sobre marcos e atualizações importantes.</p>
                        </div>
                        <Switch id="notif-projects" checked={notifications.projects} onCheckedChange={(c) => setNotifications(p => ({...p, projects: c}))} />
                    </div>
                     <div className="flex items-center justify-between p-4 bg-sidebar rounded-lg border border-card-border">
                        <div>
                            <Label htmlFor="notif-messages" className="font-medium cursor-pointer">Novas Mensagens</Label>
                            <p className="text-sm text-text-secondary">Ser notificado por email sobre novas mensagens na plataforma.</p>
                        </div>
                        <Switch id="notif-messages" checked={notifications.messages} onCheckedChange={(c) => setNotifications(p => ({...p, messages: c}))} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientSettingsPage;