
import React, { useMemo, useState, useEffect } from 'react';
import { DevelopmentPlan, DevTask, Sprint as SprintType, SubTask, TaskDetails, ToolTarget, Project } from '../../../types';
import Icon from '../../shared/Icon';
import { Checkbox } from '../../ui/Checkbox';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Separator } from '../../ui/Separator';
import CommitsView from './CommitsView';
import FilesView from './FilesView';
import CommandsView from './CommandsView';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';
import PlanSummaryView from './PlanSummaryView';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';
import { ScrollArea } from '../../ui/ScrollArea';


// --- PROPS ---
interface PlanContentProps {
    plan: DevelopmentPlan;
    wizardData: any;
    allSprints: any[];
    activeSprint: any | null;
    activeTask: DevTask | null;
    onSubTaskChange: (taskId: string, subTaskId: string, newStatus: 'todo' | 'done') => void;
    onExecuteTask: (toolTarget: ToolTarget, taskId: string) => void;
    setActiveTaskId: (id: string | null) => void;
}

// --- HELPER COMPONENTS ---

const MainTabTrigger: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${isActive ? 'bg-accent text-white border-accent' : 'bg-transparent text-text-secondary border-transparent hover:bg-sidebar'}`}>
        <Icon name={icon} className="h-4 w-4" />
        <span>{label}</span>
    </button>
);

const PlaceholderContent: React.FC<{ title: string; icon: string, children?: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-card border border-card-border rounded-lg p-6 text-center py-16 mt-6 shadow-sm">
        <Icon name={icon} className="h-10 w-10 text-text-secondary mx-auto mb-3" />
        <h3 className="font-semibold text-text-primary">{title}</h3>
        {children || <p className="text-text-secondary text-sm mt-1">Selecione um item na barra lateral para ver os detalhes aqui.</p>}
    </div>
);

const TaskDetailView: React.FC<{ task: DevTask }> = ({ task }) => {
    const { details } = task;

    return (
        <div className="bg-card border border-card-border rounded-lg p-6 lg:p-8 mt-6 animate-in fade-in-50">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-text-secondary mt-1">Tutorial detalhado e recursos para a tarefa, gerados por IA.</p>

            <Separator className="my-6" />

            <Accordion type="single" collapsible className="w-full" defaultValue="erros">
                {details?.errosComuns && details.errosComuns.length > 0 && (
                    <AccordionItem value="erros">
                        <AccordionTrigger className="text-lg">
                            <div className="flex items-center gap-2">
                                <Icon name="alertCircle" className="h-5 w-5 text-red-400" />
                                Erros Comuns
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pt-2">
                                {details.errosComuns.map((erro, index) => (
                                    <div key={index} className="p-4 bg-sidebar rounded-md border border-card-border">
                                        <h4 className="font-semibold text-red-400 flex items-center gap-2"><Icon name="x" className="h-4 w-4 flex-shrink-0" /> {erro.erro}</h4>
                                        <p className="mt-2 text-sm pl-6"><strong className="text-text-primary">Solução:</strong> {erro.solucao}</p>
                                        <p className="mt-1 text-sm pl-6"><strong className="text-text-primary">Prevenção:</strong> {erro.prevencao}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
                {details?.faq && details.faq.length > 0 && (
                    <AccordionItem value="faq">
                        <AccordionTrigger className="text-lg">
                            <div className="flex items-center gap-2">
                                <Icon name="helpCircle" className="h-5 w-5 text-sky-400" />
                                Perguntas Frequentes (FAQ)
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pt-2">
                                {details.faq.map((item, index) => (
                                    <div key={index} className="p-4 bg-sidebar rounded-md border border-card-border">
                                        <h4 className="font-semibold text-accent">{item.pergunta}</h4>
                                        <p className="mt-2 text-sm">{item.resposta}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
};


// --- TAB VIEW COMPONENTS ---

const DashboardView: React.FC<{ plan: DevelopmentPlan; allSprints: any[] }> = ({ plan, allSprints }) => {
    const totalSubTasks = allSprints.flatMap(s => s.tasks).flatMap((t: DevTask) => t.subTasks).length;
    const completedSubTasks = allSprints.flatMap(s => s.tasks).flatMap((t: DevTask) => t.subTasks).filter(st => st.status === 'done').length;
    const overallProgress = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;

    return (
        <div className="bg-card border border-card-border rounded-lg p-8 mt-6 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Dashboard {plan.title}</h2>
                <p className="text-text-secondary mt-1">Sistema completo de gestão para oficinas mecânicas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-sidebar p-6 rounded-lg border border-card-border text-center">
                    <h3 className="text-text-secondary font-semibold">Progresso Geral</h3>
                    <p className="text-4xl font-bold text-accent my-2">{overallProgress}%</p>
                    <p className="text-sm text-text-secondary">{completedSubTasks} de {totalSubTasks} tarefas</p>
                </div>
                <div className="bg-sidebar p-6 rounded-lg border border-card-border text-center">
                    <h3 className="text-text-secondary font-semibold">Tempo</h3>
                    <p className="text-4xl font-bold my-2">0h</p>
                    <p className="text-sm text-text-secondary">Concluídas: 0h / Restantes: 428h</p>
                </div>
                <div className="bg-sidebar p-6 rounded-lg border border-card-border text-center">
                    <h3 className="text-text-secondary font-semibold">Sprints</h3>
                    <p className="text-4xl font-bold my-2">0 <span className="text-2xl text-text-secondary">/ {plan.sprints.length}</span></p>
                    <p className="text-sm text-text-secondary">concluídos</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Progresso por Sprint</h3>
                <div className="space-y-4">
                    {allSprints.filter(s => s.id !== 'checklist').map(sprint => {
                        const sprintTotal = sprint.tasks.flatMap((t: DevTask) => t.subTasks).length;
                        const sprintCompleted = sprint.tasks.flatMap((t: DevTask) => t.subTasks).filter((st: any) => st.status === 'done').length;
                        const sprintProgress = sprintTotal > 0 ? (sprintCompleted / sprintTotal) * 100 : 0;
                        return (
                            <div key={sprint.id} className="bg-sidebar p-4 rounded-lg border border-card-border">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-semibold">{sprint.title}</p>
                                        <p className="text-xs text-text-secondary">{sprint.version}</p>
                                    </div>
                                    <span className="font-semibold text-sm">{Math.round(sprintProgress)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: `${sprintProgress}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const GuiaView: React.FC<{ activeSprint: any | null }> = ({ activeSprint }) => {
    if (!activeSprint) return <PlaceholderContent title="Guia do Sprint" icon="list"><p className="text-text-secondary text-sm mt-1">Selecione um sprint na barra lateral para ver seus objetivos e entregas.</p></PlaceholderContent>;

    const sprintProgress = activeSprint.tasks.length > 0
        ? (activeSprint.tasks.filter((t: DevTask) => t.status === 'done').length / activeSprint.tasks.length) * 100
        : 0;

    return (
        <div className="bg-card border border-card-border rounded-lg p-8 mt-6 space-y-6">
            <h2 className="text-2xl font-bold">{activeSprint.title}</h2>
            <p className="text-text-secondary">Configuração inicial do ambiente de desenvolvimento, ferramentas e estrutura base do projeto</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-sidebar p-4 rounded-lg border border-card-border"><p className="text-text-secondary text-sm">Duração</p><p className="font-semibold">{activeSprint.duration}</p></div>
                <div className="bg-sidebar p-4 rounded-lg border border-card-border"><p className="text-text-secondary text-sm">Estimativa</p><p className="font-semibold">{activeSprint.estimate}</p></div>
                <div className="bg-sidebar p-4 rounded-lg border border-card-border"><p className="text-text-secondary text-sm">Versão</p><p className="font-semibold">{activeSprint.version}</p></div>
            </div>

            <div>
                <p className="text-text-secondary text-sm mb-1">Progresso do Sprint</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${sprintProgress}%` }}></div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Entregas Esperadas</h3>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    {activeSprint.deliverables.map((item: string) => <li key={item}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
};

const TarefasView: React.FC<{ task: DevTask | null; onSubTaskChange: PlanContentProps['onSubTaskChange']; onExecuteTask: PlanContentProps['onExecuteTask'] }> = ({ task, onSubTaskChange, onExecuteTask }) => {
    if (!task) {
        return <PlaceholderContent title="Checklist de Sub-tarefas" icon="checkSquare" ><p className="text-text-secondary text-sm mt-1">Selecione uma tarefa na barra lateral para ver seu checklist.</p></PlaceholderContent>;
    }
    return (
        <div className="bg-card border border-card-border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="checkSquare" className="h-5 w-5 text-accent" />
                Checklist: {task.title}
            </h2>
            <div className="space-y-3">
                {task.subTasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center space-x-3 p-3 bg-sidebar rounded-md border border-card-border hover:border-accent transition-colors group">
                        <Checkbox id={subTask.id} checked={subTask.status === 'done'} onCheckedChange={(checked) => onSubTaskChange(task.id, subTask.id, checked ? 'done' : 'todo')} />
                        <Label htmlFor={subTask.id} className={`flex-1 text-sm cursor-pointer ${subTask.status === 'done' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                            {subTask.text}
                        </Label>
                        {task.toolTarget && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onExecuteTask(task.toolTarget!, task.id)}
                                aria-label={`Executar tarefa para ${subTask.text}`}
                            >
                                <Icon name="play" className="h-4 w-4 text-accent hover:text-accent-hover" />
                            </Button>
                        )}
                    </div>
                ))}
                {task.subTasks.length === 0 && (
                    <p className="text-sm text-text-secondary italic text-center py-4">Nenhuma sub-tarefa detalhada para este item.</p>
                )}
            </div>
        </div>
    );
};

