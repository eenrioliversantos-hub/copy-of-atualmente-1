import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Icon from '../shared/Icon';
import { Concept, TaskStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ConceptCardProps {
  concept: Concept;
  onClick: () => void;
  onExecute: () => void;
}

const getStatusClasses = (status: TaskStatus) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500/10 text-green-400 border-green-500/30';
        case 'inProgress':
            return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
        case 'pending':
        default:
            return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
}

const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
        case 'completed': return 'Concluído';
        case 'inProgress': return 'Em Progresso';
        case 'pending':
        default: return 'Pendente';
    }
}


const ConceptCard: React.FC<ConceptCardProps> = ({ concept, onClick, onExecute }) => {
  return (
    <Card 
        className="group transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-1 bg-sidebar/50 hover:bg-sidebar flex flex-col"
    >
        <CardContent className="p-5 flex flex-col flex-grow">
            <div 
                onClick={onClick}
                className="flex-grow cursor-pointer"
            >
                <div className="flex items-start justify-between mb-3">
                     <Badge variant="outline" className={`text-xs ${getStatusClasses(concept.status)}`}>
                        {getStatusLabel(concept.status)}
                    </Badge>
                    <Icon name="arrowRight" className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-background rounded-lg border border-card-border group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                        <Icon name={concept.icon} className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors text-base">{concept.title}</h3>
                        <p className="text-xs text-text-secondary mt-1">{concept.description}</p>
                    </div>
                </div>
            </div>
            {concept.toolTarget && (
                <div className="mt-4 pt-4 border-t border-card-border/50">
                    <Button 
                        size="sm" 
                        className="w-full"
                        onClick={onExecute}
                    >
                        <Icon name={concept.children ? 'folderOpen' : 'play'} className="h-4 w-4 mr-2" />
                        {concept.children ? 'Abrir Ferramenta' : 'Executar Tarefa'}
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
};

export default ConceptCard;