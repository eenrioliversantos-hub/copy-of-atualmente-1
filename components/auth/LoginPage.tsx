import React from 'react';
import Icon from '../shared/Icon';
import { UserProfile } from '../../App';

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

const ProfileCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-sidebar border border-card-border rounded-lg p-6 text-center cursor-pointer hover:bg-slate-700 hover:border-accent transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <div className="bg-background inline-block p-4 rounded-full border-2 border-card-border group-hover:border-accent transition-colors">
      <Icon name={icon} className="h-8 w-8 text-accent" />
    </div>
    <h3 className="text-xl font-semibold mt-4 text-text-primary">{title}</h3>
    <p className="text-sm text-text-secondary mt-2">{description}</p>
  </div>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Icon name="logo" className="h-12 w-12 text-accent" />
          <h1 className="text-5xl font-bold">Nexus Platform</h1>
        </div>
        <p className="text-lg text-text-secondary">Selecione seu perfil para continuar</p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProfileCard
          icon="settings"
          title="Operator"
          description="Acesse o workspace de modelagem e o cockpit de gerenciamento."
          onClick={() => onLogin('operator')}
        />
        <ProfileCard
          icon="users"
          title="Client"
          description="Acompanhe o progresso de seus projetos e comunique-se com a equipe."
          onClick={() => onLogin('client')}
        />
        <ProfileCard
          icon="code"
          title="Team Member"
          description="Visualize suas tarefas, registre horas e colabore nos projetos."
          onClick={() => onLogin('team')}
        />
        <ProfileCard
          icon="shield"
          title="Admin"
          description="Gerencie usuários, permissões e configurações da plataforma."
          onClick={() => onLogin('admin')}
        />
      </div>
       <footer className="absolute bottom-4 text-sm text-text-secondary">
        &copy; {new Date().getFullYear()} Nexus Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;