
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton } from '../../ui/Dialog';
import CodeBlock from '../../shared/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';

// --- TYPE DEFINITIONS ---

interface EventAction {
    id: string;
    trigger: 'onClick' | 'onChange' | 'onHover' | 'onMount';
    actionType: 'API_CALL' | 'NAVIGATION' | 'STATE_UPDATE' | 'CUSTOM_LOGIC';
    actionDetails: string;
}

// Interfaces for data received from the AI
interface GeneratedComponent {
    id: string; // Add ID for unique key
    name: string;
    type: string;
    description: string;
    dataEntities: string[];
    style?: {
        backgroundColor?: string;
        textColor?: string;
        borderColor?: string;
        padding?: string;
        borderRadius?: string;
    };
    advanced?: {
        visibilityCondition?: string;
        events?: EventAction[];
        animation?: string;
        transition?: string;
    };
}
interface GeneratedPage { id: string; path: string; description: string; layout: string; components: GeneratedComponent[]; }

// Props for the main component
interface ComponentPrototyperProps {
    generatedData: { pages: GeneratedPage[] };
    onBack: () => void;
    onComplete: (data: any) => void;
}

type ViewMode = 'visual' | 'data_state' | 'navigation_interactivity' | 'theme';
type PropertyTab = 'content' | 'style' | 'advanced';

// --- MODAL COMPONENT ---
const CodeArtifactModal: React.FC<{ component: GeneratedComponent | null; onClose: () => void }> = ({ component, onClose }) => {
  if (!component) return null;

  const codeSnippet = `
import React from 'react';

interface ${component.name}Props {
  // Props generated based on component type and data entities
}

const ${component.name}: React.FC<${component.name}Props> = (props) => {
  // Component logic for a "${component.type}" that interacts with:
  // ${component.dataEntities.join(', ')}

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="font-bold">${component.name}</h3>
      <p className="text-sm text-text-secondary">${component.description}</p>
    </div>
  );
};

export default ${component.name};
  `.trim();

  return (
    <Dialog open={true} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Artefato de Código: {component.name}</DialogTitle>
            <DialogDescription>Exemplo de código React (TSX) gerado para este componente.</DialogDescription>
            <DialogCloseButton />
        </DialogHeader>
        <DialogContent>
            <CodeBlock language="typescript" code={codeSnippet} />
        </DialogContent>
    </Dialog>
  );
};


// --- UI SUB-COMPONENTS ---

