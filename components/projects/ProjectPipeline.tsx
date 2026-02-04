
import React from 'react';
import { Project, ProjectValidation, ProductionPhase } from '../../types';
import { PRODUCTION_PHASES } from '../../data/productionPhases';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';

type PhaseStatus = 'locked' | 'pending' | 'in_progress' | 'awaiting_validation' | 'changes_requested' | 'approved';

const getPhaseStatus = (phase: ProductionPhase, project: Project, allPhases: ProductionPhase[]): PhaseStatus => {
    const validation = project.validations.find(v => v.targetId === phase.id);
    if (validation) {
        if (validation.status === 'approved') return 'approved';
        if (validation.status === 'pending') return 'awaiting_validation';
        if (validation.status === 'changes_requested') return 'changes_requested';
    }
    const currentIndex = allPhases.findIndex(p => p.id === phase.id);
    // The very first phase is always in progress if no validation exists for it.
    if (currentIndex === 0 && !validation) return 'in_progress';

    // A phase is in progress if the previous one was approved and it has no validation yet.
    if (currentIndex > 0) {
        const prevPhase = allPhases[currentIndex - 1];
        const prevValidation = project.validations.find(v => v.targetId === prevPhase.id);
        if (prevValidation && prevValidation.status === 'approved' && !validation) return 'in_progress';
    }
    return 'locked';
};

const statusConfig: Record<PhaseStatus, { text: string; icon: string; color: string; }> = {
    locked: { text: 'Bloqueado', icon: 'lock', color: 'text-text-secondary' },
    pending: { text: 'Pendente', icon: 'clock', color: 'text-text-secondary' },
    in_progress: { text: 'Em Progresso', icon: 'cog', color: 'text-sky-400' },
    awaiting_validation: { text: 'Aguardando Validação', icon: 'share', color: 'text-yellow-400' },
    changes_requested: { text: 'Alterações Solicitadas', icon: 'alertCircle', color: 'text-orange-400' },
    approved: { text: 'Aprovado', icon: 'checkCircle', color: 'text-green-400' },
};

interface ProjectPipelineProps {
    project: Project;
    userType: 'operator' | 'client';
    onApproveValidation: (projectId: string, validationId: string) => void;
    onRequestChanges: (projectId: string, validationId: string, feedback: string) => void;
    onViewValidation: (validation: ProjectValidation) => void;
    // Operator specific
    onRequestValidation?: (projectId: string, targetId: string, targetName: string, data: any) => void;
    setCurrentView?: (view: string, context?: any) => void;
    setActiveTab?: (tabId: string) => void;
}

const ProjectPipeline: React.FC<ProjectPipelineProps> = ({
    project,
    userType,
    onApproveValidation,
    onRequestChanges,
    onViewValidation,
    onRequestValidation,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pipeline de Validação do Projeto</CardTitle>
                <CardDescription>Acompanhe as fases de aprovação do negócio com o cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    <div className="absolute top-0 bottom-0 left-9 w-0.5 bg-card-border -z-10"></div>
                    {PRODUCTION_PHASES.map((phase) => {
                        const status = getPhaseStatus(phase, project, PRODUCTION_PHASES);
                        const config = statusConfig[status];
                        const validation = project.validations.find(v => v.targetId === phase.id);

                        return (
                            <div key={phase.id} className="relative mb-4">
                                <div className={`absolute -left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-background ${config.color.replace('text-', 'bg-')}`}>
                                    <Icon name={config.icon} className="h-4 w-4 text-background" />
                                </div>
                                <div className="ml-12 p-4 bg-sidebar/50 rounded-lg border border-card-border">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`font-bold text-lg ${config.color}`}>{phase.title}</h3>
                                        <Badge variant="outline" className={`${config.color.replace('text-', 'border-')}/30 ${config.color.replace('text-', 'bg-')}/10 ${config.color}`}>{config.text}</Badge>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">{phase.description}</p>

                                    {/* Operator Actions */}
                                    {userType === 'operator' && (status === 'in_progress' || status === 'changes_requested') && onRequestValidation && (
                                        <div className="mt-4 pt-3 border-t border-card-border flex gap-2">
                                            <Button size="sm" onClick={() => onRequestValidation(project.id, phase.id, phase.title, { summary: `Resumo da fase ${phase.title}` })}>
                                                <Icon name="share" className="h-4 w-4 mr-2" />
                                                Enviar para Validação
                                            </Button>
                                        </div>
                                    )}

                                    {/* Client Actions */}
                                    {userType === 'client' && status === 'awaiting_validation' && validation && (
                                        <div className="mt-4 pt-3 border-t border-card-border flex gap-2">
                                            <Button size="sm" onClick={() => onViewValidation(validation)}>
                                                <Icon name="eye" className="h-4 w-4 mr-2" />
                                                Revisar e Aprovar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectPipeline;
