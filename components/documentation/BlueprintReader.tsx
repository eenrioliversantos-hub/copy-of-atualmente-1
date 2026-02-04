
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { ScrollArea } from '../ui/ScrollArea';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import ERDiagram from '../modeling/er-diagram/ERDiagram';
import CodeBlock from '../shared/CodeBlock';
import { DevelopmentPlan, DevTask } from '../../types';
import FileExplorer, { FileTreeItem } from '../shared/FileExplorer';
import { compileProjectArtifacts } from '../../lib/projectCompiler';
import { generateMasterReport } from '../../lib/generation/masterReportGenerator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton } from '../ui/Dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';

// FIX: Added missing SitemapNode interface definition.
interface SitemapNode {
    name: string;
    fullPath: string;
    isDynamic: boolean;
    children: SitemapNode[];
    data?: any;
}

// FIX: Added missing buildSitemapTree helper function to construct route hierarchy for the FrontendArchitectureView.
const buildSitemapTree = (screens: any[], prototypePages: any[]): SitemapNode => {
    const root: SitemapNode = { name: 'root', fullPath: '/', isDynamic: false, children: [] };

    const allPages = [...(prototypePages || [])];
    (screens || []).forEach(s => {
        if (!allPages.find(p => p.path === s.path)) {
            allPages.push({ ...s, type: 'static', authLevel: 'public' });
        }
    });

    allPages.forEach(page => {
        const parts = (page.path || '').split('/').filter(Boolean);
        let currentNode = root;
        let currentPath = '';

        parts.forEach((part, index) => {
            currentPath += `/${part}`;
            const isLast = index === parts.length - 1;
            let child = currentNode.children.find(c => c.name === part);

            if (!child) {
                child = {
                    name: part,
                    fullPath: currentPath,
                    isDynamic: part.startsWith('[') && part.endsWith(']'),
                    children: [],
                    data: isLast ? page : { type: 'group', authLevel: 'public' }
                };
                currentNode.children.push(child);
            } else if (isLast) {
                child.data = { ...child.data, ...page };
            }
            currentNode = child;
        });
    });

    return root;
};

interface BlueprintReaderProps {
    wizardData: any;
    developmentPlan?: DevelopmentPlan;
    onBack: () => void;
    onEditStep?: (stepIndex: number) => void;
}

type CategoryId = 'strategy' | 'engineering' | 'interface' | 'execution' | 'artifacts';
type SectionId = string;

interface NavItem {
    id: SectionId;
    label: string;
    icon: string;
}

interface NavCategory {
    id: CategoryId;
    label: string;
    items: NavItem[];
}

const NAVIGATION: NavCategory[] = [
    {
        id: 'strategy',
        label: '1. Estratégia & Visão',
        items: [
            { id: 'master_analysis', label: 'Análise Mestra (BRD)', icon: 'award' },
            { id: 'overview', label: 'Visão Geral do Produto', icon: 'eye' },
            { id: 'users', label: 'Personas & Jornadas', icon: 'users' },
            { id: 'requirements', label: 'Requisitos de Negócio', icon: 'list' },
        ]
    },
    {
        id: 'engineering',
        label: '2. Engenharia de Software',
        items: [
            { id: 'architecture', label: 'Arquitetura & Stack', icon: 'server' },
            { id: 'data_model', label: 'Modelagem de Dados', icon: 'database' },
            { id: 'functionalities', label: 'Funcionalidades & Regras', icon: 'puzzle' },
            { id: 'api_contracts', label: 'Contratos de API', icon: 'webhook' },
            { id: 'security', label: 'Segurança & Qualidade', icon: 'shield' },
        ]
    },
    {
        id: 'interface',
        label: '3. Interface & UX',
        items: [
            { id: 'sitemap', label: 'Mapa do Site & Arquitetura Frontend', icon: 'mapPin' },
            { id: 'design_system', label: 'Design System', icon: 'palette' },
        ]
    },
    {
        id: 'execution',
        label: '4. Plano de Execução',
        items: [
            { id: 'roadmap', label: 'Cronograma & Roadmap', icon: 'calendar' },
            { id: 'devops', label: 'DevOps & Ambientes', icon: 'cloud' },
        ]
    },
    {
        id: 'artifacts',
        label: '5. Artefatos Técnicos',
        items: [
            { id: 'tech_artifacts', label: 'Lista de Materiais & Arquivos', icon: 'code' },
        ]
    }
];

const SectionHeader: React.FC<{ title: string; description: string; onEdit?: () => void }> = ({ title, description, onEdit }) => (
    <div className="flex items-start justify-between mb-6 border-b border-card-border pb-4">
        <div>
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            <p className="text-text-secondary mt-1">{description}</p>
        </div>
        {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
                <Icon name="edit" className="h-4 w-4 mr-2" />
                Refinar
            </Button>
        )}
    </div>
);

