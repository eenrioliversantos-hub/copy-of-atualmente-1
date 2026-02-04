import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import Icon from '../shared/Icon';
import { Client } from './OperatorClientsPage';

interface ClientFormProps {
    initialData: Client | null;
    onSave: (clientData: Client) => void;
    onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Client>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Default values for a new client
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                status: 'prospect',
                tags: [],
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof Client, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Client);
    };

    const isEditing = !!initialData;

    return (
        <div className="space-y-8 animate-in fade-in-50">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h1>
                    <p className="text-text-secondary">{isEditing ? `Editando o perfil de ${initialData?.name}` : 'Preencha os dados para criar um novo cliente'}</p>
                </div>
                <Button variant="ghost" onClick={onCancel} className="gap-2">
                    <Icon name="x" className="h-4 w-4" />
                    Cancelar
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Empresa</Label>
                                <Input id="company" value={formData.company || ''} onChange={(e) => handleChange('company', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Detalhes Adicionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="prospect">Prospect</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                                <Input id="tags" value={(formData.tags || []).join(', ')} onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end mt-8">
                     <Button type="submit" className="gap-2">
                        <Icon name="checkCircle" className="h-4 w-4" />
                        Salvar Cliente
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ClientForm;