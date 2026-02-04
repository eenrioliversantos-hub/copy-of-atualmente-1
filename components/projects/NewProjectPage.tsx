

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import Avatar from "../shared/Avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Checkbox } from "../ui/Checkbox"
import Icon from "../shared/Icon"
import { Project } from "../../types"

interface NewProjectPageProps {
  onBack: () => void;
  onSave: (projectData: any) => void;
  initialData?: Project | null;
}

export default function NewProjectPage({ onBack, onSave, initialData }: NewProjectPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>(initialData || {
    milestones: [],
    teamMembers: [],
    technologies: [],
    features: [],
    projectScope: 'client',
  })
  
  const isEditing = !!initialData;

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const projectTypes = [
    { value: "website", label: "Website/Landing Page" },
    { value: "webapp", label: "Aplicação Web" },
    { value: "mobile", label: "App Mobile" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "system", label: "Sistema Corporativo" },
    { value: "api", label: "API/Backend" },
  ]

  const priorities = [
    { value: "low", label: "Baixa", color: "bg-green-500/20 text-green-400" },
    { value: "medium", label: "Média", color: "bg-yellow-500/20 text-yellow-400" },
    { value: "high", label: "Alta", color: "bg-red-500/20 text-red-400" },
  ]

  const availableTeam = [
    { id: "1", name: "Carlos Silva", role: "Tech Lead", skills: ["React", "Node.js", "PostgreSQL"], hourlyRate: 120, avatar: "/placeholder-user.jpg", available: true },
    { id: "2", name: "Ana Santos", role: "Frontend Developer", skills: ["React", "Vue.js", "CSS"], hourlyRate: 80, avatar: "/placeholder-user.jpg", available: true },
    { id: "3", name: "Pedro Costa", role: "Backend Developer", skills: ["Node.js", "Python", "MongoDB"], hourlyRate: 90, avatar: "/placeholder-user.jpg", available: false },
    { id: "4", name: "Maria Oliveira", role: "Project Manager", skills: ["Scrum", "Kanban", "Leadership"], hourlyRate: 100, avatar: "/placeholder-user.jpg", available: true },
    { id: "5", name: "João Santos", role: "Fullstack Developer", skills: ["React", "Node.js", "MongoDB"], hourlyRate: 95, avatar: "/placeholder-user.jpg", available: true },
  ]

  const commonTechnologies = ["React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Node.js", "Express", "NestJS", "Python", "Django", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "AWS", "Vercel", "Docker", "Kubernetes", "Git"];

  const handleNext = () => { if (currentStep < totalSteps) setCurrentStep(currentStep + 1) }
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }
  const handleSubmit = () => {
    onSave(formData);
  }

  const addMilestone = () => {
    const newMilestone = { id: Date.now().toString(), name: "", date: "", description: "" };
    setFormData({ ...formData, milestones: [...formData.milestones, newMilestone] });
  };

  const removeMilestone = (id: string) => setFormData({ ...formData, milestones: formData.milestones.filter((m: any) => m.id !== id) });
  const updateMilestone = (id: string, field: string, value: string) => setFormData({ ...formData, milestones: formData.milestones.map((m: any) => (m.id === id ? { ...m, [field]: value } : m)) });

  const toggleTeamMember = (memberId: string) => {
    const isSelected = formData.teamMembers.includes(memberId);
    setFormData({ ...formData, teamMembers: isSelected ? formData.teamMembers.filter((id: string) => id !== memberId) : [...formData.teamMembers, memberId] });
  };
  
  const toggleTechnology = (tech: string) => {
    const isSelected = formData.technologies.includes(tech);
    setFormData({ ...formData, technologies: isSelected ? formData.technologies.filter((t: string) => t !== tech) : [...formData.technologies, tech] });
  };

  const addFeature = () => {
    const newFeature = { id: Date.now().toString(), name: "", description: "", priority: "medium" };
    setFormData({ ...formData, features: [...formData.features, newFeature] });
  };

  const removeFeature = (id: string) => setFormData({ ...formData, features: formData.features.filter((f: any) => f.id !== id) });
  const updateFeature = (id: string, field: string, value: string) => setFormData({ ...formData, features: formData.features.map((f: any) => (f.id === id ? { ...f, [field]: value } : f)) });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Informações Básicas</h2>
              <p className="text-text-secondary">Vamos começar com os dados fundamentais do projeto</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Sistema ERP - TechCorp" />
              </div>
              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descreva o projeto em detalhes..." rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectScope">Escopo do Projeto *</Label>
                  <Select value={formData.projectScope} onValueChange={(value) => setFormData({ ...formData, projectScope: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Para um Cliente</SelectItem>
                      <SelectItem value="internal">Projeto Interno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.projectScope === 'client' && (
                  <div>
                    <Label htmlFor="client">Cliente *</Label>
                    <Input id="client" value={formData.client || ''} onChange={(e) => setFormData({ ...formData, client: e.target.value })} placeholder="Nome do cliente ou empresa" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="type">Tipo de Projeto *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              </div>
               <div>
                  <Label>Prioridade *</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {priorities.map((priority) => (
                      <Card key={priority.value} className={`cursor-pointer transition-all hover:shadow-md ${formData.priority === priority.value ? "ring-2 ring-accent" : ""}`} onClick={() => setFormData({ ...formData, priority: priority.value })}>
                        <CardContent className="p-4 text-center">
                          <Badge variant="outline" className={priority.color}>{priority.label}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6"><div className="text-center mb-8"><h2 className="text-2xl font-bold mb-2">Cronograma</h2><p className="text-text-secondary">Defina prazos e marcos importantes</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="startDate">Data de Início *</Label><Input id="startDate" type="date" value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} /></div><div><Label htmlFor="endDate">Data de Entrega *</Label><Input id="endDate" type="date" value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} /></div></div><div><Label htmlFor="estimatedHours">Horas Estimadas</Label><Input id="estimatedHours" type="number" value={formData.estimatedHours || ''} onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })} placeholder="Ex: 160" /></div><div><div className="flex items-center justify-between mb-4"><Label>Marcos do Projeto</Label><Button onClick={addMilestone} variant="outline" size="sm" className="gap-2 bg-transparent"><Icon name="plus" className="h-4 w-4" />Adicionar Marco</Button></div><div className="space-y-3">{formData.milestones.map((milestone: any) => (<Card key={milestone.id}><CardContent className="p-4"><div className="flex items-center justify-between mb-3"><Input placeholder="Nome do marco" value={milestone.name} onChange={(e) => updateMilestone(milestone.id, "name", e.target.value)} /><Button onClick={() => removeMilestone(milestone.id)} variant="ghost" size="sm"><Icon name="x" className="h-4 w-4" /></Button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Input type="date" value={milestone.date} onChange={(e) => updateMilestone(milestone.id, "date", e.target.value)} /><Input placeholder="Descrição" value={milestone.description} onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)} /></div></CardContent></Card>))}</div></div></div>
        )
      case 3:
        return (
          <div className="space-y-6"><div className="text-center mb-8"><h2 className="text-2xl font-bold mb-2">Orçamento</h2><p className="text-text-secondary">Configure valores e condições de pagamento</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="budget">Orçamento Total *</Label><Input id="budget" type="number" value={formData.budget || ''} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} placeholder="Ex: 45000" /></div><div><Label htmlFor="hourlyRate">Valor por Hora</Label><Input id="hourlyRate" type="number" value={formData.hourlyRate || ''} onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} placeholder="Ex: 100" /></div></div><div><Label htmlFor="paymentTerms">Condições de Pagamento</Label><Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}><SelectTrigger><SelectValue placeholder="Selecione as condições" /></SelectTrigger><SelectContent><SelectItem value="50-50">50% início / 50% entrega</SelectItem><SelectItem value="30-70">30% início / 70% entrega</SelectItem><SelectItem value="monthly">Pagamento mensal</SelectItem><SelectItem value="milestones">Por marcos</SelectItem><SelectItem value="full-advance">100% antecipado</SelectItem><SelectItem value="full-delivery">100% na entrega</SelectItem></SelectContent></Select></div>{formData.budget && formData.estimatedHours && (<Card className="bg-accent/10 border-accent/30"><CardContent className="p-4"><h3 className="font-semibold mb-2">Resumo Financeiro</h3><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-text-secondary">Valor por hora calculado:</span><div className="font-semibold">R$ {(Number.parseFloat(formData.budget) / Number.parseFloat(formData.estimatedHours)).toFixed(2)}</div></div><div><span className="text-text-secondary">Margem estimada:</span><div className="font-semibold text-green-400">{formData.hourlyRate ? `${((Number.parseFloat(formData.budget) / Number.parseFloat(formData.estimatedHours) / Number.parseFloat(formData.hourlyRate) - 1) * 100).toFixed(1)}%` : "N/A"}</div></div></div></CardContent></Card>)}</div>
        )
      case 4:
        return (
          <div className="space-y-6"><div className="text-center mb-8"><h2 className="text-2xl font-bold mb-2">Equipe</h2><p className="text-text-secondary">Selecione os membros da equipe para este projeto</p></div><div><Label htmlFor="projectManager">Gerente do Projeto</Label><Select value={formData.projectManager} onValueChange={(value) => setFormData({ ...formData, projectManager: value })}><SelectTrigger><SelectValue placeholder="Selecione o gerente" /></SelectTrigger><SelectContent>{availableTeam.filter((member) => member.role.includes("Manager") || member.role.includes("Lead")).map((member) => (<SelectItem key={member.id} value={member.id}>{member.name} - {member.role}</SelectItem>))}</SelectContent></Select></div><div><Label className="text-base font-medium mb-4 block">Membros da Equipe</Label><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{availableTeam.map((member) => (<Card key={member.id} className={`cursor-pointer transition-all hover:shadow-md ${formData.teamMembers.includes(member.id) ? "ring-2 ring-accent bg-accent/10" : ""} ${!member.available ? "opacity-50" : ""}`} onClick={() => member.available && toggleTeamMember(member.id)}><CardContent className="p-4"><div className="flex items-center space-x-3"><Avatar src={member.avatar || "/placeholder.svg"} fallback={member.name.charAt(0)} alt={member.name} /><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold">{member.name}</h3><Checkbox checked={formData.teamMembers.includes(member.id)} disabled={!member.available} /></div><p className="text-sm text-text-secondary">{member.role}</p><p className="text-sm text-green-400">R$ {member.hourlyRate}/hora</p>{!member.available && (<Badge variant="outline" className="text-xs mt-1">Indisponível</Badge>)}</div></div><div className="mt-3"><div className="text-xs text-text-secondary mb-1">Habilidades:</div><div className="flex flex-wrap gap-1">{member.skills.slice(0, 3).map((skill, idx) => (<Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>))}{member.skills.length > 3 && (<Badge variant="outline" className="text-xs">+{member.skills.length - 3}</Badge>)}</div></div></CardContent></Card>))}</div></div>{formData.teamMembers.length > 0 && (<Card className="bg-green-500/10 border-green-500/30"><CardContent className="p-4"><h3 className="font-semibold mb-2">Equipe Selecionada</h3><div className="text-sm"><div className="mb-2"><strong>Membros:</strong> {formData.teamMembers.length}</div><div><strong>Custo médio/hora:</strong> R$ {(formData.teamMembers.reduce((acc: number, memberId: string) => { const member = availableTeam.find((m) => m.id === memberId); return acc + (member ? member.hourlyRate : 0) }, 0) / formData.teamMembers.length).toFixed(2)}</div></div></CardContent></Card>)}</div>
        )
      case 5:
        return (
          <div className="space-y-6"><div className="text-center mb-8"><h2 className="text-2xl font-bold mb-2">Tecnologias e Requisitos</h2><p className="text-text-secondary">Defina as tecnologias e funcionalidades</p></div><div><Label className="text-base font-medium mb-4 block">Tecnologias</Label><div className="grid grid-cols-3 md:grid-cols-5 gap-2">{commonTechnologies.map((tech) => (<Badge key={tech} variant={formData.technologies.includes(tech) ? "default" : "outline"} className={`cursor-pointer text-center justify-center py-2 ${formData.technologies.includes(tech) ? "bg-accent" : ""}`} onClick={() => toggleTechnology(tech)}>{tech}</Badge>))}</div></div><div><Label htmlFor="requirements">Requisitos Técnicos</Label><Textarea id="requirements" value={formData.requirements || ''} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Descreva os requisitos técnicos específicos..." rows={4} /></div><div><div className="flex items-center justify-between mb-4"><Label>Funcionalidades</Label><Button onClick={addFeature} variant="outline" size="sm" className="gap-2 bg-transparent"><Icon name="plus" className="h-4 w-4" />Adicionar Funcionalidade</Button></div><div className="space-y-3">{formData.features.map((feature: any) => (<Card key={feature.id}><CardContent className="p-4"><div className="flex items-center justify-between mb-3"><Input placeholder="Nome da funcionalidade" value={feature.name} onChange={(e) => updateFeature(feature.id, "name", e.target.value)} /><Button onClick={() => removeFeature(feature.id)} variant="ghost" size="sm"><Icon name="x" className="h-4 w-4" /></Button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="md:col-span-2"><Input placeholder="Descrição" value={feature.description} onChange={(e) => updateFeature(feature.id, "description", e.target.value)} /></div><Select value={feature.priority} onValueChange={(value) => updateFeature(feature.id, "priority", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Baixa</SelectItem><SelectItem value="medium">Média</SelectItem><SelectItem value="high">Alta</SelectItem></SelectContent></Select></div></CardContent></Card>))}</div></div><Card className="bg-sidebar"><CardHeader><CardTitle className="text-lg">Resumo do Projeto</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><strong>Nome:</strong> {formData.name || "Não informado"}</div><div><strong>Cliente:</strong> {formData.client || "Não informado"}</div><div><strong>Tipo:</strong> {projectTypes.find((t) => t.value === formData.type)?.label || "Não selecionado"}</div><div><strong>Prioridade:</strong> {priorities.find((p) => p.value === formData.priority)?.label || "Não selecionada"}</div><div><strong>Orçamento:</strong> R$ {formData.budget || "0"}</div><div><strong>Prazo:</strong> {formData.startDate && formData.endDate ? `${formData.startDate} - ${formData.endDate}` : "Não definido"}</div><div><strong>Equipe:</strong> {formData.teamMembers.length} membros</div><div><strong>Tecnologias:</strong> {formData.technologies.length} selecionadas</div></div></CardContent></Card></div>
        )
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <Icon name="chevronLeft" className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h1>
                <p className="text-text-secondary">{isEditing ? `Editando "${initialData.name}"` : 'Crie um novo projeto passo a passo'}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent">Etapa {currentStep} de {totalSteps}</Badge>
          </div>
          {/* Progress */}
          <div className="mb-8"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Progresso</span><span className="text-sm text-text-secondary">{Math.round(progress)}%</span></div><Progress value={progress} className="h-2" /></div>
          {/* Form */}
          <Card className="border-0 shadow-lg"><CardContent className="p-8">{renderStep()}</CardContent></Card>
          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="gap-2 bg-transparent">
              <Icon name="chevronLeft" className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i + 1 <= currentStep ? "bg-accent" : "bg-card-border"}`} />))}
            </div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="gap-2">
                Próximo<Icon name="arrowRight" className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2 bg-green-600 hover:bg-green-700">
                <Icon name="checkCircle" className="h-4 w-4" />
                {isEditing ? 'Salvar Alterações' : 'Criar Projeto'}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}