import React from 'react';
import { Project, ProjectValidation, ProductionPhase } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { PRODUCTION_PHASES } from '../../data/productionPhases';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Textarea } from '../ui/Textarea';

interface ClientValidationPageProps {
    project: Project;
    validation: ProjectValidation;
    onBack: () => void;
    onApprove: (projectId: string, validationId: string) => void;
    onRequestChanges: (projectId: string, validationId: string, feedback: string) => void;
}

const ClientValidationPage: React.FC<ClientValidationPageProps> = ({ project, validation, onBack, onApprove, onRequestChanges }) => {
    const [showRequestChangesDialog, setShowRequestChangesDialog] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");

    const phase = PRODUCTION_PHASES.find(p => p.id === validation.targetId);

    if (!phase) {
        return <div>Fase de validação não encontrada.</div>;
    }

    const handleRequestChangesSubmit = () => {
        onRequestChanges(project.id, validation.id, feedback);
        setShowRequestChangesDialog(false);
        setFeedback("");
    };
    
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <Dialog open={showRequestChangesDialog} onClose={() => setShowRequestChangesDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Solicitar Alterações para "{phase.title}"</DialogTitle>
                    <DialogDescription>Descreva as alterações necessárias para a equipe. Seja o mais detalhado possível.</DialogDescription>
                </DialogHeader>
                <DialogContent>
                    <Textarea placeholder="Ex: Gostaria de adicionar um passo extra na etapa de Análise de Requisitos..." rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRequestChangesDialog(false)}>Cancelar</Button>
                    <Button onClick={handleRequestChangesSubmit} disabled={!feedback.trim()}>Enviar Solicitação</Button>
                </DialogFooter>
            </Dialog>

            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar ao Projeto
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">Revisão e Aprovação</h1>
                        <p className="text-sm text-text-secondary">Projeto: {project.name}</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Validação da Fase: {phase.title}</h2>
                        <p className="text-text-secondary max-w-3xl mx-auto mt-2">
                           Por favor, revise o resumo desta fase do projeto. Sua aprovação é necessária para que a equipe de desenvolvimento possa prosseguir.
                        </p>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo da Fase</CardTitle>
                            <CardDescription>{validation.data.summary || 'Resumo das atividades realizadas nesta fase.'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-text-primary mb-3">Etapas Concluídas nesta Fase:</h3>
                            <ul className="space-y-3">
                                {phase.steps.map(step => (
                                    <li key={step.id} className="p-3 bg-sidebar/50 border border-card-border rounded-md">
                                        <p className="font-medium flex items-center gap-2">
                                            <Icon name="checkCircle" className="h-4 w-4 text-green-400" />
                                            {step.title}
                                        </p>
                                        <p className="text-sm text-text-secondary ml-6">{step.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                </div>
            </main>
             <footer className="bg-sidebar/80 backdrop-blur-sm border-t border-card-border px-6 py-4 flex items-center justify-center gap-4">
                <Button variant="destructive" size="lg" onClick={() => setShowRequestChangesDialog(true)}>
                    <Icon name="x" className="h-5 w-5 mr-2" />
                    Solicitar Alterações
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(project.id, validation.id)}>
                    <Icon name="checkCircle" className="h-5 w-5 mr-2" />
                    Aprovar Fase
                </Button>
            </footer>
        </div>
    );
};

export default ClientValidationPage;