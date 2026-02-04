import React from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { SystemTemplate } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/Tabs';
import { Badge } from '../../ui/Badge';
import { Separator } from '../../ui/Separator';

interface BlueprintDetailPageProps {
    blueprint: SystemTemplate;
    onBack: () => void;
    onUseBlueprint: () => void;
}

const DetailItem: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="border-b border-card-border py-3">
        <p className="text-sm text-text-secondary">{label}</p>
        <div className="font-medium mt-1">{children}</div>
    </div>
);


const BlueprintDetailPage: React.FC<BlueprintDetailPageProps> = ({ blueprint, onBack, onUseBlueprint }) => {
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                     <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Back to Blueprints
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{blueprint.icon}</span>
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary">{blueprint.name}</h1>
                            <p className="text-sm text-text-secondary">{blueprint.category}</p>
                        </div>
                    </div>
                </div>
                <Button onClick={onUseBlueprint} size="sm">
                    <Icon name="zap" className="h-4 w-4 mr-2" />
                    Use this Blueprint
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                 <p className="text-center text-text-secondary max-w-3xl mx-auto mb-8">{blueprint.description}</p>
                 <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="users">Perfis de Usuário</TabsTrigger>
                        <TabsTrigger value="entities">Entidades</TabsTrigger>
                        <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                        <Card>
                            <CardHeader><CardTitle>Visão Geral do Sistema</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <DetailItem label="Objetivo">{blueprint.systemOverview.objective}</DetailItem>
                               <DetailItem label="Usuários Alvo">{blueprint.systemOverview.targetUsers}</DetailItem>
                               <DetailItem label="Principais Funcionalidades">
                                   <ul className="list-disc list-inside space-y-1 mt-2">
                                       {blueprint.systemOverview.mainFeatures.map(f => <li key={f}>{f}</li>)}
                                   </ul>
                               </DetailItem>
                               <DetailItem label="Requisitos Não-Funcionais">
                                   <ul className="list-disc list-inside space-y-1 mt-2">
                                       {blueprint.systemOverview.nonFunctionalRequirements.map(r => <li key={r}>{r}</li>)}
                                   </ul>
                               </DetailItem>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="users" className="mt-6">
                        <div className="space-y-4">
                            {blueprint.userProfiles.map(profile => (
                                <Card key={profile.name}>
                                    <CardHeader>
                                        <CardTitle>{profile.name}</CardTitle>
                                        <CardDescription>{profile.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="entities" className="mt-6">
                         <div className="space-y-4">
                            {blueprint.entities.map(entity => (
                                <Card key={entity.name}>
                                    <CardHeader>
                                        <CardTitle>{entity.name}</CardTitle>
                                        {/* FIX: Check if entity.description exists before rendering */}
                                        {entity.description && <CardDescription>{entity.description}</CardDescription>}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-semibold mb-2">Campos</h4>
                                                <div className="divide-y divide-card-border border-y border-card-border">
                                                    {entity.fields.map(field => (
                                                        <div key={field.name} className="flex justify-between items-center py-2 px-2">
                                                            <span>{field.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary">{field.type}</Badge>
                                                                {field.required && <Badge variant="outline">Obrigatório</Badge>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {(entity.relationships && entity.relationships.length > 0) && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Relacionamentos</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                                                        {entity.relationships.map((rel, i) => <li key={i}>{rel.type} com {rel.targetEntity}: {rel.description}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="architecture" className="mt-6">
                        <Card>
                            <CardHeader><CardTitle>Stack de Tecnologia</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem label="Frontend">
                                    <div className="flex flex-wrap gap-2 mt-2">{blueprint.technologyStack.frontend.map(t => <Badge key={t}>{t}</Badge>)}</div>
                                </DetailItem>
                                 <DetailItem label="Backend">
                                    <div className="flex flex-wrap gap-2 mt-2">{blueprint.technologyStack.backend.map(t => <Badge key={t}>{t}</Badge>)}</div>
                                </DetailItem>
                                 <DetailItem label="Banco de Dados">
                                    <div className="flex flex-wrap gap-2 mt-2">{blueprint.technologyStack.database.map(t => <Badge key={t}>{t}</Badge>)}</div>
                                </DetailItem>
                                 <DetailItem label="DevOps">
                                    <div className="flex flex-wrap gap-2 mt-2">{blueprint.technologyStack.devops.map(t => <Badge key={t}>{t}</Badge>)}</div>
                                </DetailItem>
                            </CardContent>
                        </Card>
                    </TabsContent>
                 </Tabs>
            </main>
        </div>
    );
};

export default BlueprintDetailPage;