import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';

interface DataStateArchitectureToolProps {
    data: any;
    setData: (data: any) => void;
}

const DataStateArchitectureTool: React.FC<DataStateArchitectureToolProps> = ({ data, setData }) => {
    const handleChange = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* 3.1. Armazenamento e Volume */}
            <Card>
                <CardHeader>
                    <CardTitle>3.1. Armazenamento e Volume (Dados de Estrutura)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo de Banco de Dados Sugerido</Label>
                            <Select value={data.dbType} onValueChange={(v) => handleChange('dbType', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PostgreSQL">SQL (PostgreSQL)</SelectItem>
                                    <SelectItem value="MySQL">SQL (MySQL)</SelectItem>
                                    <SelectItem value="MongoDB">NoSQL (MongoDB)</SelectItem>
                                    <SelectItem value="Firestore/DynamoDB">NoSQL (Firestore/DynamoDB)</SelectItem>
                                    <SelectItem value="Misto">Misto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Crescimento Anual Estimado (%)</Label>
                            <Input type="number" value={data.growthEstimate || ''} onChange={(e) => handleChange('growthEstimate', e.target.value)} placeholder="25" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Justificativa da Escolha do Banco de Dados</Label>
                        <Textarea value={data.dbJustification || ''} onChange={(e) => handleChange('dbJustification', e.target.value)} placeholder="Ex: PostgreSQL pela robustez e suporte a JSONB..." />
                    </div>
                </CardContent>
            </Card>

            {/* 3.2. Gerenciamento de Estado e Cache */}
            <Card>
                <CardHeader>
                    <CardTitle>3.2. Gerenciamento de Estado e Cache</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Gerenciamento de Estado (Frontend)</Label>
                            <Input value={data.frontendState || ''} onChange={(e) => handleChange('frontendState', e.target.value)} placeholder="Ex: Redux, Zustand, React Context..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Estratégia de Cache (Backend/DB)</Label>
                            <Input value={data.cacheStrategy || ''} onChange={(e) => handleChange('cacheStrategy', e.target.value)} placeholder="Ex: Redis, TTL 60s, Cache-Aside" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Requisitos de Processamento Assíncrono/Filas</Label>
                        <Textarea value={data.asyncProcessing || ''} onChange={(e) => handleChange('asyncProcessing', e.target.value)} placeholder="Ex: Geração de relatórios e envio de emails..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Comunicação entre Microsserviços/Eventos</Label>
                        <Input value={data.microserviceComms || ''} onChange={(e) => handleChange('microserviceComms', e.target.value)} placeholder="Ex: Mensageria (Kafka/SNS), Event Sourcing..." />
                    </div>
                </CardContent>
            </Card>

            {/* 3.3. Arquitetura e Integrações */}
            <Card>
                <CardHeader>
                    <CardTitle>3.3. Arquitetura e Integrações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Estilo Arquitetural Preferido</Label>
                            <Select value={data.architectureStyle} onValueChange={(v) => handleChange('architectureStyle', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Microserviços">Microsserviços</SelectItem>
                                    <SelectItem value="Monolítico">Monolítico</SelectItem>
                                    <SelectItem value="Monolítico Modular">Monolítico Modular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Requisito de Escalabilidade</Label>
                            <Select value={data.scalabilityReq} onValueChange={(v) => handleChange('scalabilityReq', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baixo">Baixo (Até 100 usuários)</SelectItem>
                                    <SelectItem value="Médio">Médio (Milhares de usuários)</SelectItem>
                                    <SelectItem value="Alto">Alto (Milhões de usuários)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>APIs Externas Necessárias (Separadas por vírgula)</Label>
                        <Input value={data.externalApis || ''} onChange={(e) => handleChange('externalApis', e.target.value)} placeholder="Ex: Stripe (Pagamentos), Mailchimp (Email)..." />
                    </div>
                </CardContent>
            </Card>

             {/* 3.4. Gerenciamento de Documentos e Ativos */}
            <Card>
                <CardHeader>
                    <CardTitle>3.4. Gerenciamento de Documentos e Dados de Negócio (Ativos)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipos de Documentos/Arquivos Críticos</Label>
                        <Input value={data.criticalDocs || ''} onChange={(e) => handleChange('criticalDocs', e.target.value)} placeholder="Ex: Faturas, Contratos PDF, Imagens de Produtos..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Estratégia de Armazenamento de Arquivos</Label>
                        <Select value={data.fileStorageStrategy} onValueChange={(v) => handleChange('fileStorageStrategy', v)}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Blob Storage">Blob Storage (S3, GCS, Azure Blob)</SelectItem>
                                <SelectItem value="Database">Database (Base64/Binary)</SelectItem>
                                <SelectItem value="File System">Local/Rede File System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Política de Retenção de Dados (Tempo de vida)</Label>
                        <Input value={data.retentionPolicy || ''} onChange={(e) => handleChange('retentionPolicy', e.target.value)} placeholder="Ex: Faturas retidas por 5 anos (Legal)..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Requisitos de Auditoria/Compliance (Exigências Legais)</Label>
                        <Input value={data.complianceReqs || ''} onChange={(e) => handleChange('complianceReqs', e.target.value)} placeholder="Ex: GDPR/LGPD (anonimização), PCI-DSS..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Requisitos de Versionamento e Imutabilidade</Label>
                        <Textarea value={data.versioningReqs || ''} onChange={(e) => handleChange('versioningReqs', e.target.value)} placeholder="Ex: Contratos devem ter versionamento completo (imutável)..." />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DataStateArchitectureTool;
