import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
} from 'react-flow-renderer';
import { Entity } from '../steps/Step8Entities';
import EntityNode from './EntityNode';

interface Relationship {
    id: string;
    fromEntityId: string;
    toEntityId: string;
    type: '1:1' | '1:N' | 'N:N';
}

interface InteractiveERDiagramProps {
    entities: Entity[];
    relationships: Relationship[];
}

const nodeTypes = {
  entityNode: EntityNode,
};

const InteractiveERDiagram: React.FC<InteractiveERDiagramProps> = ({ entities = [], relationships = [] }) => {
    const initialNodes = useMemo(() => {
        if (!entities) return [];
        const columns = 3;
        return entities.map((entity, index) => ({
            id: entity.id,
            type: 'entityNode',
            data: { label: entity.name, entity: entity },
            position: {
                x: (index % columns) * 300,
                y: Math.floor(index / columns) * 250,
            },
        }));
    }, [entities]);

    const initialEdges = useMemo(() => {
        if (!relationships) return [];
        return relationships.map(rel => ({
            id: `edge-${rel.id}`,
            source: rel.fromEntityId,
            target: rel.toEntityId,
            label: rel.type,
            type: 'smoothstep',
            markerEnd: {
                type: 'arrowclosed',
            },
            style: { stroke: '#94a3b8' },
            labelStyle: { fill: '#f8fafc', fontWeight: 'bold' },
            labelBgStyle: { fill: '#1e293b' },
            labelBgPadding: [4, 8],
            labelBgBorderRadius: 4,
        }));
    }, [relationships]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="h-[70vh] w-full bg-background rounded-lg border border-card-border">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={16} color="#334155" />
            </ReactFlow>
        </div>
    );
};

export default InteractiveERDiagram;