import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Checkbox } from '../../ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import CodeBlock from '../../shared/CodeBlock';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';

// --- PROPS ---
interface DeployToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
}

// --- OPTIONS ---
const HOSTING_PROVIDERS = ["Vercel", "AWS (Amplify, ECS)", "Google Cloud (Cloud Run)", "Azure (App Service)", "Heroku", "Servidor próprio"];
const DEPLOYMENT_STRATEGIES = ["Rolling Update", "Blue/Green", "Canary"];
const CI_CD_STEPS_OPTIONS = ["Linting", "Unit Tests", "Integration Tests", "Build Application", "Containerize", "Deploy to Staging", "E2E Tests", "Deploy to Production"];
const CONTAINERIZATION_TOOLS = ["Docker"];
const ORCHESTRATION_TOOLS = ["Kubernetes (EKS, GKE)", "AWS ECS", "Docker Swarm", "Nenhum"];
const IAC_TOOLS = ["Terraform", "Pulumi", "AWS CDK", "Nenhum"];
const DATABASE_PROVIDERS = ["NeonDB", "Supabase", "AWS RDS", "MongoDB Atlas", "Local/Self-Hosted"];
const BACKUP_FREQUENCIES = ["Diário", "Semanal", "Mensal", "Sob demanda"];
const LOGGING_TOOLS = ["Vercel Logging", "Datadog", "Sentry", "New Relic", "AWS CloudWatch"];

const DeployConfig: React.FC<{ data: any; setData: (data: any) => void }> = ({ data, setData }) => {

    const handleCheckboxChange = (field: 'ciCdSteps' | 'monitoring', value: string) => {
        const currentItems = data[field] || [];
        const newItems = currentItems.includes(value) ? currentItems.filter((item: string) => item !== value) : [...currentItems, value];
        setData({ ...data, [field]: newItems });
    };

    return (
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="hosting">
            <AccordionItem value="hosting">
                <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Hospedagem e Ambientes</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="border-t border-card-border pt-4 space-y-4">
                            <div className="space-y-2"><Label>Provedor de Hospedagem Principal</Label><Select value={data.hostingProvider} onValueChange={v => setData({ ...data, hostingProvider: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{HOSTING_PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            <AccordionItem value="ci-cd">
                <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">CI/CD Pipeline</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="border-t border-card-border pt-4 space-y-4">
                            <div className="space-y-2"><Label>Estratégia de Deploy em Produção</Label><Select value={data.deploymentStrategy} onValueChange={v => setData({ ...data, deploymentStrategy: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{DEPLOYMENT_STRATEGIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Passos do Pipeline</Label><div className="grid grid-cols-2 gap-4 p-4 border border-card-border rounded-md">{CI_CD_STEPS_OPTIONS.map(step => (<div key={step} className="flex items-center space-x-2"><Checkbox id={`step-${step}`} checked={(data.ciCdSteps || []).includes(step)} onCheckedChange={() => handleCheckboxChange('ciCdSteps', step)} /><Label htmlFor={`step-${step}`} className="font-normal text-sm">{step}</Label></div>))}</div></div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            <AccordionItem value="containers">
                 <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Containerização e Orquestração</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                       <div className="border-t border-card-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2"><Label>Ferramenta de Containerização</Label><Select value={data.containerization} onValueChange={v => setData({ ...data, containerization: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{CONTAINERIZATION_TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                           <div className="space-y-2"><Label>Orquestração</Label><Select value={data.orchestration} onValueChange={v => setData({ ...data, orchestration: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{ORCHESTRATION_TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                       </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            <AccordionItem value="iac">
                 <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Infraestrutura como Código (IaC)</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                       <div className="border-t border-card-border pt-4 space-y-4">
                           <div className="space-y-2"><Label>Ferramenta de IaC</Label><Select value={data.iacTool} onValueChange={v => setData({ ...data, iacTool: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{IAC_TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                       </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            <AccordionItem value="database">
                 <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Banco de Dados e Backup</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="border-t border-card-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2"><Label>Provedor do Banco de Dados</Label><Select value={data.databaseProvider} onValueChange={v => setData({ ...data, databaseProvider: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{DATABASE_PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                           <div className="space-y-2"><Label>Frequência de Backup</Label><Select value={data.backupFrequency} onValueChange={v => setData({ ...data, backupFrequency: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{BACKUP_FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            <AccordionItem value="monitoring">
                 <Card><AccordionTrigger className="p-4"><CardTitle className="text-lg">Monitoramento e Logging</CardTitle></AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="border-t border-card-border pt-4 space-y-4">
                            <div className="space-y-2"><Label>Ferramenta de Logging/Monitoramento</Label><Select value={data.loggingTool} onValueChange={v => setData({ ...data, loggingTool: v })}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{LOGGING_TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
    );
};

const DeployTool: React.FC<DeployToolProps> = ({ initialData, onComplete, onBack }) => {
    const [data, setData] = useState(initialData || {});
    
    const deployGuideMd = useMemo(() => `
# Guia de Deploy e Infraestrutura

## 1. Hospedagem e Ambientes
- **Provedor de Hospedagem:** ${data.hostingProvider || 'Não definido'}

## 2. CI/CD Pipeline
- **Estratégia de Deploy:** ${data.deploymentStrategy || 'Não definido'}
- **Passos do Pipeline:**
${(data.ciCdSteps || []).map((step: string) => `  - [ ] ${step}`).join('\n')}

## 3. Arquitetura
- **Containerização:** ${data.containerization || 'N/A'}
- **Orquestração:** ${data.orchestration || 'N/A'}
- **Infraestrutura como Código:** ${data.iacTool || 'N/A'}

## 4. Dados e Monitoramento
- **Provedor de Banco de Dados:** ${data.databaseProvider || 'Não definido'}
- **Frequência de Backup:** ${data.backupFrequency || 'Não definido'}
- **Ferramenta de Monitoramento:** ${data.loggingTool || 'Não definido'}
    `.trim(), [data]);

    const handleGenerateAndSave = () => {
        const artifacts = {
            'DEPLOY_GUIDE.md': deployGuideMd,
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
                        <Icon name="server" className="h-6 w-6 text-accent" />
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary">Ferramenta de DevOps</h1>
                            <p className="text-sm text-text-secondary">Configure os ambientes, CI/CD e hosting.</p>
                        </div>
                    </div>
                </div>
                <Button onClick={handleGenerateAndSave}>
                    <Icon name="sparkles" className="h-4 w-4 mr-2" />
                    Gerar Guia e Salvar
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                 <Tabs defaultValue="config" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="config">Configuração</TabsTrigger>
                        <TabsTrigger value="artifacts">Artefatos</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="config">
                            <DeployConfig data={data} setData={setData} />
                        </TabsContent>
                         <TabsContent value="artifacts">
                            <CodeBlock language="markdown" code={deployGuideMd} />
                        </TabsContent>
                    </div>
                 </Tabs>
            </main>
        </div>
    );
};

export default DeployTool;