
import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogCloseButton } from '../../ui/Dialog';
import { generateFullApi } from '../../../lib/generation/fullApiGenerator';
import ApiArtifactsView from '../generation/ApiArtifactsView';

interface ApiDesignToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
    planningData: any;
    entitiesData: any;
}

const ApiDesignTool: React.FC<ApiDesignToolProps> = ({ initialData, onComplete, onBack, planningData, entitiesData }) => {
    const [phase, setPhase] = useState<'overview' | 'conference' | 'generating' | 'details'>('overview');
    const [conferenceData, setConferenceData] = useState(initialData?.conference || {
        apiStyle: 'REST',
        versioning: 'URL Path (/v1)',
        authentication: 'JWT Bearer Token',
        dataFormat: 'Standard JSON',
    });
    const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
    const [generatedArtifacts, setGeneratedArtifacts] = useState<any>(initialData?.artifacts || null);
    const [loadingMessage, setLoadingMessage] = useState('');

    const conferenceQuestions = [
        { id: 'apiStyle', question: 'Qual estilo de API devemos adotar?', options: ['REST', 'GraphQL'], recommendation: 'REST', justification: 'REST é o padrão da indústria, amplamente suportado e mais simples para a maioria dos casos de uso CRUD. É ideal para comunicação entre serviços e clientes web/mobile tradicionais.' },
        { id: 'versioning', question: 'Como faremos o versionamento da API?', options: ['URL Path (/v1)', 'Header (Accept: ...v1+json)'], recommendation: 'URL Path (/v1)', justification: 'Versionamento na URL é explícito, fácil de entender e rotear. É a abordagem mais comum e clara para consumidores da API.' },
        { id: 'authentication', question: 'Qual método de autenticação será o primário?', options: ['JWT Bearer Token', 'OAuth 2.0', 'API Key'], recommendation: 'JWT Bearer Token', justification: 'JWT é um padrão moderno, stateless e ideal para proteger APIs consumidas por frontends (SPAs) e aplicações mobile.' },
        { id: 'dataFormat', question: 'Qual formato de dados usaremos?', options: ['Standard JSON', 'JSON:API'], recommendation: 'Standard JSON', justification: 'JSON padrão é universalmente entendido e mais simples de implementar e consumir. JSON:API é poderoso para relacionamentos complexos, mas adiciona complexidade.' },
    ];
    
    const handleConferenceChange = (id: string, value: string) => setConferenceData((prev: any) => ({ ...prev, [id]: value }));

    const handleGenerate = async () => {
        setPhase('generating');
        const steps = [
            "Analisando contexto do projeto...",
            "Definindo estratégia de API com base nas suas escolhas...",
            "Projetando contratos de dados (DTOs)...",
            "Estruturando módulos de recursos...",
            "Gerando rotas e controladores para cada entidade...",
            "Esboçando serviços de lógica de negócio...",
            "Criando schemas de validação...",
            "Desenhando diagramas de componente e sequência...",
            "Compilando artefatos finais..."
        ];

        for (const message of steps) {
            setLoadingMessage(message);
            await new Promise(res => setTimeout(res, 400));
        }
        
        const artifacts = await generateFullApi({ planning: planningData, data_modeling: entitiesData }, conferenceData);
        setGeneratedArtifacts(artifacts);
        setPhase('details');
    };

    const handleCompleteAndSave = () => {
        const fullData = { conference: conferenceData, artifacts: generatedArtifacts };
        onComplete(fullData, generatedArtifacts?.files || {});
    };

    const AIRecomendation: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mt-4 p-4 border border-sky-500/30 bg-sky-500/10 rounded-lg">
            <h4 className="font-semibold text-sky-300 flex items-center gap-2 mb-2"><Icon name="sparkles" className="h-5 w-5"/> Recomendação da IA: {title}</h4>
            <div className="text-sm text-sky-400/80 prose prose-sm prose-invert max-w-none">{children}</div>
        </div>
    );

    if (phase === 'overview') {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in-50">
                <Dialog open={isRecommendationModalOpen} onClose={() => setIsRecommendationModalOpen(false)}>
                    <DialogHeader><DialogTitle>Raciocínio da IA</DialogTitle><DialogCloseButton /></DialogHeader>
                    <DialogContent><p>Com base na sua modelagem de dados e na necessidade de múltiplos endpoints CRUD, uma arquitetura de API <strong>REST</strong> é a mais indicada. Ela oferece um modelo de recursos claro e é universalmente compreendida, facilitando a integração com qualquer tipo de cliente (web, mobile, etc.).</p></DialogContent>
                </Dialog>
                <div className="text-center"><h1 className="text-2xl font-bold">Visão Geral da Engenharia de API</h1><p className="text-text-secondary">O Engenheiro de IA analisou seu projeto e gerou uma recomendação inicial.</p></div>
                <Card><CardHeader><CardTitle>Contexto Analisado</CardTitle></CardHeader><CardContent className="p-4 bg-background rounded-md border border-card-border text-sm text-text-secondary"><p><strong>Objetivo:</strong> {planningData?.step1?.mainObjective}</p><p><strong>Entidades Principais:</strong> {(entitiesData?.step8?.entities || []).map((e: any) => e.name).join(', ')}</p></CardContent></Card>
                <Card className="text-center"><CardHeader><CardTitle>Estilo de API Sugerido</CardTitle></CardHeader><CardContent><Icon name="route" className="h-16 w-16 text-accent mx-auto" /><h3 className="text-xl font-semibold mt-4">API RESTful</h3><p className="text-text-secondary mt-2">Um design padronizado, escalável e stateless.</p></CardContent><CardFooter className="flex-col gap-2"><Button variant="outline" size="sm" onClick={() => setIsRecommendationModalOpen(true)}><Icon name="helpCircle" className="h-4 w-4 mr-2" />Entenda a Recomendação</Button><Button size="lg" onClick={() => setPhase('conference')}><Icon name="arrowRight" className="h-4 w-4 mr-2" />Prosseguir para Conferência</Button></CardFooter></Card>
            </div>
        );
    }
    
    if (phase === 'conference') {
        return (
             <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in-50">
                 <div className="text-center"><h1 className="text-2xl font-bold">Conferência com o Engenheiro de IA</h1><p className="text-text-secondary">Valide as decisões chave para o design da sua API.</p></div>
                <div className="space-y-4">
                    {conferenceQuestions.map(q => (
                        <Card key={q.id}><CardHeader><CardTitle className="text-lg">{q.question}</CardTitle></CardHeader><CardContent><Select value={conferenceData[q.id]} onValueChange={(v) => handleConferenceChange(q.id, v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{q.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><AIRecomendation title={q.recommendation}>{q.justification}</AIRecomendation></CardContent></Card>
                    ))}
                </div>
                 <div className="flex justify-end gap-2 mt-6"><Button variant="outline" onClick={() => setPhase('overview')}>Voltar</Button><Button size="lg" onClick={handleGenerate}><Icon name="check" className="h-5 w-5 mr-2" /> Validar e Gerar API Completa</Button></div>
            </div>
        )
    }

    if (phase === 'generating') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <Icon name="spinner" className="animate-spin h-12 w-12 text-accent" />
                <h2 className="text-2xl font-semibold mt-4">O Engenheiro de IA está trabalhando...</h2>
                <p className="text-text-secondary mt-2">{loadingMessage}</p>
            </div>
        );
    }

    if (phase === 'details') {
        return (
            <ApiArtifactsView
                artifacts={generatedArtifacts}
                onBack={() => setPhase('conference')}
                onSave={handleCompleteAndSave}
            />
        );
    }

    return null;
};

export default ApiDesignTool;
