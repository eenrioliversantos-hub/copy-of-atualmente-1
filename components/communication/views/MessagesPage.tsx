
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import Icon from '../../shared/Icon';
import Avatar from '../../shared/Avatar';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Conversation, Message } from '../../../types';

interface MessagesPageProps {
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    onSendMessage: (conversationId: string, text: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ conversations, messages, onSendMessage }) => {
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations?.[0] || null);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() && activeConversation) {
            onSendMessage(activeConversation.id, newMessage);
            setNewMessage('');
        }
    };

    const ChatMessage: React.FC<{ msg: Message; author?: any }> = ({ msg, author }) => (
        <div className={`flex items-end gap-3 ${msg.senderId === 'me' ? 'justify-end' : ''}`}>
            {msg.senderId !== 'me' && <Avatar src={author.avatarUrl} alt={author.name} fallback={author.name.charAt(0)} size="md" />}
            <div className={`max-w-xl p-3 rounded-lg ${msg.senderId === 'me' ? 'bg-accent text-white rounded-br-none' : 'bg-card text-text-primary rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-bold">Mensagens</h1>
                <p className="text-text-secondary">Comunicação direta com a equipe e clientes.</p>
            </div>
            <Card className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-[340px] border-r border-card-border flex flex-col">
                    <div className="p-4 border-b border-card-border">
                         <div className="relative">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                            <Input placeholder="Buscar conversas ou contatos..." className="pl-9" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <div key={convo.id} onClick={() => setActiveConversation(convo)} className={`p-4 cursor-pointer border-l-4 flex gap-4 ${activeConversation?.id === convo.id ? 'bg-sidebar border-accent' : 'border-transparent hover:bg-sidebar/50'}`}>
                                <Avatar src={convo.avatarUrl || ''} alt={convo.name} fallback={convo.name.charAt(0)} size="lg" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-sm truncate">{convo.name}</h3>
                                        <span className="text-xs text-text-secondary flex-shrink-0">{convo.lastMessageTimestamp}</span>
                                    </div>
                                    <div className="flex justify-between items-start mt-1">
                                        <p className="text-xs text-text-secondary truncate pr-2">{convo.lastMessage}</p>
                                        {convo.unreadCount > 0 && <Badge className="h-5 w-5 p-0 flex items-center justify-center">{convo.unreadCount}</Badge>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Chat */}
                <div className="flex-1 flex flex-col">
                    {activeConversation ? (
                        <>
                            <div className="p-4 border-b border-card-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar src={activeConversation.avatarUrl || ''} alt={activeConversation.name} fallback={activeConversation.name.charAt(0)} size="lg" />
                                    <div>
                                        <h3 className="font-semibold">{activeConversation.name}</h3>
                                        <p className="text-sm text-text-secondary">Projeto: {activeConversation.project}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm"><Icon name="moreHorizontal" className="h-5 w-5" /></Button>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-background">
                                {(messages[activeConversation.id] || []).map((msg) => (
                                    <ChatMessage key={msg.id} msg={msg} author={activeConversation} />
                                ))}
                            </div>
                            <div className="p-4 border-t border-card-border bg-sidebar/50">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-4">
                                    <Input 
                                        placeholder="Digite sua mensagem..." 
                                        className="flex-1 bg-background" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button type="submit" className="gap-2"><Icon name="arrowRight" className="h-4 w-4" />Enviar</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div className="text-text-secondary">
                                <Icon name="messageCircle" className="h-12 w-12 mx-auto mb-4" />
                                <p>Selecione uma conversa para começar</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MessagesPage;
