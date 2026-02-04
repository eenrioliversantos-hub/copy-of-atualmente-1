import React, { useState, useMemo, useEffect } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Entity, Validation } from './Step8Entities';

interface Step11ValidationsProps {
  entitiesData: {
    entities?: Entity[];
  };
  setEntitiesData: (data: any) => void;
}

const ALL_VALIDATIONS = [
    { type: 'minLength', label: 'Minimum Length', appliesTo: ['String', 'Text'], inputType: 'number', description: 'Ensures the text is not too short.' },
    { type: 'maxLength', label: 'Maximum Length', appliesTo: ['String', 'Text'], inputType: 'number', description: 'Ensures the text is not too long.' },
    { type: 'min', label: 'Minimum Value', appliesTo: ['Integer', 'Float'], inputType: 'number', description: 'Ensures the number is not too small.' },
    { type: 'max', label: 'Maximum Value', appliesTo: ['Integer', 'Float'], inputType: 'number', description: 'Ensures the number is not too large.' },
    { type: 'email', label: 'Email Format', appliesTo: ['String'], inputType: 'none', description: 'Validates if the text is a proper email format.' },
    { type: 'url', label: 'URL Format', appliesTo: ['String'], inputType: 'none', description: 'Validates if the text is a proper URL.' },
    { type: 'pattern', label: 'Regex Pattern', appliesTo: ['String', 'Text'], inputType: 'text', description: 'Matches the text against a regular expression.' },
];


