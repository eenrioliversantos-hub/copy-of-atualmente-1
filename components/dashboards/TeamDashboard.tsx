
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Avatar from '../shared/Avatar';
import { Badge } from '../ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import Icon from '../shared/Icon';
import CommunicationHub from '../communication/CommunicationHub';
import { 
    Message, Conversation, Appointment, SupportTicket, KnowledgeBaseArticle, Client 
} from '../../types';
import { TeamMember } from '../team/OperatorTeamPage';

interface TeamDashboardProps {
  onLogout: () => void;
  // Communication Hub Props
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  appointments: Appointment[];
  tickets: SupportTicket[];
  knowledgeBase: KnowledgeBaseArticle[];
  teamMembers: TeamMember[];
  clients: Client[];
  onSendMessage: (conversationId: string, text: string) => void;
  onScheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdate' | 'createdAt'>) => void;
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: "home" },
  { id: "cockpit", name: "Cockpit", icon: "gauge" },
  { id: "academy", name: "Academia Principal", icon: "graduationCap" },
  { id: "projects", name: "Projetos", icon: "briefcase" },
  { id: "tasks", name: "Tarefas", icon: "checkSquare" },
  { id: "workspace", name: "Workspace", icon: "folderOpen" },
  { id: "communication", name: "Comunicação", icon: "messageSquare" },
];

const teamNavigation = [{ id: "settings", name: "Configurações", icon: "settings" }];

// Orange theme classes
const activeBg = 'bg-orange-500/20';
const activeText = 'text-orange-400';
const hoverBg = 'hover:bg-slate-700';

const NavItem: React.FC<{ item: { id: string; name: string; icon: string; }; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isActive
                ? `${activeBg} ${activeText}`
                : `text-text-secondary ${hoverBg} hover:text-text-primary`
            }`}
        >
            <Icon
                name={item.icon}
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? activeText : "text-text-secondary group-hover:text-text-primary"
                }`}
            />
            {item.name}
        </button>
    );
};


const SidebarContent: React.FC<{
    currentView: string;
    setCurrentView: (view: string) => void;
    onClose?: () => void;
}> = ({ currentView, setCurrentView, onClose }) => (
     <div className="flex flex-col flex-grow bg-sidebar pt-5 pb-4 overflow-y-auto h-full border-r border-card-border">
        <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                     <Icon name="users" className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Nexus</h1>
                    <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400">Equipe</Badge>
                </div>
            </div>
            {onClose && (
                <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-white">
                    <Icon name="x" className="h-6 w-6" />
                </button>
            )}
        </div>
        <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        isActive={currentView === item.id}
                        onClick={() => {
                            setCurrentView(item.id);
                            onClose?.();
                        }}
                    />
                ))}
            </nav>
            <div className="px-2 mt-auto">
                <div className="border-t border-card-border pt-4">
                    <p className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Equipe</p>
                    <nav className="mt-2 space-y-1">
                         {teamNavigation.map((item) => (
                            <NavItem
                                key={item.name}
                                item={item}
                                isActive={currentView === item.id}
                                onClick={() => {
                                    setCurrentView(item.id);
                                    onClose?.();
                                }}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    </div>
);


const TeamDashboard: React.FC<TeamDashboardProps> = (props) => {
    const { onLogout } = props;
    const [view, setView] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch(view) {
            case 'communication':
                return <CommunicationHub onBack={() => setView('dashboard')} {...props} />;
            default:
                return (
                     <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Página de {view}</h2>
                        <p className="text-text-secondary">Conteúdo em desenvolvimento.</p>
                    </div>
                );
        }
    };
    
    const fullScreenViews = ['communication'];
    if (fullScreenViews.includes(view)) {
        return renderContent();
    }


    return (
        <div className="flex h-screen bg-background text-text-primary">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <SidebarContent currentView={view} setCurrentView={setView} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-sidebar shadow-sm border-b border-card-border">
                    <button
                        className="px-4 border-r border-card-border text-text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Icon name="menu" className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                           <div className="w-full max-w-md flex md:ml-0">
                                <div className="relative w-full text-text-secondary focus-within:text-text-primary">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><Icon name="search" className="h-5 w-5" /></div>
                                    <input className="block w-full h-full pl-8 pr-3 py-2 border-transparent bg-transparent text-text-primary placeholder-text-secondary focus:outline-none focus:ring-0 sm:text-sm" placeholder="Buscar..." type="search"/>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <Button variant="ghost" size="sm" className="p-1 relative rounded-full">
                                <Icon name="bell" className="h-6 w-6 text-text-secondary" />
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white flex items-center justify-center">1</Badge>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-3 p-0 ring-2 ring-transparent hover:ring-orange-400">
                                        <Avatar src="" alt="Equipe" fallback="EQ" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">Membro da Equipe</p><p className="text-xs leading-none text-text-secondary">equipe@nexus.com</p></div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><Icon name="user" className="mr-2 h-4 w-4" /><span>Perfil</span></DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setView("settings")}><Icon name="cog" className="mr-2 h-4 w-4" /><span>Configurações</span></DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout}><Icon name="logOut" className="mr-2 h-4 w-4" /><span>Sair</span></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Conteúdo da página */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
export default TeamDashboard;
