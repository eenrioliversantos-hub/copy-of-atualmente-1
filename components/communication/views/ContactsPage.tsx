import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Tabs, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Avatar from '../../shared/Avatar';
import { Badge } from '../../ui/Badge';
import { Client } from '../../../types';
import { TeamMember } from '../../team/OperatorTeamPage';

interface ContactsPageProps {
    teamMembers: TeamMember[];
    clients: Client[];
}

const ContactsPage: React.FC<ContactsPageProps> = ({ teamMembers, clients }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const allContacts = useMemo(() => {
        const teamAsContacts = teamMembers.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            avatar: m.avatar,
            type: 'team' as const,
            role: m.role,
        }));
        const clientsAsContacts = clients.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            avatar: c.avatar,
            type: 'client' as const,
            role: 'Cliente',
        }));
        return [...teamAsContacts, ...clientsAsContacts];
    }, [teamMembers, clients]);

    const filteredContacts = useMemo(() => {
        let contacts = allContacts;
        if (activeTab !== 'all') {
            contacts = contacts.filter(c => c.type === activeTab);
        }
        if (searchTerm) {
            contacts = contacts.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return contacts;
    }, [allContacts, activeTab, searchTerm]);

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Contatos</h1>
                <p className="text-text-secondary">Veja todos os clientes e membros da equipe.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex-1">
                             <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList>
                                    <TabsTrigger value="all">Todos</TabsTrigger>
                                    <TabsTrigger value="team">Equipe</TabsTrigger>
                                    <TabsTrigger value="clients">Clientes</TabsTrigger>
                                </TabsList>
                            </Tabs>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="relative w-64">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                                <Input 
                                    placeholder="Buscar contato..." 
                                    className="pl-9" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button className="gap-2"><Icon name="userPlus" className="h-4 w-4" /> Novo Contato</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredContacts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredContacts.map((contact) => (
                                <Card key={contact.id} className="p-4 bg-sidebar/50">
                                    <div className="flex items-center gap-4">
                                        <Avatar src={contact.avatar || ''} alt={contact.name} fallback={contact.name.substring(0,2)} size="lg" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{contact.name}</h3>
                                            <p className="text-sm text-text-secondary">{contact.email}</p>
                                            <Badge variant="outline" className={`mt-1 text-xs ${contact.type === 'team' ? 'border-accent/30 text-accent' : ''}`}>
                                                {contact.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center pt-12">
                            <Icon name="users" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Nenhum contato encontrado</h3>
                            <p className="text-sm text-text-secondary">Tente ajustar seus filtros de busca.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactsPage;