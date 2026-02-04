import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

const activities = [
    { user: 'Ana Santos', action: 'concluiu a tarefa', target: 'Design do Dashboard', time: '5m atrás', avatar: 'https://i.pravatar.cc/150?u=user-1' },
    { user: 'Pedro Costa', action: 'adicionou um novo comentário em', target: 'API de Autenticação', time: '25m atrás', avatar: 'https://i.pravatar.cc/150?u=user-2' },
    { user: 'Carlos Silva', action: 'criou um novo projeto', target: 'Sistema ERP - TechCorp', time: '2h atrás', avatar: 'https://i.pravatar.cc/150?u=user-4' },
    { user: 'Juliana Oliveira', action: 'fez upload de novos arquivos em', target: 'Marketing Copy', time: '4h atrás', avatar: 'https://i.pravatar.cc/150?u=user-3' },
];

const ActivityFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>O que aconteceu recentemente nos seus projetos.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
            {activities.map((activity, index) => (
                <li key={index} className="flex items-start space-x-3">
                    <Avatar src={activity.avatar} alt={activity.user} fallback={activity.user.substring(0,2)} size="md" />
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold text-text-primary">{activity.user}</span>
                            <span className="text-text-secondary"> {activity.action} </span>
                            <span className="font-medium text-accent">{activity.target}</span>
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">{activity.time}</p>
                    </div>
                </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
