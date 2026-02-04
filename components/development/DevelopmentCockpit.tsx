
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DevTask, GeneratedFile, Project, DevelopmentPlan } from '../../types';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import CodeBlock from '../shared/CodeBlock';
import { Button } from '../ui/Button';
import { GoogleGenAI, Type } from "@google/genai";
import { ScrollArea } from '../ui/ScrollArea';
import FileExplorer, { FileTreeItem } from '../shared/FileExplorer';
import { useDPO } from '../../contexts/DPOContext';
import SourceControlView from './SourceControlView';
import BottomPanelView from './BottomPanelView';
import PreviewView from './PreviewView';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import AIAssistant from './AIAssistant';
import QuickAutomations from './QuickAutomations';
import ProjectExplorerView from './ProjectExplorerView';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import { compileProjectArtifacts } from '../../lib/projectCompiler';

interface DevelopmentCockpitProps {
    project: Project;
    plan: DevelopmentPlan;
    wizardData: any;
    onBack: () => void;
    onCommit: (projectId: string, taskId: string, message: string) => void;
    initialTaskId?: string;
}

// Schema for AI generation
const fileGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        files: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    path: { type: Type.STRING, description: "Caminho do arquivo. Ex: src/components/Button.tsx" },
                    content: { type: Type.STRING, description: "Código completo do arquivo." },
                    language: { type: Type.STRING, description: "Linguagem (typescript, css, etc)" }
                },
                required: ['path', 'content', 'language'],
            },
        },
        explanation: { type: Type.STRING, description: "Breve explicação do que foi feito." }
    },
    required: ['files', 'explanation'],
};