const InfoBlock: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={`p-4 bg-sidebar/30 rounded-lg border border-card-border ${className}`}>
        <p className="text-xs text-text-secondary uppercase font-semibold mb-2">{label}</p>
        <div className="text-sm text-text-primary font-medium">{value || <span className="text-text-secondary italic">Não definido</span>}</div>
    </div>
);

// New Master Analysis View
const MasterAnalysisView: React.FC<{ wizardData: any }> = ({ wizardData }) => {
    const report = useMemo(() => generateMasterReport(wizardData), [wizardData]);
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Relatório de Análise Mestra (BRD)" description="O parecer técnico definitivo sobre a arquitetura e visão do sistema." />
            <Card className="border-l-4 border-l-accent bg-sidebar/50">
                <CardContent className="p-8 prose prose-invert max-w-none">
                    <CodeBlock language="markdown" code={report} />
                </CardContent>
            </Card>
        </div>
    );
};

const StrategyView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const step1 = data.planning?.step1 || {};
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Visão Geral do Produto" description="Definição fundamental do propósito e escopo do sistema." onEdit={() => onEdit?.(1)} />
            <Card><CardContent className="p-6 space-y-6"><InfoBlock label="Nome do Sistema" value={step1.systemName} /><InfoBlock label="Descrição" value={step1.description} /><InfoBlock label="Objetivo Principal" value={step1.mainObjective} /><InfoBlock label="Problema a Resolver" value={step1.problemSolved} /></CardContent></Card>
        </div>
    );
};

const PersonasView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const userTypes = data.planning?.step6?.userTypes || [];
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Personas & Usuários" description="Perfis de usuários que interagem com o sistema." onEdit={() => onEdit?.(6)} />
            <div className="grid gap-4">{userTypes.map((user: any, idx: number) => (<Card key={idx}><CardHeader><CardTitle>{user.name}</CardTitle></CardHeader><CardContent><p>{user.description}</p></CardContent></Card>))}{userTypes.length === 0 && <p className="text-text-secondary italic">Nenhum perfil de usuário definido.</p>}</div>
        </div>
    );
};

const RequirementsView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const objectives = data.planning?.step1?.businessObjectives || [];
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Requisitos de Negócio" description="Objetivos estratégicos e métricas de sucesso." onEdit={() => onEdit?.(1)} />
            <Card><CardHeader><CardTitle>Objetivos de Negócio</CardTitle></CardHeader><CardContent><ul className="list-disc pl-5 space-y-2">{objectives.map((obj: any, i: number) => (<li key={i}><span className="font-medium">{obj.text}</span> <Badge variant="outline" className="ml-2">{obj.priority}</Badge></li>))}{objectives.length === 0 && <li className="text-text-secondary italic">Nenhum objetivo definido.</li>}</ul></CardContent></Card>
        </div>
    );
};

const ArchitectureView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const planning = data.planning || {};
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Arquitetura & Stack" description="Decisões técnicas estruturais." onEdit={() => onEdit?.(3)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><InfoBlock label="Tipo de Sistema" value={planning.step2?.systemType} /><InfoBlock label="Padrão Arquitetural" value={planning.step3?.architecture} /></div>
             <Card><CardHeader><CardTitle>Stack Tecnológico</CardTitle></CardHeader><CardContent className="space-y-4"><div><p className="text-sm font-semibold mb-2">Frontend</p><div className="flex flex-wrap gap-2">{(planning.step4?.frontend || []).map((t: string) => <Badge key={t}>{t}</Badge>)}</div></div><div><p className="text-sm font-semibold mb-2">Backend</p><div className="flex flex-wrap gap-2">{(planning.step4?.backend || []).map((t: string) => <Badge key={t}>{t}</Badge>)}</div></div><div><p className="text-sm font-semibold mb-2">Database</p><div className="flex flex-wrap gap-2">{(planning.step4?.database || []).map((t: string) => <Badge key={t}>{t}</Badge>)}</div></div></CardContent></Card>
        </div>
    );
};

