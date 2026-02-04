import React from 'react';
import { Project } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';

interface OperatorMonitoringTabProps {
    project: Project;
}

const OperatorMonitoringTab: React.FC<OperatorMonitoringTabProps> = ({ project }) => {
    const isInternal = project.projectScope === 'internal';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="barChart3" className="h-5 w-5 text-accent"/>
                    Monitoramento e Ações
                </CardTitle>
                <CardDescription>
                    {isInternal
                        ? "Execute ações-chave e monitore a saúde da aplicação."
                        : "Visualize o status do projeto e solicite a custódia para realizar ações."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isInternal ? (
                    <div className="space-y-4">
                         <h3 className="font-semibold">Ações de Gerenciamento</h3>
                         <div className="flex flex-wrap gap-4">
                            <Button variant="outline"><Icon name="play" className="h-4 w-4 mr-2"/>Reiniciar Servidor</Button>
                            <Button variant="outline"><Icon name="file-text" className="h-4 w-4 mr-2"/>Ver Logs em Tempo Real</Button>
                            <Button variant="outline"><Icon name="database" className="h-4 w-4 mr-2"/>Forçar Backup do Banco</Button>
                            <Button variant="destructive"><Icon name="alertCircle" className="h-4 w-4 mr-2"/>Modo de Manutenção</Button>
                         </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 bg-sidebar rounded-lg border border-card-border">
                        <div>
                            <p className="font-semibold">Status da Custódia</p>
                            <p className="text-sm text-text-secondary">A custódia deste projeto está com o cliente ({project.client}).</p>
                        </div>
                        <Button>
                             <Icon name="shield" className="h-4 w-4 mr-2"/>
                             Solicitar Custódia
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OperatorMonitoringTab;