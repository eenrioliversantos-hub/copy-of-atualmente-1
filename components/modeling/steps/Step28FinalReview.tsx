
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';
import { Alert, AlertDescription } from '../../ui/Alert';
import { Separator } from '../../ui/Separator';

interface Step28FinalReviewProps {
    wizardData: any;
    setCurrentStep: (step: number) => void;
}

const SummaryItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4">
        <p className="text-text-secondary flex-shrink-0 text-sm">{label}</p>
        <div className="font-medium text-right break-words text-sm">{value || <span className="italic text-text-secondary">N/A</span>}</div>
    </div>
);

const Step28FinalReview: React.FC<Step28FinalReviewProps> = ({ wizardData, setCurrentStep }) => {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    
    // Extração segura com fallbacks de objeto vazio
    const planning = wizardData?.planning || {};
    const vision = planning.step1 || {};
    const type = planning.step2 || {};
    const arch = planning.step3 || {};
    const stack = planning.step4 || {};
    
    const dataModeling = wizardData?.data_modeling || {};
    const entities = dataModeling.step8?.entities || [];
    const apis = dataModeling.step13?.endpoints || [];
    
    const ux = wizardData?.interface_ux || {};
    const screens = ux.step15?.screens || [];
    const theme = ux.step18 || {};
    
    const funcs = wizardData?.functionalities || {};
    const notifications = funcs.step19 || {};
    
    const techReqs = wizardData?.tech_reqs || {};
    const seo = techReqs.step23 || {};
    const perf = techReqs.step24 || {};
    const security = techReqs.step25 || {};

    const handleToggle = (card: string) => setExpandedCard(expandedCard === card ? null : card);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Revisão de Engenharia</h2>
                <p className="text-text-secondary mt-2">Confirme todas as especificações antes de iniciar a construção.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Planejamento */}
                <Card className={expandedCard === 'p' ? 'ring-2 ring-accent' : ''}>
                    <CardHeader className="cursor-pointer" onClick={() => handleToggle('p')}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="eye" className="text-accent" />
                                <CardTitle>Planejamento</CardTitle>
                            </div>
                            <Icon name={expandedCard === 'p' ? 'chevronUp' : 'chevronDown'} className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SummaryItem label="Sistema" value={vision.systemName} />
                        <SummaryItem label="Tipo" value={type.systemType} />
                        <SummaryItem label="Arquitetura" value={arch.architecture} />
                        {expandedCard === 'p' && (
                            <div className="pt-4 border-t border-card-border mt-4 animate-in fade-in">
                                <SummaryItem label="Backend" value={(stack.backend || []).join(', ')} />
                                <SummaryItem label="Frontend" value={(stack.frontend || []).join(', ')} />
                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="w-full mt-2 text-accent">Editar Planejamento</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dados */}
                <Card className={expandedCard === 'd' ? 'ring-2 ring-accent' : ''}>
                    <CardHeader className="cursor-pointer" onClick={() => handleToggle('d')}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="database" className="text-accent" />
                                <CardTitle>Modelo de Dados</CardTitle>
                            </div>
                            <Icon name={expandedCard === 'd' ? 'chevronUp' : 'chevronDown'} className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SummaryItem label="Entidades" value={entities.length} />
                        <SummaryItem label="Endpoints API" value={apis.length} />
                        {expandedCard === 'd' && (
                            <div className="pt-4 border-t border-card-border mt-4 animate-in fade-in">
                                <div className="space-y-1">
                                    {entities.map((e: any) => <div key={e.id} className="text-xs text-text-secondary">• {e.name}</div>)}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(8)} className="w-full mt-2 text-accent">Editar Dados</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Interface */}
                <Card className={expandedCard === 'i' ? 'ring-2 ring-accent' : ''}>
                    <CardHeader className="cursor-pointer" onClick={() => handleToggle('i')}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="layout" className="text-accent" />
                                <CardTitle>Interface & UX</CardTitle>
                            </div>
                            <Icon name={expandedCard === 'i' ? 'chevronUp' : 'chevronDown'} className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SummaryItem label="Total de Telas" value={screens.length} />
                        <SummaryItem label="Cor Primária" value={<div className="w-4 h-4 rounded-full border border-card-border" style={{backgroundColor: theme.primaryColor || '#000'}} />} />
                        {expandedCard === 'i' && (
                            <div className="pt-4 border-t border-card-border mt-4 animate-in fade-in">
                                <SummaryItem label="Fonte" value={theme.fontFamily} />
                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(15)} className="w-full mt-2 text-accent">Editar UI/UX</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Requisitos Técnicos */}
                <Card className={expandedCard === 't' ? 'ring-2 ring-accent' : ''}>
                    <CardHeader className="cursor-pointer" onClick={() => handleToggle('t')}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="shield" className="text-accent" />
                                <CardTitle>Técnico & Qualidade</CardTitle>
                            </div>
                            <Icon name={expandedCard === 't' ? 'chevronUp' : 'chevronDown'} className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SummaryItem label="Sitemap" value={seo.sitemap ? 'Sim' : 'Não'} />
                        <SummaryItem label="Lighthouse Perf" value={perf.lighthouse?.performance} />
                        <SummaryItem label="HTTPS Forçado" value={security.https ? 'Sim' : 'Não'} />
                        {expandedCard === 't' && (
                            <div className="pt-4 border-t border-card-border mt-4 animate-in fade-in">
                                <SummaryItem label="Proteções" value={(security.vulnerabilities || []).join(', ')} />
                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(23)} className="w-full mt-2 text-accent">Editar Requisitos</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="bg-accent/10 border border-accent/20 p-6 rounded-xl flex items-center justify-between mt-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/20 rounded-full"><Icon name="sparkles" className="h-6 w-6 text-accent" /></div>
                    <div>
                        <h4 className="font-bold">Tudo pronto para a construção?</h4>
                        <p className="text-sm text-text-secondary">Ao finalizar, a IA irá preparar os scaffolds de código e o plano de sprints.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step28FinalReview;