const DataModelView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const entities = data.data_modeling?.step8?.entities || [];
    const relationships = data.data_modeling?.step10?.relationships || [];
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Modelagem de Dados" description="Entidades, atributos e relacionamentos." onEdit={() => onEdit?.(8)} />
            <Tabs defaultValue="diagram"><TabsList><TabsTrigger value="diagram">Diagrama</TabsTrigger><TabsTrigger value="list">Dicionário de Dados</TabsTrigger></TabsList><TabsContent value="diagram" className="mt-4"><ERDiagram entities={entities} relationships={relationships} /></TabsContent><TabsContent value="list" className="mt-4"><div className="space-y-6">{entities.map((ent: any) => (<Card key={ent.id}><CardHeader className="pb-3 border-b border-card-border bg-sidebar/30"><div className="flex justify-between items-center"><div className="flex items-center gap-2"><Icon name="database" className="h-5 w-5 text-accent"/><CardTitle className="text-lg">{ent.name}</CardTitle></div><div className="flex gap-2">{ent.timestamps && <Badge variant="outline" className="text-[10px]">Timestamps</Badge>}{ent.softDeletes && <Badge variant="outline" className="text-[10px]">Soft Delete</Badge>}</div></div><CardDescription>{ent.description}</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead>Campo</TableHead><TableHead>Tipo</TableHead><TableHead className="text-center">PK</TableHead><TableHead className="text-center">Unique</TableHead><TableHead className="text-center">Required</TableHead></TableRow></TableHeader><TableBody>{ent.fields.map((f: any) => (<TableRow key={f.id} className="hover:bg-sidebar/50"><TableCell className="font-medium font-mono text-xs">{f.name}</TableCell><TableCell className="text-xs text-text-secondary">{f.type}</TableCell><TableCell className="text-center">{f.id === 'pk' || f.name === 'id' ? <Icon name="key" className="h-3 w-3 text-yellow-500 mx-auto"/> : ''}</TableCell><TableCell className="text-center">{f.unique ? <Icon name="check" className="h-3 w-3 text-green-500 mx-auto"/> : ''}</TableCell><TableCell className="text-center">{f.required ? <Icon name="check" className="h-3 w-3 text-green-500 mx-auto"/> : ''}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>))}</div></TabsContent></Tabs>
        </div>
    );
};

const ApiContractsView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const endpoints = data.data_modeling?.step13?.endpoints || [];
    const groupedEndpoints = useMemo(() => {
        const groups: Record<string, any[]> = {};
        endpoints.forEach((ep: any) => {
            const parts = ep.path.split('/').filter((p: string) => p && p !== 'api' && p !== 'v1');
            const resource = parts[0] || 'geral';
            if (!groups[resource]) groups[resource] = [];
            groups[resource].push(ep);
        });
        return groups;
    }, [endpoints]);
    const getMethodColor = (method: string) => { switch(method) { case 'GET': return 'text-sky-400 border-sky-400/30 bg-sky-400/10'; case 'POST': return 'text-green-400 border-green-400/30 bg-green-400/10'; case 'PUT': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'; case 'DELETE': return 'text-red-400 border-red-400/30 bg-red-400/10'; default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10'; } }
    return (
        <div className="space-y-6 animate-in fade-in-50">
             <SectionHeader title="Contratos de API" description="Especificação dos endpoints agrupados por recurso." onEdit={() => onEdit?.(13)} />
            {Object.entries(groupedEndpoints).map(([resource, resourceEndpoints]) => (<Card key={resource} className="overflow-hidden"><div className="bg-sidebar/50 p-3 border-b border-card-border"><h3 className="text-lg font-bold capitalize flex items-center gap-2"><Icon name="folder" className="h-5 w-5 text-accent"/> {resource}</h3></div><div className="divide-y divide-card-border">{(resourceEndpoints as any[]).map((ep: any) => (<div key={ep.id} className="p-4 hover:bg-sidebar/30 transition-colors"><div className="flex flex-col md:flex-row md:items-center gap-3 mb-2"><Badge variant="outline" className={`${getMethodColor(ep.method)} font-bold`}>{ep.method}</Badge><code className="bg-background px-2 py-0.5 rounded text-sm text-text-primary flex-1">{ep.path}</code>{ep.authRequired && <Badge variant="secondary" className="text-[10px]"><Icon name="lock" className="h-3 w-3 mr-1"/> Auth</Badge>}</div><p className="text-sm text-text-secondary pl-1">{ep.description}</p></div>))}</div></Card>))}{endpoints.length === 0 && <p className="text-text-secondary italic">Nenhum endpoint definido.</p>}
        </div>
    );
};

const SecurityQualityView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const security = data.tech_reqs?.step25 || {};
    const tests = data.tech_reqs?.step26 || {};
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Segurança & Qualidade" description="Requisitos não-funcionais críticos." onEdit={() => onEdit?.(25)} />
            <div className="grid md:grid-cols-2 gap-6"><Card><CardHeader><CardTitle>Segurança</CardTitle></CardHeader><CardContent className="space-y-2"><InfoBlock label="HTTPS" value={security.https ? "Sim" : "Não"} /><InfoBlock label="Proteções" value={(security.vulnerabilities || []).join(', ')} /></CardContent></Card><Card><CardHeader><CardTitle>Qualidade</CardTitle></CardHeader><CardContent className="space-y-2"><InfoBlock label="Níveis de Teste" value={(tests.levels || []).join(', ')} /><InfoBlock label="Cobertura Alvo" value={tests.coverageTarget ? `${tests.coverageTarget}%` : 'N/A'} /></CardContent></Card></div>
        </div>
    );
};

