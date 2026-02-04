import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const conversations = [
    { id: 1, name: 'Maria Oliveira', avatar: 'https://i.pravatar.cc/150?u=user-3', lastMessage: 'Claro, vou verificar e te retorno.', time: '10:42', unread: 2, project: 'Sistema ERP' },
    { id: 2, name: 'Carlos Silva', avatar: 'https://i.pravatar.cc/150?u=user-4', lastMessage: 'Obrigado pelo feedback!', time: 'Ontem', unread: 0, project: 'E-commerce' },
];

const messages = {
    1: [
        { from: 'other', text: 'Olá João, tudo bem? Recebi sua dúvida sobre o relatório financeiro.', time: '10:30' },
        { from: 'me', text: 'Oi Maria, tudo ótimo! Sim, estou com uma questão na exportação para PDF.', time: '10:35' },
        { from: 'other', text: 'Claro, vou verificar e te retorno.', time: '10:42' },
    ],
    2: [
        { from: 'other', text: 'Obrigado pelo feedback!', time: 'Ontem' },
    ],
};

const ClientMessagesPage = () => {
    const [activeConversation, setActiveConversation] = useState(conversations[0]);

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Mensagens</h1>
                <p className="text-text-secondary">Comunicação direta com a equipe do projeto.</p>
            </div>

            <Card className="h-[70vh] flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-card-border flex flex-col">
                    <div className="p-4 border-b border-card-border">
                        <Input placeholder="Buscar conversas..." />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <div
                                key={convo.id}
                                onClick={() => setActiveConversation(convo)}
                                className={`p-4 cursor-pointer border-l-4 ${activeConversation.id === convo.id ? 'bg-sidebar border-accent' : 'border-transparent hover:bg-sidebar/50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={convo.avatar} alt={convo.name} fallback={convo.name.charAt(0)} size="md" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{convo.name}</h3>
                                            <p className="text-sm text-text-secondary truncate">{convo.lastMessage}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-xs text-text-secondary mb-1">{convo.time}</span>
                                        {convo.unread > 0 && <span className="bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{convo.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Chat */}
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b border-card-border flex items-center gap-3">
                         <Avatar src={activeConversation.avatar} alt={activeConversation.name} fallback={activeConversation.name.charAt(0)} size="md" />
                         <div>
                            <h3 className="font-semibold">{activeConversation.name}</h3>
                            <p className="text-sm text-text-secondary">Projeto: {activeConversation.project}</p>
                         </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {(messages[activeConversation.id as keyof typeof messages] || []).map((msg, i) => (
                             <div key={i} className={`flex items-end gap-2 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                                {msg.from === 'other' && <Avatar src={activeConversation.avatar} alt={activeConversation.name} fallback={activeConversation.name.charAt(0)} size="sm" />}
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.from === 'me' ? 'bg-accent text-white rounded-br-none' : 'bg-sidebar text-text-primary rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 ${msg.from === 'me' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-card-border bg-sidebar/50">
                        <div className="flex items-center gap-2">
                            <Input placeholder="Digite sua mensagem..." className="flex-1" />
                            <Button className="gap-2"><Icon name="arrowRight" className="h-4 w-4" />Enviar</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ClientMessagesPage;
