
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import Step1Vision from '../steps/Step1Vision';
import Step2SystemType from '../steps/Step2SystemType';
import Step4Stack from '../steps/Step4Stack';
import Step5Authentication from '../steps/Step5Authentication';
import Step7Permissions from '../steps/Step7Permissions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';
// FIX: Added missing CardHeader, CardTitle, and CardContent imports to fix "Cannot find name" errors on line 194.
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';
import UserEntityDataTool from './UserEntityDataTool';
import EntityLifecycleTool from './EntityLifecycleTool';
import DataStateArchitectureTool from './DataStateArchitectureTool';

interface PlanningToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
}

const PlanningTool: React.FC<PlanningToolProps> = ({ initialData, onComplete, onBack }) => {
    // Inicialização robusta garantindo que se o initialData (blueprint) tiver dados, eles sejam usados
    const [data, setData] = useState(() => {
        const base = initialData || {};
        return {
            ...base,
            step1: base.step1 || { businessObjectives: [], successMetrics: [] },
            step2: base.step2 || { mobileFeatures: [] },
            step4: base.step4 || { frontend: [], backend: [], database: [] },
            step5: base.step5 || { providers: [] },
            step6: base.step6 || { userTypes: [] },
            planningEntities: base.planningEntities || [],
            planningDataArchitecture: base.planningDataArchitecture || { growthEstimate: '25' }
        };
    });

    const handleDataChange = useCallback((stepKey: string, stepData: any) => {
        setData((prev: any) => {
            return { ...prev, [stepKey]: stepData };
        });
    }, []);

    const handleUserTypeDataChange = (id: string, userData: any) => {
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = userTypes.map((u: any) => u.id === id ? { ...u, ...userData } : u);
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleAddUserType = () => {
        const newUser = { id: Date.now().toString(), name: 'Novo Papel' };
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = [...userTypes, newUser];
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleRemoveUserType = (id: string) => {
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = userTypes.filter((u: any) => u.id !== id);
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleAddEntity = () => {
        const newEntity = { id: Date.now().toString(), singularName: 'Nova Entidade', attributes: [], transitions: [] };
        const updatedEntities = [...(data.planningEntities || []), newEntity];
        handleDataChange('planningEntities', updatedEntities);
    };

    const handleRemoveEntity = (id: string) => {
        const updatedEntities = (data.planningEntities || []).filter((e: any) => e.id !== id);
        handleDataChange('planningEntities', updatedEntities);
    };

    const handleEntityDataChange = (id: string, entityData: any) => {
        const updatedEntities = (data.planningEntities || []).map((e: any) => e.id === id ? { ...e, ...entityData } : e);
        handleDataChange('planningEntities', updatedEntities);
    };

    const visionMd = useMemo(() => `
# Documento de Planejamento Estratégico: ${data.step1?.systemName || 'Sem Nome'}
## Visão e Escopo
${data.step1?.description || 'N/A'}

## Arquitetura de Dados
- **Banco de Dados:** ${data.planningDataArchitecture?.dbType}
- **Escalabilidade:** ${data.planningDataArchitecture?.scalabilityReq}
- **Retenção:** ${data.planningDataArchitecture?.retentionPolicy}
    `.trim(), [data]);

    const handleGenerateAndSave = () => {
        const artifacts = { 'PLANNING_STRATEGY.md': visionMd };
        onComplete(data, artifacts);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar ao Hub</Button>
                    <div className="flex items-center gap-3"><Icon name="eye" className="h-6 w-6 text-accent" />
                        <div><h1 className="text-lg font-semibold text-text-primary">Ferramenta de Planejamento</h1><p className="text-sm text-text-secondary">Defina a visão, arquitetura e stack do seu projeto.</p></div>
                    </div>
                </div>
                <Button onClick={handleGenerateAndSave} className="bg-accent hover:bg-accent-hover text-white"><Icon name="sparkles" className="h-4 w-4 mr-2" />Concluir Planejamento</Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <Tabs defaultValue="vision" className="w-full">
                    <TabsList className="grid w-full grid-cols-7 bg-sidebar p-1 rounded-lg">
                        <TabsTrigger value="vision">1. Visão</TabsTrigger>
                        <TabsTrigger value="type">2. Tipo</TabsTrigger>
                        <TabsTrigger value="stack">3. Stack</TabsTrigger>
                        <TabsTrigger value="auth">4. Autenticação</TabsTrigger>
                        <TabsTrigger value="users_entities_data">5. Fluxos & Dados</TabsTrigger>
                        <TabsTrigger value="permissions">6. Permissões</TabsTrigger>
                        <TabsTrigger value="artifacts">7. Artefatos</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="vision"><Step1Vision data={data.step1 || {}} setData={(d) => handleDataChange('step1', d)} /></TabsContent>
                        <TabsContent value="type"><Step2SystemType data={data.step2 || {}} setData={(d) => handleDataChange('step2', d)} /></TabsContent>
                        <TabsContent value="stack"><Step4Stack data={data.step4 || {}} setData={(d) => handleDataChange('step4', d)} /></TabsContent>
                        <TabsContent value="auth"><Step5Authentication data={data.step5 || {}} setData={(d) => handleDataChange('step5', d)} /></TabsContent>
                        
                        <TabsContent value="users_entities_data">
                             <Tabs defaultValue="users" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-background border border-card-border rounded-md p-1">
                                    <TabsTrigger value="users">Usuários & Fluxos</TabsTrigger>
                                    <TabsTrigger value="entities">Entidades & Ciclo de Vida</TabsTrigger>
                                    <TabsTrigger value="data_architecture">Dados & Arquitetura</TabsTrigger>
                                </TabsList>
                                <TabsContent value="users" className="mt-6">
                                     <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1"><h3 className="text-xl font-semibold">Perfis de Usuário & Fluxos</h3><p className="text-sm text-text-secondary">Mapeamento de personas e jornadas críticas.</p></div>
                                            <Button variant="outline" size="sm" onClick={handleAddUserType}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Perfil</Button>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {(data.step6?.userTypes || []).map((user: any) => (
                                                <AccordionItem value={user.id} key={user.id} className="border-none">
                                                    <Card className="bg-sidebar/50 border-card-border overflow-hidden">
                                                        <AccordionTrigger className="p-4 hover:no-underline">
                                                            <div className="flex justify-between items-center w-full pr-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-accent/10 rounded text-accent"><Icon name="user" className="h-4 w-4"/></div>
                                                                    <span className="font-semibold text-text-primary">{user.roleName || user.name || 'Papel sem nome'}</span>
                                                                </div>
                                                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveUserType(user.id)}} className="hover:bg-red-500/10 text-red-500"><Icon name="trash" className="h-4 w-4" /></Button>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><UserEntityDataTool data={user} setData={(d) => handleUserTypeDataChange(user.id, d)} /></div></AccordionContent>
                                                    </Card>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </TabsContent>
                                <TabsContent value="entities" className="mt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1"><h3 className="text-xl font-semibold">Entidades & Ciclo de Vida</h3><p className="text-sm text-text-secondary">Definição conceitual do domínio e seus estados.</p></div>
                                            <Button variant="outline" size="sm" onClick={handleAddEntity}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Entidade</Button>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {(data.planningEntities || []).map((entity: any) => (
                                                <AccordionItem value={entity.id} key={entity.id} className="border-none">
                                                    <Card className="bg-sidebar/50 border-card-border overflow-hidden">
                                                        <AccordionTrigger className="p-4 hover:no-underline">
                                                            <div className="flex justify-between items-center w-full pr-4">
                                                                <div className="flex items-center gap-3">
                                                                     <div className="p-2 bg-sky-500/10 rounded text-sky-400"><Icon name="database" className="h-4 w-4"/></div>
                                                                     <span className="font-semibold text-text-primary">{entity.singularName || 'Nova Entidade'}</span>
                                                                </div>
                                                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveEntity(entity.id) }} className="hover:bg-red-500/10 text-red-500"><Icon name="trash" className="h-4 w-4" /></Button>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><EntityLifecycleTool data={entity} setData={(d) => handleEntityDataChange(entity.id, d)} /></div></AccordionContent>
                                                    </Card>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </TabsContent>
                                <TabsContent value="data_architecture" className="mt-6">
                                    <DataStateArchitectureTool
                                        data={data.planningDataArchitecture}
                                        setData={(d) => handleDataChange('planningDataArchitecture', d)}
                                    />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                        
                        <TabsContent value="permissions"><Step7Permissions data={data.step7 || {}} setData={(d) => handleDataChange('step7', d)} userTypes={data.step6?.userTypes || []} /></TabsContent>
                        <TabsContent value="artifacts"><Card><CardHeader><CardTitle>Prévia da Documentação de Planejamento</CardTitle></CardHeader><CardContent><CodeBlock language="markdown" code={visionMd} /></CardContent></Card></TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
};

export default PlanningTool;
