import React, { useState } from 'react';
import { Project } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';

interface ClientMonitoringTabProps {
    project: Project;
}

const ClientMonitoringTab: React.FC<ClientMonitoringTabProps> = ({ project }) => {
    // Mock state for custody
    const [custody, setCustody] = useState<'client' | 'operator'>('client');
    const hasServiceAgreement = true; // Mock

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="barChart3" className="h-5 w-5 text-accent"/>
                    Monitoramento do Projeto
                </CardTitle>
                <CardDescription>
                    Acompanhe a saúde da sua aplicação e execute ações de gerenciamento.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-sidebar rounded-lg border border-card-border flex items-center justify-between">
                    <p className="font-semibold">
                        Custódia Atual: <Badge variant="secondary" className={custody === 'client' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}>{custody === 'client' ? 'Você' : 'Operador'}</Badge>
                    </p>
                    {custody === 'client' ? (
                        <Button onClick={() => setCustody('operator')} disabled={!hasServiceAgreement}>
                            <Icon name="shield" className="h-4 w-4 mr-2" />
                            Transferir para o Operador
                        </Button>
                    ) : (
                         <Button onClick={() => setCustody('client')}>
                            <Icon name="shield" className="h-4 w-4 mr-2" />
                            Reivindicar Custódia
                        </Button>
                    )}
                </div>
                 {!hasServiceAgreement && custody === 'client' && (
                    <p className="text-xs text-text-secondary">
                        Para transferir a custódia para o operador, é necessário um contrato de prestação de serviços de manutenção.
                    </p>
                )}
                 {custody === 'client' ? (
                     <div className="space-y-4">
                         <h3 className="font-semibold">Ações de Gerenciamento</h3>
                         <div className="flex flex-wrap gap-4">
                            <Button variant="outline"><Icon name="play" className="h-4 w-4 mr-2"/>Reiniciar Servidor</Button>
                            <Button variant="outline"><Icon name="file-text" className="h-4 w-4 mr-2"/>Ver Logs da Aplicação</Button>
                            <Button variant="destructive"><Icon name="alertCircle" className="h-4 w-4 mr-2"/>Ativar Modo de Manutenção</Button>
                         </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Icon name="shield" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                        <p className="text-text-secondary">O operador atualmente tem a custódia do projeto e é responsável pelas ações de monitoramento.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ClientMonitoringTab;