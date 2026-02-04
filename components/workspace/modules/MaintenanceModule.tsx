"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { Label } from "../../ui/Label"
import { Textarea } from "../../ui/Textarea"
import { Checkbox } from "../../ui/Checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/Select"
import Icon from "../../shared/Icon"

interface MaintenanceModuleProps {
  currentPhase: any
  onPhaseComplete: (phaseId: string, data: any) => void
  moduleData: any
}

export default function MaintenanceModule({ currentPhase, onPhaseComplete, moduleData }: MaintenanceModuleProps) {
  const [formData, setFormData] = useState<any>(moduleData[currentPhase.id] || {})

  const handleSave = () => {
    onPhaseComplete(currentPhase.id, formData)
  }
  
  const handleCheckboxChange = (group: string, item: string, isChecked: boolean) => {
    const currentItems = formData[group] || [];
    const newItems = isChecked
      ? [...currentItems, item]
      : currentItems.filter((i: string) => i !== item);
    setFormData({ ...formData, [group]: newItems });
  };


  const renderPhaseContent = () => {
    switch (currentPhase.id) {
      case "current-analysis":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="file-text" className="h-5 w-5" />
                  Análise do Sistema Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Nome do Projeto *</Label>
                  <Input
                    id="projectName"
                    placeholder="Nome do sistema/projeto atual"
                    value={formData.projectName || ""}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="currentDescription">Descrição Atual do Sistema *</Label>
                  <Textarea
                    id="currentDescription"
                    placeholder="Descreva o que o sistema faz atualmente..."
                    value={formData.currentDescription || ""}
                    onChange={(e) => setFormData({ ...formData, currentDescription: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="currentTech">Tecnologias Atuais *</Label>
                  <Textarea
                    id="currentTech"
                    placeholder="Linguagens, frameworks, banco de dados, infraestrutura..."
                    value={formData.currentTech || ""}
                    onChange={(e) => setFormData({ ...formData, currentTech: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectAge">Idade do Projeto</Label>
                    <Select
                      value={formData.projectAge}
                      onValueChange={(value) => setFormData({ ...formData, projectAge: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-6months">0-6 meses</SelectItem>
                        <SelectItem value="6months-1year">6 meses - 1 ano</SelectItem>
                        <SelectItem value="1-2years">1-2 anos</SelectItem>
                        <SelectItem value="2-5years">2-5 anos</SelectItem>
                        <SelectItem value="5+years">5+ anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="teamSize">Tamanho da Equipe</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo</SelectItem>
                        <SelectItem value="2-3">2-3 pessoas</SelectItem>
                        <SelectItem value="4-10">4-10 pessoas</SelectItem>
                        <SelectItem value="10+">10+ pessoas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentUsers">Usuários Atuais</Label>
                  <Input
                    id="currentUsers"
                    placeholder="Quantos usuários usam o sistema atualmente"
                    value={formData.currentUsers || ""}
                    onChange={(e) => setFormData({ ...formData, currentUsers: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="businessImpact">Impacto no Negócio</Label>
                  <Textarea
                    id="businessImpact"
                    placeholder="Como o sistema impacta o negócio atualmente..."
                    value={formData.businessImpact || ""}
                    onChange={(e) => setFormData({ ...formData, businessImpact: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!formData.projectName || !formData.currentDescription || !formData.currentTech}
              >
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Salvar Análise
              </Button>
            </div>
          </div>
        )

      case "problem-identification":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="alertCircle" className="h-5 w-5" />
                  Identificação de Problemas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Problemas Técnicos</Label>
                  <div className="space-y-3 mt-2">
                    {[
                      "Performance lenta",
                      "Bugs frequentes",
                      "Código difícil de manter",
                      "Tecnologias desatualizadas",
                      "Falta de testes",
                      "Problemas de segurança",
                      "Escalabilidade limitada",
                      "Documentação inadequada",
                    ].map((problem) => (
                      <div key={problem} className="flex items-center space-x-2">
                        <Checkbox
                          id={problem}
                          checked={(formData.technicalProblems || []).includes(problem)}
                          onChange={(e) => handleCheckboxChange('technicalProblems', problem, e.target.checked)}
                        />
                        <Label htmlFor={problem} className="text-sm cursor-pointer font-normal">
                          {problem}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specificIssues">Problemas Específicos *</Label>
                  <Textarea
                    id="specificIssues"
                    placeholder="Descreva problemas específicos que você está enfrentando..."
                    value={formData.specificIssues || ""}
                    onChange={(e) => setFormData({ ...formData, specificIssues: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="userComplaints">Reclamações dos Usuários</Label>
                  <Textarea
                    id="userComplaints"
                    placeholder="Feedback negativo ou problemas relatados pelos usuários..."
                    value={formData.userComplaints || ""}
                    onChange={(e) => setFormData({ ...formData, userComplaints: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="businessImpact">Impacto nos Negócios</Label>
                  <Textarea
                    id="businessImpact"
                    placeholder="Como esses problemas afetam o negócio..."
                    value={formData.businessImpact || ""}
                    onChange={(e) => setFormData({ ...formData, businessImpact: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Nível de Urgência</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa - Pode esperar</SelectItem>
                      <SelectItem value="medium">Média - Algumas semanas</SelectItem>
                      <SelectItem value="high">Alta - Precisa resolver logo</SelectItem>
                      <SelectItem value="critical">Crítica - Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.specificIssues}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Salvar Problemas
              </Button>
            </div>
          </div>
        )

      case "upgrade-suggestions":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="trendingUp" className="h-5 w-5" />
                  Sugestões de Atualização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Atualizações Tecnológicas</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      { category: "Frontend", items: ["React 18", "Next.js 14", "TypeScript", "Tailwind CSS"] },
                      { category: "Backend", items: ["Node.js LTS", "Express 5", "Fastify", "tRPC"] },
                      { category: "Database", items: ["PostgreSQL 15", "Prisma ORM", "Redis", "MongoDB 7"] },
                      { category: "DevOps", items: ["Docker", "Kubernetes", "GitHub Actions", "Vercel"] },
                    ].map((group) => (
                      <Card key={group.category} className="p-4">
                        <h4 className="font-medium mb-3">{group.category}</h4>
                        <div className="space-y-2">
                          {group.items.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${group.category}-${item}`}
                                checked={(formData.techUpgrades || []).includes(item)}
                                onChange={(e) => handleCheckboxChange('techUpgrades', item, e.target.checked)}
                              />
                              <Label htmlFor={`${group.category}-${item}`} className="text-sm cursor-pointer font-normal">
                                {item}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="architectureImprovements">Melhorias de Arquitetura *</Label>
                  <Textarea
                    id="architectureImprovements"
                    placeholder="Sugestões para melhorar a arquitetura do sistema..."
                    value={formData.architectureImprovements || ""}
                    onChange={(e) => setFormData({ ...formData, architectureImprovements: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="securityImprovements">Melhorias de Segurança</Label>
                  <Textarea
                    id="securityImprovements"
                    placeholder="Implementar autenticação, HTTPS, validações..."
                    value={formData.securityImprovements || ""}
                    onChange={(e) => setFormData({ ...formData, securityImprovements: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="performanceImprovements">Melhorias de Performance</Label>
                  <Textarea
                    id="performanceImprovements"
                    placeholder="Cache, otimizações, lazy loading..."
                    value={formData.performanceImprovements || ""}
                    onChange={(e) => setFormData({ ...formData, performanceImprovements: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="newFeatures">Novas Funcionalidades</Label>
                  <Textarea
                    id="newFeatures"
                    placeholder="Funcionalidades que poderiam ser adicionadas..."
                    value={formData.newFeatures || ""}
                    onChange={(e) => setFormData({ ...formData, newFeatures: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.architectureImprovements}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Salvar Sugestões
              </Button>
            </div>
          </div>
        )

      case "action-plan":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="clock" className="h-5 w-5" />
                  Plano de Ação Incremental
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="timeline">Prazo Total Desejado *</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2weeks">1-2 semanas</SelectItem>
                      <SelectItem value="1month">1 mês</SelectItem>
                      <SelectItem value="2-3months">2-3 meses</SelectItem>
                      <SelectItem value="6months">6 meses</SelectItem>
                      <SelectItem value="1year">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Priorização das Melhorias</Label>
                  <div className="space-y-4 mt-2">
                    {[
                      {
                        phase: "Fase 1 - Crítico",
                        description: "Problemas que precisam ser resolvidos imediatamente",
                        color: "border-red-500/30 bg-red-500/10",
                      },
                      {
                        phase: "Fase 2 - Importante",
                        description: "Melhorias importantes mas não urgentes",
                        color: "border-yellow-500/30 bg-yellow-500/10",
                      },
                      {
                        phase: "Fase 3 - Desejável",
                        description: "Melhorias que podem ser feitas no futuro",
                        color: "border-blue-500/30 bg-blue-500/10",
                      },
                    ].map((phase) => (
                      <Card key={phase.phase} className={phase.color}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{phase.phase}</h4>
                          <p className="text-sm text-text-secondary mb-3">{phase.description}</p>
                          <Textarea
                            placeholder={`Descreva as ações para ${phase.phase.toLowerCase()}...`}
                            value={formData[`phase${phase.phase.charAt(5)}`] || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, [`phase${phase.phase.charAt(5)}`]: e.target.value })
                            }
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="resources">Recursos Necessários</Label>
                  <Textarea
                    id="resources"
                    placeholder="Equipe, ferramentas, orçamento, tempo..."
                    value={formData.resources || ""}
                    onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="risks">Riscos e Mitigações</Label>
                  <Textarea
                    id="risks"
                    placeholder="Possíveis riscos e como mitigá-los..."
                    value={formData.risks || ""}
                    onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="successMetrics">Métricas de Sucesso</Label>
                  <Textarea
                    id="successMetrics"
                    placeholder="Como medir se as melhorias foram bem-sucedidas..."
                    value={formData.successMetrics || ""}
                    onChange={(e) => setFormData({ ...formData, successMetrics: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.timeline || !formData.phase1}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Finalizar Plano
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Fase não encontrada</div>
    }
  }

  return <div>{renderPhaseContent()}</div>
}
