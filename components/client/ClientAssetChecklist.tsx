import React, { useState } from 'react';
import { Project } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Icon from '../shared/Icon';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ClientAssetChecklistProps {
    project: Project;
    onAssetSubmit: (projectId: string, assetId: string, value: string) => void;
}

const ClientAssetChecklist: React.FC<ClientAssetChecklistProps> = ({ project, onAssetSubmit }) => {
    const [textValues, setTextValues] = useState<Record<string, string>>({});

    const handleTextChange = (assetId: string, value: string) => {
        setTextValues(prev => ({ ...prev, [assetId]: value }));
    };

    const handleSubmit = (assetId: string) => {
        if (textValues[assetId]) {
            onAssetSubmit(project.id, assetId, textValues[assetId]);
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
                    Para continuarmos com o desenvolvimento do projeto '{project.name}', precisamos que você forneça os seguintes itens.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {project.assets.map(asset => (
                        <div key={asset.id} className="p-3 bg-sidebar/50 rounded-md border border-card-border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium">{asset.label}</h4>
                                    <p className="text-xs text-text-secondary capitalize">{asset.type}</p>
                                </div>
                                {asset.status === 'submitted' ? (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Icon name="checkCircle" className="h-4 w-4" />
                                        <span className="text-sm font-semibold">Enviado</span>
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0">
                                        {asset.type === 'file' && <Button size="sm" variant="outline">Upload</Button>}
                                        {(asset.type === 'text' || asset.type === 'credentials') && (
                                            <div className="flex gap-2">
                                                <Input 
                                                    className="w-48" 
                                                    placeholder="Digite aqui..." 
                                                    value={textValues[asset.id] || ''}
                                                    onChange={(e) => handleTextChange(asset.id, e.target.value)}
                                                />
                                                <Button size="sm" onClick={() => handleSubmit(asset.id)}>Enviar</Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ClientAssetChecklist;
