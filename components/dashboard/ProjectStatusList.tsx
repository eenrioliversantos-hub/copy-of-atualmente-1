import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

const projects = [
    { name: 'Sistema ERP - TechCorp', status: 'Em Andamento', progress: 75 },
    { name: 'E-commerce - Digital Store', status: 'Planejamento', progress: 25 },
    { name: 'App Mobile - StartupX', status: 'Concluído', progress: 100 },
    { name: 'Landing Page - Marketing Pro', status: 'Pausado', progress: 40 },
];

const getStatusColor = (status: string) => {
    switch (status) {
      case "Planejamento": return "text-blue-400 bg-blue-500/10";
      case "Em Andamento": return "text-yellow-400 bg-yellow-500/10";
      case "Concluído": return "text-green-400 bg-green-500/10";
      case "Pausado": return "text-text-secondary bg-sidebar";
      default: return "text-text-primary bg-card";
    }
};

const ProjectStatusList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Projetos</CardTitle>
        <CardDescription>Visão geral do progresso dos projetos ativos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{project.name}</span>
                <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
            </div>
            <Progress value={project.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusList;
