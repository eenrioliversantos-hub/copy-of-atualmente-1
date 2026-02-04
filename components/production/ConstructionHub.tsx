
import React, { useState, useEffect, useRef } from "react";
import Icon from "../shared/Icon";
import { Button } from "../ui/Button";
import { ToolTarget, Project, DevelopmentPlan, Invoice, Contract, ProjectValidation, ProjectArtifacts } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import OperatorOverviewTab from '../projects/tabs/OperatorOverviewTab';
import ProjectFilesTab from '../projects/tabs/ProjectFilesTab';
import OperatorFinancialsTab from '../projects/tabs/OperatorFinancialsTab';
import OperatorMonitoringTab from '../projects/tabs/OperatorMonitoringTab';
import DevelopmentPlanViewer from "../modeling/generation/DevelopmentPlanViewer";
import GenerationViewer from "../modeling/generation/GenerationViewer";
import BlueprintReader from "../documentation/BlueprintReader";
import { PRODUCTION_PHASES } from '../../data/productionPhases';
import { Badge } from '../ui/Badge';
import ProjectPipeline from '../projects/ProjectPipeline';
import AssemblyLine from './AssemblyLine';
import { compileProjectArtifacts, flattenFileTree } from '../../lib/projectCompiler';
import { generateProjectZip, downloadBlob } from '../../lib/archiveGenerator';

interface ConstructionHubProps {
  onBack: () => void;
  setCurrentView: (view: string, context?: any) => void;
  project: Project;
  invoices: Invoice[];
  contracts: Contract[];
  developmentPlan?: DevelopmentPlan;
  wizardData?: any;
  onSendFinalProduct: (projectId: string, message: string) => void;
  onRequestValidation: (projectId: string, targetId: string, targetName: string, data: any) => void;
  onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
  onFileUpload: (projectId: string, file: File, description: string) => void;
}

