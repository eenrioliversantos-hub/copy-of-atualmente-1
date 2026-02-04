import React, { useState, useMemo } from 'react';
import { Entity } from '../steps/Step8Entities';
import ERDiagramTooltip from './ERDiagramTooltip';

// Local type definition for Relationship to avoid complex imports/exports
interface Relationship {
    id: string;
    fromEntityId: string;
    toEntityId: string;
    type: '1:1' | '1:N' | 'N:N';
}

interface ERDiagramProps {
    entities: Entity[];
    relationships: Relationship[];
}

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;
const ENTITY_WIDTH = 140;
const ENTITY_HEIGHT = 70;

const ERDiagram: React.FC<ERDiagramProps> = ({ entities = [], relationships = [] }) => {
    const [hoveredEntity, setHoveredEntity] = useState<{ entity: Entity, event: React.MouseEvent } | null>(null);

    const entityPositions = useMemo(() => {
        const positions = new Map<string, { x: number, y: number }>();
        const count = entities.length;
        if (count === 0) return positions;

        const centerX = SVG_WIDTH / 2;
        const centerY = SVG_HEIGHT / 2;
        const radiusX = (SVG_WIDTH / 2) - (ENTITY_WIDTH / 2) - 40;
        const radiusY = (SVG_HEIGHT / 2) - (ENTITY_HEIGHT / 2) - 40;
        const angleStep = (2 * Math.PI) / count;

        entities.forEach((entity, i) => {
            const angle = angleStep * i - Math.PI / 2; // Start from top
            const x = centerX + radiusX * Math.cos(angle) - ENTITY_WIDTH / 2;
            const y = centerY + radiusY * Math.sin(angle) - ENTITY_HEIGHT / 2;
            positions.set(entity.id, { x, y });
        });

        return positions;
    }, [entities]);

    const handleMouseEnter = (event: React.MouseEvent, entity: Entity) => {
        setHoveredEntity({ entity, event });
    };

    const handleMouseLeave = () => {
        setHoveredEntity(null);
    };

    return (
        <div className="relative bg-background p-4 rounded-lg border border-card-border overflow-auto">
             {entities.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                    <p className="text-text-secondary">Defina entidades para visualizar o diagrama.</p>
                </div>
            ) : (
                <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="font-sans">
                    {/* Relationships */}
                    <g className="relationships">
                        {relationships.map(rel => {
                            const fromPos = entityPositions.get(rel.fromEntityId);
                            const toPos = entityPositions.get(rel.toEntityId);

                            if (!fromPos || !toPos) return null;

                            const x1 = fromPos.x + ENTITY_WIDTH / 2;
                            const y1 = fromPos.y + ENTITY_HEIGHT / 2;
                            const x2 = toPos.x + ENTITY_WIDTH / 2;
                            const y2 = toPos.y + ENTITY_HEIGHT / 2;

                            return (
                                <g key={rel.id}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="#475569"
                                        strokeWidth="1.5"
                                    />
                                    <text
                                        x={(x1 + x2) / 2}
                                        y={(y1 + y2) / 2}
                                        fill="#94a3b8"
                                        fontSize="12"
                                        textAnchor="middle"
                                        dy="-5"
                                    >
                                        {rel.type}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* Entities */}
                    <g className="entities">
                        {entities.map(entity => {
                            const pos = entityPositions.get(entity.id);
                            if (!pos) return null;

                            return (
                                <g
                                    key={entity.id}
                                    transform={`translate(${pos.x}, ${pos.y})`}
                                    onMouseEnter={(e) => handleMouseEnter(e, entity)}
                                    onMouseLeave={handleMouseLeave}
                                    className="cursor-pointer group"
                                >
                                    <rect
                                        width={ENTITY_WIDTH}
                                        height={ENTITY_HEIGHT}
                                        rx="8"
                                        fill="#1e293b"
                                        stroke="#334155"
                                        strokeWidth="1"
                                        className="group-hover:stroke-accent transition-colors"
                                    />
                                    <text
                                        x={ENTITY_WIDTH / 2}
                                        y={ENTITY_HEIGHT / 2}
                                        dy=".3em"
                                        textAnchor="middle"
                                        fill="#f8fafc"
                                        fontSize="14"
                                        fontWeight="600"
                                        className="pointer-events-none"
                                    >
                                        {entity.name}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            )}
             {hoveredEntity && (
                <ERDiagramTooltip
                    entity={hoveredEntity.entity}
                    event={hoveredEntity.event}
                />
            )}
        </div>
    );
};

export default ERDiagram;