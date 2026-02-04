import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';
import { Entity } from '../steps/Step8Entities';

interface DataModelTabProps {
    wizardData: any;
}

const DataModelTab: React.FC<DataModelTabProps> = ({ wizardData }) => {
    const entities: Entity[] = wizardData.step8?.entities || [];
    const relationships = wizardData.step10?.relationships || [];

    const getEntityNameById = (id: string) => entities.find(e => e.id === id)?.name || 'Unknown';

    if (entities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Model Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-text-secondary">
                    <Icon name="database" className="h-8 w-8 mx-auto mb-2" />
                    <p>No entities were defined in Step 8.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Entities & Fields</CardTitle>
                    <CardDescription>A summary of the data structures you defined.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {entities.map(entity => (
                        <div key={entity.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
                            <h3 className="font-semibold text-accent flex items-center gap-2">
                                <Icon name="database" className="h-4 w-4" />
                                {entity.name}
                            </h3>
                            <p className="text-xs text-text-secondary mb-3">{entity.description}</p>
                            <div className="divide-y divide-card-border/50">
                                {entity.fields.map(field => (
                                    <div key={field.id} className="flex justify-between items-center py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm">{field.name}</span>
                                            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                                            {field.unique && <Badge variant="outline" className="text-xs">Unique</Badge>}
                                        </div>
                                        <Badge variant="secondary">{field.type}</Badge>
                                    </div>
                                ))}
                                {entity.fields.length === 0 && <p className="text-xs text-text-secondary italic py-2">No fields defined.</p>}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Relationships</CardTitle>
                     <CardDescription>How your entities are connected.</CardDescription>
                </CardHeader>
                <CardContent>
                    {relationships.length > 0 ? (
                        <ul className="space-y-2">
                            {relationships.map((rel: any) => (
                                <li key={rel.id} className="flex items-center gap-3 p-3 bg-sidebar/50 rounded-md border border-card-border">
                                    <Badge variant="outline">{getEntityNameById(rel.fromEntityId)}</Badge>
                                    <span className="text-sm text-text-secondary">has a</span>
                                    <Badge variant="secondary">{rel.type}</Badge>
                                    <span className="text-sm text-text-secondary">relationship with</span>
                                    <Badge variant="outline">{getEntityNameById(rel.toEntityId)}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-text-secondary py-8">No relationships were defined in Step 10.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DataModelTab;