export default function ConstructionHub(props: ConstructionHubProps) {
    const { onBack, setCurrentView, project, developmentPlan, wizardData, onSendFinalProduct, invoices, contracts, onRequestValidation, onFileUpload, onArtifactsUpdate } = props;
    const [activeTab, setActiveTab] = useState("overview");
    const [hubState, setHubState] = useState<'loading' | 'needs_modeling' | 'needs_plan_generation' | 'plan_ready'>('loading');
    const [isArchiving, setIsArchiving] = useState(false);
    const prevDevPlanRef = useRef<DevelopmentPlan | undefined>();

    useEffect(() => {
        if (!wizardData) {
            setHubState('needs_modeling');
        } else if (!developmentPlan) {
            setHubState('needs_plan_generation');
        } else {
            setHubState('plan_ready');
            if (!prevDevPlanRef.current && developmentPlan) {
                setActiveTab('dev_plan');
            }
        }
        prevDevPlanRef.current = developmentPlan;
    }, [wizardData, developmentPlan]);

    const handleExportProjectDNA = () => {
        const projectDNA = {
            exportInfo: {
                generatedAt: new Date().toISOString(),
                version: "1.2.0",
                platform: "Nexus Platform"
            },
            project: { id: project.id, name: project.name, client: project.client, description: project.description },
            model: wizardData,
            developmentPlan: developmentPlan,
            infrastructure: wizardData?.devops || {}
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectDNA, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `DNA_${project.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleExportZip = async () => {
        setIsArchiving(true);
        try {
            const tree = compileProjectArtifacts(wizardData);
            const zipBlob = await generateProjectZip(tree);
            downloadBlob(zipBlob, `nexus_project_${project.name.replace(/\s+/g, '_').toLowerCase()}.zip`);
        } catch (error) {
            console.error("Erro ao gerar ZIP:", error);
            alert("Erro ao compactar arquivos.");
        } finally {
            setIsArchiving(false);
        }
    };

    const handleExportFullBundle = () => {
        const tree = compileProjectArtifacts(wizardData);
        const manifest = flattenFileTree(tree);
        const bundle = { projectName: project.name, exportedAt: new Date().toISOString(), files: manifest };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `PROJECT_BUNDLE_${project.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (activeTab === 'blueprint_reader') {
        return (
            <BlueprintReader 
                wizardData={wizardData} 
                developmentPlan={developmentPlan}
                onBack={() => setActiveTab('overview')} 
                onEditStep={(stepIndex) => setCurrentView('modeling_hub', { project, stepIndex })}
            />
        );
    }

    const renderMainContent = () => {
        switch (hubState) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                        <Icon name="settings" className="h-16 w-16 animate-spin text-accent mb-4" />
                        <h3 className="text-xl font-mono text-accent">Inicializando Sistemas da Fábrica...</h3>
                    </div>
                );
            case 'needs_modeling':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Card className="text-center max-w-lg bg-sidebar/50 border-dashed border-2 border-card-border">
                            <CardHeader>
                                <Icon name="schema" className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                                <CardTitle className="text-2xl">Blueprint Necessário</CardTitle>
                                <CardDescription>A linha de montagem não pode iniciar sem um blueprint técnico definido.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary mb-6">Inicie o processo de modelagem para definir a arquitetura, dados e funcionalidades do sistema.</p>
                                <Button size="lg" onClick={() => setCurrentView('modeling_hub', { project })} className="w-full">
                                    <Icon name="play" className="h-5 w-5 mr-2"/>
                                    Entrar na Sala de Modelagem
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'needs_plan_generation':
                return (
                    <GenerationViewer
                        wizardData={wizardData}
                        setCurrentView={setCurrentView}
                        project={project}
                        onArtifactsUpdate={onArtifactsUpdate}
                    />
                );
            case 'plan_ready':
                return (
                     <div className="space-y-6">
                        <Card className="bg-sidebar/30 border-accent/20">
                            <CardContent className="p-0">
                                <AssemblyLine 
                                    project={project} 
                                    currentPhaseId=""
                                    onPhaseClick={(id) => console.log(id)}
                                />
                            </CardContent>
                        </Card>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-7 bg-sidebar/50">
                                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                                <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
                                <TabsTrigger value="docs">Documentação</TabsTrigger>
                                <TabsTrigger value="validation_pipeline">Pipeline</TabsTrigger>
                                <TabsTrigger value="dev_plan">Execução (Plan)</TabsTrigger>
                                <TabsTrigger value="files">Artefatos</TabsTrigger>
                                <TabsTrigger value="product">Expedição</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="overview" className="mt-6 animate-in fade-in-50">
                                <OperatorOverviewTab project={project} setActiveTab={setActiveTab} setCurrentView={setCurrentView} />
                            </TabsContent>

                            <TabsContent value="blueprint" className="mt-6 animate-in fade-in-50">
                                <Card className="border-l-4 border-l-accent">
                                    <CardHeader>
                                        <div className="flex justify-between">
                                            <div>
                                                <CardTitle>Blueprint Digital</CardTitle>
                                                <CardDescription>Especificações técnicas resumidas.</CardDescription>
                                            </div>
                                            <Button variant="outline" onClick={() => setCurrentView('modeling_hub', { project })}>
                                                <Icon name="edit" className="h-4 w-4 mr-2"/>
                                                Refinar Modelo
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div className="p-3 bg-sidebar rounded border border-card-border">
                                                <span className="text-text-secondary block mb-1">Arquitetura</span>
                                                <span className="font-mono font-semibold text-accent">{wizardData?.planning?.step3?.architecture || 'N/A'}</span>
                                            </div>
                                            <div className="p-3 bg-sidebar rounded border border-card-border">
                                                <span className="text-text-secondary block mb-1">Entidades</span>
                                                <span className="font-mono font-semibold text-accent">{wizardData?.data_modeling?.step8?.entities?.length || 0} Models</span>
                                            </div>
                                            <div className="p-3 bg-sidebar rounded border border-card-border">
                                                <span className="text-text-secondary block mb-1">Stack</span>
                                                <span className="font-mono font-semibold text-accent">{(wizardData?.planning?.step4?.backend || [])[0] || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <Button className="mt-4 w-full" onClick={() => setActiveTab('blueprint_reader')}>
                                            <Icon name="bookOpen" className="h-4 w-4 mr-2"/>
                                            Abrir Especificação Completa (Modo Leitura)
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="docs" className="mt-6 animate-in fade-in-50">
                                 <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-card-border rounded-lg bg-sidebar/30">
                                     <Icon name="book" className="h-12 w-12 text-text-secondary mb-4" />
                                     <h3 className="text-xl font-semibold mb-2">Documentação do Projeto</h3>
                                     <p className="text-text-secondary text-center max-w-md mb-6">Acesse a especificação completa, diagramas e manuais gerados.</p>
                                     <div className="flex flex-wrap justify-center gap-4">
                                        <Button onClick={() => setActiveTab('blueprint_reader')} variant="outline">
                                            <Icon name="bookOpen" className="h-4 w-4 mr-2"/>
                                            Acessar Central
                                        </Button>
                                        <Button onClick={handleExportZip} disabled={isArchiving} className="bg-green-600 hover:bg-green-700 text-white">
                                            <Icon name={isArchiving ? 'spinner' : 'package'} className={`h-4 w-4 mr-2 ${isArchiving ? 'animate-spin' : ''}`}/>
                                            Baixar Projeto (.ZIP)
                                        </Button>
                                        <Button onClick={handleExportFullBundle} variant="outline" className="border-accent text-accent">
                                            <Icon name="code" className="h-4 w-4 mr-2"/>
                                            Manifesto JSON
                                        </Button>
                                     </div>
                                 </div>
                            </TabsContent>

                            <TabsContent value="validation_pipeline" className="mt-6 animate-in fade-in-50">
                                <ProjectPipeline
                                    project={project}
                                    userType="operator"
                                    onRequestValidation={onRequestValidation}
                                    onApproveValidation={() => {}} 
                                    onRequestChanges={() => {}} 
                                    onViewValidation={() => {}} 
                                />
                            </TabsContent>

                            <TabsContent value="dev_plan" className="mt-6 animate-in fade-in-50">
                                <div className="flex justify-end mb-4">
                                    <Button size="sm" variant="outline" onClick={handleExportProjectDNA} className="bg-background">
                                        <Icon name="download" className="h-4 w-4 mr-2"/>
                                        Exportar Plano (JSON)
                                    </Button>
                                </div>
                                <DevelopmentPlanViewer 
                                    plan={developmentPlan!} 
                                    onStartConstruction={() => setCurrentView('development_plan_tool', { projectId: project.id })} 
                                />
                            </TabsContent>

                            <TabsContent value="files" className="mt-6 animate-in fade-in-50">
                                <ProjectFilesTab 
                                    project={project}
                                    userType="operator"
                                    onFileUpload={onFileUpload}
                                    artifacts={{ wizardData, developmentPlan }}
                                    invoices={invoices}
                                    contracts={contracts}
                                    setCurrentView={setCurrentView}
                                />
                            </TabsContent>

                            <TabsContent value="product" className="mt-6 animate-in fade-in-50">
                                <Card className="border-green-500/20 bg-green-500/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Icon name="package" className="h-6 w-6 text-green-400"/>
                                            Área de Expedição
                                        </CardTitle>
                                        <CardDescription>Prepare e envie o pacote final para o cliente.</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-end">
                                        <Button 
                                            size="lg"
                                            onClick={() => onSendFinalProduct(project.id, 'Entrega Final')} 
                                            disabled={project.status === 'awaiting_delivery_approval' || project.status === 'completed'}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Icon name="truck" className="h-5 w-5 mr-2" />
                                            Enviar Entrega Final
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack} className="border-card-border hover:bg-sidebar-hover">
                        <Icon name="arrowLeft" className="h-4 w-4 mr-2" />
                        Voltar ao Pátio
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-md border border-accent/20">
                            <Icon name="cpu" className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Torre de Controle: {project.name}</h1>
                            <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">Status: {project.status}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <Button variant="outline" size="sm" onClick={handleExportZip} disabled={isArchiving} title="Baixar Projeto Completo">
                        <Icon name={isArchiving ? 'spinner' : 'package'} className={`h-4 w-4 mr-2 ${isArchiving ? 'animate-spin' : ''}`} />
                        ZIP
                     </Button>
                     <Badge variant="outline" className="bg-sidebar border-card-border gap-2 py-1 px-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        Fábrica Ativa
                     </Badge>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0b1120]">
                {renderMainContent()}
            </main>
        </div>
    );
}
