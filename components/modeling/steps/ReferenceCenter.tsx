import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';

// Types for references
type ReferenceType = 'link' | 'text' | 'file' | 'image';
interface ReferenceItem {
    id: string;
    type: ReferenceType;
    value: string; // URL for link, content for text, file name for file/image
    description: string;
}
type ReferenceCategory = 'visual' | 'functional' | 'behavioral';
export interface ReferenceData {
    visual?: ReferenceItem[];
    functional?: ReferenceItem[];
    behavioral?: ReferenceItem[];
}

interface ReferenceCenterProps {
    data: ReferenceData;
    onChange: (data: ReferenceData) => void;
}

const AddReferenceForm: React.FC<{ onAdd: (item: Omit<ReferenceItem, 'id'>) => void; onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [type, setType] = useState<ReferenceType>('link');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!value || !description) return;
        onAdd({ type, value, description });
    };

    return (
        <div className="p-3 bg-background border border-card-border rounded-md space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={type} onValueChange={(v) => setType(v as ReferenceType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="image">Imagem</SelectItem>
                            <SelectItem value="file">Arquivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs">Descrição</Label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Logo principal" />
                </div>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">{type === 'link' ? 'URL' : 'Conteúdo/Nome do Arquivo'}</Label>
                {type === 'text' ? (
                     <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Cole o texto aqui..." rows={3}/>
                ) : type === 'file' || type === 'image' ? (
                    <Input type="file" onChange={(e) => setValue(e.target.files?.[0]?.name || '')} />
                ) : (
                    <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://exemplo.com" />
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
                <Button size="sm" onClick={handleSubmit}>Adicionar</Button>
            </div>
        </div>
    );
};


const ReferenceCenter: React.FC<ReferenceCenterProps> = ({ data, onChange }) => {
    const [addingTo, setAddingTo] = useState<ReferenceCategory | null>(null);

    const handleAddReference = (category: ReferenceCategory, item: Omit<ReferenceItem, 'id'>) => {
        const newItem = { ...item, id: Date.now().toString() };
        const updatedCategory = [...(data[category] || []), newItem];
        onChange({ ...data, [category]: updatedCategory });
        setAddingTo(null);
    };

    const handleRemoveReference = (category: ReferenceCategory, id: string) => {
        const updatedCategory = (data[category] || []).filter(item => item.id !== id);
        onChange({ ...data, [category]: updatedCategory });
    };

    const renderCategory = (category: ReferenceCategory, title: string, icon: string) => {
        const items = data[category] || [];
        return (
            <Card className="bg-sidebar/50">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Icon name={icon} className="h-5 w-5 text-accent" />
                            {title}
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setAddingTo(category)}>
                            <Icon name="plus" className="h-4 w-4 mr-2" /> Adicionar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {addingTo === category && (
                        <AddReferenceForm
                            onAdd={(item) => handleAddReference(category, item)}
                            onCancel={() => setAddingTo(null)}
                        />
                    )}
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.id} className="p-2 flex items-start justify-between bg-background border border-card-border rounded-md">
                                <div className="flex items-start gap-2 overflow-hidden">
                                    <Icon name={item.type === 'link' ? 'link2' : item.type === 'text' ? 'file-text' : 'file-code'} className="h-4 w-4 text-text-secondary mt-1 flex-shrink-0"/>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{item.description}</p>
                                        <p className="text-xs text-text-secondary truncate">{item.value}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveReference(category, item.id)}>
                                    <Icon name="trash" className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        addingTo !== category && <p className="text-xs text-text-secondary text-center py-4">Nenhuma referência adicionada.</p>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon name="bookOpen" className="h-5 w-5"/>Central de Referências</CardTitle>
                <CardDescription>Colete arquivos, links, textos e imagens para guiar a IA na geração de código e conteúdo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderCategory('visual', 'Referências Visuais', 'eye')}
                    {renderCategory('functional', 'Referências Funcionais', 'cog')}
                    {renderCategory('behavioral', 'Referências Comportamentais', 'zap')}
                </div>
            </CardContent>
        </Card>
    );
};

export default ReferenceCenter;