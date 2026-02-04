import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import Avatar from "../shared/Avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Icon from "../shared/Icon"
import TeamMemberForm from "./TeamMemberForm"

export interface TeamMember {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Fullstack' | 'Designer' | 'Project Manager' | 'Tech Lead';
  email: string;
  status: 'active' | 'on_leave' | 'inactive';
  projectsAssigned: number;
  hourlyRate: number;
  avatar: string;
  skills: string[];
}

const initialTeam: TeamMember[] = [
    {
      id: "1",
      name: "Carlos Silva",
      role: "Tech Lead",
      email: "carlos@nexus.com",
      status: "active",
      projectsAssigned: 3,
      hourlyRate: 120,
      avatar: "/placeholder-user.jpg",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      id: "2",
      name: "Ana Santos",
      role: "Frontend",
      email: "ana@nexus.com",
      status: "active",
      projectsAssigned: 2,
      hourlyRate: 80,
      avatar: "/placeholder-user.jpg",
      skills: ["React", "Vue.js", "Tailwind CSS"],
    },
    {
      id: "3",
      name: "Pedro Costa",
      role: "Backend",
      email: "pedro@nexus.com",
      status: "on_leave",
      projectsAssigned: 1,
      hourlyRate: 90,
      avatar: "/placeholder-user.jpg",
      skills: ["Node.js", "Python", "MongoDB"],
    },
     {
      id: "4",
      name: "Maria Oliveira",
      role: "Project Manager",
      email: "maria@nexus.com",
      status: "active",
      projectsAssigned: 4,
      hourlyRate: 100,
      avatar: "/placeholder-user.jpg",
      skills: ["Scrum", "Kanban", "Jira"],
    },
  ];

export default function OperatorTeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleNewMember = () => {
    setEditingMember(null);
    setIsFormVisible(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormVisible(true);
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm("Tem certeza que deseja remover este membro da equipe?")) {
      setTeam(team.filter(m => m.id !== memberId));
    }
  };

  const handleSaveMember = (memberData: TeamMember) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === memberData.id ? memberData : m));
    } else {
      setTeam([...team, { ...memberData, id: Date.now().toString() }]);
    }
    setIsFormVisible(false);
    setEditingMember(null);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingMember(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "on_leave": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "inactive": return "text-text-secondary bg-sidebar border-card-border";
      default: return "text-text-secondary bg-sidebar border-card-border";
    }
  };

  const filteredTeam = team.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || member.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (isFormVisible) {
    return <TeamMemberForm initialData={editingMember} onSave={handleSaveMember} onCancel={handleCancelForm} />;
  }

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Equipe</h1>
            <p className="text-text-secondary">Gerencie os membros da sua equipe</p>
          </div>
          <Button className="gap-2" onClick={handleNewMember}>
            <Icon name="userPlus" className="h-4 w-4" />
            Novo Membro
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Total de Membros</CardTitle><Icon name="users" className="h-4 w-4 text-text-secondary" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{team.length}</div><p className="text-xs text-text-secondary">+1 este mês</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Custo / Hora</CardTitle><Icon name="dollar-sign" className="h-4 w-4 text-text-secondary" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">R$ 98,75</div><p className="text-xs text-text-secondary">Média da equipe</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Projetos Ativos</CardTitle><Icon name="briefcase" className="h-4 w-4 text-text-secondary" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">8</div><p className="text-xs text-text-secondary">Membros alocados: {team.filter(m => m.projectsAssigned > 0).length}</p></CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Membros Disponíveis</CardTitle><Icon name="user" className="h-4 w-4 text-text-secondary" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{team.filter(m => m.status === 'active' && m.projectsAssigned === 0).length}</div><p className="text-xs text-text-secondary">Para alocação</p></CardContent>
          </Card>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm"><Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" /><Input placeholder="Buscar membros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
          <Button variant="outline" className="gap-2 bg-transparent"><Icon name="filter" className="h-4 w-4" />Filtros</Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList><TabsTrigger value="all">Todos</TabsTrigger><TabsTrigger value="active">Ativos</TabsTrigger><TabsTrigger value="on_leave">Em Licença</TabsTrigger><TabsTrigger value="inactive">Inativos</TabsTrigger></TabsList>
          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeam.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow hover:border-accent flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3"><Avatar src={member.avatar || "/placeholder.svg"} fallback={member.name.charAt(0)} alt={member.name} /><div className="flex-1"><CardTitle className="text-lg">{member.name}</CardTitle><CardDescription>{member.role}</CardDescription></div></div>
                      <Badge variant="outline" className={getStatusColor(member.status)}>{member.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex flex-col flex-grow">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-text-secondary">Projetos:</span><p className="font-medium">{member.projectsAssigned}</p></div>
                      <div><span className="text-text-secondary">Custo/Hora:</span><p className="font-medium text-green-400">R$ {member.hourlyRate}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-1"><span className="text-sm text-text-secondary mr-2">Skills:</span>{member.skills.slice(0, 4).map((skill, index) => (<Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>))}{member.skills.length > 4 && <Badge variant="secondary" className="text-xs">+{member.skills.length - 4}</Badge>}</div>
                    <div className="mt-auto pt-4 border-t border-card-border flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEditMember(member)}><Icon name="edit" className="h-4 w-4 mr-2" />Editar</Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent hover:border-red-500/50 hover:text-red-400" onClick={() => handleDeleteMember(member.id)}><Icon name="trash" className="h-4 w-4 mr-2" />Remover</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
