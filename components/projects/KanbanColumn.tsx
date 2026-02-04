

import React from 'react';
// Fix: Module '"../../types"' has no exported member 'Task'. Using `ProjectTask` instead.
import { KanbanColumn as ColumnType, ProjectTask } from '../../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  column: ColumnType;
  // Fix: Using `ProjectTask` instead of `Task`.
  tasks: ProjectTask[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onDragStart, onDrop, onDragOver }) => {
  return (
    <div
      className="w-80 flex-shrink-0 bg-sidebar rounded-lg p-2 flex flex-col"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={onDragOver}
    >
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <h3 className="font-semibold text-text-primary">{column.title}</h3>
        <span className="text-sm text-text-secondary bg-background px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 p-1">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={(e) => onDragStart(e, task.id, column.id)} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;