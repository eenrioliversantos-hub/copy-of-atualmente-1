import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

const OperatorSettingsPage = () => {
    const [profile, setProfile] = useState({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        phone: '(11) 99999-9999',
        company: 'DevCreator'
    });
    const [theme, setTheme] = useState('system');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Perfil salvo com sucesso!'); // Placeholder for a proper toast notification
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-text-secondary mt-1">Gerencie as configurações da sua conta e da plataforma.</p>
            </div>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="user" className="h-5 w-5 text-accent" />
                        Perfil
                    </CardTitle>
                    <CardDescription>Atualize suas informações pessoais e de contato.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSave} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar src="" fallback="JS" alt="João Silva" size="lg" />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{profile.name}</h3>
                                <p className="text-sm text-text-secondary">{profile.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" value={profile.name} onChange={handleProfileChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={profile.email} onChange={handleProfileChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" value={profile.phone} onChange={handleProfileChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Empresa</Label>
                                <Input id="company" value={profile.company} onChange={handleProfileChange} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                                Salvar Perfil
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="palette" className="h-5 w-5 text-accent" />
                        Aparência
                    </CardTitle>
                    <CardDescription>Personalize a aparência da plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-w-xs">
                        <Label htmlFor="theme">Tema da Interface</Label>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger id="theme">
                                <SelectValue placeholder="Selecione o tema" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">Sistema</SelectItem>
                                <SelectItem value="light">Claro</SelectItem>
                                <SelectItem value="dark">Escuro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="bell" className="h-5 w-5 text-accent" />
                        Notificações
                    </CardTitle>
                    <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-sidebar rounded-lg border border-card-border">
                        <div>
                            <Label htmlFor="notifications-switch" className="font-medium cursor-pointer">Ativar Notificações</Label>
                            <p className="text-sm text-text-secondary">Receber notificações por email e na plataforma.</p>
                        </div>
                        <Switch id="notifications-switch" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OperatorSettingsPage;