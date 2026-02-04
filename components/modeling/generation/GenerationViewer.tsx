
import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { generateDevelopmentPlan } from '../../../lib/generation/planGenerator'; 
import { Project, ProjectArtifacts } from '../../../types';
import PlanSummaryView from './PlanSummaryView';

interface GenerationViewerProps {
    wizardData: any;
    setCurrentView: (view: string, context?: any) => void;
    project: Project;
    onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
}

const GenerationViewer: React.FC<GenerationViewerProps> = ({ wizardData, setCurrentView, project, onArtifactsUpdate }) => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    
    const handleGeneratePlan = () => {
        setIsGenerating(true);
        
        // Generate the dynamic plan based on the wizard data
        setTimeout(() => {
            const plan = generateDevelopmentPlan(wizardData);
            
            // Save the generated plan to the central artifacts state
            onArtifactsUpdate(project.id, { developmentPlan: plan });
            
            // The parent component (ConstructionHub) will automatically switch views
            // because the `developmentPlan` prop will now be populated in the parent's state.
            setIsGenerating(false);
        }, 1500);
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <Icon name="spinner" className="animate-spin h-12 w-12 text-accent" />
                <h2 className="text-2xl font-semibold mt-4">Criando seu Plano de Desenvolvimento...</h2>
                <p className="text-text-secondary mt-2">Aguarde enquanto nossa IA transforma seu modelo em tarefas acionáveis.</p>
            </div>
        );
    }
    
    // Default view: 'summary'
    return (
        <div className="space-y-6">
            <header className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <Icon name="checkCircle" className="h-8 w-8 text-green-400" />
                    <h1 className="text-4xl font-bold">Modelagem Concluída</h1>
                </div>
                <p className="text-text-secondary max-w-3xl mx-auto">
                    Seu modelo de sistema foi processado. Revise o resumo abaixo e gere um plano de desenvolvimento detalhado.
                </p>
            </header>

            <div className="text-center">
                <Button onClick={handleGeneratePlan} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    <Icon name="download" className="h-5 w-5 mr-2" />
                    Gerar Plano de Desenvolvimento Dinâmico
                </Button>
                <p className="text-sm text-text-secondary mt-2">Transforma suas entidades, telas e regras em Sprints e Tarefas reais.</p>
            </div>

            <PlanSummaryView wizardData={wizardData} />
        </div>
    );
};

export default GenerationViewer;
