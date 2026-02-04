import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Entity } from '../steps/Step8Entities';

interface EntityNodeProps {
  data: {
    label: string;
    entity: Entity;
  };
}

const EntityNode: React.FC<EntityNodeProps> = ({ data }) => {
  const { label, entity } = data;

  return (
    <div className="bg-card border-2 border-card-border rounded-lg w-64 shadow-lg hover:border-accent transition-colors">
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <div className="bg-sidebar p-2 rounded-t-md">
        <h3 className="font-bold text-center text-accent">{label}</h3>
      </div>
      <div className="p-2 text-xs divide-y divide-card-border">
        {(entity.fields || []).map(field => (
          <div key={field.id} className="py-1 flex justify-between">
            <span className="text-text-primary font-mono">{field.name}</span>
            <span className="text-text-secondary font-mono">{field.type}</span>
          </div>
        ))}
        {(!entity.fields || entity.fields.length === 0) && (
            <div className="py-1 text-center text-text-secondary italic">Sem campos</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
};

export default EntityNode;