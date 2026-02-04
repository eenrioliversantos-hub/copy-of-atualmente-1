import React, { useState, useRef, useEffect } from 'react';
import type { Schema, Table } from '../../../types';

interface SchemaDiagramProps {
  schema: Schema;
  onSelectTable: (tableId: string) => void;
}

const TABLE_WIDTH = 200;
const TABLE_HEADER_HEIGHT = 40;
const ROW_HEIGHT = 24;
const PADDING = 40;

const SchemaDiagram: React.FC<SchemaDiagramProps> = ({ schema, onSelectTable }) => {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 800 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
        setViewBox({ x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight });
    }
  }, []);


  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const point = new DOMPoint(e.clientX, e.clientY);
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const newWidth = viewBox.width * scale;
    const newHeight = viewBox.height * scale;
    const newX = viewBox.x + (svgPoint.x - viewBox.x) * (1 - scale);
    const newY = viewBox.y + (svgPoint.y - viewBox.y) * (1 - scale);

    setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    const scaleX = viewBox.width / svgRef.current.clientWidth;
    const scaleY = viewBox.height / svgRef.current.clientHeight;
    
    const dx = (e.clientX - startPoint.x) * scaleX;
    const dy = (e.clientY - startPoint.y) * scaleY;
    
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const tables = schema.tables || [];
  const tablePositions = new Map<string, { x: number, y: number, height: number }>();
  
  // Simple grid layout
  const numCols = Math.floor(Math.sqrt(tables.length)) || 1;
  let currentX = PADDING;
  let currentY = PADDING;
  let maxHeightInRow = 0;

  tables.forEach((table, i) => {
    const tableHeight = TABLE_HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + PADDING / 2;
    if (i > 0 && i % numCols === 0) {
      currentX = PADDING;
      currentY += maxHeightInRow + PADDING * 2;
      maxHeightInRow = 0;
    }
    tablePositions.set(table.id, { x: currentX, y: currentY, height: tableHeight });
    currentX += TABLE_WIDTH + PADDING * 2;
    if (tableHeight > maxHeightInRow) {
      maxHeightInRow = tableHeight;
    }
  });


  return (
    <div className="w-full h-full diagram-bg overflow-hidden cursor-grab"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        >
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
                </marker>
            </defs>

            {/* Render tables FIRST */}
            {tables.map((table) => {
                const pos = tablePositions.get(table.id);
                if (!pos) return null;

                return (
                    <g key={table.id} transform={`translate(${pos.x}, ${pos.y})`} className="unselectable" onClick={() => onSelectTable(table.id)} style={{ cursor: 'pointer' }}>
                        <rect width={TABLE_WIDTH} height={pos.height} rx="8" ry="8" fill="#1e293b" stroke="#334155" />
                        <rect width={TABLE_WIDTH} height={TABLE_HEADER_HEIGHT} rx="8" ry="8" fill="#334155" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
                        <text x={TABLE_WIDTH / 2} y="25" textAnchor="middle" fontWeight="bold" fill="white">{table.name}</text>
                        
                        {table.columns.map((col, index) => (
                            <g key={col.id} transform={`translate(0, ${TABLE_HEADER_HEIGHT + index * ROW_HEIGHT})`}>
                                <text x="10" y="18" fontSize="12" fill={col.isForeignKey ? '#7dd3fc' : 'white'}>
                                    {col.name} <tspan fill="#94a3b8" fontSize="10">{col.dataType}</tspan>
                                </text>
                            </g>
                        ))}
                    </g>
                );
            })}
            
            {/* Render relationships on TOP */}
            {tables.map(table => {
                const sourcePos = tablePositions.get(table.id);
                if (!sourcePos) return null;

                return table.columns.map((col, colIndex) => {
                    if (!col.isForeignKey || !col.foreignKeyTable) return null;
                    
                    const targetTable = tables.find(t => t.name === col.foreignKeyTable);
                    if (!targetTable) return null;

                    const targetPos = tablePositions.get(targetTable.id);
                    if (!targetPos) return null;

                    const startX = sourcePos.x + TABLE_WIDTH;
                    const startY = sourcePos.y + TABLE_HEADER_HEIGHT + (colIndex * ROW_HEIGHT) + ROW_HEIGHT / 2;
                    const endX = targetPos.x;
                    const endY = targetPos.y + TABLE_HEADER_HEIGHT / 2;

                    const pathData = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;

                    return <path key={`${table.id}-${col.id}-rel`} d={pathData} stroke="#38bdf8" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />;
                });
            })}
        </svg>
    </div>
  );
};

export default SchemaDiagram;