const FunctionalitiesView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const funcs = data.functionalities || {};
    return (
        <div className="space-y-6 animate-in fade-in-50">
             <SectionHeader title="Funcionalidades" description="Recursos funcionais do sistema." onEdit={() => onEdit?.(19)} />
            <div className="grid md:grid-cols-2 gap-4"><InfoBlock label="Canais de Notificação" value={(funcs.step19?.channels || []).join(', ')} /><InfoBlock label="Relatórios" value={(funcs.step21?.reports || []).map((r:any) => r.name).join(', ')} /><InfoBlock label="Ferramentas Analytics" value={(funcs.step22?.tools || []).join(', ')} /></div>
        </div>
    );
};

// FIX: Corrected type name and parameter references in RouteNodeView.
const RouteNodeView: React.FC<{ node: SitemapNode; onSelect: (node: SitemapNode) => void; level: number }> = ({ node, onSelect, level }) => {
    const isRoot = node.name === 'root';
    let borderColor = 'border-card-border';
    let textColor = 'text-text-primary';
    let iconName = 'layout';
    let iconColor = 'text-text-secondary';
    if (node.isDynamic) { borderColor = 'border-blue-500/30'; textColor = 'text-blue-200'; iconName = 'code'; iconColor = 'text-blue-400'; } 
    else if (node.data?.authLevel === 'protected' || node.data?.authLevel === 'admin') { borderColor = 'border-yellow-500/30'; iconName = 'lock'; iconColor = 'text-yellow-400'; } 
    else if (node.data?.type === 'group') { borderColor = 'border-dashed border-card-border'; textColor = 'text-text-secondary'; iconName = 'folder'; }
    return (
        <div className={`select-none ${!isRoot ? 'ml-4' : ''}`}>
            {!isRoot && (
                <div className="flex items-center gap-2 py-1"><div className="w-4 border-b border-card-border mr-2"></div><div onClick={() => onSelect(node)} className={`flex items-center gap-2 px-3 py-2 rounded-md border w-full max-w-md cursor-pointer transition-all hover:bg-sidebar hover:border-accent/50 ${borderColor} bg-sidebar/30`}><Icon name={iconName} className={`h-4 w-4 ${iconColor}`} /><span className={`font-mono text-sm ${textColor} truncate`}>{node.name}</span>{node.data?.layoutId && <Badge variant="outline" className="ml-auto text-[10px] h-5 hidden sm:flex">{node.data.layoutId}</Badge>}</div></div>
            )}
            <div className={`border-l border-card-border ${!isRoot ? 'ml-4' : ''}`}>{node.children.map(child => (<RouteNodeView key={child.fullPath} node={child} onSelect={node => onSelect(node)} level={level + 1} />))}</div>
        </div>
    );
};

// FIX: Corrected type name in RouteDetailPanel props.
const RouteDetailPanel: React.FC<{ node: SitemapNode; onClose: () => void }> = ({ node, onClose }) => {
    const data = node.data;
    if (!data) return null;
    return (
        <Card className="h-full border-none shadow-none rounded-none bg-sidebar/50"><CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-card-border"><div className="space-y-1"><CardTitle className="font-mono text-lg break-all">{node.fullPath}</CardTitle><div className="flex gap-2"><Badge variant={data.authLevel === 'public' ? 'secondary' : 'default'} className="text-xs">{data.authLevel === 'public' ? 'Público' : 'Protegido'}</Badge><Badge variant="outline" className="text-xs">{data.type}</Badge></div></div><Button variant="ghost" size="sm" onClick={onClose}><Icon name="x" className="h-4 w-4" /></Button></CardHeader><CardContent className="p-0"><ScrollArea className="h-[calc(100vh-200px)]"><div className="p-4 space-y-6"><div><p className="text-sm text-text-secondary">{data.description || 'Sem descrição.'}</p></div>{data.stateVariables && data.stateVariables.length > 0 && (<div><h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-blue-400"><Icon name="database" className="h-3 w-3" /> Estado Local (useState)</h4><div className="space-y-2">{data.stateVariables.map((state: any, i: number) => (<div key={i} className="text-xs bg-background p-2 rounded border border-card-border"><span className="font-mono text-accent">{state.name}</span>: <span className="text-text-secondary">{state.type}</span><p className="text-text-secondary mt-0.5">{state.description}</p></div>))}</div></div>)}{data.apiCalls && data.apiCalls.length > 0 && (<div><h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-400"><Icon name="globe" className="h-3 w-3" /> Chamadas de API</h4><div className="space-y-2">{data.apiCalls.map((api: any, i: number) => (<div key={i} className="text-xs bg-background p-2 rounded border border-card-border"><div className="flex justify-between font-mono"><span className={api.method === 'GET' ? 'text-blue-400' : 'text-orange-400'}>{api.method}</span><span className="text-text-primary">{api.endpoint}</span></div><p className="text-text-secondary mt-1">Gatilho: {api.trigger}</p></div>))}</div></div>)}{data.components && data.components.length > 0 && (<div><h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-purple-400"><Icon name="layout" className="h-3 w-3" /> Componentes UI</h4><div className="flex flex-wrap gap-2">{data.components.map((comp: any, i: number) => (<Badge key={i} variant="outline" className="text-xs font-normal">{comp.name || comp.type}</Badge>))}</div></div>)}</div></ScrollArea></CardContent></Card>
    );
};

