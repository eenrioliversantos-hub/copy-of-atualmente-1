import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const mockDeployments = [
    { 
        env: 'Staging', 
        version: 'v1.3.0-rc1', 
        status: 'Sucesso',
        lastDeploy: '2 horas atrás',
        commit: 'a1b2c3d',
        stages: [
            { name: 'Deploy to Staging', status: 'success' },
            { name: 'Run E2E Tests', status: 'success' },
            { name: 'Smoke Test', status: 'success' },
        ],
        promotionReady: true
    },
    { 
        env: 'Produção', 
        version: 'v1.2.1', 
        status: 'Sucesso',
        lastDeploy: '1 dia atrás',
        commit: 'e4f5g6h',
         stages: [
            { name: 'Deploy to Production', status: 'success' },
            { name: 'Monitor Health', status: 'success' },
        ],
        promotionReady: false
    },
];

const Stage: React.FC<{ name: string; status: string; }> = ({ name, status }) => {
    const statusConfig = {
        success: { icon: 'checkCircle', color: 'text-green-400' },
        running: { icon: 'spinner', color: 'text-sky-400 animate-spin' },
        pending: { icon: 'clock', color: 'text-text-secondary' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <div className="flex flex-col items-center text-center">
            <div className={`p-3 rounded-full mb-2 ${status === 'success' ? 'bg-green-500/10' : 'bg-sidebar'}`}>
                <Icon name={config.icon} className={`h-6 w-6 ${config.color}`} />
            </div>
            <p className="text-sm font-medium">{name}</p>
        </div>
    );
};

const CDPipelinePage = () => {
    return (
        <div className="space-y-8">
            {mockDeployments.map(deploy => (
                 <Card key={deploy.env}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">Ambiente: {deploy.env}</CardTitle>
                                <CardDescription className="mt-1">
                                    Versão atual: <Badge variant="secondary">{deploy.version}</Badge> • Commit: <Badge variant="outline" className="font-mono">{deploy.commit}</Badge>
                                </CardDescription>
                            </div>
                             <div className="text-right">
                                <Badge className={'bg-green-500/10 text-green-400'}>
                                    {deploy.status}
                                </Badge>
                                <p className="text-xs text-text-secondary mt-1">{deploy.lastDeploy}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-around p-4 bg-background rounded-lg">
                            {deploy.stages.map((stage, index) => (
                                <React.Fragment key={index}>
                                    <Stage name={stage.name} status={stage.status} />
                                    {index < deploy.stages.length - 1 && <div className="flex-1 h-0.5 bg-card-border mx-4"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-card-border flex items-center gap-2">
                            {deploy.promotionReady && (
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Icon name="rocket" className="h-4 w-4 mr-2" />
                                    Promover para Produção
                                </Button>
                            )}
                             <Button variant="outline">
                                <Icon name="refresh-cw" className="h-4 w-4 mr-2" />
                                Re-deploy
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CDPipelinePage;