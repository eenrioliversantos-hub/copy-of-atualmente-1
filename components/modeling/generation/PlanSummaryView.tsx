import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import DataModelTab from './DataModelTab';
import InterfaceUXTab from './InterfaceUXTab';
import FeaturesTab from './FeaturesTab';
import TechReqsTab from './TechReqsTab';
import CodeArtifactsTab from './CodeArtifactsTab';
import { ScrollArea } from '../../ui/ScrollArea';

interface PlanSummaryViewProps {
    wizardData: any;
}

const PlanSummaryView: React.FC<PlanSummaryViewProps> = ({ wizardData }) => {
    const planningData = wizardData.planning || {};
    const allPlanningSteps = { ...planningData.step1, ...planningData.step2, ...planningData.step3, ...planningData.step4, ...planningData.step5, ...planningData.step6, ...planningData.step7};

    return (
        <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="planning">Planning</TabsTrigger>
                    <TabsTrigger value="data-model">Data Model</TabsTrigger>
                    <TabsTrigger value="ux">Interface/UX</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="tech">Tech Reqs</TabsTrigger>
                    <TabsTrigger value="bom">Lista de Materiais</TabsTrigger>
                    <TabsTrigger value="generation">Code Artifacts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>{wizardData.planning?.step1?.systemName}</CardTitle>
                            <CardDescription>{wizardData.planning?.step1?.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="p-4 bg-sidebar/50 rounded-lg">
                                <p className="text-sm text-text-secondary">System Type</p>
                                <p className="text-lg font-semibold">{wizardData.planning?.step2?.systemType}</p>
                            </div>
                            <div className="p-4 bg-sidebar/50 rounded-lg">
                                <p className="text-sm text-text-secondary">Architecture</p>
                                <p className="text-lg font-semibold">{wizardData.planning?.step3?.architecture}</p>
                            </div>
                             <div className="p-4 bg-sidebar/50 rounded-lg">
                                <p className="text-sm text-text-secondary">Entities</p>
                                <p className="text-lg font-semibold">{(wizardData.data_modeling?.step8?.entities || []).length}</p>
                            </div>
                             <div className="p-4 bg-sidebar/50 rounded-lg">
                                <p className="text-sm text-text-secondary">API Endpoints</p>
                                <p className="text-lg font-semibold">{(wizardData.data_modeling?.step13?.endpoints || []).length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="planning" className="mt-6">
                     <Card>
                        <CardHeader><CardTitle>Planning Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>Main Objective:</strong> {allPlanningSteps.mainObjective}</p>
                            <p><strong>Target Audience:</strong> {(allPlanningSteps.targetAudience || []).join(', ')}</p>
                            <div className="flex flex-wrap gap-2">
                                <strong>Stack:</strong> 
                                {allPlanningSteps.frontend?.map((fe: string) => <Badge key={fe} variant='secondary'>{fe}</Badge>)}
                                {allPlanningSteps.backend?.map((be: string) => <Badge key={be} variant='secondary'>{be}</Badge>)}
                                {allPlanningSteps.database?.map((db: string) => <Badge key={db} variant='secondary'>{db}</Badge>)}
                            </div>
                             <p><strong>Auth Providers:</strong> {(allPlanningSteps.providers || []).join(', ')}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="data-model" className="mt-6">
                    <DataModelTab wizardData={wizardData.data_modeling} />
                </TabsContent>
                <TabsContent value="ux" className="mt-6">
                    <InterfaceUXTab wizardData={wizardData.interface_ux} />
                </TabsContent>
                <TabsContent value="features" className="mt-6">
                    <FeaturesTab wizardData={wizardData.functionalities} />
                </TabsContent>
                <TabsContent value="tech" className="mt-6">
                    <TechReqsTab wizardData={{...wizardData.tech_reqs, ...wizardData.deploy}} />
                </TabsContent>
                 <TabsContent value="bom" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Materiais do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[60vh] rounded-md border border-card-border bg-background p-4">
                                <pre className="text-sm whitespace-pre-wrap font-sans">
                                    {wizardData.billOfMaterials || 'Lista de materiais não encontrada.'}
                                </pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="generation" className="mt-6">
                    <CodeArtifactsTab wizardData={wizardData} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PlanSummaryView;