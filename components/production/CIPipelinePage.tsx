import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const mockPipelineRuns = [
    { id: 'run-123', commit: 'a1b2c3d', branch: 'main', status: 'Sucesso', duration: '5m 32s', stages: [{ name: 'Build', status: 'success' }, { name: 'Testes', status: 'success' }, { name: 'Análise', status: 'success' }, { name: 'Artefato', status: 'success' }] },
    { id: 'run-122', commit: 'i7j8k9l', branch: 'feat/new-dashboard', status: 'Falha', duration: '2m 10s', stages: [{ name: 'Build', status: 'success' }, { name: 'Testes', status: 'failure' }, { name: 'Análise', status: 'skipped' }, { name: 'Artefato', status: 'skipped' }] },
    { id: 'run-121', commit: 'm0n1o2p', branch: 'fix/auth-bug', status: 'Sucesso', duration: '4m 55s', stages: [{ name: 'Build', status: 'success' }, { name: 'Testes', status: 'success' }, { name: 'Análise', status: 'success' }, { name: 'Artefato', status: 'success' }] },
];

const Stage: React.FC<{ name: string; status: string; }> = ({ name, status }) => {
    const statusConfig = {
        success: { icon: 'checkCircle', color: 'text-green-400' },
        failure: { icon: 'x', color: 'text-red-400' },
        running: { icon: 'spinner', color: 'text-sky-400 animate-spin' },
        skipped: { icon: 'arrowRight', color: 'text-text-secondary' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.skipped;

    return (
        <div className="flex items-center gap-2 p-2 bg-background rounded-md border border-card-border">
            <Icon name={config.icon} className={`h-4 w-4 ${config.color}`} />
            <span className="text-sm font-medium">{name}</span>
        </div>
    );
};

const CIPipelinePage = () => {
    return (
        <div className="space-y-6">
            {mockPipelineRuns.map(run => (
                <Card key={run.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Pipeline Run #{run.id.split('-')[1]}</CardTitle>
                                <CardDescription className="font-mono text-xs mt-1">
                                    Commit {run.commit} na branch <Badge variant="outline">{run.branch}</Badge>
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <Badge className={run.status === 'Sucesso' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                                    {run.status}
                                </Badge>
                                <p className="text-xs text-text-secondary mt-1">{run.duration}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {run.stages.map((stage, index) => (
                                <React.Fragment key={index}>
                                    <Stage name={stage.name} status={stage.status} />
                                    {index < run.stages.length - 1 && <Icon name="arrowRight" className="h-5 w-5 text-text-secondary flex-shrink-0" />}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-card-border flex items-center gap-2">
                            <Button size="sm" variant="outline">Ver Detalhes</Button>
                            <Button size="sm" variant="outline">Ver Logs</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CIPipelinePage;