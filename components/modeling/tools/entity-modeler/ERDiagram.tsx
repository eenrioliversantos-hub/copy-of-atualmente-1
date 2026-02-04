import React, { useState, useMemo } from 'react';
import type { Entity } from '../../../../lib/entity-modeler/types';
import Icon from './Icon';

interface ERDiagramProps {
  entities: Entity[];
}

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  entity: Entity;
}

interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label: string;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ entities }) => {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const entityMap = new Map<string, Entity>(entities.map(e => [e.name, e]));
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const radius = 350;
    const centerX = 500;
    const centerY = 400;
    const angleStep = entities.length > 0 ? (2 * Math.PI) / entities.length : 0;
    const nodeWidth = 220;
    const nodeHeight = 180;

    entities.forEach((entity, i) => {
      const angle = i * angleStep;
      newNodes.push({
        id: entity.name,
        x: centerX + radius * Math.cos(angle) - nodeWidth / 2,
        y: centerY + radius * Math.sin(angle) - nodeHeight / 2,
        width: nodeWidth,
        height: nodeHeight,
        entity,
      });
    });

    const nodePositionMap = new Map<string, { x: number; y: number; width: number; height: number }>(
      newNodes.map(n => [n.id, { x: n.x, y: n.y, width: n.width, height: n.height }])
    );
    
    entities.forEach(sourceEntity => {
      (sourceEntity.relationships || []).forEach(rel => {
        if (entityMap.has(rel.targetEntity) && nodePositionMap.has(sourceEntity.name) && nodePositionMap.has(rel.targetEntity)) {
          const sourcePos = nodePositionMap.get(sourceEntity.name)!;
          const targetPos = nodePositionMap.get(rel.targetEntity)!;
          
          newEdges.push({
            id: `${sourceEntity.name}-${rel.name}-${rel.targetEntity}`,
            sourceId: sourceEntity.name,
            targetId: rel.targetEntity,
            sourceX: sourcePos.x + sourcePos.width / 2,
            sourceY: sourcePos.y + sourcePos.height / 2,
            targetX: targetPos.x + targetPos.width / 2,
            targetY: targetPos.y + targetPos.height / 2,
            label: rel.type
          });
        }
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [entities]);

  const highlightedElements = useMemo(() => {
    if (!selectedEdgeId) return null;
    const edge = edges.find(e => e.id === selectedEdgeId);
    if (!edge) return null;
    return {
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    };
  }, [selectedEdgeId, edges]);

  const handleEdgeClick = (e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation();
    setSelectedEdgeId(prev => (prev === edgeId ? null : edgeId));
  };

  const handleCanvasClick = () => {
    setSelectedEdgeId(null);
  };
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-xl border border-card-border w-full h-[800px] overflow-hidden">
        <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center border-b pb-2 border-card-border">
            <Icon name="gitBranch" className="w-5 h-5 mr-2 text-accent" />
            Diagrama de Entidade e Relacionamento (ER)
        </h3>
        <p className="text-sm text-text-secondary mb-4">Clique em uma linha de relacionamento para destacar as entidades conectadas.</p>
      <svg width="100%" height="100%" viewBox="0 0 1000 800" className="diagram-bg rounded-lg border border-card-border" onClick={handleCanvasClick}>
        <defs>
          <marker id="arrowhead-er" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        {edges.map(edge => {
          const isSelected = selectedEdgeId === edge.id;
          const isDimmed = highlightedElements !== null && !isSelected;
          const midX = (edge.sourceX + edge.targetX) / 2;
          const midY = (edge.sourceY + edge.targetY) / 2;

          return (
            <g 
                key={edge.id} 
                className={`transition-opacity duration-300 ${isDimmed ? 'opacity-10' : 'opacity-100'}`}
                onClick={(e) => handleEdgeClick(e, edge.id)}
            >
              <path
                d={`M${edge.sourceX},${edge.sourceY} L${edge.targetX},${edge.targetY}`}
                stroke={isSelected ? '#38bdf8' : '#94a3b8'}
                strokeWidth={isSelected ? 3 : 1.5}
                className="cursor-pointer"
              />
              <text x={midX} y={midY - 5} textAnchor="middle" fontSize="10" fill={isSelected ? '#38bdf8' : '#f8fafc'} className="font-sans font-semibold">
                {edge.label}
              </text>
            </g>
          );
        })}

        {nodes.map(node => {
          const isHighlighted = highlightedElements ? 
            (node.id === highlightedElements.sourceId || node.id === highlightedElements.targetId) : 
            false;
          const isDimmed = highlightedElements !== null && !isHighlighted;

          return (
            <g 
              key={node.id} 
              transform={`translate(${node.x}, ${node.y})`} 
              className={`transition-all duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
            >
              <rect
                width={node.width}
                height={node.height}
                rx="8"
                fill="#1e293b" // card color
                stroke={isHighlighted ? '#38bdf8' : '#334155'} // accent or card-border
                strokeWidth={isHighlighted ? 2 : 1}
                className="shadow-lg transition-all duration-300"
              />
              <foreignObject width={node.width} height={node.height}>
                 <div className="p-3 flex flex-col h-full font-sans text-text-primary">
                    <h4 className={`font-bold text-base border-b pb-1 mb-2 transition-colors duration-300 ${isHighlighted ? 'text-accent' : 'text-text-primary'}`}>{node.entity.name}</h4>
                    <div className="overflow-y-auto text-xs space-y-1 pr-2">
                      {(node.entity.attributes || []).map(attr => (
                        <div key={attr.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                {attr.isPK && <Icon name="key" className="w-3 h-3 text-yellow-500 mr-1.5"/>}
                                {!attr.isPK && <Icon name="type" className="w-3 h-3 text-text-secondary mr-1.5"/>}
                                <span className={attr.isPK ? 'font-semibold' : ''}>{attr.name}</span>
                            </div>
                           <span className="text-text-secondary">{attr.type}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ERDiagram;
