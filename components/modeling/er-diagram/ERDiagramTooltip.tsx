import React from 'react';
import { Entity } from '../steps/Step8Entities';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface ERDiagramTooltipProps {
    entity: Entity;
    event: React.MouseEvent;
}

const ERDiagramTooltip: React.FC<ERDiagramTooltipProps> = ({ entity, event }) => {
    // Position tooltip relative to the mouse cursor
    const style = {
        position: 'fixed' as 'fixed',
        top: `${event.clientY + 15}px`,
        left: `${event.clientX + 15}px`,
        pointerEvents: 'none' as 'none',
    };

    return (
        <div
            style={style}
            className="w-64 bg-background border border-card-border rounded-lg shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95"
        >
            <h3 className="font-bold text-accent mb-2">{entity.name}</h3>
            <p className="text-xs text-text-secondary mb-3">{entity.description}</p>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Icon name="list" className="h-4 w-4" /> Fields
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
                {entity.fields.length > 0 ? entity.fields.map(field => (
                    <div key={field.id} className="flex justify-between items-center text-xs">
                        <span className="text-text-primary">{field.name}</span>
                        <Badge variant="secondary" className="font-mono">{field.type}</Badge>
                    </div>
                )) : (
                    <p className="text-xs text-text-secondary italic">No fields defined.</p>
                )}
            </div>
        </div>
    );
};

export default ERDiagramTooltip;