const FrontendArchitectureView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const screens = data.interface_ux?.step15?.screens || [];
    const prototypePages = data.interface_ux?.prototype?.pages || [];
    // FIX: Using buildSitemapTree which is now correctly defined above.
    const routeTree = useMemo(() => buildSitemapTree(screens, prototypePages), [screens, prototypePages]);
    // FIX: Corrected selectedRoute state type.
    const [selectedRoute, setSelectedRoute] = useState<SitemapNode | null>(null);

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="Mapa do Site (Sitemap) & Arquitetura Frontend" description="Estrutura hierárquica das rotas, lógica e componentes da interface." onEdit={() => onEdit?.(15)} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]"><Card className="lg:col-span-2 overflow-hidden flex flex-col"><CardHeader className="pb-2 border-b border-card-border bg-sidebar/30"><div className="flex items-center gap-4 text-xs text-text-secondary"><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-text-primary"></div>Estática</div><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Dinâmica [id]</div><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div>Protegida</div></div></CardHeader><CardContent className="flex-1 overflow-auto p-4">{routeTree.children.length > 0 ? (<RouteNodeView node={routeTree} level={0} onSelect={setSelectedRoute} />) : (<div className="text-center py-20"><Icon name="layout" className="h-12 w-12 text-text-secondary mx-auto mb-4" /><p className="text-text-secondary">Nenhuma rota definida.</p></div>)}</CardContent></Card><div className="lg:col-span-1 h-full border border-card-border rounded-lg overflow-hidden">{selectedRoute ? (<RouteDetailPanel node={selectedRoute} onClose={() => setSelectedRoute(null)} />) : (<div className="h-full flex flex-col items-center justify-center bg-sidebar/30 text-center p-6"><Icon name="mousePointer" className="h-10 w-10 text-text-secondary mb-3" /><h3 className="font-semibold text-text-primary">Detalhes da Rota</h3><p className="text-sm text-text-secondary mt-1">Selecione uma rota na árvore ao lado para visualizar seus componentes, estado e lógica.</p></div>)}</div></div>
        </div>
    );
};

const DesignSystemView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const theme = data.interface_ux?.step18 || {};
    return (
        <div className="space-y-6 animate-in fade-in-50">
             <SectionHeader title="Design System" description="Diretrizes visuais." onEdit={() => onEdit?.(18)} />
             <div className="grid md:grid-cols-3 gap-4"><div className="p-4 bg-sidebar rounded border border-card-border flex items-center gap-4"><div className="w-8 h-8 rounded-full border border-white/20" style={{backgroundColor: theme.primaryColor}}></div><div><p className="text-xs text-text-secondary">Cor Primária</p><p className="font-mono text-sm">{theme.primaryColor}</p></div></div><div className="p-4 bg-sidebar rounded border border-card-border"><p className="text-xs text-text-secondary">Fonte</p><p className="font-semibold">{theme.fontFamily}</p></div></div>
        </div>
    );
};

