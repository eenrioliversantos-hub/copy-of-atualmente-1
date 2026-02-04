
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import CodeBlock from '../../shared/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';

interface ApiArtifactsViewProps {
    artifacts: any;
    onSave: () => void;
    onBack: () => void;
}

const SimpleMermaidRenderer: React.FC<{ mermaidCode: string }> = ({ mermaidCode }) => {
    const { nodes, edges, type } = useMemo(() => {
        if (!mermaidCode) return { nodes: [], edges: [], type: null };

        const cleanCode = mermaidCode.replace(/```mermaid|```/g, '').trim();
        const lines = cleanCode.split('\n').map(line => line.trim());
        const diagramType = lines[0];

        if (diagramType === 'sequenceDiagram') {
            const participants = lines.filter(l => l.startsWith('participant')).map(l => l.replace('participant ', '').trim());
            const sequenceEdges = lines.filter(l => l.includes('->>')).map((l, i) => {
                const match = l.match(/(\w+)->>\+?(\w+): (.*)/);
                if (!match) return null;
                return { id: `seq-${i}`, from: match[1], to: match[2], label: match[3] };
            }).filter(Boolean);
            return { nodes: participants.map(p => ({ id: p, label: p })), edges: sequenceEdges, type: 'sequence' };
        }

        if (diagramType === 'graph TD') {
            const parsedNodes = new Map<string, { id: string, label: string }>();
            const parsedEdges: { from: string, to: string }[] = [];
            lines.forEach(line => {
                const edgeMatch = line.match(/(\w+)\s*-->\s*(\w+)/);
                if (edgeMatch) {
                    const [, from, to] = edgeMatch;
                    if (!parsedNodes.has(from)) parsedNodes.set(from, { id: from, label: from });
                    if (!parsedNodes.has(to)) parsedNodes.set(to, { id: to, label: to });
                    parsedEdges.push({ from, to });
                }
            });
             return { nodes: Array.from(parsedNodes.values()), edges: parsedEdges, type: 'graph' };
        }
        
        return { nodes: [], edges: [], type: null };

    }, [mermaidCode]);

    if (type === 'sequence') {
        const nodeWidth = 120, xSpacing = 160;
        return (
             <div className="h-[50vh] w-full overflow-auto diagram-bg rounded-lg border border-card-border p-8">
                <svg width={nodes.length * xSpacing} height="400">
                    {nodes.map((node, i) => (
                        <g key={node.id}>
                            <rect x={i * xSpacing} y="20" width={nodeWidth} height="40" rx="5" fill="#1e293b" stroke="#334155" />
                            <text x={i * xSpacing + nodeWidth/2} y="40" textAnchor="middle" fill="#f8fafc" fontSize="12">{node.label}</text>
                            <line x1={i * xSpacing + nodeWidth/2} y1="60" x2={i * xSpacing + nodeWidth/2} y2="380" stroke="#475569" strokeDasharray="4 4" />
                        </g>
                    ))}
                    {edges.map((edge: any, i) => {
                         const fromIndex = nodes.findIndex(n => n.id === edge.from);
                         const toIndex = nodes.findIndex(n => n.id === edge.to);
                         const y = 90 + i * 40;
                         return (
                            <g key={edge.id}>
                                <line x1={fromIndex * xSpacing + nodeWidth/2} y1={y} x2={toIndex * xSpacing + nodeWidth/2} y2={y} stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-backend)" />
                                <text x={(fromIndex * xSpacing + toIndex * xSpacing + nodeWidth)/2} y={y-5} textAnchor="middle" fill="#f8fafc" fontSize="10">{edge.label}</text>
                            </g>
                         );
                    })}
                </svg>
            </div>
        );
    }
    
    if (type === 'graph') {
        const nodePositions = new Map<string, { x: number, y: number }>();
        const nodeWidth = 150, nodeHeight = 50, xSpacing = 200, ySpacing = 100;
        nodes.forEach((node, index) => {
            nodePositions.set(node.id, { x: (index % 4) * xSpacing, y: Math.floor(index / 4) * ySpacing });
        });
        return (
             <div className="h-[50vh] w-full overflow-auto diagram-bg rounded-lg border border-card-border p-4">
                <svg width="800" height="600">
                    <defs><marker id="arrow-backend" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" /></marker></defs>
                    {edges.map((edge: any) => {
                         const fromPos = nodePositions.get(edge.from);
                         const toPos = nodePositions.get(edge.to);
                         if (!fromPos || !toPos) return null;
                         return <line key={edge.id} x1={fromPos.x + nodeWidth / 2} y1={fromPos.y + nodeHeight} x2={toPos.x + nodeWidth / 2} y2={toPos.y} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-backend)" />;
                    })}
                    {nodes.map(node => {
                        const pos = nodePositions.get(node.id)!;
                        return (
                            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                <rect width={nodeWidth} height={nodeHeight} rx="5" fill="#1e293b" stroke="#334155" />
                                <text x="75" y="25" dy=".3em" textAnchor="middle" fill="#f8fafc" fontSize="12" className="font-sans">{node.label}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    }

    return (
        <div className="h-[50vh] flex items-center justify-center text-text-secondary text-sm italic">
            A visualização para este tipo de diagrama não é suportada. Veja a aba "Código".
        </div>
    );
};


const ApiArtifactsView: React.FC<ApiArtifactsViewProps> = ({ artifacts, onSave, onBack }) => {
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
                            <CardTitle className="text-2xl">Artefatos da API Gerados</CardTitle>
                            <CardDescription>Explore os arquivos de backend e diagramas gerados pela IA.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" onClick={onBack}><Icon name="arrowLeft" className="h-4 w-4 mr-2" />Voltar</Button>
                             <Button onClick={onSave}><Icon name="save" className="h-4 w-4 mr-2" />Salvar e Concluir</Button>
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
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                        <Card className="lg:col-span-1 h-full">
                            <CardHeader><CardTitle className="text-lg">Estrutura de Arquivos</CardTitle></CardHeader>
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

export default ApiArtifactsView;
