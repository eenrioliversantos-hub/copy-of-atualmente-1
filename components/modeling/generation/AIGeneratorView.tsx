

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import CodeBlock from '../../shared/CodeBlock';
import { Entity } from '../steps/Step8Entities';
import ERDiagram from '../er-diagram/ERDiagram';
// FIX: Import Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';

interface AIGeneratorViewProps {
    artifacts: any;
    entities: Entity[];
    relationships: any[];
    onSaveToDPO: () => void;
    onBack: () => void;
}

const AIGeneratorView: React.FC<AIGeneratorViewProps> = ({ artifacts, entities, relationships, onSaveToDPO, onBack }) => {
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('code');

    const fileTree: FileTreeItem[] = useMemo(() => {
        if (!artifacts?.files) return [];
        return Object.entries(artifacts.files).map(([name, content]: [string, any]) => ({
            name,
            type: 'file',
            content: content,
            language: name.endsWith('.sql') ? 'sql' : 'markdown'
        }));
    }, [artifacts]);

    const handleFileClick = (file: FileTreeItem) => {
        setSelectedFile(file);
    };
    
    const handleExport = () => {
        alert("Função de exportação (ZIP) em desenvolvimento.");
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Resultados da Geração por IA</CardTitle>
                            <CardDescription>Explore os artefatos gerados, visualize o diagrama e exporte os arquivos.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(p => !p)}>
                                <Icon name="layout" className="h-4 w-4 mr-2" />
                                {isSidebarOpen ? 'Fechar Painel' : 'Abrir Painel'}
                            </Button>
                             <Button variant="outline" onClick={onBack}><Icon name="arrowLeft" className="h-4 w-4 mr-2" />Voltar ao Editor</Button>
                             <Button variant="outline" onClick={onSaveToDPO}><Icon name="save" className="h-4 w-4 mr-2" />Salvar no DPO</Button>
                             <Button onClick={handleExport}><Icon name="download" className="h-4 w-4 mr-2" />Exportar como ZIP</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-sidebar/50 rounded-lg">
                        <p className="text-sm text-text-secondary">Complexidade Estimada</p>
                        <p className="font-semibold text-lg text-accent">{artifacts.analysis.complexity}</p>
                    </div>
                    <div className="p-4 bg-sidebar/50 rounded-lg">
                        <p className="text-sm text-text-secondary">Tempo de Implementação (Backend)</p>
                        <p className="font-semibold text-lg text-accent">{artifacts.analysis.estimatedTime}</p>
                    </div>
                </CardContent>
            </Card>

            <div className={`grid grid-cols-1 ${isSidebarOpen ? 'lg:grid-cols-4' : ''} gap-6`}>
                {isSidebarOpen && (
                    <div className="lg:col-span-1 animate-in slide-in-from-left-12 duration-300">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {activeTab === 'code' ? 'Explorador de Arquivos' : 'Entidades do Diagrama'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activeTab === 'code' ? (
                                    <FileExplorer items={fileTree} onFileClick={handleFileClick} activeFile={selectedFile} />
                                ) : (
                                    <div className="space-y-1">
                                        {(entities || []).map(entity => (
                                            <button key={entity.id} className="w-full text-left text-sm p-2 rounded-md hover:bg-sidebar/50 flex items-center gap-2">
                                                <Icon name="database" className="h-4 w-4 text-accent flex-shrink-0" />
                                                <span>{entity.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
                <div className={isSidebarOpen ? 'lg:col-span-3' : 'col-span-1'}>
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="code">Visualizador de Código</TabsTrigger>
                            <TabsTrigger value="diagram">Diagrama ER</TabsTrigger>
                        </TabsList>
                        <TabsContent value="code" className="mt-4">
                            <Card className="h-[600px] flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-base">{selectedFile?.name || "Selecione um arquivo"}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto bg-slate-900 rounded-b-lg">
                                    {selectedFile?.content ? (
                                        <CodeBlock code={selectedFile.content} language={selectedFile.language || 'text'} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-text-secondary">
                                            <p>Selecione um arquivo no painel à esquerda para ver o conteúdo.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="diagram" className="mt-4">
                             <ERDiagram entities={entities} relationships={relationships} />
                        </TabsContent>
                     </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AIGeneratorView;