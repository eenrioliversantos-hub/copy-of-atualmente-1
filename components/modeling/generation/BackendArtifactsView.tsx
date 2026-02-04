

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import CodeBlock from '../../shared/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';

interface BackendArtifactsViewProps {
    artifacts: any;
    onSave: () => void;
    onBack: () => void;
}

const SimpleMermaidRenderer: React.FC<{ mermaidCode: string }> = ({ mermaidCode }) => {
    const { nodes, edges } = useMemo(() => {
        if (!mermaidCode || !mermaidCode.includes('graph TD')) {
            return { nodes: [], edges: [] };
        }

        const cleanCode = mermaidCode.replace(/```mermaid|```/g, '').trim();
        const lines = cleanCode.split('\n').map(line => line.trim());

        const parsedNodes = new Map<string, { id: string, label: string }>();
        const parsedEdges: { from: string, to: string }[] = [];

        lines.forEach(line => {
            const edgeMatch = line.match(/(\w+)\s*-->\s*(\w+)/);
            if (edgeMatch) {
                const [, from, to] = edgeMatch;
                if (!parsedNodes.has(from)) parsedNodes.set(from, { id: from, label: from });
                if (!parsedNodes.has(to)) parsedNodes.set(to, { id: to, label: to });
                parsedEdges.push({ from, to });
                return;
            }
            
            const nodeMatch = line.match(/(\w+)\["(.*)"\]/);
            if (nodeMatch) {
                const [, id, label] = nodeMatch;
                parsedNodes.set(id, { id, label });
                return;
            }
            
            const simpleNodeMatch = line.match(/^\s*([\w\d_]+)\s*$/);
            if (simpleNodeMatch && !line.includes('subgraph') && !line.includes('end') && !line.includes('graph')) {
                 const [, id] = simpleNodeMatch;
                 if (!parsedNodes.has(id)) parsedNodes.set(id, { id, label: id });
            }
        });

        if (parsedNodes.size === 0) return { nodes: [], edges: [] };
        
        const nodeArray = Array.from(parsedNodes.values());
        const positions = new Map<string, { x: number, y: number }>();
        const nodeWidth = 150, nodeHeight = 50, xSpacing = 200, ySpacing = 100;
        
        nodeArray.forEach((node, index) => {
            positions.set(node.id, { x: (index % 4) * xSpacing, y: Math.floor(index / 4) * ySpacing });
        });

        const finalNodes = nodeArray.map(node => ({ ...node, pos: positions.get(node.id)! }));
        const finalEdges = parsedEdges.map(({ from, to }) => {
            const fromPos = positions.get(from);
            const toPos = positions.get(to);
            if (!fromPos || !toPos) return null;
            return { id: `${from}-${to}`, x1: fromPos.x + nodeWidth / 2, y1: fromPos.y + nodeHeight, x2: toPos.x + nodeWidth / 2, y2: toPos.y };
        }).filter(Boolean);

        return { nodes: finalNodes, edges: finalEdges as any[] };
    }, [mermaidCode]);

    if (!mermaidCode || !mermaidCode.includes('graph TD')) {
        return (
            <div className="h-[50vh] flex items-center justify-center text-text-secondary text-sm italic">
                A visualização para este tipo de diagrama não é suportada.
            </div>
        );
    }
    
    return (
        <div className="h-[50vh] w-full overflow-auto diagram-bg rounded-lg border border-card-border p-4">
            <svg width="800" height="600">
                <defs>
                    <marker id="arrow-backend" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                </defs>
                {edges.map(edge => ( <line key={edge.id} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-backend)" /> ))}
                {nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.pos.x}, ${node.pos.y})`}>
                        <rect width="150" height="50" rx="5" fill="#1e293b" stroke="#334155" />
                        <text x="75" y="25" dy=".3em" textAnchor="middle" fill="#f8fafc" fontSize="12" className="font-sans">
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};


const BackendArtifactsView: React.FC<BackendArtifactsViewProps> = ({ artifacts, onSave, onBack }) => {
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
    const [activeTab, setActiveTab] = useState('files');

    const { fileTree, diagramFiles } = useMemo(() => {
        if (!artifacts?.files) return { fileTree: [], diagramFiles: [] };
        
        const root: FileTreeItem[] = [];
        const diagrams: { name: string; content: string }[] = [];
        const map: { [key: string]: FileTreeItem } = {};

        Object.keys(artifacts.files).forEach(path => {
            if (path.startsWith('diagrams/')) {
                diagrams.push({ name: path.split('/').pop() || path, content: artifacts.files[path] });
                return;
            }

            const parts = path.split('/');
            parts.reduce((acc, part, index) => {
                const currentPath = acc ? `${acc}/${part}` : part;
                if (!map[currentPath]) {
                    const isFile = index === parts.length - 1;
                    const newItem: FileTreeItem = {
                        name: part,
                        type: isFile ? 'file' : 'folder',
                        content: isFile ? artifacts.files[path] : undefined,
                        language: isFile ? path.split('.').pop() : undefined,
                        children: isFile ? undefined : [],
                    };
                    map[currentPath] = newItem;
                    
                    if (acc) {
                        map[acc].children!.push(newItem);
                    } else {
                        root.push(newItem);
                    }
                }
                return currentPath;
            }, '');
        });

        return { fileTree: root, diagramFiles: diagrams };
    }, [artifacts]);

    const handleFileClick = (file: FileTreeItem) => {
        if (file.type === 'file') {
            setSelectedFile(file);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Artefatos de Backend Gerados</CardTitle>
                            <CardDescription>Explore os arquivos e diagramas gerados pela IA e salve para continuar.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" onClick={onBack}><Icon name="arrowLeft" className="h-4 w-4 mr-2" />Voltar</Button>
                             <Button onClick={onSave}><Icon name="save" className="h-4 w-4 mr-2" />Salvar Artefatos</Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="files">Arquivos de Código</TabsTrigger>
                    <TabsTrigger value="diagrams">Diagramas Gerados</TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="mt-4">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
                        <Card className="lg:col-span-1 h-full">
                            <CardHeader><CardTitle className="text-lg">Explorador de Arquivos</CardTitle></CardHeader>
                            <CardContent><FileExplorer items={fileTree} onFileClick={handleFileClick} activeFile={selectedFile} /></CardContent>
                        </Card>
                        <Card className="lg:col-span-2 h-full flex flex-col">
                            <CardHeader><CardTitle className="text-base">{selectedFile?.name || "Selecione um arquivo"}</CardTitle></CardHeader>
                            <CardContent className="flex-1 overflow-auto bg-slate-900 rounded-b-lg">
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

                <TabsContent value="diagrams" className="mt-4">
                    {diagramFiles.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {diagramFiles.map(diagram => (
                                <Card key={diagram.name}>
                                    <CardHeader><CardTitle className="text-lg capitalize">{diagram.name.replace('.md', '').replace(/_/g, ' ')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <Tabs defaultValue="visual" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="visual">Visual</TabsTrigger>
                                                <TabsTrigger value="code">Código</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="visual" className="mt-4">
                                                <SimpleMermaidRenderer mermaidCode={diagram.content} />
                                            </TabsContent>
                                            <TabsContent value="code" className="mt-4">
                                                <div className="h-[50vh] overflow-auto bg-slate-900 rounded-lg">
                                                    <CodeBlock code={diagram.content} language="markdown" />
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-16 text-text-secondary">
                                <Icon name="gitBranch" className="h-8 w-8 mx-auto mb-2" />
                                <p>Nenhum diagrama foi gerado.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BackendArtifactsView;