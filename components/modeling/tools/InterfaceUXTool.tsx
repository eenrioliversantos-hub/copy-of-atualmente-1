
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import ComponentPrototyper from './ComponentPrototyper';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { generateFullFrontend } from '../../../lib/generation/fullFrontendGenerator'; // Import new generator

// --- TYPE DEFINITIONS ---
interface GeneratedComponent { 
    name: string; 
    type: string; 
    description: string; 
    dataEntities: string[];
    // Visual props for the renderer
    props?: Record<string, string>; 
}

interface GeneratedPage { 
    path: string; 
    name: string;
    type: 'static' | 'dynamic' | 'group';
    authLevel: 'public' | 'protected' | 'admin';
    layoutId: string;
    dataFetching: 'server-side' | 'client-side' | 'static';
    description: string; 
    components: GeneratedComponent[];
    // Deep Technical Details
    stateVariables?: { name: string; type: string; initialValue: string; description: string }[];
    apiCalls?: { 
        endpoint: string; 
        method: string; 
        trigger: string; 
        requestBody: string; 
        successResponse: string; 
        errorHandling: string; 
    }[];
    functions?: { name: string; description: string; logic: string }[];
    // Visual & Code
    tsxCode?: string; // The full React component code
    responsiveConfig?: { mobileLayout: string; desktopLayout: string };
}

// --- PROPS ---
interface InterfaceUXToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
    planningData: any;
    entitiesData: any;
}

const ColorInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; }> = ({ label, value, onChange }) => (
    <div className="space-y-1">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-2 p-1 border border-card-border rounded-md bg-background">
            <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" style={{ appearance: 'none', padding: 0 }} />
            <Input value={value} onChange={e => onChange(e.target.value)} className="flex-1 bg-transparent border-none focus-visible:ring-0 text-xs" />
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const InterfaceUXTool: React.FC<InterfaceUXToolProps> = ({ initialData, onComplete, onBack, planningData, entitiesData }) => {
    // FIX: Initialize state correctly based on whether prototype data already exists.
    const hasPrototypeData = initialData?.prototype && initialData.prototype.pages && initialData.prototype.pages.length > 0;
    
    const [phase, setPhase] = useState<'conference' | 'generating' | 'details'>(hasPrototypeData ? 'details' : 'conference');
    const [conferenceData, setConferenceData] = useState(initialData?.conference || {
        framework: 'Next.js (App Router) + Tailwind',
        theme: 'Dark',
        primaryColor: '#38bdf8',
        backgroundColor: '#0f172a',
        cardColor: '#1e293b',
        textColor: '#f8fafc',
        fontFamily: 'Inter',
        borderRadius: '0.5rem',
        spacingUnit: '4px',
        stateManagement: 'Zustand',
        dataFetching: 'React Query',
    });
    
    // FIX: Ensure generatedData loads from initialData.prototype to persist state
    const [generatedData, setGeneratedData] = useState<{ pages: GeneratedPage[] } | null>(initialData?.prototype || null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState('');

    const handleConferenceChange = (field: string, value: string) => {
        setConferenceData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        setPhase('generating');
        setError(null);
        try {
            setProgress('Analisando modelo de dados e requisitos...');
            await new Promise(res => setTimeout(res, 500)); // Pequena pausa para UX
            
            setProgress('Projetando arquitetura de rotas...');
            await new Promise(res => setTimeout(res, 500)); 

            // Use the deterministic generator
            const wizardContext = {
                planning: planningData,
                data_modeling: entitiesData,
                interface_ux: { step15: entitiesData.step15 || initialData.step15 || { screens: [] } } // Fallback to ensure screens are passed if available
            };
            
            const result = generateFullFrontend(wizardContext);
            
            setProgress('Finalizando especificação técnica...');
            await new Promise(res => setTimeout(res, 300)); 

            setGeneratedData(result);
            setPhase('details');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
            setPhase('conference');
        }
    };
    
    // FIX: Ensure we pass the full data structure back
    const handleComplete = (finalPrototypeData: any) => {
        // If finalPrototypeData is just the updated generatedData, wrap it
        const finalData = { 
            conference: conferenceData, 
            prototype: finalPrototypeData || generatedData // Fallback to current state if argument is null
        };
        
        // Pass both the wizard state AND the artifact (prototype) separately if needed, 
        // though usually wizardData handles everything.
        onComplete(finalData, { prototype: finalPrototypeData });
    };

    if (phase === 'details' && generatedData) {
        return <ComponentPrototyper generatedData={generatedData} onBack={() => setPhase('conference')} onComplete={handleComplete} />;
    }

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar ao Hub</Button>
                    <div className="flex items-center gap-3"><Icon name="layout" className="h-6 w-6 text-accent" />
                        <div><h1 className="text-lg font-semibold text-text-primary">Engenharia de Frontend & UX</h1><p className="text-sm text-text-secondary">Defina a arquitetura de UI, rotas, lógica e estado.</p></div>
                    </div>
                </div>
                 {/* Allow skipping generation if data exists */}
                 {hasPrototypeData && phase === 'conference' && (
                     <Button onClick={() => setPhase('details')} variant="secondary">
                        <Icon name="edit" className="h-4 w-4 mr-2" />
                        Editar Protótipo Existente
                    </Button>
                 )}
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                {phase === 'generating' ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                        <Icon name="cpu" className="animate-spin h-12 w-12 text-accent mb-4" />
                        <h2 className="text-2xl font-semibold">Arquiteto de Frontend Trabalhando...</h2>
                        <p className="text-text-secondary mt-2">{progress}</p>
                        <div className="w-64 h-1 bg-sidebar rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-accent animate-pulse w-1/2 mx-auto rounded-full"></div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Definição da Arquitetura de Interface</h2>
                            <p className="text-text-secondary mt-1">Configure as bases para que o sistema gere a estrutura profunda de componentes, estado e API.</p>
                        </div>

                        <Card>
                            <CardHeader><CardTitle>Arquitetura e Tecnologia</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label>Framework & Estratégia</Label><Select value={conferenceData.framework} onValueChange={(v) => handleConferenceChange('framework', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Next.js (App Router) + Tailwind">Next.js (App Router) + Tailwind</SelectItem><SelectItem value="React (Vite) + Styled Components">React (Vite) + Styled Components</SelectItem><SelectItem value="React Native (Mobile First)">React Native (Mobile First)</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Gerenciamento de Estado</Label><Select value={conferenceData.stateManagement} onValueChange={(v) => handleConferenceChange('stateManagement', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Zustand">Zustand (Recomendado)</SelectItem><SelectItem value="Context API">Context API</SelectItem><SelectItem value="Redux Toolkit">Redux Toolkit</SelectItem><SelectItem value="Jotai">Jotai</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Data Fetching</Label><Select value={conferenceData.dataFetching} onValueChange={(v) => handleConferenceChange('dataFetching', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="React Query">React Query / TanStack Query</SelectItem><SelectItem value="SWR">SWR</SelectItem><SelectItem value="Server Actions">Server Actions (Next.js)</SelectItem><SelectItem value="Axios + useEffect">Axios + useEffect (Legado)</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Tema Visual Base</Label><Select value={conferenceData.theme} onValueChange={(v) => handleConferenceChange('theme', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Dark">Dark</SelectItem><SelectItem value="Light">Light</SelectItem><SelectItem value="System">Sistema</SelectItem></SelectContent></Select></div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Design System Tokens (Base)</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ColorInput label="Cor Primária (Brand)" value={conferenceData.primaryColor} onChange={(v) => handleConferenceChange('primaryColor', v)} />
                                <ColorInput label="Cor de Fundo" value={conferenceData.backgroundColor} onChange={(v) => handleConferenceChange('backgroundColor', v)} />
                                <ColorInput label="Cor de Superfície" value={conferenceData.cardColor} onChange={(v) => handleConferenceChange('cardColor', v)} />
                                <ColorInput label="Cor do Texto" value={conferenceData.textColor} onChange={(v) => handleConferenceChange('textColor', v)} />
                            </CardContent>
                        </Card>
                        
                        <div className="text-center pt-4">
                             {error && <p className="text-sm text-red-500 mb-4 bg-red-500/10 p-2 rounded">{error}</p>}
                            <Button size="lg" onClick={handleGenerate}>
                                <Icon name="sparkles" className="h-5 w-5 mr-2" /> 
                                {hasPrototypeData ? 'Regerar Arquitetura de Frontend' : 'Projetar Arquitetura de Frontend'}
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InterfaceUXTool;
