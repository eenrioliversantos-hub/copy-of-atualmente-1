import React from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Input } from '../../ui/Input';

interface BusinessRule {
    id: string;
    description: string;
    given: string;
    when: string;
    then: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface Step12BusinessRulesProps {
  data: {
    rules?: BusinessRule[];
  };
  setData: (data: any) => void;
}

const RULE_CATEGORIES = ["Data Integrity", "Workflow", "Access Control", "Financial", "Validation"];

const Step12BusinessRules: React.FC<Step12BusinessRulesProps> = ({ data, setData }) => {
  const rules = data.rules || [];

  const handleAddRule = () => {
    const newRule: BusinessRule = {
      id: new Date().getTime().toString(),
      description: '',
      given: '',
      when: '',
      then: '',
      category: 'Validation',
      priority: 'Medium',
    };
    setData({ ...data, rules: [...rules, newRule] });
  };

  const handleRemoveRule = (id: string) => {
    setData({ ...data, rules: rules.filter(r => r.id !== id) });
  };

  const handleChange = (id: string, property: keyof BusinessRule, value: string) => {
    const updatedRules = rules.map(r =>
      r.id === id ? { ...r, [property]: value } : r
    );
    setData({ ...data, rules: updatedRules });
  };

  return (
    <div className="space-y-6">
       <div>
         <Label>Business Rules</Label>
         <p className="text-sm text-text-secondary">Defina regras de alto nível que governam a lógica do sistema usando o formato Gherkin-like (Dado/Quando/Então).</p>
       </div>
      
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="bg-sidebar/50">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor={`description-${rule.id}`}>Descrição da Regra</Label>
                            <Input
                                id={`description-${rule.id}`}
                                placeholder="Ex: Um cliente VIP recebe 10% de desconto em pedidos acima de R$ 500."
                                value={rule.description}
                                onChange={e => handleChange(rule.id, 'description', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-1.5">
                                <Label htmlFor={`given-${rule.id}`}>Dado (Contexto)</Label>
                                <Textarea id={`given-${rule.id}`} placeholder="Ex: Um usuário é um cliente VIP..." value={rule.given} onChange={e => handleChange(rule.id, 'given', e.target.value)} rows={3} />
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor={`when-${rule.id}`}>Quando (Ação)</Label>
                                <Textarea id={`when-${rule.id}`} placeholder="Ex: Ele finaliza um pedido..." value={rule.when} onChange={e => handleChange(rule.id, 'when', e.target.value)} rows={3}/>
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor={`then-${rule.id}`}>Então (Resultado)</Label>
                                <Textarea id={`then-${rule.id}`} placeholder="Ex: O total do pedido deve ser recalculado com 10% de desconto." value={rule.then} onChange={e => handleChange(rule.id, 'then', e.target.value)} rows={3}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Categoria</Label>
                                <Select value={rule.category} onValueChange={v => handleChange(rule.id, 'category', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {RULE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Prioridade</Label>
                                <Select value={rule.priority} onValueChange={v => handleChange(rule.id, 'priority', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(rule.id)}
                        className="flex-shrink-0"
                    >
                        <Icon name="trash" className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddRule}>
        <Icon name="plus" className="h-4 w-4 mr-2" />
        Add Business Rule
      </Button>
    </div>
  );
};

export default Step12BusinessRules;
