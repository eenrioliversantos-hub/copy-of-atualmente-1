import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import Step23Seo from '../steps/Step23Seo';
import Step24Performance from '../steps/Step24Performance';
import Step25Security from '../steps/Step25Security';
import Step26Tests from '../steps/Step26Tests';
import CodeBlock from '../../shared/CodeBlock';

interface TechReqsToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
    planningData?: any;
    entitiesData?: any;
}

const TechReqsTool: React.FC<TechReqsToolProps> = ({ initialData, onComplete, onBack }) => {
    const [data, setData] = useState(initialData);

    const handleDataChange = (stepKey: string, stepData: any) => {
        setData((prev: any) => ({
            ...prev,
            [stepKey]: stepData
        }));
    };
    
    const techReqsMd = useMemo(() => `
# Requisitos Técnicos

## Performance
- Lighthouse Score Mínimo (Performance): ${data.step24?.lighthouse?.performance || 'N/A'}
- Estratégias de Cache: ${(data.step24?.caching || []).join(', ') || 'N/A'}

## Segurança
- HTTPS Forçado: ${data.step25?.https ? 'Sim' : 'Não'}
- Proteções: ${(data.step25?.vulnerabilities || []).join(', ') || 'N/A'}

## Testes
- Níveis de Teste: ${(data.step26?.levels || []).join(', ') || 'N/A'}
- Cobertura de Código Mínima: ${data.step26?.coverageTarget || 'N/A'}%
    `.trim(), [data]);

    const handleGenerateAndSave = () => {
        const artifacts = {
            'tech-requirements.md': techReqsMd,
        };
        onComplete(data, artifacts);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar ao Hub
                    </Button>
                    <div className="flex items-center gap-3">
                        <Icon name="shield" className="h-6 w-6 text-accent" />
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary">Ferramenta de Requisitos Técnicos</h1>
                            <p className="text-sm text-text-secondary">Defina SEO, performance, segurança e testes.</p>
                        </div>
                    </div>
                </div>
                <Button onClick={handleGenerateAndSave}>
                    <Icon name="sparkles" className="h-4 w-4 mr-2" />
                    Gerar Artefatos e Salvar
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <Tabs defaultValue="seo" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                        <TabsTrigger value="tests">Testes</TabsTrigger>
                        <TabsTrigger value="artifacts">Artefatos</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="seo">
                            <Step23Seo data={data.step23} setData={(d) => handleDataChange('step23', d)} />
                        </TabsContent>
                        <TabsContent value="performance">
                            <Step24Performance data={data.step24} setData={(d) => handleDataChange('step24', d)} />
                        </TabsContent>
                        <TabsContent value="security">
                            <Step25Security data={data.step25} setData={(d) => handleDataChange('step25', d)} />
                        </TabsContent>
                         <TabsContent value="tests">
                            <Step26Tests data={data.step26} setData={(d) => handleDataChange('step26', d)} />
                        </TabsContent>
                        <TabsContent value="artifacts">
                            <CodeBlock language="markdown" code={techReqsMd} />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
};

export default TechReqsTool;