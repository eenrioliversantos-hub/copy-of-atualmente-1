import React, { useState, useMemo } from 'react';
import { QuoteRequest } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import Icon from '../shared/Icon';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';

interface QuoteEstimatorPageProps {
    quoteRequest: QuoteRequest;
    onBack: () => void;
    onGenerateProposal: (estimatorData: any) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-sm font-semibold text-text-secondary">{label}</p>
            {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-1">
                    {value.map(v => <Badge key={v} variant="secondary">{v}</Badge>)}
                </div>
            ) : (
                <p className="text-text-primary">{value}</p>
            )}
        </div>
    );
};

const QuoteEstimatorPage: React.FC<QuoteEstimatorPageProps> = ({ quoteRequest, onBack, onGenerateProposal }) => {
    const [estimatorData, setEstimatorData] = useState({
        complexity: "Médio",
        estimatedHours: 250,
        hourlyRate: 140,
        timeline: "8-10 semanas",
        valueProposition: "Plataforma completa com painel de instrutor e aluno.",
        team: "1 Sênior, 2 Plenos",
    });
    
    const finalPrice = useMemo(() => {
        return estimatorData.estimatedHours * estimatorData.hourlyRate;
    }, [estimatorData.estimatedHours, estimatorData.hourlyRate]);

    const handleChange = (field: keyof typeof estimatorData, value: string | number) => {
        setEstimatorData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = () => {
        onGenerateProposal({ ...estimatorData, finalPrice });
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" /> Voltar para Solicitações
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleGenerate} size="sm">
                        <Icon name="file-text" className="h-4 w-4 mr-2" />
                        Gerar Rascunho da Proposta
                    </Button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Client Request Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-bold">Solicitação do Cliente</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>{quoteRequest.projectName}</CardTitle>
                                <CardDescription>de {quoteRequest.clientName}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem label="Tipo de Projeto" value={quoteRequest.projectType} />
                                <DetailItem label="Descrição" value={quoteRequest.projectDescription} />
                                <DetailItem label="Funcionalidades Chave" value={quoteRequest.coreFeatures} />
                                <DetailItem label="Metas Adicionais" value={quoteRequest.mainGoals} />
                                <DetailItem label="Público-Alvo" value={quoteRequest.targetAudience} />
                                <DetailItem label="Preferência de Design" value={quoteRequest.designPreferences} />
                                <DetailItem label="Faixa de Orçamento" value={quoteRequest.budgetRange} />
                                <DetailItem label="Prazo Desejado" value={quoteRequest.desiredTimeline} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estimator Column */}
                    <div className="lg:col-span-2 space-y-6">
                         <h2 className="text-2xl font-bold">Orçamentador</h2>
                         <Card>
                            <CardHeader>
                                <CardTitle>Definição de Escopo e Preço</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Complexidade</Label>
                                        <Select value={estimatorData.complexity} onValueChange={(v) => handleChange('complexity', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Baixo">Baixo</SelectItem>
                                                <SelectItem value="Médio">Médio</SelectItem>
                                                <SelectItem value="Alto">Alto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cronograma Estimado</Label>
                                        <Input value={estimatorData.timeline} onChange={(e) => handleChange('timeline', e.target.value)} />
                                    </div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Horas Estimadas</Label>
                                        <Input type="number" value={estimatorData.estimatedHours} onChange={(e) => handleChange('estimatedHours', Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Valor/Hora (R$)</Label>
                                        <Input type="number" value={estimatorData.hourlyRate} onChange={(e) => handleChange('hourlyRate', Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Equipe Sugerida</Label>
                                    <Input value={estimatorData.team} onChange={(e) => handleChange('team', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Proposta de Valor</Label>
                                    <Textarea value={estimatorData.valueProposition} onChange={(e) => handleChange('valueProposition', e.target.value)} rows={3} />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-sidebar/50 p-4">
                                 <div className="flex justify-between items-center w-full">
                                    <span className="text-lg font-semibold">Preço Final Estimado:</span>
                                    <span className="text-2xl font-bold text-green-400">R$ {finalPrice.toLocaleString()}</span>
                                </div>
                            </CardFooter>
                         </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuoteEstimatorPage;