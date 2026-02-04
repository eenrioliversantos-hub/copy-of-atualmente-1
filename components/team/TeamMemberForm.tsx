import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import Icon from '../shared/Icon';
import { TeamMember } from './OperatorTeamPage';

interface TeamMemberFormProps {
    initialData: TeamMember | null;
    onSave: (memberData: TeamMember) => void;
    onCancel: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TeamMember>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                role: 'Frontend',
                email: '',
                status: 'active',
                skills: [],
                hourlyRate: 0,
                projectsAssigned: 0,
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof TeamMember, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as TeamMember);
    };

    const isEditing = !!initialData;

    const roles: TeamMember['role'][] = ['Frontend', 'Backend', 'Fullstack', 'Designer', 'Project Manager', 'Tech Lead'];

    return (
        <div className="space-y-8 animate-in fade-in-50">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{isEditing ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}</h1>
                    <p className="text-text-secondary">{isEditing ? `Editando o perfil de ${initialData?.name}` : 'Preencha os dados para adicionar um novo membro'}</p>
                </div>
                <Button variant="ghost" onClick={onCancel} className="gap-2">
                    <Icon name="x" className="h-4 w-4" />
                    Cancelar
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} required />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Informações Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Cargo</Label>
                                <Select value={formData.role} onValueChange={(v: TeamMember['role']) => handleChange('role', v)}>
                                    <SelectTrigger id="role"><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                    <SelectTrigger id="status"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="on_leave">Em Licença</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="hourlyRate">Custo / Hora (R$)</Label>
                                <Input id="hourlyRate" type="number" value={formData.hourlyRate || 0} onChange={(e) => handleChange('hourlyRate', Number(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
                                <Input id="skills" value={(formData.skills || []).join(', ')} onChange={(e) => handleChange('skills', e.target.value.split(',').map(t => t.trim()))} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end mt-8">
                     <Button type="submit" className="gap-2">
                        <Icon name="checkCircle" className="h-4 w-4" />
                        Salvar Membro
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TeamMemberForm;
