import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { UserStory } from '../../../types';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';

interface UserEntityDataToolProps {
    data: any; // Data for a single user role
    setData: (data: any) => void;
}

const UserEntityDataTool: React.FC<UserEntityDataToolProps> = ({ data, setData }) => {
    const handleChange = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    const handleAddStory = () => {
        const newStory: UserStory = { id: Date.now().toString(), asA: '', iWantTo: '', soThat: '' };
        const updatedStories = [...(data.userStories || []), newStory];
        handleChange('userStories', updatedStories);
    };

    const handleRemoveStory = (id: string) => {
        const updatedStories = (data.userStories || []).filter((s: UserStory) => s.id !== id);
        handleChange('userStories', updatedStories);
    };

    const handleStoryChange = (id: string, field: keyof Omit<UserStory, 'id'>, value: string) => {
        const updatedStories = (data.userStories || []).map((s: UserStory) => s.id === id ? { ...s, [field]: value } : s);
        handleChange('userStories', updatedStories);
    };

    return (
        <div className="space-y-6">
            {/* 1.1. Definição do Papel */}
            <Card>
                <CardHeader>
                    <CardTitle>1.1. Definição do Papel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`roleName-${data.id}`}>Nome do Papel</Label>
                            <Input id={`roleName-${data.id}`} value={data.roleName || ''} onChange={(e) => handleChange('roleName', e.target.value)} placeholder="Ex: Administrador, Cliente" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`importanceLevel-${data.id}`}>Nível de Importância (1-5)</Label>
                            <Input id={`importanceLevel-${data.id}`} type="number" min="1" max="5" value={data.importanceLevel || '3'} onChange={(e) => handleChange('importanceLevel', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`roleDescription-${data.id}`}>Descrição e Objetivo do Papel</Label>
                        <Textarea id={`roleDescription-${data.id}`} value={data.roleDescription || ''} onChange={(e) => handleChange('roleDescription', e.target.value)} placeholder="Descreva as responsabilidades e o que este usuário precisa fazer no sistema." />
                    </div>
                </CardContent>
            </Card>

            {/* User Stories */}
             <Card>
                <CardHeader>
                    <CardTitle>Histórias de Usuário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-3">
                        {(data.userStories || []).map((story: UserStory) => (
                            <div key={story.id} className="p-3 border border-card-border rounded-md bg-background space-y-2">
                                <div className="flex justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveStory(story.id)}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor={`asA-${story.id}`}>Como um...</Label>
                                        <Input id={`asA-${story.id}`} value={story.asA} onChange={e => handleStoryChange(story.id, 'asA', e.target.value)} placeholder="Ex: Usuário Administrador" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`iWantTo-${story.id}`}>Eu quero...</Label>
                                        <Input id={`iWantTo-${story.id}`} value={story.iWantTo} onChange={e => handleStoryChange(story.id, 'iWantTo', e.target.value)} placeholder="Ex: Visualizar um dashboard" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`soThat-${story.id}`}>Para que...</Label>
                                        <Input id={`soThat-${story.id}`} value={story.soThat} onChange={e => handleStoryChange(story.id, 'soThat', e.target.value)} placeholder="Ex: Eu possa monitorar as vendas" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddStory} className="mt-3 w-full">
                        <Icon name="plus" className="h-4 w-4 mr-2" /> Adicionar História de Usuário
                    </Button>
                </CardContent>
            </Card>

            {/* 1.2. Autenticação e Segurança */}
            <Card>
                <CardHeader>
                    <CardTitle>1.2. Autenticação e Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`authMethod-${data.id}`}>Método de Autenticação Primário</Label>
                        <Select value={data.authMethod} onValueChange={(v) => handleChange('authMethod', v)}>
                            <SelectTrigger id={`authMethod-${data.id}`}><SelectValue placeholder="Selecione um método..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Email/Senha (Padrão)">Email/Senha (Padrão)</SelectItem>
                                <SelectItem value="OAuth (Google, Facebook, etc.)">OAuth (Google, Facebook, etc.)</SelectItem>
                                <SelectItem value="SSO (SAML, JWT)">SSO (SAML, JWT)</SelectItem>
                                <SelectItem value="Chave de API/Token">Chave de API/Token</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`passwordPolicy-${data.id}`}>Política de Senha/Segurança</Label>
                        <Input id={`passwordPolicy-${data.id}`} value={data.passwordPolicy || ''} onChange={(e) => handleChange('passwordPolicy', e.target.value)} placeholder="Ex: 8 chars, 1 maiúscula, 2FA obrigatório" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`keyPermissions-${data.id}`}>Permissões e Ações Chave (Separadas por vírgula)</Label>
                        <Input id={`keyPermissions-${data.id}`} value={data.keyPermissions || ''} onChange={(e) => handleChange('keyPermissions', e.target.value)} placeholder="Ex: criar_produto, editar_proprio_perfil, visualizar_relatorio_financeiro" />
                    </div>
                </CardContent>
            </Card>

            {/* 1.3. Mapeamento de Fluxo de Usuário Crítico (Userflow) */}
            <Card>
                <CardHeader>
                    <CardTitle>1.3. Mapeamento de Fluxo de Usuário Crítico (Userflow)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`criticalFlowName-${data.id}`}>Nome do Fluxo de Usuário Crítico</Label>
                        <Input id={`criticalFlowName-${data.id}`} value={data.criticalFlowName || ''} onChange={(e) => handleChange('criticalFlowName', e.target.value)} placeholder="Ex: Processo de Checkout e Pagamento" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`workflowSteps-${data.id}`}>Passos do Workflow (Sequência de Telas/Ações)</Label>
                        <Textarea id={`workflowSteps-${data.id}`} value={data.workflowSteps || ''} onChange={(e) => handleChange('workflowSteps', e.target.value)} placeholder="1. Usuário adiciona item ao carrinho. 2. Acessa tela de Checkout..." rows={4} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`dataFlow-${data.id}`}>Dados Lidos/Escritos em Cada Passo (Data Flow)</Label>
                        <Textarea id={`dataFlow-${data.id}`} value={data.dataFlow || ''} onChange={(e) => handleChange('dataFlow', e.target.value)} placeholder="Passo 2: Leitura: Entidade 'Carrinho'. Escrita: Nenhuma..." rows={4} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`notificationTriggers-${data.id}`}>Gatilhos de Notificação/Eventos Após o Fluxo</Label>
                        <Input id={`notificationTriggers-${data.id}`} value={data.notificationTriggers || ''} onChange={(e) => handleChange('notificationTriggers', e.target.value)} placeholder="Ex: Envio de Email de Confirmação, Disparo de Evento 'PedidoCriado'..." />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserEntityDataTool;
