import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton, DialogFooter } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { QuoteRequest } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Progress } from '../ui/Progress';

interface ClientQuoteRequestFormProps {
    onCancel: () => void;
    onSubmit: (data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => void;
}

const CORE_FEATURES_OPTIONS = [
    "Autenticação de Usuários", "Painel Administrativo", "Integração com Pagamentos", "Notificações por Email", "Busca Avançada", "Geração de Relatórios", "Upload de Arquivos", "Dashboard com Gráficos"
];

const ClientQuoteRequestForm: React.FC<ClientQuoteRequestFormProps> = ({ onCancel, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>>>({
        clientName: 'João Silva (TechCorp)', // Mocked client name
        projectName: '',
        projectDescription: '',
        coreFeatures: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSelectChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value }));
    };

    const handleCheckboxChange = (feature: string) => {
        const currentFeatures = formData.coreFeatures || [];
        const newFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter(f => f !== feature)
            : [...currentFeatures, feature];
        setFormData(prev => ({...prev, coreFeatures: newFeatures }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    const progress = (step / 3) * 100;

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Solicitar Orçamento Detalhado</DialogTitle>
                <DialogDescription>Quanto mais detalhes, mais preciso será nosso orçamento. (Etapa {step} de 3)</DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent>
                <Progress value={progress} className="mb-4" />
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="space-y-2">
                            <Label htmlFor="projectName">Nome da Ideia / Projeto *</Label>
                            <Input id="projectName" value={formData.projectName} onChange={handleChange} placeholder="Ex: Novo App de Vendas" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="projectType">Tipo de Projeto *</Label>
                            <Select onValueChange={(v) => handleSelectChange('projectType', v)} value={formData.projectType}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="webapp">Aplicação Web</SelectItem>
                                    <SelectItem value="mobile">Aplicativo Mobile</SelectItem>
                                    <SelectItem value="desktop">Aplicação Desktop</SelectItem>
                                    <SelectItem value="api">API / Backend</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="projectDescription">Descrição Geral *</Label>
                            <Textarea id="projectDescription" value={formData.projectDescription} onChange={handleChange} placeholder="Descreva o que você precisa, quais problemas quer resolver..." rows={5} required />
                        </div>
                    </div>
                )}
                {step === 2 && (
                     <div className="space-y-4 animate-in fade-in-50">
                         <div className="space-y-2">
                            <Label>Principais Funcionalidades</Label>
                            <p className="text-sm text-text-secondary">Selecione as funcionalidades essenciais que você imagina para o projeto.</p>
                             <div className="grid grid-cols-2 gap-4 pt-2">
                                {CORE_FEATURES_OPTIONS.map(feature => (
                                    <div key={feature} className="flex items-center space-x-2">
                                        <Checkbox id={feature} checked={(formData.coreFeatures || []).includes(feature)} onCheckedChange={() => handleCheckboxChange(feature)} />
                                        <Label htmlFor={feature} className="font-normal cursor-pointer">{feature}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="mainGoals">Outras Funcionalidades ou Metas</Label>
                            <Textarea id="mainGoals" value={formData.mainGoals} onChange={handleChange} placeholder="Liste outras funcionalidades importantes ou os principais objetivos a serem alcançados." rows={4} />
                        </div>
                     </div>
                )}
                 {step === 3 && (
                     <div className="space-y-4 animate-in fade-in-50">
                          <div className="space-y-2">
                            <Label htmlFor="targetAudience">Público-Alvo</Label>
                            <Input id="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Ex: Vendedores, gestores de estoque, etc." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designPreferences">Preferência de Design</Label>
                            <Select onValueChange={(v) => handleSelectChange('designPreferences', v)} value={formData.designPreferences}>
                                <SelectTrigger><SelectValue placeholder="Selecione um estilo..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minimalist">Minimalista e Limpo</SelectItem>
                                    <SelectItem value="corporate">Corporativo e Sóbrio</SelectItem>
                                    <SelectItem value="modern">Moderno e Arrojado</SelectItem>
                                    <SelectItem value="playful">Divertido e Colorido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budgetRange">Faixa de Orçamento (Opcional)</Label>
                                <Select onValueChange={(v) => handleSelectChange('budgetRange', v)} value={formData.budgetRange}>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="<10k">Abaixo de R$ 10.000</SelectItem>
                                        <SelectItem value="10k-30k">R$ 10.000 - R$ 30.000</SelectItem>
                                        <SelectItem value="30k-70k">R$ 30.000 - R$ 70.000</SelectItem>
                                        <SelectItem value=">70k">Acima de R$ 70.000</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="desiredTimeline">Prazo Desejado (Opcional)</Label>
                                <Input id="desiredTimeline" value={formData.desiredTimeline} onChange={handleChange} placeholder="Ex: 3 meses" />
                            </div>
                        </div>
                     </div>
                )}
            </DialogContent>
            <DialogFooter>
                {step > 1 && <Button type="button" variant="ghost" onClick={prevStep}>Voltar</Button>}
                <div className="flex-1" />
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                {step < 3 ? (
                    <Button type="button" onClick={nextStep}>Próximo <Icon name="arrowRight" className="h-4 w-4 ml-2" /></Button>
                ) : (
                    <Button type="submit">
                        <Icon name="share" className="h-4 w-4 mr-2" />
                        Enviar Solicitação
                    </Button>
                )}
            </DialogFooter>
        </form>
    );
};

export default ClientQuoteRequestForm;