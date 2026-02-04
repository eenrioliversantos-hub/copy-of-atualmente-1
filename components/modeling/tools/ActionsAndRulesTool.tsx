
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';

interface ActionsAndRulesToolProps {
    data: any[]; // Expecting an array of actions
    setData: (data: any[]) => void;
}

const ActionRuleItem = ({ item, updateItem, removeItem }: { item: any, updateItem: (d: any) => void, removeItem: () => void }) => {
    const handleFieldChange = (field: string, value: any) => {
        updateItem({ ...item, [field]: value });
    };

    return (
        <Card className="bg-sidebar/50 border-card-border overflow-hidden">
            <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded text-purple-400"><Icon name="zap" className="h-4 w-4"/></div>
                        <span className="font-semibold text-text-primary">{item.name || 'Nova Ação/Regra'}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeItem() }} className="hover:bg-red-500/10 text-red-500"><Icon name="trash" className="h-4 w-4" /></Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
                <div className="border-t border-card-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor={`action-name-${item.id}`}>Nome da Ação / Funcionalidade</Label>
                        <Input id={`action-name-${item.id}`} value={item.name || ''} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="Ex: Processar Pagamento" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`action-trigger-${item.id}`}>Gatilho</Label>
                        <Select value={item.trigger} onValueChange={(v) => handleFieldChange('trigger', v)}>
                            <SelectTrigger id={`action-trigger-${item.id}`}>
                                <SelectValue placeholder="Selecione o gatilho..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user_action">Ação do Usuário (Clique)</SelectItem>
                                <SelectItem value="api_call">Chamada de API Externa</SelectItem>
                                <SelectItem value="system_event">Evento do Sistema (Kafka)</SelectItem>
                                <SelectItem value="scheduled_job">Job Agendado (Cron)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label htmlFor={`action-desc-${item.id}`}>Descrição</Label>
                        <Textarea id={`action-desc-${item.id}`} value={item.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} placeholder="O que esta funcionalidade faz, qual seu objetivo?" />
                    </div>

                    {/* API Endpoint Details */}
                    <div className="col-span-1 md:col-span-2 space-y-4 p-4 border border-card-border rounded-md bg-background/50">
                       <h4 className="font-semibold text-text-primary">Endpoint da API</h4>
                       <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                           <div className="md:col-span-3 space-y-2">
                               <Label>Método HTTP</Label>
                                <Select value={item.httpMethod} onValueChange={(v) => handleFieldChange('httpMethod', v)}>
                                    <SelectTrigger><SelectValue placeholder="Método..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                    </SelectContent>
                                </Select>
                           </div>
                           <div className="md:col-span-9 space-y-2">
                               <Label>Rota (Endpoint)</Label>
                               <Input value={item.route || ''} onChange={(e) => handleFieldChange('route', e.target.value)} placeholder="/api/v1/orders/{id}/pay" />
                           </div>
                           <div className="md:col-span-6 space-y-2">
                               <Label>Schema do Request (JSON)</Label>
                               <Textarea value={item.requestSchema || ''} onChange={(e) => handleFieldChange('requestSchema', e.target.value)} placeholder={`{
  "amount": "number",
  "paymentMethodId": "string"
}`} className="font-mono h-32" />
                           </div>
                            <div className="md:col-span-6 space-y-2">
                               <Label>Schema do Response (JSON)</Label>
                               <Textarea value={item.responseSchema || ''} onChange={(e) => handleFieldChange('responseSchema', e.target.value)} placeholder={`{
  "status": "string",
  "transactionId": "string"
}`} className="font-mono h-32" />
                           </div>
                       </div>
                    </div>

                     {/* Security & Permissions */}
                     <div className="col-span-1 md:col-span-2 space-y-4 p-4 border border-card-border rounded-md bg-background/50">
                        <h4 className="font-semibold text-text-primary">Segurança e Permissões</h4>
                        <div className="space-y-2">
                            <Label>Papéis (Roles) com Acesso</Label>
                            <Input value={item.roles || ''} onChange={(e) => handleFieldChange('roles', e.target.value)} placeholder="Admin, Gerente, Cliente" />
                            <p className="text-xs text-text-secondary">Separe os papéis por vírgula.</p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`action-rls-${item.id}`}>Política de Segurança a Nível de Linha (RLS)</Label>
                            <Textarea id={`action-rls-${item.id}`} value={item.rls || ''} onChange={(e) => handleFieldChange('rls', e.target.value)} placeholder="Ex: usuario.id === pedido.usuario_id" className="font-mono"/>
                        </div>
                    </div>

                </div>
            </AccordionContent>
        </Card>
    );
}

const ActionsAndRulesTool: React.FC<ActionsAndRulesToolProps> = ({ data = [], setData }) => {

    const handleAddItem = () => {
        setData([...data, { id: Date.now().toString(), name: 'Nova Ação' }]);
    };

    const handleRemoveItem = (id: string) => {
        setData(data.filter(item => item.id !== id));
    };

    const handleUpdateItem = (id: string, itemData: any) => {
        setData(data.map(item => item.id === id ? itemData : item));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Ações, Regras de Negócio e Endpoints</h3>
                    <p className="text-sm text-text-secondary">Defina as operações, regras, permissões e endpoints do sistema.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddItem}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Ação/Regra</Button>
            </div>

             <Accordion type="single" collapsible className="w-full space-y-4">
                {data.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="border-none">
                        <ActionRuleItem 
                            item={item} 
                            removeItem={() => handleRemoveItem(item.id)} 
                            updateItem={(d) => handleUpdateItem(item.id, d)}
                        />
                    </AccordionItem>
                ))}
            </Accordion>
            {data.length === 0 && (
                 <Card className="bg-sidebar/50 border-card-border">
                    <CardContent className="p-10 text-center">
                         <Icon name="zap" className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-lg text-text-primary mb-1">Mapeie as Ações do Sistema</h4>
                        <p className="text-text-secondary max-w-md mx-auto">
                           Clique em "Adicionar Ação/Regra" para começar a definir as funcionalidades chave,
                           seus endpoints, permissões e regras de negócio associadas.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ActionsAndRulesTool;
