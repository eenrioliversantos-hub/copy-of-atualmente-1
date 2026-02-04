import React, { useState, useEffect } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Entity, Field, Validation } from './Step8Entities';
import { Switch } from '../../ui/Switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';
import { Badge } from '../../ui/Badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/Dialog';
import { Separator } from '../../ui/Separator';

interface Step9FieldsProps {
  entitiesData: {
    entities?: Entity[];
  };
  setEntitiesData: (data: any) => void;
}

const DATA_TYPES = ["String", "Text", "Integer", "Float", "Boolean", "Date", "DateTime", "JSON", "UUID"];

const VALIDATION_TYPES = [
    { value: 'minLength', label: 'Minimum Length', appliesTo: ['String', 'Text'], inputType: 'number' },
    { value: 'maxLength', label: 'Maximum Length', appliesTo: ['String', 'Text'], inputType: 'number' },
    { value: 'min', label: 'Minimum Value', appliesTo: ['Integer', 'Float'], inputType: 'number' },
    { value: 'max', label: 'Maximum Value', appliesTo: ['Integer', 'Float'], inputType: 'number' },
    { value: 'email', label: 'Email Format', appliesTo: ['String'], inputType: 'none' },
    { value: 'url', label: 'URL Format', appliesTo: ['String'], inputType: 'none' },
    { value: 'pattern', label: 'Regex Pattern', appliesTo: ['String', 'Text'], inputType: 'text' },
];

