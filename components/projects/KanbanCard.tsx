

import React from 'react';
// Fix: Module '"../../types"' has no exported member 'Task'. Using `ProjectTask` instead.
import { ProjectTask, TaskPriority } from '../../types';
import Avatar from '../shared/Avatar';

interface KanbanCardProps {
  // Fix: Using `ProjectTask` instead of `Task`.
  task: ProjectTask;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const priorityClasses: { [key in TaskPriority]: { bg: string; text: string } } = {
  [TaskPriority.Low]: { bg: 'bg-gray-600', text: 'text-gray-100' },
  [TaskPriority.Medium]: { bg: 'bg-blue-600', text: 'text-blue-100' },
  [TaskPriority.High]: { bg: 'bg-yellow-600', text: 'text-yellow-100' },
  [TaskPriority.Urgent]: { bg: 'bg-red-600', text: 'text-red-100' },
};

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart }) => {
  const { bg, text } = priorityClasses[task.priority];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-card p-4 rounded-md border border-card-border cursor-grab active:cursor-grabbing hover:border-accent transition-shadow shadow-sm"
    >
      <p className="text-sm font-medium text-text-primary mb-2">{task.title}</p>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}
        >
          {task.priority}
        </span>
        <Avatar
          src={task.assignee.avatarUrl}
          alt={task.assignee.name}
          fallback={task.assignee.name.substring(0, 2)}
          size="sm"
        />
      </div>
    </div>
  );
};

export default KanbanCard;