interface TaskDetailDialogProps {
    task: DevTask | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ task, open, onOpenChange }) => {
    if (!task) return null;
    const commitPlan = useMemo(() => {
        const baseMessage = task.title.toLowerCase().replace(/\s+/g, '-');
        const prefix = task.category === 'backend' ? 'feat(api):' : 'feat(ui):';
        return [
            `${prefix} scaffold structure for ${baseMessage}`,
            `${prefix} implement core logic for ${baseMessage}`,
            `test: add unit tests for ${baseMessage}`,
            `chore: update documentation for ${baseMessage}`
        ];
    }, [task]);
    const acceptanceCriteria = useMemo(() => {
        const baseCriteria = [ "Código deve seguir o style guide do projeto (linting).", "Testes unitários cobrindo caminhos felizes e de erro.", "Funcionalidade validada no ambiente de desenvolvimento." ];
        if (task.category === 'backend') { baseCriteria.push("Endpoint deve retornar códigos HTTP corretos (200, 201, 400, 500)."); baseCriteria.push("Validação de input implementada (Zod/Joi)."); } 
        else { baseCriteria.push("Interface deve ser responsiva (Mobile/Desktop)."); baseCriteria.push("Feedback visual de carregamento e erro implementado."); }
        return baseCriteria;
    }, [task]);
    const commonErrors = task.details?.errosComuns || [ { erro: "Falta de tratamento de erros", solucao: "Use try/catch e retorne mensagens claras.", prevencao: "Adicione blocos de erro no início." }, { erro: "Hardcoding de valores", solucao: "Use variáveis de ambiente ou constantes.", prevencao: "Revise o código buscando strings mágicas." } ];
    return (
        <Dialog open={open} onClose={() => onOpenChange(false)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><div className="flex items-center gap-3 mb-2"><Badge variant="outline" className={task.category === 'backend' ? 'text-blue-400 border-blue-400/30' : 'text-pink-400 border-pink-400/30'}>{task.category === 'backend' ? 'Backend' : 'Frontend'}</Badge><Badge variant="secondary">{task.priority?.toUpperCase() || 'NORMAL'}</Badge></div><DialogTitle className="text-xl">{task.title}</DialogTitle><DialogDescription>{task.description || "Implementação técnica da funcionalidade."}</DialogDescription><DialogCloseButton /></DialogHeader>
                <Tabs defaultValue="criteria" className="w-full mt-2"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="criteria">Critérios de Aceite</TabsTrigger><TabsTrigger value="git">Plano de Commits</TabsTrigger><TabsTrigger value="guide">Guia Técnico</TabsTrigger></TabsList><TabsContent value="criteria" className="mt-4 space-y-4"><div className="p-4 bg-sidebar/50 rounded-lg border border-card-border"><h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Icon name="checkSquare" className="h-4 w-4 text-green-400" /> Definition of Done (DoD)</h4><ul className="space-y-2">{acceptanceCriteria.map((ac, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-text-secondary"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500/50 flex-shrink-0" /><span>{ac}</span></li>))}</ul></div></TabsContent><TabsContent value="git" className="mt-4 space-y-4"><div className="p-4 bg-sidebar/50 rounded-lg border border-card-border"><h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Icon name="gitCommit" className="h-4 w-4 text-accent" /> Estratégia de Versionamento</h4><div className="space-y-2 font-mono text-xs">{commitPlan.map((commit, idx) => (<div key={idx} className="p-2 bg-background rounded border border-card-border/50 text-text-secondary">{commit}</div>))}</div></div></TabsContent><TabsContent value="guide" className="mt-4 space-y-4">{commonErrors.map((err: any, idx: number) => (<div key={idx} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg"><h5 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2"><Icon name="alertCircle" className="h-3 w-3" /> Erro Comum: {err.erro}</h5><p className="text-xs text-text-secondary mb-1"><strong>Solução:</strong> {err.solucao}</p><p className="text-xs text-text-secondary italic"><strong>Dica:</strong> {err.prevencao}</p></div>))}<div className="p-4 bg-sidebar/50 rounded-lg border border-card-border"><h4 className="font-semibold text-sm mb-2">Instruções Adicionais</h4><p className="text-sm text-text-secondary">Utilize as ferramentas do <strong>Playground</strong> ou <strong>Laboratório</strong> para prototipar antes de commitar o código final.</p></div></TabsContent></Tabs>
            </DialogContent>
        </Dialog>
    );
}

const DetailedSprintTable: React.FC<{ sprint: any, index: number, onTaskClick: (task: DevTask) => void }> = ({ sprint, index, onTaskClick }) => {
    return (
        <AccordionItem value={sprint.id} className="border-card-border">
            <AccordionTrigger className="hover:no-underline hover:bg-sidebar/30 px-4 py-3 rounded-md"><div className="flex items-center justify-between w-full pr-4"><div className="flex items-center gap-3"><Badge variant="outline" className="bg-background">Sprint {index + 1}</Badge><span className="font-semibold text-base">{sprint.title}</span></div><div className="flex gap-4 text-xs text-text-secondary"><span className="flex items-center gap-1"><Icon name="server" className="h-3 w-3"/> {sprint.backendTasks.length} Backend</span><span className="flex items-center gap-1"><Icon name="layout" className="h-3 w-3"/> {sprint.frontendTasks.length} Frontend</span></div></div></AccordionTrigger>
            <AccordionContent className="px-4 pb-4"><div className="mt-2 border rounded-md border-card-border overflow-hidden"><Table><TableHeader className="bg-sidebar/50"><TableRow><TableHead className="w-[100px]">Tipo</TableHead><TableHead>Tarefa <span className="text-[10px] font-normal text-text-secondary ml-1">(Clique para detalhes)</span></TableHead><TableHead className="w-[100px]">Prioridade</TableHead><TableHead className="w-[120px]">Estimativa</TableHead></TableRow></TableHeader><TableBody>{sprint.backendTasks.map((t: DevTask) => (<TableRow key={t.id} className="hover:bg-sidebar/40 cursor-pointer group transition-colors" onClick={() => onTaskClick({...t, category: 'backend'})}><TableCell><Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Backend</Badge></TableCell><TableCell className="font-medium group-hover:text-accent transition-colors">{t.title}</TableCell><TableCell><Badge variant="outline" className="text-xs">Alta</Badge></TableCell><TableCell className="text-text-secondary font-mono text-xs">4h - 8h</TableCell></TableRow>))}{sprint.frontendTasks.map((t: DevTask) => (<TableRow key={t.id} className="hover:bg-sidebar/40 cursor-pointer group transition-colors" onClick={() => onTaskClick({...t, category: 'frontend'})}><TableCell><Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border-pink-500/20">Frontend</Badge></TableCell><TableCell className="font-medium group-hover:text-accent transition-colors">{t.title}</TableCell><TableCell><Badge variant="outline" className="text-xs">Média</Badge></TableCell><TableCell className="text-text-secondary font-mono text-xs">2h - 6h</TableCell></TableRow>))}</TableBody></Table></div><div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-md"><h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2"><Icon name="package" className="h-4 w-4"/> Entregáveis do Sprint</h4><ul className="list-disc pl-5 text-xs text-text-secondary space-y-1"><li>Funcionalidades de {sprint.title} implementadas e testadas.</li><li>Código com merge na branch de desenvolvimento.</li><li>Deploy em ambiente de Staging para validação.</li></ul></div></AccordionContent>
        </AccordionItem>
    );
};

const ExecutionView: React.FC<{ plan: DevelopmentPlan; onEdit?: (step: number) => void }> = ({ plan, onEdit }) => {
    const [selectedTask, setSelectedTask] = useState<DevTask | null>(null);
    return (
         <div className="space-y-8 animate-in fade-in-50">
             <SectionHeader title="Plano de Execução & Roadmap" description="Estratégia detalhada de implementação, cronograma e alocação de tarefas." />
            {(!plan.sprints || plan.sprints.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-card-border rounded-xl bg-sidebar/20"><Icon name="calendar" className="h-12 w-12 text-text-secondary mx-auto mb-4" /><h3 className="text-xl font-semibold text-text-primary">Plano Não Gerado</h3><p className="text-text-secondary mt-2">O plano de execução detalhado ainda não foi gerado.</p></div>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-2"><AccordionItem value="setup" className="border-card-border bg-sidebar/20 rounded-lg border"><AccordionTrigger className="hover:no-underline px-4 py-3"><div className="flex items-center gap-3"><Badge variant="secondary" className="bg-slate-600 text-white">Fase 0</Badge><span className="font-semibold text-base">Setup & DevOps</span></div></AccordionTrigger><AccordionContent className="px-4 pb-4"><div className="space-y-2 pt-2">{plan.setupAndDevOps.map(t => (<div key={t.id} className="flex items-center gap-3 p-2 border-b border-card-border last:border-0 hover:bg-sidebar/40 cursor-pointer rounded transition-colors" onClick={() => setSelectedTask({...t, category: 'devops'})}><Icon name="settings" className="h-4 w-4 text-slate-400"/><span className="text-sm">{t.title}</span></div>))}</div></AccordionContent></AccordionItem>{plan.sprints.map((sprint, i) => (<DetailedSprintTable key={sprint.id} sprint={sprint} index={i} onTaskClick={setSelectedTask} />))}</Accordion>
            )}
            <TaskDetailDialog task={selectedTask} open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)} />
        </div>
    );
};

const DevOpsView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data, onEdit }) => {
    const devops = data.devops || {};
    return (
         <div className="space-y-6 animate-in fade-in-50">
            <SectionHeader title="DevOps" description="Infraestrutura e CI/CD." onEdit={() => onEdit?.(27)} />
             <div className="grid md:grid-cols-2 gap-4"><InfoBlock label="Hosting" value={devops.hostingProvider} /><InfoBlock label="Database" value={devops.databaseProvider} /><InfoBlock label="CI/CD" value={(devops.ciCdSteps || []).join(' -> ')} className="col-span-2" /></div>
        </div>
    );
};