const Step9Fields: React.FC<Step9FieldsProps> = ({ entitiesData, setEntitiesData }) => {
  const entities = entitiesData?.entities || [];
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(entities[0]?.id || null);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  // FIX: This effect synchronizes the selected entity state when the list of entities changes.
  useEffect(() => {
    const currentEntities = entitiesData?.entities || [];
    // Check if the currently selected entity still exists in the list.
    const selectionStillExists = currentEntities.some(e => e.id === selectedEntityId);

    // If there's no selection OR the selection is gone, reset to the first available entity.
    if ((!selectedEntityId || !selectionStillExists) && currentEntities.length > 0) {
      setSelectedEntityId(currentEntities[0].id);
    }
    // If there are no entities at all, reset to null.
    else if (currentEntities.length === 0) {
      setSelectedEntityId(null);
    }
  }, [entitiesData, selectedEntityId]);

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  const handleAddField = () => {
    if (!selectedEntityId) return;
    const newField: Field = {
      id: new Date().getTime().toString(),
      name: '',
      type: 'String',
      required: false,
      unique: false,
      indexed: false,
      defaultValue: '',
      validations: [],
    };
    const updatedEntities = entities.map(e => 
      e.id === selectedEntityId ? { ...e, fields: [...e.fields, newField] } : e
    );
    setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };
  
  const confirmRemoveField = () => {
    if (!selectedEntityId || !fieldToDelete) return;
    const updatedEntities = entities.map(e => 
      e.id === selectedEntityId ? { ...e, fields: e.fields.filter(f => f.id !== fieldToDelete) } : e
    );
    setEntitiesData({ ...entitiesData, entities: updatedEntities });
    setFieldToDelete(null);
  };

  const handleChange = (fieldId: string, property: keyof Field, value: any) => {
     if (!selectedEntityId) return;
     const updatedEntities = entities.map(e => {
        if (e.id === selectedEntityId) {
            return {
                ...e,
                fields: e.fields.map(f => {
                    if (f.id === fieldId) {
                        const updatedField = { ...f, [property]: value };
                        if (property === 'name' && value.toLowerCase() === 'status') {
                            updatedField.defaultValue = 'active';
                        }
                        return updatedField;
                    }
                    return f;
                })
            }
        }
        return e;
     });
     setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };
  
  const handleAddValidation = (fieldId: string) => {
      if (!selectedEntityId) return;
      const newValidation: Validation = { id: Date.now().toString(), type: '', value: '', message: '' };
      const updatedEntities = entities.map(e => 
          e.id === selectedEntityId ? {
              ...e,
              fields: e.fields.map(f => 
                  f.id === fieldId ? { ...f, validations: [...f.validations, newValidation] } : f
              )
          } : e
      );
      setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };

  const handleValidationChange = (fieldId: string, validationId: string, property: keyof Validation, value: string | number) => {
      if (!selectedEntityId) return;
      const updatedEntities = entities.map(e => 
          e.id === selectedEntityId ? {
              ...e,
              fields: e.fields.map(f => 
                  f.id === fieldId ? { 
                      ...f, 
                      validations: f.validations.map(v => v.id === validationId ? { ...v, [property]: value } : v)
                  } : f
              )
          } : e
      );
      setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };

  const handleRemoveValidation = (fieldId: string, validationId: string) => {
      if (!selectedEntityId) return;
      const updatedEntities = entities.map(e => 
          e.id === selectedEntityId ? {
              ...e,
              fields: e.fields.map(f => 
                  f.id === fieldId ? { 
                      ...f, 
                      validations: f.validations.filter(v => v.id !== validationId)
                  } : f
              )
          } : e
      );
      setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="entity-select">Selecionar Entidade</Label>
        <p className="text-sm text-text-secondary mb-2">Escolha uma entidade para definir seus campos (atributos).</p>
        <Select onValueChange={setSelectedEntityId} value={selectedEntityId || ''}>
            <SelectTrigger id="entity-select">
                <SelectValue placeholder="Selecione uma entidade..." />
            </SelectTrigger>
            <SelectContent>
                {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {selectedEntity && (
        <Card className="bg-sidebar/50">
            <CardHeader>
                <CardTitle>Campos para "{selectedEntity.name}"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Accordion type="single" collapsible className="w-full space-y-2">
                    {selectedEntity.fields.map(field => {
                        const availableValidations = VALIDATION_TYPES.filter(v => v.appliesTo.includes(field.type));
                        return (
                            <AccordionItem value={field.id} key={field.id} className="border-none">
                                <Card className="bg-background/50 border-card-border overflow-hidden">
                                    <AccordionTrigger className="p-4 hover:no-underline w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3 text-left">
                                                <Icon name="list" className="h-5 w-5 text-text-secondary"/>
                                                <div className="truncate">
                                                    <p className="font-semibold truncate">{field.name || "Novo Campo"}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                        <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                                                        {field.required && <Badge variant="outline" className="text-xs">Obrigatório</Badge>}
                                                        {field.unique && <Badge variant="outline" className="text-xs">Único</Badge>}
                                                        {field.indexed && <Badge variant="outline" className="text-xs">Indexado</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFieldToDelete(field.id); }} aria-label={`Deletar campo ${field.name}`} className="ml-2 flex-shrink-0 hover:bg-red-500/10">
                                                <Icon name="trash" className="h-4 w-4 text-red-500"/>
                                            </Button>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <div className="border-t border-card-border pt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label>Nome do Campo</Label>
                                                    <Input placeholder="ex: primeiro_nome" value={field.name} onChange={e => handleChange(field.id, 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label>Tipo de Dado</Label>
                                                    <Select value={field.type} onValueChange={value => handleChange(field.id, 'type', value)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {DATA_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label>Valor Padrão</Label>
                                                    <Input placeholder="ex: 0 ou 'ativo'" value={field.defaultValue || ''} onChange={e => handleChange(field.id, 'defaultValue', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    <Switch id={`required-${field.id}`} checked={field.required} onCheckedChange={checked => handleChange(field.id, 'required', checked)} />
                                                    <Label htmlFor={`required-${field.id}`} className="font-normal cursor-pointer">Obrigatório</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch id={`unique-${field.id}`} checked={field.unique} onCheckedChange={checked => handleChange(field.id, 'unique', checked)} />
                                                    <Label htmlFor={`unique-${field.id}`} className="font-normal cursor-pointer">Único</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch id={`indexed-${field.id}`} checked={field.indexed} onCheckedChange={checked => handleChange(field.id, 'indexed', checked)} />
                                                    <Label htmlFor={`indexed-${field.id}`} className="font-normal cursor-pointer">Indexado</Label>
                                                </div>
                                            </div>
                                            <Separator className="my-4"/>
                                            <div>
                                                <Label className="font-semibold">Validações</Label>
                                                <div className="space-y-3 mt-2">
                                                    {(field.validations || []).map((validation) => {
                                                        const vType = VALIDATION_TYPES.find(vt => vt.value === validation.type);
                                                        return (
                                                            <div key={validation.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                                                                <div className="md:col-span-4 space-y-1.5"><Label className="text-xs">Tipo</Label><Select value={validation.type} onValueChange={v => handleValidationChange(field.id, validation.id, 'type', v)}><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger><SelectContent>{availableValidations.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}</SelectContent></Select></div>
                                                                {vType?.inputType !== 'none' && <div className="md:col-span-2 space-y-1.5"><Label className="text-xs">Valor</Label><Input type={vType?.inputType} value={validation.value} onChange={e => handleValidationChange(field.id, validation.id, 'value', e.target.value)} /></div>}
                                                                <div className={`space-y-1.5 ${vType?.inputType === 'none' ? 'md:col-span-7' : 'md:col-span-5'}`}><Label className="text-xs">Mensagem de Erro</Label><Input value={validation.message} onChange={e => handleValidationChange(field.id, validation.id, 'message', e.target.value)} /></div>
                                                                <div className="md:col-span-1 text-right"><Button variant="ghost" size="sm" onClick={() => handleRemoveValidation(field.id, validation.id)}><Icon name="trash" className="h-4 w-4 text-red-500"/></Button></div>
                                                            </div>
                                                        );
                                                    })}
                                                     <Button variant="outline" size="sm" onClick={() => handleAddValidation(field.id)} className="mt-2"><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Validação</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </Card>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
                <Button variant="outline" onClick={handleAddField} className="mt-2">
                    <Icon name="plus" className="h-4 w-4 mr-2" />
                    Adicionar Campo
                </Button>
            </CardContent>
        </Card>
      )}

      {!selectedEntity && entities.length > 0 && (
          <p className="text-center text-text-secondary py-8">Selecione uma entidade acima para começar a adicionar campos.</p>
      )}
       {!entities.length && (
          <p className="text-center text-text-secondary py-8">Nenhuma entidade criada ainda. Volte para a etapa 'Entidades Principais' para criá-las.</p>
      )}

       <Dialog open={!!fieldToDelete} onClose={() => setFieldToDelete(null)}>
        <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
                Você tem certeza que deseja excluir o campo "{selectedEntity?.fields.find(f => f.id === fieldToDelete)?.name || ''}"? Esta ação não pode ser desfeita.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={() => setFieldToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmRemoveField}>Excluir Campo</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Step9Fields;