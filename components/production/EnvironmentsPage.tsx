import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const mockEnvironments = [
    { 
        name: 'Produção', 
        url: 'https://erp-techcorp.com', 
        status: 'Online', 
        version: 'v1.2.1', 
        commit: 'e4f5g6h', 
        cpu: 35, 
        memory: 68 
    },
    { 
        name: 'Staging', 
        url: 'https://staging.erp-techcorp.com', 
        status: 'Online', 
        version: 'v1.3.0-rc1', 
        commit: 'a1b2c3d', 
        cpu: 22, 
        memory: 55 
    },
    { 
        name: 'Desenvolvimento', 
        url: 'https://dev.erp-techcorp.com', 
        status: 'Offline', 
        version: 'v1.3.0-dev', 
        commit: 'i7j8k9l', 
        cpu: 0, 
        memory: 0 
    },
];

const EnvironmentsPage = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mockEnvironments.map(env => (
                <Card key={env.name}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${env.status === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                                {env.name}
                            </CardTitle>
                            <Badge className={env.status === 'Online' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                                {env.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm">
                            <p className="text-text-secondary">Versão:</p>
                            <p className="font-semibold flex items-center gap-2">{env.version} <span className="font-mono text-xs text-accent">{env.commit}</span></p>
                        </div>
                        <div className="text-sm">
                            <p className="text-text-secondary">URL:</p>
                            <a href={env.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline flex items-center gap-1">
                                {env.url} <Icon name="externalLink" className="h-3 w-3" />
                            </a>
                        </div>
                        <div className="space-y-2 pt-2">
                            <div>
                                <div className="flex justify-between text-xs mb-1"><span>CPU</span><span>{env.cpu}%</span></div>
                                <div className="w-full bg-sidebar rounded-full h-1.5"><div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${env.cpu}%` }}></div></div>
                            </div>
                             <div>
                                <div className="flex justify-between text-xs mb-1"><span>Memória</span><span>{env.memory}%</span></div>
                                <div className="w-full bg-sidebar rounded-full h-1.5"><div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${env.memory}%` }}></div></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-card-border">
                            <Button size="sm" variant="outline"><Icon name="file-text" className="h-4 w-4 mr-2" />Logs</Button>
                            <Button size="sm" variant="outline"><Icon name="settings" className="h-4 w-4 mr-2" />Config</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default EnvironmentsPage;