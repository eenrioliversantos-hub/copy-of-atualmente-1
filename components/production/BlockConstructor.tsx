import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

const blockPalette = [
    { category: 'Entrada/Saída', icon: 'gitCommit', items: [{ name: 'Início', type: 'start' }, { name: 'Fim', type: 'end' }, { name: 'Webhook', type: 'webhook' }] },
    { category: 'Lógica', icon: 'cog', items: [{ name: 'Condicional (If)', type: 'if' }, { name: 'Loop (For)', type: 'for' }, { name: 'Script Custom', type: 'script' }] },
    { category: 'Dados', icon: 'database', items: [{ name: 'Ler do DB', type: 'db_read' }, { name: 'Escrever no DB', type: 'db_write' }, { name: 'Transformar Dados', type: 'transform' }] },
    { category: 'APIs', icon: 'globe', items: [{ name: 'Chamada API REST', type: 'api_call' }, { name: 'Publicar Evento', type: 'publish_event' }] },
];

const canvasBlocks = [
    { id: 'b1', name: 'Início', type: 'start', x: 50, y: 150 },
    { id: 'b2', name: 'Valida Input', type: 'script', x: 250, y: 50 },
    { id: 'b3', name: 'Lê Usuário DB', type: 'db_read', x: 450, y: 150 },
    { id: 'b4', name: 'Gera JWT', type: 'script', x: 650, y: 250 },
    { id: 'b5', name: 'Fim', type: 'end', x: 850, y: 150 },
];


const BlockConstructor: React.FC = () => {
    const [selectedBlockId, setSelectedBlockId] = useState('b3');
    const selectedBlock = canvasBlocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-background text-text-primary mt-6">
        <div className="flex items-center justify-between gap-2 mb-4">
            <div>
                <h2 className="text-xl font-semibold">Construtor de Blocos</h2>
                <p className="text-sm text-text-secondary">Arraste, conecte e configure blocos para criar fluxos.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Icon name="save" className="h-4 w-4 mr-2" />Salvar Bloco</Button>
                <Button size="sm"><Icon name="play" className="h-4 w-4 mr-2" />Executar Teste</Button>
            </div>
        </div>
        <div className="flex-1 flex overflow-hidden border border-card-border rounded-lg">
            {/* Palette */}
            <aside className="w-64 bg-sidebar p-4 border-r border-card-border overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Paleta de Blocos</h2>
                {blockPalette.map(category => (
                    <div key={category.category} className="mb-4">
                        <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                           <Icon name={category.icon} className="h-4 w-4" /> {category.category}
                        </h3>
                        <div className="space-y-2">
                            {category.items.map(item => (
                                <div key={item.type} className="p-2 border border-card-border rounded-md bg-background cursor-grab text-sm hover:border-accent">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </aside>

            {/* Canvas */}
            <main className="flex-1 bg-slate-900/50 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)' , backgroundSize: '20px 20px' }}>
                {/* Connections (SVG lines - simplified) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="150" y1="190" x2="250" y2="90" stroke="#475569" strokeWidth="2" />
                    <line x1="350" y1="90" x2="450" y2="190" stroke="#475569" strokeWidth="2" />
                    <line x1="550" y1="190" x2="650" y2="290" stroke="#475569" strokeWidth="2" />
                    <line x1="750" y1="290" x2="850" y2="190" stroke="#475569" strokeWidth="2" />
                </svg>

                {/* Blocks */}
                {canvasBlocks.map(block => (
                    <div 
                        key={block.id}
                        className={`absolute w-40 p-3 bg-card border rounded-lg shadow-lg cursor-pointer transition-all ${selectedBlockId === block.id ? 'border-accent ring-2 ring-accent' : 'border-card-border'}`}
                        style={{ left: block.x, top: block.y }}
                        onClick={() => setSelectedBlockId(block.id)}
                    >
                        <p className="font-semibold text-sm">{block.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">{block.type}</Badge>
                    </div>
                ))}

            </main>

            {/* Properties Panel */}
            <aside className="w-80 bg-sidebar p-4 border-l border-card-border overflow-y-auto">
                 <h2 className="text-lg font-semibold mb-4">Propriedades</h2>
                 {selectedBlock ? (
                     <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{selectedBlock.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="block-name">Nome</Label>
                                    <Input id="block-name" defaultValue={selectedBlock.name} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="block-type">Tipo</Label>
                                    <Input id="block-type" value={selectedBlock.type} disabled />
                                </div>
                            </CardContent>
                        </Card>
                         {selectedBlock.type === 'db_read' && (
                             <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-base">Configuração da Query</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                     <div className="space-y-1">
                                        <Label>Tabela</Label>
                                        <Select defaultValue="users">
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="users">users</SelectItem>
                                                <SelectItem value="products">products</SelectItem>
                                                <SelectItem value="orders">orders</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Condição (WHERE)</Label>
                                        <Input placeholder="email = ?" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Campos (SELECT)</Label>
                                        <Input placeholder="id, name, email" />
                                    </div>
                                </CardContent>
                            </Card>
                         )}
                     </div>
                 ) : (
                    <div className="text-center text-text-secondary pt-16">
                        <Icon name="mousePointer" className="h-8 w-8 mx-auto mb-2" />
                        <p>Selecione um bloco para ver suas propriedades.</p>
                    </div>
                 )}
            </aside>
        </div>
    </div>
  );
};

export default BlockConstructor;