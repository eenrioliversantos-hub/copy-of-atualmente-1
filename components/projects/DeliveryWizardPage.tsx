import React, { useState } from 'react';
import { Project } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';

interface DeliveryWizardPageProps {
    project: Project;
    onBack: () => void;
    onSend: (projectId: string, message: string) => void;
}

const DeliveryWizardPage: React.FC<DeliveryWizardPageProps> = ({ project, onBack, onSend }) => {
    const [message, setMessage] = useState(`Olá,\n\nA primeira versão do projeto "${project.name}" está pronta para sua revisão e aprovação final.\n\nVocê pode acessar a aplicação no link fornecido e baixar os demais artefatos, como o código-fonte e a documentação.\n\nQualquer dúvida, estamos à disposição.\n\nAtenciosamente,\nA Equipe`);

    const artifacts = [
        { name: "Link da Aplicação em Produção", type: 'link', value: `https://app.${project.name.toLowerCase().replace(/\s/g, '')}.com` },
        { name: "Código-Fonte (v1.0.0.zip)", type: 'file', value: "Download" },
        { name: "Documentação Completa (PDF)", type: 'file', value: "Download" },
        { name: "Blueprint Digital (JSON)", type: 'file', value: "Download" },
    ];

    const handleSend = () => {
        onSend(project.id, message);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" /> Voltar para a Torre de Controle
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">Preparar Entrega Final</h1>
                        <p className="text-sm text-text-secondary">Projeto: {project.name}</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revisão dos Entregáveis</CardTitle>
                            <CardDescription>Confirme os artefatos que serão enviados para o cliente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {artifacts.map(artifact => (
                                    <li key={artifact.name} className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                                        <div className="flex items-center gap-3">
                                            <Icon name={artifact.type === 'link' ? 'externalLink' : 'package'} className="h-5 w-5 text-accent" />
                                            <div>
                                                <p className="font-medium">{artifact.name}</p>
                                                {artifact.type === 'link' && <p className="text-xs text-text-secondary">{artifact.value}</p>}
                                            </div>
                                        </div>
                                        {artifact.type === 'file' && <Button variant="ghost" size="sm"><Icon name="download" className="h-4 w-4" /></Button>}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mensagem para o Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="delivery-message" className="sr-only">Mensagem de Entrega</Label>
                            <Textarea
                                id="delivery-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={10}
                                placeholder="Escreva uma mensagem para o cliente..."
                            />
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/10 border-accent/30">
                        <CardFooter className="p-6 flex items-center justify-center">
                             <Button size="lg" onClick={handleSend}>
                                <Icon name="share" className="h-5 w-5 mr-2" />
                                Enviar para Aprovação do Cliente
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DeliveryWizardPage;