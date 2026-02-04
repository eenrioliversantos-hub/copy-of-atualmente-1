import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';

interface EntityAttribute {
  id: string;
  attributeName: string;
  dataType: string;
  required: 'Sim' | 'Não';
  isUnique: 'Sim' | 'Não';
  description: string;
}

interface EntityLifecycleToolProps {
    data: any;
    setData: (data: any) => void;
}
const DATA_TYPE_OPTIONS = ["UUID", "Int", "String", "Text", "Boolean", "Date", "DateTime", "JSON"];

const EntityLifecycleTool: React.FC<EntityLifecycleToolProps> = ({ data, setData }) => {
    const handleChange = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    const attributes: EntityAttribute[] = data.attributes || [];

    const handleAddAttribute = () => {
        const newAttribute: EntityAttribute = { id: Date.now().toString(), attributeName: '', dataType: 'String', required: 'Não', isUnique: 'Não', description: '' };
        handleChange('attributes', [...attributes, newAttribute]);
    };
    
    const handleRemoveAttribute = (id: string) => {
        handleChange('attributes', attributes.filter(a => a.id !== id));
    };

    const handleAttributeChange = (id: string, field: keyof EntityAttribute, value: string) => {
        const updatedAttributes = attributes.map(a => a.id === id ? { ...a, [field]: value } : a);
        handleChange('attributes', updatedAttributes);
    };

    return (
        <div className="space-y-6">
            {/* 2.1. Identificação da Entidade */}
            <Card>
                <CardHeader><CardTitle>2.1. Identificação da Entidade</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Nome Singular</Label><Input value={data.singularName || ''} onChange={(e) => handleChange('singularName', e.target.value)} placeholder="Ex: Pedido" /></div>
                        <div className="space-y-2"><Label>Nome Plural</Label><Input value={data.pluralName || ''} onChange={(e) => handleChange('pluralName', e.target.value)} placeholder="Ex: Pedidos" /></div>
                    </div>
                    <div className="space-y-2"><Label>Dono da Entidade/Microsserviço</Label><Input value={data.owner || ''} onChange={(e) => handleChange('owner', e.target.value)} placeholder="Ex: Módulo de Vendas" /></div>
                    <div className="space-y-2"><Label>Propósito e Significado</Label><Textarea value={data.purpose || ''} onChange={(e) => handleChange('purpose', e.target.value)} placeholder="O que esta entidade representa..." /></div>
                </CardContent>
            </Card>

            {/* 2.2. Atributos e Propriedades Chave */}
            <Card>
                <CardHeader><CardTitle>2.2. Atributos e Propriedades</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        {attributes.map(attr => (
                            <div key={attr.id} className="grid grid-cols-12 gap-2 items-end p-2 border border-card-border rounded-md">
                                <div className="col-span-3 space-y-1"><Label className="text-xs">Nome Atributo</Label><Input value={attr.attributeName} onChange={(e) => handleAttributeChange(attr.id, 'attributeName', e.target.value)} /></div>
                                <div className="col-span-2 space-y-1"><Label className="text-xs">Tipo</Label><Select value={attr.dataType} onValueChange={(v) => handleAttributeChange(attr.id, 'dataType', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{DATA_TYPE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
                                <div className="col-span-2 space-y-1"><Label className="text-xs">Obrigatório?</Label><Select value={attr.required} onValueChange={(v: any) => handleAttributeChange(attr.id, 'required', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Sim">Sim</SelectItem><SelectItem value="Não">Não</SelectItem></SelectContent></Select></div>
                                <div className="col-span-2 space-y-1"><Label className="text-xs">Único?</Label><Select value={attr.isUnique} onValueChange={(v: any) => handleAttributeChange(attr.id, 'isUnique', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Sim">Sim</SelectItem><SelectItem value="Não">Não</SelectItem></SelectContent></Select></div>
                                <div className="col-span-2 space-y-1"><Label className="text-xs">Descrição</Label><Input value={attr.description} onChange={(e) => handleAttributeChange(attr.id, 'description', e.target.value)} /></div>
                                <div className="col-span-1"><Button variant="ghost" size="sm" onClick={() => handleRemoveAttribute(attr.id)}><Icon name="trash" className="h-4 w-4 text-red-500"/></Button></div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddAttribute}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Atributo</Button>
                </CardContent>
            </Card>

            {/* 2.3. Ciclo de Vida */}
            <Card>
                <CardHeader><CardTitle>2.3. Ciclo de Vida e Estados</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Nome do Campo de Status</Label><Input value={data.statusField || ''} onChange={(e) => handleChange('statusField', e.target.value)} placeholder="Ex: status_transacao" /></div>
                        <div className="space-y-2"><Label>Status Inicial Padrão</Label><Input value={data.initialStatus || ''} onChange={(e) => handleChange('initialStatus', e.target.value)} placeholder="Ex: PENDENTE" /></div>
                    </div>
                    <div className="space-y-2"><Label>Estados Possíveis (separados por vírgula)</Label><Input value={data.possibleStates || ''} onChange={(e) => handleChange('possibleStates', e.target.value)} placeholder="Ex: PENDENTE, PROCESSANDO, APROVADO..." /></div>
                    <div className="space-y-2"><Label>Transições de Estado Válidas</Label><Textarea value={data.stateTransitions || ''} onChange={(e) => handleChange('stateTransitions', e.target.value)} placeholder="Ex: PENDENTE -> PROCESSANDO; PROCESSANDO -> APROVADO/REJEITADO..." /></div>
                    <div className="space-y-2"><Label>Ação/Evento que Dispara a Transição</Label><Textarea value={data.transitionTriggers || ''} onChange={(e) => handleChange('transitionTriggers', e.target.value)} placeholder="Ex: Evento 'PAGAMENTO_RECEBIDO' dispara PENDENTE -> PROCESSANDO..." /></div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EntityLifecycleTool;