const ArtifactsView: React.FC<{ data: any; onEdit?: (step: number) => void }> = ({ data }) => {
    const fileTree = useMemo(() => { return compileProjectArtifacts(data); }, [data]);
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
    return (
         <div className="space-y-8 animate-in fade-in-50">
            <SectionHeader title="Artefatos Técnicos & Código" description="Repositório central de todos os arquivos, códigos e configurações gerados pelo Nexus." />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]"><Card className="lg:col-span-1 h-full"><CardHeader><CardTitle className="text-lg">Estrutura do Projeto</CardTitle></CardHeader><CardContent><FileExplorer items={fileTree} onFileClick={f => f.type === 'file' && setSelectedFile(f)} activeFile={selectedFile} /></CardContent></Card><Card className="lg:col-span-2 h-full flex flex-col"><CardHeader><div className="flex justify-between items-center"><CardTitle className="text-base">{selectedFile?.name || "Selecione um arquivo"}</CardTitle>{selectedFile && <Button variant="outline" size="sm"><Icon name="download" className="h-4 w-4 mr-2" /> Download</Button>}</div></CardHeader><CardContent className="flex-1 overflow-auto bg-slate-900 rounded-b-lg p-0">{selectedFile?.content ? (<CodeBlock code={selectedFile.content} language={selectedFile.language || 'text'} />) : (<div className="flex items-center justify-center h-full text-text-secondary"><p>Selecione um arquivo para ver o conteúdo.</p></div>)}</CardContent></Card></div>
        </div>
    );
};