type LeftView = 'explorer' | 'source-control' | 'plan';
type RightView = 'assistant' | 'context' | 'automations';
type ViewMode = 'code' | 'preview' | 'split';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DevelopmentCockpit: React.FC<DevelopmentCockpitProps> = ({ project, plan, wizardData, onBack, onCommit, initialTaskId }) => {
    // --- Layout State ---
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [activeLeftView, setActiveLeftView] = useState<LeftView>('explorer');
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
    const [activeRightView, setActiveRightView] = useState<RightView>('assistant');
    const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);

    // Editor State
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    
    // --- Data State ---
    const [activeTaskId, setActiveTaskId] = useState<string | null>(initialTaskId || null);
    const [activeFile, setActiveFile] = useState<GeneratedFile | null>(null);
    const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    // Task Context State
    const [selectedSubTasks, setSelectedSubTasks] = useState<string[]>([]);
    const [additionalInstructions, setAdditionalInstructions] = useState('');

    // --- Context ---
    const { getTaskById } = useDPO();
    const currentTask = useMemo(() => getTaskById(project.id, activeTaskId || ''), [getTaskById, project.id, activeTaskId]);

    // --- REAL ARTIFACT COMPILATION ---
    const projectFileTree = useMemo(() => {
        return compileProjectArtifacts(wizardData);
    }, [wizardData]);

    // --- Derived Data ---
    const allTasks = useMemo(() => {
        if (!plan) return [];
        return [
            ...(plan.setupAndDevOps || []).map(t => ({ ...t, sprint: 'Setup' })),
            ...(plan.sprints || []).flatMap(s => [
                ...(s.backendTasks || []).map(t => ({ ...t, sprint: s.title })),
                ...(s.frontendTasks || []).map(t => ({ ...t, sprint: s.title }))
            ]),
            ...(plan.postDeploy || []).map(t => ({ ...t, sprint: 'Post-Deploy' })),
        ];
    }, [plan]);

    // --- Initialization ---
    useEffect(() => {
        if (!activeTaskId && allTasks.length > 0) {
            setActiveTaskId(allTasks[0].id);
        }
    }, [allTasks, activeTaskId]);

    useEffect(() => {
        if (activeFile) {
            setEditedContent(activeFile.content);
        }
    }, [activeFile]);

    useEffect(() => {
        if (currentTask) {
            setCommitMessage(`feat: implementa ${currentTask.title}`);
            setSelectedSubTasks(currentTask.subTasks.map(st => st.id)); // Select all by default
        }
    }, [currentTask]);


    // --- Actions ---
    const handleGenerateCode = async () => {
        if (!currentTask) return;
        setIsGenerating(true);
        // Open terminal to show progress
        setIsBottomPanelOpen(true);
        setTerminalLogs(prev => [...prev, `Iniciando geração de código para tarefa: ${currentTask.title}...`]);
        
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY não encontrada.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const subtasksText = currentTask.subTasks
                .filter(st => selectedSubTasks.includes(st.id))
                .map(st => `- ${st.text}`)
                .join('\n');

            const prompt = `
                PROJETO: ${project.name}
                TAREFA: ${currentTask.title}
                CHECKLIST:
                ${subtasksText}
                
                INSTRUÇÕES EXTRAS: ${additionalInstructions}

                Gere os arquivos necessários para implementar esta tarefa.
                Retorne JSON no formato { files: [{ path: string, content: string, language: string }], explanation: string }.
            `;

            setTerminalLogs(prev => [...prev, `Enviando prompt para IA...`]);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: fileGenerationSchema },
            });

            const result = JSON.parse(response.text.trim());
            const newFiles = result.files || [];
            
            setGeneratedFiles(newFiles);
            setTerminalLogs(prev => [...prev, `Código gerado com sucesso. ${newFiles.length} arquivos criados.`]);
            if (result.explanation) {
                setTerminalLogs(prev => [...prev, `IA: ${result.explanation}`]);
            }

            if (newFiles.length > 0) setActiveFile(newFiles[0]);
            
            // Auto switch to source control view to see changes
            setActiveLeftView('source-control');
            setIsLeftPanelOpen(true);

        } catch (error) {
            console.error(error);
            setTerminalLogs(prev => [...prev, `ERRO: Falha ao gerar código. ${error instanceof Error ? error.message : ''}`]);
            alert("Erro ao gerar código.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCommitAction = () => {
        if (currentTask && commitMessage) {
            setIsBottomPanelOpen(true);
            setTerminalLogs(prev => [...prev, `Commitando alterações: "${commitMessage}"`]);
            onCommit(project.id, currentTask.id, commitMessage);
            setGeneratedFiles([]); // Clear changes after commit
            setTerminalLogs(prev => [...prev, `Commit realizado e enviado com sucesso.`]);
            alert('Alterações salvas e commitadas!');
        }
    };

    const handleFileSelect = (file: GeneratedFile) => {
        setActiveFile(file);
    };

    // --- Layout Toggles ---
    const toggleLeftView = (view: LeftView) => {
        if (activeLeftView === view && isLeftPanelOpen) {
            setIsLeftPanelOpen(false);
        } else {
            setActiveLeftView(view);
            setIsLeftPanelOpen(true);
        }
    };

    const toggleRightView = (view: RightView) => {
        if (activeRightView === view && isRightPanelOpen) {
            setIsRightPanelOpen(false);
        } else {
            setActiveRightView(view);
            setIsRightPanelOpen(true);
        }
    };

    const toggleBottomPanel = () => {
        setIsBottomPanelOpen(prev => !prev);
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans selection:bg-accent selection:text-white">
            
            {/* --- ACTIVITY BAR (Far Left - Always Visible) --- */}
            <aside className="w-12 bg-[#1e293b] border-r border-[#334155] flex flex-col items-center py-3 gap-4 z-30 flex-shrink-0">
                 <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 text-slate-400 hover:text-white">
                    <Icon name="arrowLeft" className="h-5 w-5" />
                </Button>
                
                <ActivityButton 
                    icon="folder" 
                    active={isLeftPanelOpen && activeLeftView === 'explorer'} 
                    onClick={() => toggleLeftView('explorer')} 
                    tooltip="Explorador de Arquivos" 
                />
                <ActivityButton 
                    icon="gitBranch" 
                    active={isLeftPanelOpen && activeLeftView === 'source-control'} 
                    onClick={() => toggleLeftView('source-control')} 
                    tooltip="Controle de Versão" 
                    badge={generatedFiles.length > 0 ? generatedFiles.length : undefined}
                />
                <ActivityButton 
                    icon="list" 
                    active={isLeftPanelOpen && activeLeftView === 'plan'} 
                    onClick={() => toggleLeftView('plan')} 
                    tooltip="Plano de Desenvolvimento" 
                />

                 <div className="mt-auto flex flex-col gap-4">
                     <ActivityButton 
                        icon="terminal" 
                        active={isBottomPanelOpen} 
                        onClick={toggleBottomPanel} 
                        tooltip="Terminal" 
                    />
                     <ActivityButton icon="settings" active={false} onClick={() => {}} tooltip="Configurações" />
                </div>
            </aside>

            {/* --- LEFT SIDEBAR (Retractable) --- */}
            <aside 
                className={`bg-[#0f172a] border-r border-[#334155] transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isLeftPanelOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}
            >
                <div className="h-9 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between px-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                    <span>
                        {activeLeftView === 'explorer' && 'Explorador'}
                        {activeLeftView === 'source-control' && 'Source Control'}
                        {activeLeftView === 'plan' && 'Plano'}
                    </span>
                    <button onClick={() => setIsLeftPanelOpen(false)}><Icon name="x" className="h-3 w-3" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {activeLeftView === 'explorer' && (
                        <ProjectExplorerView 
                            files={projectFileTree}
                            onFileSelect={(f) => handleFileSelect({path: f.path, content: f.content, language: f.language})} 
                        />
                    )}
                    {activeLeftView === 'source-control' && (
                        <SourceControlView 
                            commitMessage={commitMessage} 
                            setCommitMessage={setCommitMessage} 
                            onCommit={handleCommitAction} 
                            changedFiles={generatedFiles} 
                            onFileSelect={(f) => handleFileSelect({path: f.path, content: f.content, language: 'typescript'})}
                        />
                    )}
                    {activeLeftView === 'plan' && (
                         <div className="p-2 space-y-1">
                             <Label className="text-xs text-slate-500 px-2 mb-2 block">Mudar Tarefa Ativa</Label>
                            {allTasks.map((t: any) => (
                                <button 
                                    key={t.id} 
                                    onClick={() => setActiveTaskId(t.id)}
                                    className={`w-full text-left px-3 py-2 rounded text-xs flex items-center gap-2 ${activeTaskId === t.id ? 'bg-accent text-white' : 'text-slate-400 hover:bg-[#1e293b]'}`}
                                >
                                    <Icon name={t.status === 'done' ? 'checkCircle' : 'circle'} className="h-3 w-3" />
                                    <span className="truncate">{t.title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                
                {/* Toolbar */}
                <header className="h-10 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between px-4 select-none flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                         <span className="font-semibold text-slate-200">{project.name}</span>
                         <span>/</span>
                         <span>{activeFile ? activeFile.path : 'No file open'}</span>
                    </div>

                    <div className="flex bg-[#0f172a] rounded-md p-0.5 border border-[#334155]">
                        <button onClick={() => setViewMode('code')} className={`px-3 py-1 text-xs rounded-sm flex items-center gap-2 transition-all ${viewMode === 'code' ? 'bg-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}><Icon name="code" className="h-3 w-3"/> Code</button>
                        <button onClick={() => setViewMode('split')} className={`px-3 py-1 text-xs rounded-sm flex items-center gap-2 transition-all ${viewMode === 'split' ? 'bg-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}><Icon name="layout" className="h-3 w-3"/> Split</button>
                        <button onClick={() => setViewMode('preview')} className={`px-3 py-1 text-xs rounded-sm flex items-center gap-2 transition-all ${viewMode === 'preview' ? 'bg-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}><Icon name="eye" className="h-3 w-3"/> Preview</button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)} 
                            className={`p-1 rounded hover:bg-[#334155] ${isBottomPanelOpen ? 'text-accent' : 'text-slate-400'}`}
                            title="Toggle Terminal"
                        >
                            <Icon name="terminal" className="h-4 w-4" />
                         </button>
                         <button 
                            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} 
                            className={`p-1 rounded hover:bg-[#334155] ${isRightPanelOpen ? 'text-accent' : 'text-slate-400'}`}
                            title="Toggle AI Panel"
                        >
                            <Icon name="layout" className="h-4 w-4 rotate-180" />
                         </button>
                    </div>
                </header>

                {/* Editor / Preview Canvas */}
                <div className="flex-1 flex overflow-hidden bg-[#0b1120]">
                    {/* Editor */}
                    {(viewMode === 'code' || viewMode === 'split') && (
                        <div className={`flex-1 flex flex-col min-w-0 border-r border-[#334155] relative ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                            {activeFile ? (
                                <CodeBlock 
                                    code={editedContent} 
                                    language={activeFile.language || 'typescript'} 
                                    isEditable={true} 
                                    onCodeChange={setEditedContent} 
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                                    <Icon name="code" className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Selecione um arquivo para editar.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div className={`flex-1 bg-black/20 relative ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                            <div className="absolute top-2 right-2 z-10 flex gap-1 bg-[#1e293b] p-1 rounded border border-[#334155]">
                                <button onClick={() => setDeviceMode('desktop')} className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-accent text-white' : 'text-slate-400'}`}><Icon name="monitor" className="h-3 w-3"/></button>
                                <button onClick={() => setDeviceMode('mobile')} className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-accent text-white' : 'text-slate-400'}`}><Icon name="smartphone" className="h-3 w-3"/></button>
                            </div>
                             <div className={`transition-all duration-300 h-full w-full flex items-center justify-center p-4`}>
                                <div className={`bg-white overflow-hidden shadow-2xl ${deviceMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[2rem] border-8 border-slate-800' : 'w-full h-full rounded-lg border border-slate-700'}`}>
                                    <PreviewView />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- BOTTOM PANEL (Terminal) --- */}
                <div 
                    className={`bg-[#1e293b] border-t border-[#334155] transition-all duration-300 ease-in-out flex flex-col ${isBottomPanelOpen ? 'h-56' : 'h-0 overflow-hidden'}`}
                >
                    <BottomPanelView onClose={() => setIsBottomPanelOpen(false)} logs={terminalLogs} />
                </div>

                 {/* Status Bar */}
                 <div className="h-6 bg-accent text-white text-[10px] flex items-center px-3 justify-between select-none flex-shrink-0 z-20">
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1"><Icon name="gitBranch" className="h-3 w-3"/> main*</span>
                        <span className="flex items-center gap-1"><Icon name="alertCircle" className="h-3 w-3"/> 0 Errors</span>
                    </div>
                    <div className="flex gap-3">
                        <span>UTF-8</span>
                        <span>TypeScript</span>
                    </div>
                </div>
            </div>

             {/* --- RIGHT SIDEBAR (Retractable) --- */}
             <aside 
                className={`bg-[#1e293b] border-l border-[#334155] transition-all duration-300 ease-in-out overflow-hidden flex flex-col flex-shrink-0 ${isRightPanelOpen ? 'w-80' : 'w-0 opacity-0'}`}
            >
                 {/* Right Tabs Header */}
                <div className="flex border-b border-[#334155] flex-shrink-0">
                    <button onClick={() => setActiveRightView('assistant')} className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeRightView === 'assistant' ? 'border-accent text-white bg-[#0f172a]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>IA Chat</button>
                    <button onClick={() => setActiveRightView('context')} className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeRightView === 'context' ? 'border-accent text-white bg-[#0f172a]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Tarefa</button>
                    <button onClick={() => setActiveRightView('automations')} className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeRightView === 'automations' ? 'border-accent text-white bg-[#0f172a]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Auto</button>
                </div>

                 <div className="flex-1 overflow-y-auto bg-[#0f172a] p-0">
                    {activeRightView === 'assistant' && currentTask && (
                        <AIAssistant taskContext={currentTask} />
                    )}
                    {activeRightView === 'context' && currentTask && (
                         <div className="p-4 space-y-4">
                             <h3 className="font-bold text-white">{currentTask.title}</h3>
                             <p className="text-xs text-slate-400">{currentTask.details?.description || 'Sem descrição detalhada.'}</p>
                             
                             <div className="space-y-2">
                                <Label className="text-xs uppercase text-slate-500 font-bold">Checklist</Label>
                                <div className="space-y-2">
                                    {currentTask.subTasks.map(sub => (
                                        <div key={sub.id} className="flex items-start space-x-2 bg-[#1e293b] p-2 rounded border border-[#334155]">
                                            <Checkbox id={`sub-${sub.id}`} checked={selectedSubTasks.includes(sub.id)} onCheckedChange={(c) => {
                                                if (c) setSelectedSubTasks([...selectedSubTasks, sub.id]);
                                                else setSelectedSubTasks(selectedSubTasks.filter(id => id !== sub.id));
                                            }} />
                                            <Label htmlFor={`sub-${sub.id}`} className="text-xs leading-tight cursor-pointer">{sub.text}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase text-slate-500 font-bold">Instruções Extras</Label>
                                <Textarea value={additionalInstructions} onChange={e => setAdditionalInstructions(e.target.value)} className="bg-[#1e293b] border-[#334155] text-xs min-h-[80px]" placeholder="Ex: Usar Tailwind para estilos..." />
                            </div>
                            <Button onClick={handleGenerateCode} disabled={isGenerating || selectedSubTasks.length === 0} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                {isGenerating ? <Icon name="spinner" className="animate-spin h-4 w-4" /> : <Icon name="sparkles" className="h-4 w-4 mr-2" />}
                                Gerar Código
                            </Button>
                         </div>
                    )}
                    {activeRightView === 'automations' && currentTask && (
                        <div className="p-4">
                             <QuickAutomations taskContext={currentTask} onGenerate={(prompt) => { setAdditionalInstructions(prev => prev + '\n' + prompt); setActiveRightView('context'); }} projectId={project.id} />
                        </div>
                    )}
                </div>
            </aside>

        </div>
    );
};

// Helper Component for Activity Bar Buttons
const ActivityButton: React.FC<{ icon: string, active: boolean, onClick: () => void, tooltip: string, badge?: number }> = ({ icon, active, onClick, tooltip, badge }) => (
    <div className="relative group">
        <button 
            onClick={onClick} 
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${active ? 'text-white bg-accent shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-white hover:bg-[#334155]'}`}
        >
            <Icon name={icon} className="h-5 w-5" />
            {badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#1e293b]">{badge}</span> : null}
        </button>
        <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity delay-75 ml-2">
            {tooltip}
        </div>
    </div>
);

export default DevelopmentCockpit;
