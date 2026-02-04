
import React, { useState, useMemo } from 'react';
import { Project, ProjectAsset, ProjectArtifacts, Invoice, Contract } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import FileUploadDialog from './FileUploadDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogCloseButton } from '../../ui/Dialog';
import CodeBlock from '../../shared/CodeBlock';
import { ScrollArea } from '../../ui/ScrollArea';
import { Badge } from '../../ui/Badge';
import { compileProjectArtifacts } from '../../../lib/projectCompiler'; // IMPORT COMPILER
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import { generateBillOfMaterials } from '../../../lib/generation/billOfMaterialsGenerator'; // Ensure BOM generator is used

interface ProjectFilesTabProps {
    project: Project;
    userType: 'operator' | 'client';
    onFileUpload: (projectId: string, file: File, description: string) => void;
    artifacts?: ProjectArtifacts;
    invoices: Invoice[];
    contracts: Contract[];
    setCurrentView: (view: string, context?: any) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getFileIcon = (fileName?: string) => {
    if (!fileName) return 'file-text';
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return 'file-text';
        case 'jpg': case 'jpeg': case 'png': case 'svg': return 'layout';
        case 'zip': case 'rar': return 'package';
        case 'sql': case 'prisma': return 'database';
        case 'ts': case 'js': return 'code';
        case 'md': return 'bookOpen';
        default: return 'file-text';
    }
}

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': case 'signed': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">{status === 'paid' ? 'Paga' : 'Assinado'}</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'overdue': return <Badge variant="destructive">Atrasada</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}


const ProjectFilesTab: React.FC<ProjectFilesTabProps> = ({ project, userType, onFileUpload, artifacts, invoices, contracts, setCurrentView }) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);

    const submittedAssets = useMemo(() => project.assets.filter(a => a.status === 'submitted'), [project.assets]);

    // Use centralized compiler to generate file tree from wizard data
    const fileTree = useMemo(() => {
        return compileProjectArtifacts(artifacts?.wizardData);
    }, [artifacts?.wizardData]);

    // Generate BOM dynamically if not present in static artifacts
    const billOfMaterials = useMemo(() => {
        if (artifacts?.billOfMaterials) return artifacts.billOfMaterials;
        if (artifacts?.wizardData) return generateBillOfMaterials(artifacts.wizardData);
        return null;
    }, [artifacts]);

    const handleUpload = (file: File, description: string) => {
        onFileUpload(project.id, file, description);
        setIsUploadDialogOpen(false);
    };

    const handleViewArtifact = (file: FileTreeItem) => {
        if (file.type === 'file' && file.content) {
            setSelectedFile(file);
        }
    };

    const handleDownloadArtifact = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <FileUploadDialog 
                open={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleUpload}
            />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Central de Ativos do Projeto</CardTitle>
                        <Button onClick={() => setIsUploadDialogOpen(true)}>
                            <Icon name="upload" className="h-4 w-4 mr-2" /> Fazer Upload
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="client-files" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="client-files">Arquivos do Cliente</TabsTrigger>
                            <TabsTrigger value="artifacts">Todos os Artefatos</TabsTrigger>
                            <TabsTrigger value="bom">Lista de Materiais</TabsTrigger>
                            <TabsTrigger value="documents">Documentos</TabsTrigger>
                            <TabsTrigger value="financial">Financeiro</TabsTrigger>
                        </TabsList>

                        <TabsContent value="client-files" className="mt-4">
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Enviado por</TableHead><TableHead>Data</TableHead><TableHead>Tamanho</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {submittedAssets.length > 0 ? submittedAssets.map(asset => (
                                            <TableRow key={asset.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Icon name={getFileIcon(asset.fileName)} className="h-5 w-5 text-accent"/>
                                                        <div><p>{asset.fileName || asset.label}</p><p className="text-xs text-text-secondary">{asset.label}</p></div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{asset.submittedBy}</TableCell>
                                                <TableCell>{asset.submittedAt ? new Date(asset.submittedAt).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell>{asset.size ? formatBytes(asset.size) : '-'}</TableCell>
                                                <TableCell className="text-right"><Button variant="ghost" size="sm"><Icon name="download" className="h-4 w-4" /></Button></TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum arquivo enviado.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="artifacts" className="mt-4">
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                                <Card className="lg:col-span-1 h-full">
                                    <CardHeader><CardTitle className="text-lg">Explorador de Arquivos</CardTitle></CardHeader>
                                    <CardContent><FileExplorer items={fileTree} onFileClick={handleViewArtifact} activeFile={selectedFile} /></CardContent>
                                </Card>
                                <Card className="lg:col-span-2 h-full flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base">{selectedFile?.name || "Selecione um arquivo"}</CardTitle>
                                            {selectedFile && <Button variant="outline" size="sm" onClick={() => handleDownloadArtifact(selectedFile.name, selectedFile.content || '')}><Icon name="download" className="h-4 w-4 mr-2" /> Download</Button>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-auto bg-slate-900 rounded-b-lg p-0">
                                        {selectedFile?.content ? (
                                            <CodeBlock code={selectedFile.content} language={selectedFile.language || 'text'} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-text-secondary">
                                                <p>Selecione um arquivo para ver o conteúdo.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="bom" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lista de Materiais do Projeto</CardTitle>
                                    <CardDescription>Um resumo de todos os componentes, tecnologias e artefatos que compõem este projeto.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {billOfMaterials ? (
                                        <ScrollArea className="h-[60vh] rounded-md border border-card-border bg-background p-4">
                                            <pre className="text-sm whitespace-pre-wrap font-sans">{billOfMaterials}</pre>
                                        </ScrollArea>
                                    ) : (
                                        <p className="text-center text-text-secondary py-8">A Lista de Materiais será gerada após a conclusão da modelagem.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeader><CardTitle>Documentação do Projeto</CardTitle></CardHeader>
                                <CardContent>
                                    {artifacts?.developmentPlan ? (
                                        <div className="p-4 bg-sidebar rounded-md border border-card-border flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon name="file-text" className="h-6 w-6 text-accent" />
                                                <div>
                                                    <h3 className="font-semibold">Plano de Desenvolvimento</h3>
                                                    <p className="text-sm text-text-secondary">Guia completo para a construção do projeto.</p>
                                                </div>
                                            </div>
                                            <Button onClick={() => setCurrentView('development_plan_tool', { projectId: project.id })}>
                                                <Icon name="eye" className="h-4 w-4 mr-2" />
                                                Revisar Plano
                                            </Button>
                                        </div>
                                    ) : <p className="text-sm text-center text-text-secondary py-8">Plano de desenvolvimento não encontrado.</p>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="financial" className="mt-4 space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Contratos</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Contrato</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {contracts.map(contract => (
                                                <TableRow key={contract.id}>
                                                    <TableCell className="font-medium">{contract.title}</TableCell>
                                                    <TableCell>R$ {contract.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" onClick={() => setCurrentView(userType === 'operator' ? 'operator_contract_detail' : 'contract_detail', { contractId: contract.id })}>
                                                            Ver Detalhes
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Faturas</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Fatura</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {invoices.map(invoice => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" onClick={() => setCurrentView('invoice_detail', { invoiceId: invoice.id })}>
                                                            Ver Detalhes
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectFilesTab;