const ArtefatosView: React.FC<{ task: DevTask | null; wizardData: any }> = ({ task, wizardData }) => {
    if (!task) {
        return <PlaceholderContent title="Artefatos do Modelo" icon="package"><p className="text-text-secondary text-sm mt-1">Selecione uma tarefa para ver os artefatos de modelagem relevantes.</p></PlaceholderContent>;
    }

    const dataModelingArtifacts = wizardData.artifacts?.data_modeling;
    const isDataTask = task.toolTarget === 'database_design_system' || task.title.toLowerCase().includes('banco de dados');
    
    if (!isDataTask || !dataModelingArtifacts) {
         return <PlaceholderContent title="Artefatos do Modelo" icon="package"><p className="text-text-secondary text-sm mt-1">Nenhum artefato de modelagem relevante para esta tarefa.</p></PlaceholderContent>;
    }

    return (
        <div className="bg-card border border-card-border rounded-lg p-6 mt-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="package" className="h-5 w-5 text-accent" />
                Artefatos para: {task.title}
            </h2>

            {dataModelingArtifacts.sql && (
                <div>
                    <h3 className="font-semibold mb-2">Schema SQL</h3>
                    <CodeBlock language="sql" code={dataModelingArtifacts.sql} />
                </div>
            )}
             {dataModelingArtifacts.prisma && (
                <div>
                    <h3 className="font-semibold mb-2">Schema Prisma</h3>
                    <CodeBlock language="prisma" code={dataModelingArtifacts.prisma} />
                </div>
            )}
             {dataModelingArtifacts.zod && (
                <div>
                    <h3 className="font-semibold mb-2">Validações Zod</h3>
                    <CodeBlock language="typescript" code={dataModelingArtifacts.zod} />
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const PlanContent: React.FC<PlanContentProps> = (props) => {
    const { plan, wizardData, allSprints, activeSprint, activeTask } = props;
    const [activeTab, setActiveTab] = useState('Dashboard');

    const mainTabs = [
        { id: 'Dashboard', icon: 'barChart' },
        { id: 'Resumo do Modelo', icon: 'schema' },
        { id: 'Lista de Materiais', icon: 'blocks' },
        { id: 'Guia', icon: 'list' },
        { id: 'Detalhes', icon: 'bookOpen' },
        { id: 'Tarefas', icon: 'checkSquare' },
        { id: 'Artefatos', icon: 'package' },
        { id: 'Commits', icon: 'gitCommit' },
        { id: 'Arquivos', icon: 'folder' },
        { id: 'Comandos', icon: 'zap' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <DashboardView plan={plan} allSprints={allSprints} />;
            case 'Resumo do Modelo': return <PlanSummaryView wizardData={wizardData} />;
            case 'Lista de Materiais': {
                const billOfMaterials = wizardData?.billOfMaterials;
                return (
                     <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Lista de Materiais do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[60vh] rounded-md border border-card-border bg-background p-4">
                                <pre className="text-sm whitespace-pre-wrap font-sans">
                                    {billOfMaterials || 'Lista de materiais não encontrada no wizardData.'}
                                </pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )
            }
            case 'Guia': return <GuiaView activeSprint={activeSprint} />;
            case 'Detalhes': {
                if (!activeTask) {
                    return <PlaceholderContent title="Tutorial Detalhado" icon="bookOpen"><p className="text-text-secondary text-sm mt-1">Selecione uma tarefa para ver seu tutorial e recursos.</p></PlaceholderContent>;
                }
                if (!activeTask.details || (!activeTask.details.errosComuns?.length && !activeTask.details.faq?.length)) {
                    return (
                        <div className="text-center py-16 bg-card border border-card-border rounded-lg mt-6">
                            <Icon name="sparkles" className="h-8 w-8 text-accent mx-auto mb-2" />
                            <h3 className="font-semibold text-lg">{activeTask.title}</h3>
                            <p className="text-sm text-text-secondary italic mt-2">Nenhum detalhe enriquecido por IA para esta tarefa.</p>
                            <p className="text-xs text-text-secondary mt-1">Tarefas chave como "Autenticação" costumam ter este conteúdo.</p>
                        </div>
                    );
                }
                return <TaskDetailView task={activeTask} />;
            }
            case 'Tarefas': return <TarefasView task={activeTask} onSubTaskChange={props.onSubTaskChange} onExecuteTask={props.onExecuteTask} />;
            case 'Artefatos': return <ArtefatosView task={activeTask} wizardData={wizardData} />;
            case 'Commits': return <CommitsView task={activeTask} />;
            case 'Arquivos': return <FilesView task={activeTask} wizardData={wizardData} />;
            case 'Comandos': return <CommandsView task={activeTask} />;
            default: return null;
        }
    };
    
    return (
        <div className="w-full">
            <div className="bg-card p-2 rounded-lg inline-flex items-center gap-1 mb-6 border border-card-border flex-wrap">
                {mainTabs.map(tab => (
                    <MainTabTrigger key={tab.id} icon={tab.icon} label={tab.id} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
                ))}
            </div>
            {renderContent()}
        </div>
    );
};

export default PlanContent;
