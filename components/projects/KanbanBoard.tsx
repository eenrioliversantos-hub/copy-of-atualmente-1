
import React, { useState } from 'react';
// Fix: Module '"../../types"' has no exported member 'Task'. The type was also unused in this file, so it has been removed from the import.
import { KanbanBoardData } from '../../types';
import KanbanColumn from './KanbanColumn';
import { MOCK_DATA } from '../../constants';

const KanbanBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<KanbanBoardData>(MOCK_DATA);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    if (!taskId || !sourceColumnId || sourceColumnId === destColumnId) {
      return;
    }

    const sourceColumn = boardData.columns[sourceColumnId];
    const destColumn = boardData.columns[destColumnId];

    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(newSourceTaskIds.indexOf(taskId), 1);

    const newDestTaskIds = Array.from(destColumn.taskIds);
    newDestTaskIds.push(taskId);

    const newBoardData: KanbanBoardData = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [sourceColumnId]: {
          ...sourceColumn,
          taskIds: newSourceTaskIds,
        },
        [destColumnId]: {
          ...destColumn,
          taskIds: newDestTaskIds,
        },
      },
    };

    setBoardData(newBoardData);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
      {boardData.columnOrder.map((columnId) => {
        const column = boardData.columns[columnId];
        const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);
        return (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;
