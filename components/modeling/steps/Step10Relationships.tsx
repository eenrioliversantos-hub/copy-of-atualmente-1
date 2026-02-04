import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Entity } from './Step8Entities';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/Dialog';

interface Relationship {
    id: string;
    fromEntityId: string;
    toEntityId: string;
    type: '1:1' | '1:N' | 'N:N';
    onDelete: 'Cascade' | 'Set Null' | 'Restrict';
}

interface Step10RelationshipsProps {
  data: {
    relationships?: Relationship[];
  };
  setData: (data: any) => void;
  entities: Entity[];
}

const RELATIONSHIP_TYPES = ['1:1', '1:N', 'N:N'];
const ON_DELETE_OPTIONS = ['Cascade', 'Set Null', 'Restrict'];

const Step10Relationships: React.FC<Step10RelationshipsProps> = ({ data, setData, entities }) => {
  const relationships = data.relationships || [];
  const [relationshipToDelete, setRelationshipToDelete] = useState<string | null>(null);

  const handleAddRelationship = () => {
    const newRelationship: Relationship = {
      id: new Date().getTime().toString(),
      fromEntityId: '',
      toEntityId: '',
      type: '1:N',
      onDelete: 'Restrict',
    };
    setData({ ...data, relationships: [...relationships, newRelationship] });
  };
  
  const confirmRemoveRelationship = () => {
    if (relationshipToDelete) {
        setData({ ...data, relationships: relationships.filter(r => r.id !== relationshipToDelete) });
        setRelationshipToDelete(null);
    }
  };

  const handleChange = (id: string, property: keyof Relationship, value: any) => {
     const updatedRelationships = relationships.map(r => r.id === id ? { ...r, [property]: value } : r);
     setData({ ...data, relationships: updatedRelationships });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Entity Relationships</Label>
        <p className="text-sm text-text-secondary">Define how your entities are connected to each other.</p>
      </div>

      <div className="space-y-4">
        {relationships.map(rel => (
            <Card key={rel.id} className="bg-sidebar/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3 space-y-1.5">
                        <Label>From</Label>
                        <Select value={rel.fromEntityId} onValueChange={value => handleChange(rel.id, 'fromEntityId', value)}>
                            <SelectTrigger><SelectValue placeholder="Entity A..." /></SelectTrigger>
                            <SelectContent>{entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                        <Label>Relationship</Label>
                        <Select value={rel.type} onValueChange={value => handleChange(rel.id, 'type', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {RELATIONSHIP_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                         <Label>To</Label>
                        <Select value={rel.toEntityId} onValueChange={value => handleChange(rel.id, 'toEntityId', value)}>
                            <SelectTrigger><SelectValue placeholder="Entity B..." /></SelectTrigger>
                            <SelectContent>{entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    
                    <div className="md:col-span-2 space-y-1.5">
                         <Label>On Delete</Label>
                        <Select value={rel.onDelete} onValueChange={value => handleChange(rel.id, 'onDelete', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {ON_DELETE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => setRelationshipToDelete(rel.id)}>
                            <Icon name="trash" className="h-4 w-4 text-red-500"/>
                       </Button>
                    </div>
                </div>
            </Card>
        ))}
      </div>

       <Button variant="outline" onClick={handleAddRelationship}>
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Add Relationship
        </Button>

      {entities.length < 2 && (
          <p className="text-center text-text-secondary py-8">You need at least two entities to create a relationship. Go back to the 'Main Entities' step.</p>
      )}

        <Dialog open={!!relationshipToDelete} onClose={() => setRelationshipToDelete(null)}>
            <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                    Você tem certeza que deseja excluir este relacionamento? Esta ação não pode ser desfeita.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRelationshipToDelete(null)}>Cancelar</Button>
                <Button variant="destructive" onClick={confirmRemoveRelationship}>Excluir</Button>
            </DialogFooter>
        </Dialog>
    </div>
  );
};

export default Step10Relationships;