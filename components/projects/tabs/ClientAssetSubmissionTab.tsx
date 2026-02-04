import React, { useState } from 'react';
import { Project } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface ClientAssetSubmissionTabProps {
    project: Project;
    onAssetSubmit: (projectId: string, assetId: string, value: string) => void;
}

const ClientAssetSubmissionTab: React.FC<ClientAssetSubmissionTabProps> = ({ project, onAssetSubmit }) => {
    const [textValues, setTextValues] = useState<Record<string, string>>({});

    const handleTextChange = (assetId: string, value: string) => {
        setTextValues(prev => ({ ...prev, [assetId]: value }));
    };

    const handleSubmit = (assetId: string) => {
        if (textValues[assetId]) {
            onAssetSubmit(project.id, assetId, textValues[assetId]);
            // Clear the input after submission
            setTextValues(prev => ({ ...prev, [assetId]: '' }));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="listChecks" className="h-5 w-5 text-accent"/>
                    Checklist de Ativos Necessários
                </CardTitle>
                <CardDescription>
                    Para continuarmos com o desenvolvimento do projeto, precisamos que você forneça os seguintes itens.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {project.assets.map(asset => (
                        <div key={asset.id} className="p-3 bg-sidebar/50 rounded-md border border-card-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <h4 className="font-medium">{asset.label}</h4>
                                    <p className="text-xs text-text-secondary capitalize">{asset.type}</p>
                                </div>
                                {asset.status === 'submitted' ? (
                                    <div className="flex items-center gap-2 text-green-400 flex-shrink-0">
                                        <Icon name="checkCircle" className="h-4 w-4" />
                                        <span className="text-sm font-semibold">Enviado</span>
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 w-full sm:w-auto">
                                        {asset.type === 'file' && <Button size="sm" variant="outline" className="w-full sm:w-auto">Upload</Button>}
                                        {(asset.type === 'text' || asset.type === 'credentials') && (
                                            <div className="flex gap-2">
                                                <Input
                                                    className="w-full sm:w-48"
                                                    placeholder="Digite aqui..."
                                                    value={textValues[asset.id] || ''}
                                                    onChange={(e) => handleTextChange(asset.id, e.target.value)}
                                                    type={asset.type === 'credentials' ? 'password' : 'text'}
                                                />
                                                <Button size="sm" onClick={() => handleSubmit(asset.id)}>Enviar</Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                     {project.assets.length === 0 && (
                         <p className="text-sm text-center text-text-secondary py-4">Nenhum ativo solicitado para este projeto no momento.</p>
                     )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ClientAssetSubmissionTab;
