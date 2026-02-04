
"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import Icon from "../shared/Icon"
import Step19Notifications from "../modeling/steps/Step19Notifications"
import Step20SearchAndFilters from "../modeling/steps/Step20SearchAndFilters"
import Step21Reports from "../modeling/steps/Step21Reports"
import Step22Analytics from "../modeling/steps/Step22Analytics"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { generateFullBackend } from '../../lib/generation/fullBackendGenerator';
import BackendArtifactsView from '../modeling/generation/BackendArtifactsView';
import Step_Webhooks from '../modeling/features/Step_Webhooks';
import Step_PaymentGateway from '../modeling/features/Step_PaymentGateway';
import Step_ThirdPartyApis from '../modeling/features/Step_ThirdPartyApis';
import FeaturePlaceholder from '../modeling/features/FeaturePlaceholder';


interface BackendDesignSystemProps {
  onBack?: () => void;
  onComplete?: (data: any, artifacts?: any) => void;
  initialData?: any;
  planningData?: any;
  entitiesData?: any;
}

export default function BackendDesignSystem({ onBack, onComplete, initialData, planningData, entitiesData }: BackendDesignSystemProps) {
  const [data, setData] = useState(initialData || { 
      step19: {}, step20: {}, step21: {}, step22: {}, 
      webhooks: {}, paymentGateways: {}, thirdPartyApis: {} 
  });
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [generatedArtifacts, setGeneratedArtifacts] = useState<any>(null);
  
  const handleDataChange = (stepKey: string, stepData: any) => {
    setData((prev: any) => ({
      ...prev,
      [stepKey]: stepData,
    }));
  };
  
  const handleGenerate = async () => {
    setGenerationState('loading');
    // Simulate generation
    await new Promise(res => setTimeout(res, 1500));
    
    const fullWizardData = {
        planning: planningData,
        data_modeling: entitiesData,
        functionalities: data,
    };

    const artifacts = generateFullBackend(fullWizardData);
    setGeneratedArtifacts(artifacts);
    setGenerationState('success');
  };

  const handleSaveAndComplete = () => {
     if (onComplete) {
      const allArtifacts = generatedArtifacts?.files || {};
      onComplete(data, { backend: allArtifacts });
    }
  };
  
  const handleBack = () => {
    if (onComplete) {
      onComplete(data, {});
    } else if (onBack) {
      onBack();
    }
  };

  if (generationState === 'success' && generatedArtifacts) {
    return (
        <BackendArtifactsView
            artifacts={generatedArtifacts}
            onBack={() => setGenerationState('idle')}
            onSave={handleSaveAndComplete}
        />
    );
  }


  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
        <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {(onBack || onComplete) && (
              <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
                <Icon name="chevronLeft" className="h-4 w-4" />
                Voltar
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-accent">
                Hub de Modelagem de Funcionalidades
              </h1>
              <p className="text-text-secondary text-sm">
                Defina os comportamentos e a inteligência da sua aplicação.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <Button onClick={() => onComplete && onComplete(data, {})}>
                <Icon name="check" className="h-4 w-4 mr-2" />
                Concluir Modelagem de Funcionalidades
              </Button>
          </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config">Configuração de Funcionalidades</TabsTrigger>
                <TabsTrigger value="generator">Gerador de Backend (IA)</TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="mt-6">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="notifications">
                    <AccordionItem value="notifications">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Notificações</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step19Notifications data={data.step19 || {}} setData={(d) => handleDataChange('step19', d)} endpoints={entitiesData?.step13?.endpoints || []} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="search">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Busca e Filtros</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step20SearchAndFilters data={data.step20 || {}} setData={(d) => handleDataChange('step20', d)} entities={entitiesData?.step8?.entities || []} screens={[]} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="reports">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Relatórios</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step21Reports data={data.step21 || {}} setData={(d) => handleDataChange('step21', d)} entities={entitiesData?.step8?.entities || []} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="analytics">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Analytics</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step22Analytics data={data.step22 || {}} setData={(d) => handleDataChange('step22', d)} entities={entitiesData?.step8?.entities || []} planningData={planningData} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="webhooks">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Webhooks</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step_Webhooks data={data.webhooks || {}} setData={(d) => handleDataChange('webhooks', d)} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="payments">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Gateways de Pagamento</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step_PaymentGateway data={data.paymentGateways || {}} setData={(d) => handleDataChange('paymentGateways', d)} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="third-party">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">APIs de Terceiros</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><Step_ThirdPartyApis data={data.thirdPartyApis || {}} setData={(d) => handleDataChange('thirdPartyApis', d)} /></div></AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="jobs">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Jobs em Background</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4">
                                <FeaturePlaceholder title="Background Jobs / Filas" description="Defina tarefas que rodam em segundo plano (ex: processamento de vídeos, envio de emails em massa)." icon="cog" />
                            </div></AccordionContent>
                        </Card>
                    </AccordionItem>
                     <AccordionItem value="caching">
                        <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Estratégias de Cache</CardTitle></AccordionTrigger>
                            <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4">
                                <FeaturePlaceholder title="Caching" description="Configure estratégias de cache (ex: Redis) para otimizar a performance de queries frequentes." icon="rocket" />
                            </div></AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
             <TabsContent value="generator" className="mt-6">
                <Card className="text-center max-w-2xl mx-auto">
                    <CardHeader>
                        <Icon name="sparkles" className="h-12 w-12 text-accent mx-auto" />
                        <CardTitle className="text-2xl">Gerador de Backend com IA</CardTitle>
                        <CardDescription>A IA irá analisar as funcionalidades configuradas e o modelo de dados para gerar a estrutura de arquivos e o código inicial para o seu backend.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" onClick={handleGenerate} disabled={generationState === 'loading'}>
                            {generationState === 'loading' ? (
                                <><Icon name="spinner" className="h-5 w-5 mr-2 animate-spin" /> Gerando...</>
                            ) : (
                                <><Icon name="play" className="h-5 w-5 mr-2" /> Analisar e Gerar Backend Completo</>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