const PrototyperHeader: React.FC<{ viewMode: ViewMode; setViewModeAndTab: (mode: ViewMode, tab: PropertyTab) => void; onBack: () => void; onComplete: () => void; }> = ({ viewMode, setViewModeAndTab, onBack, onComplete }) => {
    const modes: { id: ViewMode; label: string; icon: string, tab: PropertyTab }[] = [
        { id: 'visual', label: 'Visual/Layout', icon: 'palette', tab: 'style' },
        { id: 'data_state', label: 'Dados & Estado', icon: 'database', tab: 'advanced' },
        { id: 'navigation_interactivity', label: 'Navegação & Lógica', icon: 'route', tab: 'advanced' },
    ];
    return (
        <header className="flex-shrink-0 flex items-center justify-between border-b border-card-border px-4 py-2 bg-background z-10">
            <Button variant="outline" size="sm" onClick={onBack}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar</Button>
            <div className="flex items-center justify-center">
                <div className="flex h-9 items-center justify-center rounded-lg bg-sidebar p-1">
                    {modes.map(mode => (
                        <button key={mode.id} onClick={() => setViewModeAndTab(mode.id, mode.tab)} className={`flex items-center gap-2 cursor-pointer h-full grow rounded-md px-3 text-sm transition-colors ${viewMode === mode.id ? 'bg-card shadow-sm text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}>
                            <Icon name={mode.icon} className="h-4 w-4" />
                            <span>{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <Button onClick={onComplete} size="sm"><Icon name="check" className="h-4 w-4 mr-2" />Concluir</Button>
        </header>
    );
};

const PropertiesPanel: React.FC<{
    component: GeneratedComponent | null;
    onUpdate: (updatedProps: Partial<GeneratedComponent>) => void;
    onViewCode: () => void;
    activeTab: PropertyTab;
    onTabChange: (tab: PropertyTab) => void;
}> = ({ component, onUpdate, onViewCode, activeTab, onTabChange }) => {
    if (!component) {
        return (
            <div className="text-center text-text-secondary pt-16">
                <Icon name="mousePointer" className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Selecione um componente para ver suas propriedades.</p>
            </div>
        );
    }
    
    const handleStyleChange = (prop: keyof NonNullable<GeneratedComponent['style']>, value: string) => {
        onUpdate({ style: { ...component.style, [prop]: value } });
    };

    const handleAdvancedChange = (prop: keyof NonNullable<GeneratedComponent['advanced']>, value: any) => {
        onUpdate({ advanced: { ...component.advanced, [prop]: value } });
    };
    
    // --- Event Handlers ---
    const handleAddEvent = () => {
        const newEvent: EventAction = { id: Date.now().toString(), trigger: 'onClick', actionType: 'NAVIGATION', actionDetails: '' };
        const updatedEvents = [...(component.advanced?.events || []), newEvent];
        handleAdvancedChange('events', updatedEvents);
    };

    const handleUpdateEvent = (id: string, field: keyof EventAction, value: string) => {
        const updatedEvents = (component.advanced?.events || []).map(e =>
            e.id === id ? { ...e, [field]: value } : e
        );
        handleAdvancedChange('events', updatedEvents);
    };
    
    const handleRemoveEvent = (id: string) => {
        const updatedEvents = (component.advanced?.events || []).filter(e => e.id !== id);
        handleAdvancedChange('events', updatedEvents);
    };

    return (
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as PropertyTab)} className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="style">Estilo</TabsTrigger>
                <TabsTrigger value="advanced">Comportamento</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
                <TabsContent value="content" className="m-0">
                     <div className="space-y-3">
                        <div className="space-y-1"><Label htmlFor="comp-name">Nome do Componente</Label><Input id="comp-name" value={component.name} onChange={(e) => onUpdate({ name: e.target.value })} /></div>
                        <div className="space-y-1"><Label>Tipo</Label><Input value={component.type} disabled /></div>
                        <div className="space-y-1"><Label htmlFor="comp-desc">Descrição</Label><Textarea id="comp-desc" value={component.description} onChange={(e) => onUpdate({ description: e.target.value })} rows={4} /></div>
                    </div>
                </TabsContent>
                <TabsContent value="style" className="m-0">
                    <div className="space-y-3">
                        <div className="space-y-1"><Label>Cor de Fundo</Label><Input type="color" value={component.style?.backgroundColor || '#1e293b'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} /></div>
                         <div className="space-y-1"><Label>Cor da Borda</Label><Input type="color" value={component.style?.borderColor || '#334155'} onChange={(e) => handleStyleChange('borderColor', e.target.value)} /></div>
                        <div className="space-y-1"><Label>Espaçamento (Padding)</Label><Input value={component.style?.padding || '0'} onChange={(e) => handleStyleChange('padding', e.target.value)} /></div>
                        <div className="space-y-1"><Label>Raio da Borda</Label><Input value={component.style?.borderRadius || '0.5rem'} onChange={(e) => handleStyleChange('borderRadius', e.target.value)} /></div>
                    </div>
                </TabsContent>
                <TabsContent value="advanced" className="m-0 space-y-4">
                     <div><p className="text-sm font-semibold text-accent mb-1 flex items-center gap-1"><Icon name="database" className="h-4 w-4" /> Entidades de Dados</p><div className="flex flex-wrap gap-1">{component.dataEntities.map(entity => <Badge key={entity} variant="outline">{entity}</Badge>)}</div></div>
                     <div className="space-y-1"><Label>Lógica de Visibilidade</Label><Input value={component.advanced?.visibilityCondition || ''} onChange={(e) => handleAdvancedChange('visibilityCondition', e.target.value)} placeholder="Ex: user.role === 'admin'" /></div>
                     <div className="space-y-1"><Label>Animação</Label><Input value={component.advanced?.animation || ''} onChange={(e) => handleAdvancedChange('animation', e.target.value)} placeholder="Ex: fadeIn 1s ease-in-out" /></div>
                     <div className="space-y-1"><Label>Transição (CSS)</Label><Input value={component.advanced?.transition || ''} onChange={(e) => handleAdvancedChange('transition', e.target.value)} placeholder="Ex: all 0.3s ease" /></div>
                    <div>
                        <Label>Eventos e Ações</Label>
                        <div className="space-y-2 mt-1 border border-card-border p-2 rounded-md bg-sidebar/50">
                            {(component.advanced?.events || []).map(event => (
                                <div key={event.id} className="p-2 bg-background rounded border border-card-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Select value={event.trigger} onValueChange={(v) => handleUpdateEvent(event.id, 'trigger', v)}><SelectTrigger className="w-2/5"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="onClick">onClick</SelectItem><SelectItem value="onChange">onChange</SelectItem><SelectItem value="onHover">onHover</SelectItem><SelectItem value="onMount">onMount</SelectItem></SelectContent></Select>
                                        <Select value={event.actionType} onValueChange={(v) => handleUpdateEvent(event.id, 'actionType', v)}><SelectTrigger className="w-3/5"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="API_CALL">Requisição API</SelectItem><SelectItem value="NAVIGATION">Navegação</SelectItem><SelectItem value="STATE_UPDATE">Atualizar Estado</SelectItem><SelectItem value="CUSTOM_LOGIC">Lógica Customizada</SelectItem></SelectContent></Select>
                                         <Button variant="ghost" size="sm" onClick={() => handleRemoveEvent(event.id)}><Icon name="trash" className="h-4 w-4 text-red-400"/></Button>
                                    </div>
                                    <Input value={event.actionDetails} onChange={(e) => handleUpdateEvent(event.id, 'actionDetails', e.target.value)} placeholder="Detalhes da ação..." />
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={handleAddEvent} className="w-full mt-1"><Icon name="plus" className="h-4 w-4 mr-2"/> Adicionar Evento</Button>
                        </div>
                    </div>
                </TabsContent>
                <Card className="bg-sidebar mt-4"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Icon name="file-code" className="h-4 w-4" /> Artefatos</CardTitle></CardHeader><CardContent><p className="text-xs text-text-secondary mb-3">Código gerado pela IA para este componente.</p><Button size="sm" className="w-full" onClick={onViewCode}><Icon name="code" className="h-4 w-4 mr-2" />Visualizar Código</Button></CardContent></Card>
            </div>
        </Tabs>
    );
};

const ComponentWireframe: React.FC<{ component: GeneratedComponent; isSelected: boolean; viewMode: ViewMode }> = ({ component, isSelected, viewMode }) => {
    
    let highlightClasses = 'border-card-border/50';
    if (isSelected) {
        switch (viewMode) {
            case 'data_state': highlightClasses = 'border-sky-500 ring-2 ring-sky-500/30'; break;
            case 'navigation_interactivity': highlightClasses = 'border-yellow-500 ring-2 ring-yellow-500/30'; break;
            default: highlightClasses = 'border-accent ring-2 ring-accent/30'; break;
        }
    }

    const style: React.CSSProperties = {
        backgroundColor: viewMode === 'theme' ? component.style?.backgroundColor : undefined,
        borderColor: viewMode === 'theme' ? component.style?.borderColor : undefined,
        borderRadius: viewMode === 'theme' ? component.style?.borderRadius : undefined,
        animation: component.advanced?.animation || 'none',
        transition: component.advanced?.transition || 'none',
    };

    const renderContent = () => {
        // Content rendering logic remains the same
        return <p className="text-xs text-text-secondary mt-2 p-2">{component.description}</p>;
    };

    return (
        <div className={`border-2 rounded-lg bg-sidebar transition-all ${highlightClasses}`} style={style}>
            <div className="p-3 border-b border-card-border/50">
                <h4 className="font-bold text-text-primary text-sm">{component.name}</h4>
                <Badge variant="secondary" className="mt-1 text-xs">{component.type}</Badge>
            </div>
            {renderContent()}
        </div>
    );
};


const ComponentPrototyper: React.FC<ComponentPrototyperProps> = ({ generatedData, onBack, onComplete }) => {
    const initialPrototypeData = useMemo(() => ({
        pages: generatedData.pages.map(page => ({
            ...page,
            id: page.path,
            components: page.components.map((comp, index) => ({
                ...comp,
                id: `${page.path}-${index}-${comp.name}`,
                style: { backgroundColor: '#1e293b', borderColor: '#334155', padding: '0', borderRadius: '0.5rem' },
                advanced: { visibilityCondition: '', events: [], animation: '', transition: '' }
            }))
        }))
    }), [generatedData]);

    const [prototypeData, setPrototypeData] = useState(initialPrototypeData);
    const [selectedPageId, setSelectedPageId] = useState(prototypeData.pages[0]?.id || null);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('visual');
    const [propertyTab, setPropertyTab] = useState<PropertyTab>('style');
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    const selectedPage = prototypeData.pages.find(p => p.id === selectedPageId);
    const selectedComponent = selectedPage?.components.find(c => c.id === selectedComponentId);

    const setViewModeAndTab = (mode: ViewMode, tab: PropertyTab) => {
        setViewMode(mode);
        setPropertyTab(tab);
    };
    
    const handleComponentClick = (componentId: string) => {
        setSelectedComponentId(componentId);
        if (viewMode === 'data_state' || viewMode === 'navigation_interactivity') {
            setPropertyTab('advanced');
        } else {
            setPropertyTab('style');
        }
    };

    const handleUpdateComponent = (updatedProps: Partial<GeneratedComponent>) => {
        if (!selectedPageId || !selectedComponentId) return;

        setPrototypeData(prevData => ({
            ...prevData,
            pages: prevData.pages.map(page =>
                page.id === selectedPageId
                    ? { ...page, components: page.components.map(comp => comp.id === selectedComponentId ? { ...comp, ...updatedProps } : comp ) }
                    : page
            ),
        }));
    };
    
    const renderPageLayout = () => {
        if (!selectedPage) return null;

        // Determine layout class based on page.layout property
        let layoutClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"; // Default grid
        if (selectedPage.layout === "Standard (Sidebar + Header)") {
             // Simulate a dashboard layout inside the preview area
             return (
                <div className="flex flex-col h-full">
                    <div className="h-12 border-b border-card-border bg-sidebar/50 flex items-center px-4 mb-4 rounded-t-lg">
                        <span className="text-xs text-text-secondary">Header Area</span>
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                         <div className="w-48 border-r border-card-border bg-sidebar/30 hidden md:flex items-center justify-center rounded-bl-lg">
                             <span className="text-xs text-text-secondary">Sidebar Area</span>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4">
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {selectedPage.components.map(comp => (
                                    <div key={comp.id} onClick={() => handleComponentClick(comp.id)} className="cursor-pointer">
                                        <ComponentWireframe component={comp} isSelected={selectedComponentId === comp.id} viewMode={viewMode} />
                                    </div>
                                ))}
                             </div>
                         </div>
                    </div>
                </div>
             )
        }

        return (
            <div className="flex-1 bg-background/50 p-4 space-y-4 overflow-y-auto h-full rounded-lg">
                <h2 className="text-xl font-bold text-center text-text-secondary mb-4">{selectedPage.path}</h2>
                <div className={layoutClasses}>
                    {selectedPage.components.map(comp => (
                        <div key={comp.id} onClick={() => handleComponentClick(comp.id)} className="cursor-pointer">
                            <ComponentWireframe component={comp} isSelected={selectedComponentId === comp.id} viewMode={viewMode} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            {isCodeModalOpen && <CodeArtifactModal component={selectedComponent || null} onClose={() => setIsCodeModalOpen(false)} />}
            
            <PrototyperHeader viewMode={viewMode} setViewModeAndTab={setViewModeAndTab} onBack={onBack} onComplete={() => onComplete(prototypeData)} />
            <main className="flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-card-border bg-background p-2 flex flex-col">
                     <div className="p-2"><h3 className="font-semibold text-text-primary mb-2">Telas</h3></div>
                     <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                        {prototypeData.pages.map(page => (
                            <button key={page.id} onClick={() => { setSelectedPageId(page.id); setSelectedComponentId(null); }} className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${selectedPageId === page.id ? 'bg-sidebar text-text-primary' : 'hover:bg-sidebar/50 text-text-secondary'}`}>
                                <Icon name="layout" className="h-4 w-4" />
                                <span className="text-sm font-medium truncate">{page.path}</span>
                            </button>
                        ))}
                     </nav>
                </aside>

                <div className="flex-1 flex items-stretch justify-center bg-background p-4 md:p-8 overflow-hidden">
                    {selectedPage ? (
                        <div className="w-full h-full bg-sidebar/50 shadow-inner rounded-xl border border-card-border p-2 overflow-hidden flex flex-col relative diagram-bg">
                           {renderPageLayout()}
                        </div>
                    ) : (<p className="text-text-secondary self-center">Selecione uma página para visualizar</p>)}
                </div>
                
                <aside className="w-80 lg:w-96 border-l border-card-border bg-background p-4 flex flex-col">
                    <h3 className="font-semibold text-text-primary mb-4 flex-shrink-0">Propriedades</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <PropertiesPanel component={selectedComponent || null} onUpdate={handleUpdateComponent} onViewCode={() => setIsCodeModalOpen(true)} activeTab={propertyTab} onTabChange={setPropertyTab} />
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ComponentPrototyper;
