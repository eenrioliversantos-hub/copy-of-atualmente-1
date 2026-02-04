import React, { useState } from 'react';
import { Project } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import OverviewDashboard from './OverviewDashboard';
import CIPipelinePage from './CIPipelinePage';
import CDPipelinePage from './CDPipelinePage';
import EnvironmentsPage from './EnvironmentsPage';
import SecurityQualityPage from './SecurityQualityPage';
import VersionControlPage from './VersionControlPage';


interface ProductionPageProps {
    project: Project;
    onBack: () => void;
    onPrepareDelivery: () => void;
}

const ProductionPage: React.FC<ProductionPageProps> = ({ project, onBack, onPrepareDelivery }) => {
    const [activeTab, setActiveTab] = useState('overview');
    
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar ao Hub do Projeto
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-text-primary">Torre de Controle: {project.name}</h1>
                        <p className="text-sm text-text-secondary">Monitoramento da esteira de produção e saúde da aplicação.</p>
                    </div>
                </div>
                <Button onClick={onPrepareDelivery}>
                    <Icon name="package" className="h-4 w-4 mr-2" />
                    Preparar Entrega
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="ci_pipeline">Pipeline CI</TabsTrigger>
                        <TabsTrigger value="cd_pipeline">Pipeline CD</TabsTrigger>
                        <TabsTrigger value="environments">Ambientes</TabsTrigger>
                        <TabsTrigger value="quality">Qualidade & Segurança</TabsTrigger>
                        <TabsTrigger value="version_control">Controle de Versão</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-6">
                        <TabsContent value="overview">
                            <OverviewDashboard />
                        </TabsContent>
                        <TabsContent value="ci_pipeline">
                           <CIPipelinePage />
                        </TabsContent>
                         <TabsContent value="cd_pipeline">
                           <CDPipelinePage />
                        </TabsContent>
                         <TabsContent value="environments">
                           <EnvironmentsPage />
                        </TabsContent>
                         <TabsContent value="quality">
                           <SecurityQualityPage />
                        </TabsContent>
                         <TabsContent value="version_control">
                           <VersionControlPage />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
};

export default ProductionPage;