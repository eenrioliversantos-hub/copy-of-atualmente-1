import React from 'react';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';

interface CommunicationSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onBack: () => void;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layoutGrid' },
    { id: 'messages', label: 'Mensagens', icon: 'messageCircle' },
    { id: 'appointments', label: 'Agendamentos', icon: 'calendarDays' },
    { id: 'tickets', label: 'Tickets de Suporte', icon: 'ticket' },
    { id: 'knowledge-base', label: 'Base de Conhecimento', icon: 'book' },
    { id: 'contacts', label: 'Contatos', icon: 'users' },
];

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? 'bg-accent text-white font-medium'
          : 'text-text-secondary hover:bg-slate-700 hover:text-text-primary'
      }`}
    >
      <Icon name={icon} className="mr-3 h-5 w-5" />
      <span>{label}</span>
    </button>
  );
};

const CommunicationSidebar: React.FC<CommunicationSidebarProps> = ({ activeView, setActiveView, onBack }) => {
    return (
        <aside className="w-72 bg-sidebar flex flex-col p-4 border-r border-card-border flex-shrink-0">
            <div className="px-2 mb-4">
                 <Button variant="ghost" onClick={onBack} className="w-full justify-start gap-2 text-text-secondary hover:text-text-primary mb-4">
                    <Icon name="arrowLeft" className="h-4 w-4" />
                    Voltar ao Painel Principal
                </Button>
                <h2 className="text-xl font-semibold">Central de Comunicação</h2>
                <p className="text-sm text-text-secondary">Conecte-se com sua equipe e clientes.</p>
            </div>
            
            <div className="mb-4">
                 <Button className="w-full gap-2">
                    <Icon name="plus" className="h-4 w-4" />
                    Nova Mensagem
                </Button>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default CommunicationSidebar;