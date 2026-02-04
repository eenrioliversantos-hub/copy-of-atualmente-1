import React, { useState } from 'react';
import CommunicationSidebar from './CommunicationSidebar';
import CommunicationDashboard from './views/CommunicationDashboard';
import MessagesPage from './views/MessagesPage';
import AppointmentsPage from './views/AppointmentsPage';
import SupportTicketsPage from './views/SupportTicketsPage';
import KnowledgeBasePage from './views/KnowledgeBasePage';
import ContactsPage from './views/ContactsPage';
import { 
    Message, Conversation, Appointment, SupportTicket, KnowledgeBaseArticle, Client 
} from '../../types';
import { TeamMember } from '../team/OperatorTeamPage';

interface CommunicationHubProps {
    onBack: () => void;
    // State props
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    appointments: Appointment[];
    tickets: SupportTicket[];
    knowledgeBase: KnowledgeBaseArticle[];
    teamMembers: TeamMember[];
    clients: Client[];
    // Handler props
    onSendMessage: (conversationId: string, text: string) => void;
    onScheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
    onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdate' | 'createdAt'>) => void;
}

const CommunicationHub: React.FC<CommunicationHubProps> = (props) => {
    const { onBack, conversations, messages, appointments, tickets, knowledgeBase, teamMembers, clients, onSendMessage, onScheduleAppointment, onCreateTicket } = props;
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <CommunicationDashboard setActiveView={setActiveView} />;
            case 'messages':
                return <MessagesPage 
                            conversations={conversations} 
                            messages={messages} 
                            onSendMessage={onSendMessage} 
                        />;
            case 'appointments':
                return <AppointmentsPage 
                            appointments={appointments}
                            onScheduleAppointment={onScheduleAppointment}
                        />;
            case 'tickets':
                return <SupportTicketsPage 
                            tickets={tickets}
                            onCreateTicket={onCreateTicket}
                        />;
            case 'knowledge-base':
                 return <KnowledgeBasePage articles={knowledgeBase} />;
            case 'contacts':
                return <ContactsPage teamMembers={teamMembers} clients={clients} />;
            default:
                return <CommunicationDashboard setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <CommunicationSidebar activeView={activeView} setActiveView={setActiveView} onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default CommunicationHub;