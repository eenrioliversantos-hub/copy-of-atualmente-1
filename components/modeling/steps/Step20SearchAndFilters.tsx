
import React from 'react';
import { Label } from '../../ui/Label';
import { Switch } from '../../ui/Switch';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Entity, Field } from './Step8Entities';
import { Checkbox } from '../../ui/Checkbox';
import { ScrollArea } from '../../ui/ScrollArea';

interface Screen {
    id: string;
    path: string;
}

interface FilterConfig {
    id: string;
    targetId: string; // Entity ID
    filterableFields: string[];
    sortableFields: string[];
}

interface Step20SearchAndFiltersProps {
    data: {
        globalSearch?: { enabled: boolean; entities: string[] };
        filters?: FilterConfig[];
    };
    setData: (data: any) => void;
    entities: Entity[];
    screens: Screen[];
}

const Step20SearchAndFilters: React.FC<Step20SearchAndFiltersProps> = ({ data, setData, entities, screens }) => {
    // FIX: Ensure entities array exists even if globalSearch is partially defined
    const globalSearch = data.globalSearch || { enabled: false, entities: [] };
    const globalSearchEntities = globalSearch.entities || [];
    const filters = data.filters || [];

    const handleGlobalSearchChange = (field: keyof typeof globalSearch, value: any) => {
        setData({ ...data, globalSearch: { ...globalSearch, [field]: value } });
    };

    const handleGlobalEntityChange = (entityId: string) => {
        // FIX: Use defensive variable globalSearchEntities
        const newEntities = globalSearchEntities.includes(entityId)
            ? globalSearchEntities.filter(id => id !== entityId)
            : [...globalSearchEntities, entityId];
        handleGlobalSearchChange('entities', newEntities);
    };

    const handleAddFilter = () => {
        const newFilter: FilterConfig = {
            id: new Date().getTime().toString(),
            targetId: '',
            filterableFields: [],
            sortableFields: []
        };
        setData({ ...data, filters: [...filters, newFilter] });
    };

    const handleRemoveFilter = (id: string) => {
        const newFilters = filters.filter(f => f.id !== id);
        setData({ ...data, filters: newFilters });
    };

    const handleFilterTargetChange = (id: string, newTargetId: string) => {
        const newFilters = filters.map(f =>
            f.id === id
                ? { ...f, targetId: newTargetId, filterableFields: [], sortableFields: [] } // Reset fields on change
                : f
        );
        setData({ ...data, filters: newFilters });
    };
    
    const handleFieldSelection = (filterId: string, fieldType: 'filterableFields' | 'sortableFields', fieldName: string) => {
        const filter = filters.find(f => f.id === filterId);
        if (!filter) return;

        const currentSelection = filter[fieldType] || [];
        const newSelection = currentSelection.includes(fieldName)
            ? currentSelection.filter(item => item !== fieldName)
            : [...currentSelection, fieldName];
        
        const newFilters = filters.map(f => f.id === filterId ? { ...f, [fieldType]: newSelection } : f);
        setData({ ...data, filters: newFilters });
    };

    return (
        <div className="space-y-8">
            <Card className="bg-sidebar/50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Global Search</Label>
                            <p className="text-sm text-text-secondary">Enable a site-wide search bar (e.g., in the header).</p>
                        </div>
                        <Switch checked={globalSearch.enabled} onCheckedChange={(c) => handleGlobalSearchChange('enabled', c)} />
                    </div>
                    {globalSearch.enabled && (
                        <div className="mt-4 pt-4 border-t border-card-border">
                            <Label>Searchable Entities</Label>
                            <p className="text-sm text-text-secondary mb-2">Which main entities should be included in global search results?</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {entities.map(entity => (
                                     <div key={entity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`gs-entity-${entity.id}`}
                                            checked={globalSearchEntities.includes(entity.id)}
                                            onCheckedChange={() => handleGlobalEntityChange(entity.id)}
                                        />
                                        <Label htmlFor={`gs-entity-${entity.id}`} className="font-normal cursor-pointer">{entity.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <div className="space-y-4">
                <Label>Filters per Entity</Label>
                <p className="text-sm text-text-secondary">Define advanced filtering and sorting options for specific entity listing pages.</p>
                
                <div className="space-y-4">
                    {filters.map(filter => {
                        const selectedEntity = entities.find(e => e.id === filter.targetId);
                        const fields = selectedEntity?.fields || [];
                        return (
                             <Card key={filter.id} className="bg-sidebar/50">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 space-y-1.5">
                                            <Label>Target Entity</Label>
                                            <Select value={filter.targetId} onValueChange={(v) => handleFilterTargetChange(filter.id, v)}>
                                                <SelectTrigger><SelectValue placeholder="Select an entity..." /></SelectTrigger>
                                                <SelectContent>{entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                         <Button variant="ghost" size="sm" onClick={() => handleRemoveFilter(filter.id)} className="ml-4 mt-6">
                                            <Icon name="trash" className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>

                                    {selectedEntity && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Filterable Fields</Label>
                                                <ScrollArea className="h-40 p-3 border border-card-border rounded-md">
                                                    {fields.map(field => (
                                                        <div key={field.id} className="flex items-center space-x-2 mb-2">
                                                            <Checkbox id={`filter-${filter.id}-${field.id}`} checked={(filter.filterableFields || []).includes(field.name)} onCheckedChange={() => handleFieldSelection(filter.id, 'filterableFields', field.name)} />
                                                            <Label htmlFor={`filter-${filter.id}-${field.id}`} className="font-normal cursor-pointer">{field.name}</Label>
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                             <div className="space-y-2">
                                                <Label>Sortable Fields</Label>
                                                <ScrollArea className="h-40 p-3 border border-card-border rounded-md">
                                                    {fields.map(field => (
                                                        <div key={field.id} className="flex items-center space-x-2 mb-2">
                                                            <Checkbox id={`sort-${filter.id}-${field.id}`} checked={(filter.sortableFields || []).includes(field.name)} onCheckedChange={() => handleFieldSelection(filter.id, 'sortableFields', field.name)} />
                                                            <Label htmlFor={`sort-${filter.id}-${field.id}`} className="font-normal cursor-pointer">{field.name}</Label>
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <Button variant="outline" onClick={handleAddFilter}>
                    <Icon name="plus" className="h-4 w-4 mr-2" /> Add Filter Configuration
                </Button>
            </div>
        </div>
    );
};

export default Step20SearchAndFilters;
