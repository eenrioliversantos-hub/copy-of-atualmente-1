
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { ALL_BLUEPRINTS } from '../../lib/blueprints';
import { SystemTemplate, Project, ProjectArtifacts } from '../../types';
import BlueprintCard from './blueprints/BlueprintCard';
import BlueprintDetailPage from './blueprints/BlueprintDetailPage';
import ModelingWizard from './ModelingWizard';

interface ModelingPageProps {
    onBack: () => void;
    setCurrentView: (view: string, context?: any) => void;
    project: Project;
    onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
    existingWizardData?: any; // New prop
}

const ModelingPage: React.FC<ModelingPageProps> = ({ onBack, setCurrentView, project, onArtifactsUpdate, existingWizardData }) => {
    // If we have existing data, start in wizard mode.
    const [view, setView] = useState<'selection' | 'detail' | 'wizard'>(existingWizardData ? 'wizard' : 'selection');
    const [selectedBlueprint, setSelectedBlueprint] = useState<SystemTemplate | null>(null);

    const handleSelectBlueprint = (blueprint: SystemTemplate) => {
        setSelectedBlueprint(blueprint);
        setView('detail');
    };
    
    const handleStartFromScratch = () => {
        setSelectedBlueprint(null);
        setView('wizard');
    };

    const handleUseBlueprint = () => {
        setView('wizard');
    };

    const handleBackToSelection = () => {
        setSelectedBlueprint(null);
        setView('selection');
    };

    if (view === 'wizard') {
        return <ModelingWizard 
                    initialData={selectedBlueprint || existingWizardData} 
                    isExistingData={!!existingWizardData && !selectedBlueprint}
                    onBack={handleBackToSelection} 
                    setCurrentView={setCurrentView} 
                    project={project} 
                    onArtifactsUpdate={onArtifactsUpdate}
                />;
    }

    if (view === 'detail' && selectedBlueprint) {
        return <BlueprintDetailPage blueprint={selectedBlueprint} onBack={handleBackToSelection} onUseBlueprint={handleUseBlueprint} />;
    }

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar ao Projeto
                    </Button>
                    <div className="flex items-center gap-3">
                        <Icon name="schema" className="h-6 w-6 text-accent" />
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary">Workspace de Modelagem</h1>
                            <p className="text-sm text-text-secondary">Inicie um novo projeto ou acelere com um blueprint.</p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Como você quer começar?</h2>
                    <p className="text-text-secondary mt-2 max-w-2xl mx-auto">
                        Inicie um projeto do zero para total customização, ou escolha um de nossos blueprints
                        para obter uma base sólida e acelerar o desenvolvimento.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Start from Scratch Card */}
                    <div
                        onClick={handleStartFromScratch}
                        className="col-span-1 md:col-span-1 bg-sidebar border-2 border-dashed border-card-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent hover:bg-slate-700 transition-all duration-300"
                    >
                        <div className="bg-background inline-block p-4 rounded-full border-2 border-card-border mb-4">
                            <Icon name="plus" className="h-10 w-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mt-4 text-text-primary">Começar do Zero</h3>
                        <p className="text-sm text-text-secondary mt-2">
                            Use o hub de modelagem para definir cada aspecto do seu sistema com total liberdade.
                        </p>
                    </div>

                    {/* Blueprints Introduction */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">Ou comece com um Blueprint</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {ALL_BLUEPRINTS.map(blueprint => (
                                <BlueprintCard
                                    key={blueprint.id}
                                    blueprint={blueprint}
                                    onClick={() => handleSelectBlueprint(blueprint)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ModelingPage;