const Step11Validations: React.FC<Step11ValidationsProps> = ({ entitiesData, setEntitiesData }) => {
  const entities = entitiesData?.entities || [];
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(entities[0]?.id || null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  useEffect(() => {
    // Reset field selection when entity changes
    setSelectedFieldId(null);
  }, [selectedEntityId]);

  const selectedEntity = entities.find(e => e.id === selectedEntityId);
  const selectedField = selectedEntity?.fields.find(f => f.id === selectedFieldId);
  
  const addValidationRule = (validationType: string) => {
    if (!selectedEntityId || !selectedFieldId) return;

    const newValidation: Validation = {
        id: new Date().getTime().toString(),
        type: validationType,
        value: '',
        message: ''
    };
    
    const updatedEntities = entities.map(e => {
        if (e.id === selectedEntityId) {
            return {
                ...e,
                fields: e.fields.map(f => {
                    if (f.id === selectedFieldId) {
                        return { ...f, validations: [...(f.validations || []), newValidation] }
                    }
                    return f;
                })
            }
        }
        return e;
    });
    setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };

  const updateValidationRule = (validationId: string, property: keyof Validation, value: any) => {
    const updatedEntities = entities.map(e => {
        if (e.id === selectedEntityId) {
            return {
                ...e,
                fields: e.fields.map(f => {
                    if (f.id === selectedFieldId) {
                        return { 
                            ...f, 
                            validations: (f.validations || []).map(v => v.id === validationId ? { ...v, [property]: value } : v)
                        }
                    }
                    return f;
                })
            }
        }
        return e;
    });
    setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };

  const removeValidationRule = (validationId: string) => {
     const updatedEntities = entities.map(e => {
        if (e.id === selectedEntityId) {
            return {
                ...e,
                fields: e.fields.map(f => {
                    if (f.id === selectedFieldId) {
                        return { ...f, validations: (f.validations || []).filter(v => v.id !== validationId) }
                    }
                    return f;
                })
            }
        }
        return e;
    });
    setEntitiesData({ ...entitiesData, entities: updatedEntities });
  };
  
  const suggestedValidations = useMemo(() => {
    if (!selectedField) return [];
    const activeValidationTypes = (selectedField.validations || []).map(v => v.type);
    return ALL_VALIDATIONS.filter(v => 
        v.appliesTo.includes(selectedField.type) && !activeValidationTypes.includes(v.type)
    );
  }, [selectedField]);

  if (entities.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg">
        <Icon name="database" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-text-primary">No Entities Found</h3>
        <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
          To add validation rules, you first need to define entities and their fields.
          Please go back to <strong className="text-accent">Step 8: Main Entities</strong> and <strong className="text-accent">Step 9: Entity Fields</strong> to set them up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="entity-select">Select Entity</Label>
            <Select onValueChange={setSelectedEntityId} value={selectedEntityId || ''}>
                <SelectTrigger id="entity-select"><SelectValue placeholder="Select an entity..." /></SelectTrigger>
                <SelectContent>{entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="field-select">Select Field</Label>
            <Select onValueChange={setSelectedFieldId} value={selectedFieldId || ''} disabled={!selectedEntity || selectedEntity.fields.length === 0}>
                <SelectTrigger id="field-select"><SelectValue placeholder={!selectedEntity ? "Select an entity first" : "Select a field..."} /></SelectTrigger>
                <SelectContent>{selectedEntity?.fields.map(f => <SelectItem key={f.id} value={f.id}>{f.name} ({f.type})</SelectItem>)}</SelectContent>
            </Select>
             {selectedEntity && selectedEntity.fields.length === 0 && (
              <p className="text-xs text-yellow-500 mt-1">
                This entity has no fields. Please add fields in <strong className="text-yellow-400">Step 9: Entity Fields</strong>.
              </p>
            )}
        </div>
      </div>

      {selectedField ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Suggested Validations */}
            <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Suggested Validations</h3>
                {suggestedValidations.length > 0 ? (
                    <div className="space-y-3">
                    {suggestedValidations.map(suggestion => (
                        <Card key={suggestion.type} className="bg-sidebar/30">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{suggestion.label}</p>
                                    <p className="text-sm text-text-secondary">{suggestion.description}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => addValidationRule(suggestion.type)}>
                                    <Icon name="plus" className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-secondary text-center py-8">No more suggestions for this field type, or all have been added.</p>
                )}
            </div>
            
            {/* Active Rules */}
            <div className="space-y-4">
                 <h3 className="font-semibold text-text-primary">Active Rules</h3>
                 {(selectedField.validations || []).length > 0 ? (
                    <div className="space-y-3">
                        {(selectedField.validations || []).map(val => {
                             const validationMeta = ALL_VALIDATIONS.find(v => v.type === val.type);
                             return (
                                <Card key={val.id} className="bg-sidebar/80">
                                    <CardHeader className="flex-row items-center justify-between p-3">
                                        <CardTitle className="text-base">{validationMeta?.label}</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => removeValidationRule(val.id)}>
                                            <Icon name="trash" className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0 space-y-3">
                                        {validationMeta?.inputType !== 'none' && (
                                            <div className="space-y-1.5">
                                                <Label>Value</Label>
                                                <Input 
                                                    type={validationMeta?.inputType || 'text'} 
                                                    placeholder={val.type === 'pattern' ? "e.g., ^[a-z]+$" : "e.g., 8"} 
                                                    value={val.value} 
                                                    onChange={e => updateValidationRule(val.id, 'value', e.target.value)} 
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-1.5">
                                            <Label>Error Message</Label>
                                            <Input placeholder="e.g., Must be at least 8 characters" value={val.message} onChange={e => updateValidationRule(val.id, 'message', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>
                             );
                        })}
                    </div>
                 ) : (
                    <div className="text-center py-8 border-2 border-dashed border-card-border rounded-lg">
                        <p className="text-sm text-text-secondary">No validation rules added yet.</p>
                        <p className="text-xs text-text-secondary">Add a rule from the suggestions on the left.</p>
                    </div>
                 )}
            </div>

        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg">
            <Icon name="checkCircle" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
            <p className="font-semibold">Select an entity and a field</p>
            <p className="text-sm text-text-secondary">Choose a field above to see suggested validations and add rules.</p>
         </div>
      )}
    </div>
  );
};

export default Step11Validations;