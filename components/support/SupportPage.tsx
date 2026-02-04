import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const faqItems = [
    { q: 'Como eu reseto minha senha?', a: 'Você pode resetar sua senha na página de login clicando em "Esqueci minha senha". Um link de recuperação será enviado para o seu email.' },
    { q: 'Como acompanho o progresso de um projeto?', a: 'Você pode ver o progresso detalhado na seção "Projetos". Lá você encontrará um dashboard com o status atual, marcos e tarefas concluídas.' },
    { q: 'Como faço para solicitar uma alteração?', a: 'A melhor forma é abrir um ticket de suporte nesta página ou enviar uma mensagem direta para o gerente do seu projeto na seção "Mensagens".' },
    { q: 'Onde encontro minhas faturas? (Apenas para Clientes)', a: 'Todas as suas faturas, pendentes e pagas, estão disponíveis na seção "Faturas". Você pode visualizá-las e fazer o download em PDF.' },
];

const SupportPage = () => {
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in-50">
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
                </DialogContent>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingTicket(false)}>Cancelar</Button>
                    <Button onClick={() => setIsCreatingTicket(false)}>Enviar Ticket</Button>
                </DialogFooter>
            </Dialog>

            <div>
                <h1 className="text-3xl font-bold">Central de Ajuda</h1>
                <p className="text-text-secondary">Encontre respostas para suas dúvidas ou entre em contato conosco.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-accent transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Icon name="headphones" className="h-8 w-8 text-accent" />
                        <div>
                            <CardTitle>Abrir um Ticket</CardTitle>
                            <CardDescription>Para problemas técnicos ou solicitações.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => setIsCreatingTicket(true)}>Abrir Novo Ticket</Button>
                    </CardContent>
                </Card>
                 <Card className="hover:border-accent transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Icon name="mail" className="h-8 w-8 text-accent" />
                        <div>
                            <CardTitle>Enviar Email</CardTitle>
                            <CardDescription>Para questões gerais ou comerciais.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.href='mailto:suporte@nexus.com'} variant="outline" className="w-full">suporte@nexus.com</Button>
                    </CardContent>
                </Card>
                 <Card className="hover:border-accent transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Icon name="phone" className="h-8 w-8 text-accent" />
                        <div>
                            <CardTitle>Ligar para Suporte</CardTitle>
                            <CardDescription>Para assuntos urgentes.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.href='tel:+551140028922'} variant="outline" className="w-full">+55 (11) 4002-8922</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <div key={index} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
                                <h3 className="font-semibold text-text-primary">{item.q}</h3>
                                <p className="text-sm text-text-secondary mt-2">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportPage;
