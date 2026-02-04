import React from 'react';
import { ProjectAsset } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';

interface OperatorAssetsTabProps {
    assets: ProjectAsset[];
}

const OperatorAssetsTab: React.FC<OperatorAssetsTabProps> = ({ assets }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="listChecks" className="h-5 w-5 text-accent"/>
                    Ativos e Credenciais do Cliente
                </CardTitle>
                <CardDescription>
                    Gerencie os ativos solicitados e enviados pelo cliente para o projeto.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assets.map(asset => (
                        <div key={asset.id} className="p-3 bg-sidebar/50 rounded-md border border-card-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <h4 className="font-medium">{asset.label}</h4>
                                    <p className="text-xs text-text-secondary capitalize">{asset.type}</p>
                                </div>
                                {asset.status === 'submitted' ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-green-400 italic truncate">
                                                {asset.type === 'file' ? asset.fileName : asset.value}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {asset.type === 'file' ? (
                                                <Button size="sm" variant="outline"><Icon name="download" className="h-4 w-4 mr-2" />Baixar</Button>
                                            ) : (
                                                <Button size="sm" variant="outline"><Icon name="eye" className="h-4 w-4 mr-2" />Visualizar</Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>
                                )}
                            </div>
                        </div>
                    ))}
                    {assets.length === 0 && (
                        <p className="text-sm text-center text-text-secondary py-4">Nenhum ativo foi solicitado para este projeto.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default OperatorAssetsTab;