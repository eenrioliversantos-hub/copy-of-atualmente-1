import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import Avatar from "../shared/Avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import Icon from "../shared/Icon"
import { Project } from "../../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/DropdownMenu"

interface ProjectPageProps {
  projects: Project[];
  onNewProject: () => void;
  onProjectSelect: (project: Project) => void;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectPage({ projects, onNewProject, onProjectSelect, onEdit, onDelete }: ProjectPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Mock data for display purposes; will be replaced by props.
  const mockTeam = [
    { name: "Carlos Silva", role: "Tech Lead", avatar: "/placeholder-user.jpg" },
    { name: "Ana Santos", role: "Frontend", avatar: "/placeholder-user.jpg" },
    { name: "Pedro Costa", role: "Backend", avatar: "/placeholder-user.jpg" },
  ];

  const stats = [
    { title: "Total de Projetos", value: projects.length.toString(), change: "+2 este mês", icon: "calendar", color: "text-accent", bgColor: "bg-accent/10" },
    { title: "Em Andamento", value: "0", change: "0% de progresso médio", icon: "play", color: "text-green-400", bgColor: "bg-green-500/10" },
    { title: "Receita Total", value: `R$ ${projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0).toLocaleString()}`, change: "+18% vs mês anterior", icon: "dollar-sign", color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { title: "Equipe Ativa", value: "12", change: `${projects.length} projetos ativos`, icon: "users", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-accent/20 text-accent";
      case "in_progress": return "bg-green-500/20 text-green-400";
      case "completed": return "bg-slate-700 text-slate-300";
      case "on_hold": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-sidebar text-text-secondary";
    }
  }

  const getStatusLabel = (status: string) => ({ planning: "Planejamento", in_progress: "Em Andamento", completed: "Concluído", on_hold: "Pausado" }[status] || status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-text-secondary bg-sidebar";
    }
  }

  const getPriorityLabel = (priority: string) => ({ high: "Alta", medium: "Média", low: "Baixa" }[priority] || priority);

  const filteredProjects = projects.filter((project) => {
    const clientName = project.client || '';
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  })

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projetos</h1>
            <p className="text-text-secondary mt-1">Gerencie todos os projetos da sua empresa</p>
          </div>
          <Button onClick={onNewProject} className="gap-2">
            <Icon name="plus" className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}><Icon name={stat.icon} className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div><p className="text-xs text-text-secondary">{stat.change}</p></CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input placeholder="Buscar projetos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Prioridade" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as Prioridades</SelectItem><SelectItem value="high">Alta</SelectItem><SelectItem value="medium">Média</SelectItem><SelectItem value="low">Baixa</SelectItem></SelectContent></Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow hover:border-accent cursor-pointer"
              onClick={() => onProjectSelect(project)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            <Badge className={getPriorityColor(project.priority)} variant="outline">{getPriorityLabel(project.priority)}</Badge>
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-text-secondary">• {project.client || 'Projeto Interno'}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <Icon name="moreHorizontal" className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        {/* FIX: Removed onClick from DropdownMenuContent as it's not a valid prop. Event handling is now managed within the component. */}
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(project.id)}>
                                <Icon name="edit" className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                                <Icon name="trash" className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Progresso</span><span className="text-sm text-text-secondary">0%</span></div><Progress value={0} className="h-2" /></div>
                <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Orçamento:</span><span className="font-medium">R$ {Number(project.budget || 0).toLocaleString()}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Prazo:</span><span className="font-medium">{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span></div>
                <div><span className="text-sm text-text-secondary mb-2 block">Tecnologias:</span><div className="flex flex-wrap gap-1">{project.technologies.map((tech, idx) => (<Badge key={idx} variant="outline" className="text-xs">{tech}</Badge>))}</div></div>
                <div><span className="text-sm text-text-secondary mb-2 block">Marcos:</span><div className="flex items-center space-x-2">{project.milestones.map((milestone, idx) => (<div key={idx} className="flex items-center space-x-1">{false ? (<Icon name="checkCircle" className="h-4 w-4 text-green-500" />) : (<div className="h-3 w-3 border-2 border-text-secondary rounded-full" />)}<span className={`text-xs ${false ? "text-green-400" : "text-text-secondary"}`}>{milestone.name}</span></div>))}</div></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="alertCircle" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-text-secondary mb-4">{searchTerm || priorityFilter !== "all" ? "Tente ajustar os filtros de busca" : "Comece criando seu primeiro projeto"}</p>
              {!searchTerm && priorityFilter === "all" && (<Button onClick={onNewProject} className="gap-2"><Icon name="plus" className="h-4 w-4" />Criar Primeiro Projeto</Button>)}
            </CardContent>
          </Card>
        )}
      </div>
  );
}