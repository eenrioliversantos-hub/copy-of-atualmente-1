import React, { createContext, useContext, ReactNode } from 'react';
import { ProjectArtifacts, DevelopmentPlan, DevTask, TaskStatus } from '../types';

interface DPOContextType {
  getTaskById: (projectId: string, taskId: string) => DevTask | null;
  updateTaskStatus: (projectId: string, taskId: string, subTaskId: string, newStatus: 'todo' | 'done') => void;
  getProjectPlan: (projectId: string) => DevelopmentPlan | null;
}

const DPOContext = createContext<DPOContextType | undefined>(undefined);

interface DPOProviderProps {
  children: ReactNode;
  projectArtifacts: Record<string, ProjectArtifacts>;
  handleArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
}

export const DPOProvider: React.FC<DPOProviderProps> = ({ children, projectArtifacts, handleArtifactsUpdate }) => {
  
  const getProjectPlan = (projectId: string): DevelopmentPlan | null => {
    return projectArtifacts[projectId]?.developmentPlan || null;
  };

  const getTaskById = (projectId: string, taskId: string): DevTask | null => {
    const plan = getProjectPlan(projectId);
    if (!plan) return null;

    const allTasks: DevTask[] = [
      ...plan.setupAndDevOps,
      ...plan.sprints.flatMap(s => [...s.backendTasks, ...s.frontendTasks]),
      ...plan.postDeploy,
      ...plan.checklist,
    ];

    return allTasks.find(t => t.id === taskId) || null;
  };

  const updateTaskStatus = (projectId: string, taskId: string, subTaskId: string, newStatus: 'todo' | 'done') => {
    const plan = getProjectPlan(projectId);
    if (!plan) return;

    const newPlan = JSON.parse(JSON.stringify(plan)) as DevelopmentPlan; // Deep copy
    let taskFound = false;

    const findAndUpdate = (tasks: DevTask[]) => {
      for (const task of tasks) {
        if (task.id === taskId) {
          const subTask = task.subTasks.find(st => st.id === subTaskId);
          if (subTask) {
            subTask.status = newStatus;
            const allSubTasksDone = task.subTasks.every(st => st.status === 'done');
            task.status = allSubTasksDone ? 'done' : 'todo';
            taskFound = true;
            return;
          }
        }
      }
    };

    const allTaskLists = [
      newPlan.setupAndDevOps,
      ...newPlan.sprints.flatMap(s => [s.backendTasks, s.frontendTasks]),
      newPlan.postDeploy,
      newPlan.checklist
    ];

    for (const taskList of allTaskLists) {
      findAndUpdate(taskList);
      if (taskFound) break;
    }

    if (taskFound) {
      handleArtifactsUpdate(projectId, { developmentPlan: newPlan });
    }
  };

  return (
    <DPOContext.Provider value={{ getTaskById, updateTaskStatus, getProjectPlan }}>
      {children}
    </DPOContext.Provider>
  );
};

export const useDPO = () => {
  const context = useContext(DPOContext);
  if (context === undefined) {
    throw new Error('useDPO must be used within a DPOProvider');
  }
  return context;
};
