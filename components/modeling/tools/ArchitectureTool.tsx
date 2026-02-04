


import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Label } from '../../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';
import ComponentDetailModal from './ComponentDetailModal';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogCloseButton } from '../../ui/Dialog';

interface ArchitectureToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
    planningData: any;
    entitiesData: any;
}

interface ComponentItem {
    id: string;
    compName: string;
    compType: string;
    compOwner: string;
    compResponsibility: string;
    compDependencies: string;
    compEvents: string;
}

const ArchitectureTool: React.FC<ArchitectureToolProps> = ({ initialData, onComplete, onBack, planningData, entitiesData }) => {
    const [phase, setPhase] = useState<'overview' | 'conference' | 'details'>('overview');
    const [conferenceData, setConferenceData] = useState(initialData?.conference || {
        cloudProvider: 'AWS', containerStrategy: 'Kubernetes (EKS, GKE)', dbStrategy: 'Banco de dados por serviço', ciCdTool: 'GitHub Actions',
    });
    const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('diagram');
    const [components, setComponents] = useState<ComponentItem[]>(initialData?.components || []);
    const [generatedArtifacts, setGeneratedArtifacts] = useState<any>(initialData?.artifacts || null);
    const [modalData, setModalData] = useState<{ component: any; allComponents: any[] } | null>(null);

    const conferenceQuestions = [
        {
            id: 'cloudProvider',
            question: 'Qual provedor de nuvem devemos utilizar?',
            options: ['AWS', 'Google Cloud', 'Azure', 'Vercel/Netlify'],
            recommendation: 'AWS',
            justification: 'Oferece o mais amplo ecossistema de serviços, maturidade e escalabilidade para microsserviços, sendo o padrão da indústria para aplicações robustas.',
            tradeOffs: {
                'Google Cloud': 'Excelente para Kubernetes (GKE) e serviços de IA, mas o ecossistema é um pouco menor que o da AWS.',
                'Azure': 'Ótima integração com o ecossistema Microsoft (.NET), mas pode ter uma curva de aprendizado maior para equipes não-Windows.',
                'Vercel/Netlify': 'Ideal para frontends e aplicações serverless simples, mas não recomendado para orquestração complexa de microsserviços de backend.',
            }
        },
        {
            id: 'containerStrategy',
            question: 'Qual será a estratégia de containers e orquestração?',
            options: ['Kubernetes (EKS, GKE)', 'Docker Swarm', 'Serverless (Fargate, Cloud Run)', 'PaaS (Heroku, Render)'],
            recommendation: 'Kubernetes (EKS, GKE)',
            justification: 'É o orquestrador padrão do mercado, oferecendo portabilidade, escalabilidade automática e um ecossistema robusto para gerenciar microsserviços complexos.',
            tradeOffs: {
                'Docker Swarm': 'Mais simples de gerenciar no início, mas cria um forte acoplamento entre os serviços, dificulta a evolução independente e pode se tornar um gargalo de performance e complexidade.',
                'Serverless (Fargate, Cloud Run)': 'Excelente para reduzir a sobrecarga operacional, mas pode levar a "vendor lock-in" e ser mais caro em cenários de alta carga constante.',
                'PaaS (Heroku, Render)': 'Extremamente fácil de usar para prototipagem e projetos menores, mas pode se tornar caro e limitado em escala.',
            }
        },
        {
            id: 'dbStrategy',
            question: 'Qual estratégia de banco de dados adotaremos?',
            options: ['Banco de dados por serviço', 'Banco de dados compartilhado'],
            recommendation: 'Banco de dados por serviço',
            justification: 'Garante o desacoplamento total entre os microsserviços. Cada serviço é dono de seus dados, permitindo que evoluam de forma independente e usem a tecnologia de banco de dados mais adequada para sua função.',
            tradeOffs: {
                'Banco de dados compartilhado': 'Mais simples de gerenciar no início, mas cria um forte acoplamento entre os serviços, dificulta a evolução independente e pode se tornar um gargalo de performance e complexidade.',
            }
        },
        {
            id: 'ciCdTool',
            question: 'Qual ferramenta de CI/CD será utilizada?',
            options: ['GitHub Actions', 'GitLab CI', 'Jenkins'],
            recommendation: 'GitHub Actions',
            justification: 'Integrado nativamente ao GitHub, possui uma sintaxe YAML simples, um vasto marketplace de ações prontas e é excelente para projetos que já estão no GitHub.',
            tradeOffs: {
                'GitLab CI': 'Ferramenta poderosa e bem integrada se você já usa o GitLab para controle de versão.',
                'Jenkins': 'Altamente customizável e flexível, mas requer mais configuração e manutenção de infraestrutura própria.',
            }
        },
    ];

    const handleConferenceChange = (id: string, value: string) => setConferenceData((prev: any) => ({ ...prev, [id]: value }));

    const handleValidation = () => {
        if (components.length === 0) {
            const exampleComponents = [
                { name: 'Frontend_Web', type: 'Frontend', owner: 'Team_UX', responsibility: 'Interface do usuário e lógica de apresentação.', dependencies: 'API_Gateway', events: '' },
                { name: 'API_Gateway', type: 'API', owner: 'Team_Ops', responsibility: 'Roteamento de requisições, segurança (WAF) e Rate Limiting.', dependencies: 'Service_Auth, Service_Products', events: '' },
                { name: 'Service_Auth', type: 'API', owner: 'Team_Security', responsibility: 'Autenticação de usuários (Login/Logout) e emissão de JWT.', dependencies: 'DB_Users', events: '' },
                { name: 'Service_Products', type: 'API', owner: 'Team_Core', responsibility: 'Gerencia o catálogo de produtos e inventário.', dependencies: 'DB_Products, Queue_Product_Updates', events: 'Product_Created, Product_Updated' },
                { name: 'DB_Users', type: 'Database', owner: 'Team_DBA', responsibility: 'Armazena credenciais e perfis de usuários.', dependencies: '', events: '' },
                { name: 'DB_Products', type: 'Database', owner: 'Team_DBA', responsibility: 'Banco de dados principal do catálogo.', dependencies: '', events: '' },
                { name: 'Queue_Product_Updates', type: 'Fila', owner: 'Team_Core', responsibility: 'Fila de Mensagens para eventos assíncronos.', dependencies: '', events: '' }
            ];
            setComponents(exampleComponents.map((data, index) => ({
                id: `comp-initial-${index}`, compName: data.name, compType: data.type, compOwner: data.owner, compResponsibility: data.responsibility,
                compDependencies: data.dependencies, compEvents: data.events
            })));
        }
        setPhase('details');
        setActiveTab('diagram');
    };

    const handleGenerateArtifacts = useCallback(() => {
        let mermaid = 'graph TD\n\n';
        const layers: Record<string, string[]> = { Frontend: [], 'API Gateway': [], API: [], Fila: [], Database: [] };
        components.forEach(c => {
            const type = c.compType || 'API';
            if (type.toLowerCase() === 'frontend') layers.Frontend.push(c.compName);
            else if (c.compName.toLowerCase().includes('gateway')) layers['API Gateway'].push(c.compName);
            else if (type.toLowerCase() === 'api') layers.API.push(c.compName);
            else if (type.toLowerCase() === 'fila') layers.Fila.push(c.compName);
            else if (type.toLowerCase() === 'database') layers.Database.push(c.compName);
            else layers.API.push(c.compName);
        });

        Object.entries(layers).forEach(([layerName, compNames]) => {
            if (compNames.length > 0) {
                mermaid += `  subgraph ${layerName}\n`;
                compNames.forEach(name => { mermaid += `    ${name}\n`; });
                mermaid += `  end\n\n`;
            }
        });

        components.forEach(c => {
            mermaid += `  ${c.compName}["${c.compName}<br><small>${c.compType}</small>"]\n`;
            const deps = (c.compDependencies || '').split(',').map(d => d.trim()).filter(Boolean);
            deps.forEach(dep => { mermaid += `  ${c.compName} --> ${dep}\n`; });
        });

        const docMd = `# Documento de Arquitetura\n\n## Componentes\n\n${components.map(c => `### ${c.compName}\n- **Tipo:** ${c.compType}\n- **Responsabilidade:** ${c.compResponsibility}\n- **Dependências:** ${c.compDependencies || 'Nenhuma'}`).join('\n\n')}`;
        
        setGeneratedArtifacts({ mermaidCode: mermaid, documentation: docMd });
    }, [components]);

    useEffect(() => {
        if (phase === 'details') {
            handleGenerateArtifacts();
        }
    }, [phase, components, handleGenerateArtifacts]);

    const handleCompleteAndSave = () => {
        const fullData = { conference: conferenceData, components, artifacts: generatedArtifacts };
        onComplete(fullData, generatedArtifacts);
    };

    const AIRecomendation: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mt-4 p-4 border border-sky-500/30 bg-sky-500/10 rounded-lg">
            <h4 className="font-semibold text-sky-300 flex items-center gap-2 mb-2"><Icon name="sparkles" className="h-5 w-5"/> Recomendação da IA: {title}</h4>
            <div className="text-sm text-sky-400/80 prose prose-sm prose-invert max-w-none">{children}</div>
        </div>
    );
    
    const AIWarning: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="mt-2 p-3 border border-yellow-500/30 bg-yellow-500/10 rounded-lg text-sm text-yellow-400/90 flex items-start gap-2">
            <Icon name="alertCircle" className="h-4 w-4 mt-0.5 flex-shrink-0"/>
            <div>{children}</div>
        </div>
    );
    
    // New Diagram Component
    const DiagramView: React.FC<{ components: ComponentItem[]; onNodeClick: (component: ComponentItem) => void }> = ({ components, onNodeClick }) => {
        const layers: Record<string, string[]> = { Frontend: [], 'API Gateway': [], API: [], Fila: [], Database: [] };
        const componentMap = new Map<string, ComponentItem>(components.map(c => [c.compName, c]));
    
        // FIX: Replaced forEach with a for...of loop to resolve a potential type inference issue where 'c' was being typed as 'unknown'.
        for (const c of components) {
            const type = c.compType || 'API';
            if (type.toLowerCase() === 'frontend') layers.Frontend.push(c.id);
            else if (c.compName.toLowerCase().includes('gateway')) layers['API Gateway'].push(c.id);
            else if (type.toLowerCase() === 'api') layers.API.push(c.id);
            else if (type.toLowerCase() === 'fila') layers.Fila.push(c.id);
            else if (type.toLowerCase() === 'database') layers.Database.push(c.id);
            else layers.API.push(c.id);
        }
    
        const layerOrder = ['Frontend', 'API Gateway', 'API', 'Fila', 'Database'];
        const nodePositions = new Map<string, { x: number; y: number }>();
        const nodeWidth = 180; const nodeHeight = 60; const ySpacing = 150; const xSpacing = 220;
    
        layerOrder.forEach((layerName, layerIndex) => {
            const layerComponentIds = layers[layerName];
            const totalWidth = layerComponentIds.length * nodeWidth + (layerComponentIds.length - 1) * (xSpacing - nodeWidth);
            let startX = (1200 - totalWidth) / 2;

            layerComponentIds.forEach((compId, compIndex) => {
                const y = layerIndex * ySpacing + 100;
                const x = startX + compIndex * xSpacing;
                nodePositions.set(compId, { x, y });
            });
        });
    
        const edges = components.flatMap(comp => {
            const sourcePos = nodePositions.get(comp.id);
            const deps = (comp.compDependencies || '').split(',').map(d => d.trim()).filter(Boolean);
            return deps.map(depName => {
// FIX: Explicitly type targetComp to resolve type inference issue in nested map.
                const targetComp: ComponentItem | undefined = componentMap.get(depName);
                if (targetComp) {
                    const targetPos = nodePositions.get(targetComp.id);
                    if (sourcePos && targetPos) {
                        return {
                            id: `${comp.id}-${targetComp.id}`, x1: sourcePos.x + nodeWidth / 2, y1: sourcePos.y + nodeHeight,
                            x2: targetPos.x + nodeWidth / 2, y2: targetPos.y,
                        };
                    }
                }
                return null;
            }).filter(Boolean);
        });
        
        if (components.length === 0) {
            return (
                <div className="w-full h-[70vh] diagram-bg rounded-lg border border-card-border flex items-center justify-center">
                    <p className="text-text-secondary">Defina os componentes na aba "Componentes & APIs" para visualizar o diagrama.</p>
                </div>
            );
        }
    
        return (
            <div className="w-full h-[70vh] bg-background diagram-bg rounded-lg border border-card-border overflow-auto">
                <svg width="1200" height="800">
                    <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" /></marker></defs>
                    {edges.map(edge => (<path key={edge!.id} d={`M ${edge!.x1} ${edge!.y1} C ${edge!.x1} ${edge!.y1 + 60}, ${edge!.x2} ${edge!.y2 - 60}, ${edge!.x2} ${edge!.y2}`} stroke="#64748b" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />))}
                    {components.map(comp => {
                        const pos = nodePositions.get(comp.id);
                        if (!pos) return null;
                        return (
                            <g key={comp.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer group" onClick={() => onNodeClick(comp)}>
                                <rect width={nodeWidth} height={nodeHeight} rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" className="group-hover:stroke-accent transition-all" />
                                <foreignObject width={nodeWidth} height={nodeHeight}>
                                    <div className="p-2 flex flex-col items-center justify-center h-full text-center unselectable"><p className="font-bold text-sm text-text-primary truncate w-full">{comp.compName}</p><p className="text-xs text-text-secondary">{comp.compType}</p></div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    if (phase === 'overview') {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                <Dialog open={isRecommendationModalOpen} onClose={() => setIsRecommendationModalOpen(false)}>
                    <DialogHeader><DialogTitle>Raciocínio da IA</DialogTitle><DialogCloseButton /></DialogHeader>
                    <DialogContent><p>Com base na necessidade de <strong>alta escalabilidade</strong> e <strong>múltiplas entidades de domínio</strong>, a arquitetura de <strong>Microsserviços</strong> é recomendada. Isso permite que equipes independentes trabalhem em serviços isolados, facilita a escalabilidade granular e aumenta a resiliência do sistema.</p></DialogContent>
                </Dialog>
                <div className="text-center"><h1 className="text-2xl font-bold">Visão Geral da Arquitetura</h1><p className="text-text-secondary">A IA analisou seu projeto e gerou uma recomendação inicial.</p></div>
                <Card><CardHeader><CardTitle>Contexto Analisado</CardTitle></CardHeader><CardContent className="p-4 bg-background rounded-md border border-card-border text-sm text-text-secondary"><p><strong>Objetivo:</strong> {planningData?.step1?.mainObjective}</p><p><strong>Entidades Principais:</strong> {(entitiesData?.step8?.entities || []).map((e: any) => e.name).join(', ')}</p></CardContent></Card>
                <Card className="text-center"><CardHeader><CardTitle>Template Arquitetural Sugerido</CardTitle></CardHeader><CardContent><Icon name="gitBranch" className="h-16 w-16 text-accent mx-auto" /><h3 className="text-xl font-semibold mt-4">Microsserviços</h3><p className="text-text-secondary mt-2">Uma arquitetura distribuída e escalável.</p></CardContent><CardFooter className="flex-col gap-2"><Button variant="outline" size="sm" onClick={() => setIsRecommendationModalOpen(true)}><Icon name="helpCircle" className="h-4 w-4 mr-2" />Entenda a Recomendação</Button><Button size="lg" onClick={() => setPhase('conference')}><Icon name="arrowRight" className="h-4 w-4 mr-2" />Prosseguir para Conferência</Button></CardFooter></Card>
            </div>
        );
    }
    
    if (phase === 'conference') {
        return (
             <div className="p-8 max-w-4xl mx-auto space-y-6">
                 <div className="text-center"><h1 className="text-2xl font-bold">Conferência com Arquiteto de IA</h1><p className="text-text-secondary">Valide as decisões chave para a arquitetura do seu sistema.</p></div>
                <div className="space-y-4">
                    {conferenceQuestions.map(q => {
                        const userChoice = conferenceData[q.id];
                        const isRecommended = userChoice === q.recommendation;
                        return (
                            <Card key={q.id}><CardHeader><CardTitle className="text-lg">{q.question}</CardTitle></CardHeader><CardContent><Select value={userChoice} onValueChange={(v) => handleConferenceChange(q.id, v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{q.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><AIRecomendation title={q.recommendation}>{q.justification}</AIRecomendation>{!isRecommended && q.tradeOffs[userChoice] && (<AIWarning><strong>Trade-off:</strong> {q.tradeOffs[userChoice]}</AIWarning>)}</CardContent></Card>
                        );
                    })}
                </div>
                 <div className="flex justify-end gap-2 mt-6"><Button variant="outline" onClick={() => setPhase('overview')}>Voltar</Button><Button size="lg" onClick={handleValidation}><Icon name="check" className="h-5 w-5 mr-2" /> Validar e Gerar Arquitetura</Button></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            {modalData && <ComponentDetailModal component={modalData.component} allComponents={modalData.allComponents} onClose={() => setModalData(null)} />}
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => setPhase('conference')}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar para Conferência</Button>
                <h1 className="text-lg font-semibold">Hub de Arquitetura - Detalhes</h1>
                <Button onClick={handleCompleteAndSave}><Icon name="check" className="h-4 w-4 mr-2" />Concluir Fase</Button>
            </header>

            <main className="flex flex-col overflow-hidden">
                <div className="px-6 py-3 border-b border-card-border bg-sidebar">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="diagram">Visualização Arquitetural</TabsTrigger>
                            <TabsTrigger value="components">Componentes & APIs</TabsTrigger>
                            <TabsTrigger value="infra">Infra & Deploy</TabsTrigger>
                            <TabsTrigger value="artifacts">Artefatos Gerados</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                     <Tabs value={activeTab}>
                        <TabsContent value="diagram">
                            <Tabs defaultValue="visual" className="w-full">
                                <TabsList><TabsTrigger value="visual">Planta Interativa</TabsTrigger><TabsTrigger value="docs">Documentação (Mermaid)</TabsTrigger></TabsList>
                                <TabsContent value="visual" className="mt-4"><DiagramView components={components} onNodeClick={(comp) => setModalData({ component: comp, allComponents: components })} /></TabsContent>
                                <TabsContent value="docs" className="mt-4">{generatedArtifacts?.mermaidCode ? <CodeBlock language="mermaid" code={generatedArtifacts.mermaidCode} /> : <p>Gerando documentação...</p>}</TabsContent>
                            </Tabs>
                        </TabsContent>
                        <TabsContent value="components">
                             <Card className="max-w-5xl mx-auto"><CardContent className="p-6 space-y-4">{components.map((c, i) => <div key={c.id} className="grid grid-cols-4 gap-2"><Input value={c.compName} onChange={e => setComponents(p => p.map((pc, j) => j === i ? {...pc, compName: e.target.value} : pc))} placeholder="Nome" /><Input value={c.compDependencies} onChange={e => setComponents(p => p.map((pc, j) => j === i ? {...pc, compDependencies: e.target.value} : pc))} placeholder="Dependências" /><Input value={c.compType} onChange={e => setComponents(p => p.map((pc, j) => j === i ? {...pc, compType: e.target.value} : pc))} placeholder="Tipo" /><Input value={c.compResponsibility} onChange={e => setComponents(p => p.map((pc, j) => j === i ? {...pc, compResponsibility: e.target.value} : pc))} placeholder="Responsabilidade" /></div>)}</CardContent></Card>
                        </TabsContent>
                         <TabsContent value="infra">
                             <Card className="max-w-4xl mx-auto"><CardContent className="p-6">{Object.entries(conferenceData).map(([key, value]) => (<div key={key} className="flex justify-between p-2 border-b border-card-border"><span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span><span>{value as string}</span></div>))}</CardContent></Card>
                         </TabsContent>
                        <TabsContent value="artifacts">
                            {generatedArtifacts?.documentation ? <CodeBlock language="markdown" code={generatedArtifacts.documentation} /> : <p>Gerando artefatos...</p>}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default ArchitectureTool;