const BlueprintReader: React.FC<BlueprintReaderProps> = ({ wizardData, developmentPlan, onBack, onEditStep }) => {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('strategy');
    const [activeSection, setActiveSection] = useState<SectionId>('master_analysis');

    const handleNavClick = (categoryId: CategoryId, sectionId: SectionId) => {
        setActiveCategory(categoryId);
        setActiveSection(sectionId);
    };

    const handleExportDNA = () => {
        const dna = {
            metadata: { generatedAt: new Date().toISOString(), version: "1.2.0" },
            projectInfo: wizardData?.planning?.step1 || {},
            model: wizardData,
            plan: developmentPlan
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dna, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "blueprint_dna.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const currentCategoryNav = NAVIGATION.find(cat => cat.id === activeCategory);

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            <aside className="w-72 bg-sidebar border-r border-card-border flex flex-col flex-shrink-0">
                 <div className="p-4 border-b border-card-border">
                    <Button variant="ghost" size="sm" onClick={onBack} className="w-full justify-start mb-4 text-text-secondary hover:text-text-primary"><Icon name="arrowLeft" className="h-4 w-4 mr-2" />Voltar ao Hub</Button>
                    <div className="flex items-center gap-3 px-2"><div className="p-2 bg-accent/20 rounded-lg"><Icon name="bookOpen" className="h-6 w-6 text-accent" /></div><div><h1 className="font-bold text-lg leading-tight">Blueprint</h1><p className="text-xs text-text-secondary">Documentação Mestra</p></div></div>
                </div>
                <ScrollArea className="flex-1"><div className="p-3 space-y-6">{NAVIGATION.map(category => (<div key={category.id}><h3 className="px-3 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{category.label}</h3><div className="space-y-1">{category.items.map(item => (<button key={item.id} onClick={() => handleNavClick(category.id, item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeSection === item.id ? 'bg-accent text-white shadow-md font-medium' : 'text-text-secondary hover:bg-sidebar/80 hover:text-text-primary'}`}><Icon name={item.icon} className="h-4 w-4" />{item.label}</button>))}</div></div>))}</div></ScrollArea>
                 <div className="p-4 border-t border-card-border bg-sidebar/50 flex flex-col gap-2">
                    <Button variant="outline" className="w-full gap-2 text-accent border-accent/20" onClick={handleExportDNA}><Icon name="code" className="h-4 w-4" />Exportar DNA (JSON)</Button>
                    <Button className="w-full gap-2" onClick={() => window.print()}><Icon name="printer" className="h-4 w-4" />Imprimir / PDF</Button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-[#0f172a] relative scroll-smooth">
                <div className="max-w-5xl mx-auto p-8 min-h-full">
                    <div className="mb-8 flex items-center text-sm text-text-secondary"><span className="opacity-70">{currentCategoryNav?.label}</span><Icon name="chevronRight" className="h-3 w-3 mx-2" /><span className="text-accent font-medium">{currentCategoryNav?.items.find(i => i.id === activeSection)?.label}</span></div>

                    {activeCategory === 'strategy' && activeSection === 'master_analysis' && <MasterAnalysisView wizardData={wizardData} />}
                    {activeCategory === 'strategy' && activeSection === 'overview' && <StrategyView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'strategy' && activeSection === 'users' && <PersonasView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'strategy' && activeSection === 'requirements' && <RequirementsView data={wizardData} onEdit={onEditStep} />}

                    {activeCategory === 'engineering' && activeSection === 'architecture' && <ArchitectureView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'engineering' && activeSection === 'data_model' && <DataModelView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'engineering' && activeSection === 'api_contracts' && <ApiContractsView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'engineering' && activeSection === 'security' && <SecurityQualityView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'engineering' && activeSection === 'functionalities' && <FunctionalitiesView data={wizardData} onEdit={onEditStep} />}

                    {activeCategory === 'interface' && activeSection === 'sitemap' && <FrontendArchitectureView data={wizardData} onEdit={onEditStep} />}
                    {activeCategory === 'interface' && activeSection === 'design_system' && <DesignSystemView data={wizardData} onEdit={onEditStep} />}

                    {activeCategory === 'execution' && activeSection === 'roadmap' && <ExecutionView plan={developmentPlan!} onEdit={onEditStep} />}
                    {activeCategory === 'execution' && activeSection === 'devops' && <DevOpsView data={wizardData} onEdit={onEditStep} />}
                    
                    {activeCategory === 'artifacts' && <ArtifactsView data={wizardData} onEdit={onEditStep} />}
                    
                </div>
            </main>
        </div>
    );
};

export default BlueprintReader;
