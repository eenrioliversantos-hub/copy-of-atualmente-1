"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { Label } from "../../ui/Label"
import { Textarea } from "../../ui/Textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tabs"
import Icon from "../../shared/Icon"

interface FromTemplateModuleProps {
  currentPhase: any
  onPhaseComplete: (phaseId: string, data: any) => void
  moduleData: any
}

export default function FromTemplateModule({ currentPhase, onPhaseComplete, moduleData }: FromTemplateModuleProps) {
  const [formData, setFormData] = useState<any>(moduleData[currentPhase.id] || {})

  const handleSave = () => {
    onPhaseComplete(currentPhase.id, formData)
  }

  const renderPhaseContent = () => {
    switch (currentPhase.id) {
      case "upload":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="upload" className="h-5 w-5" />
                  Fonte do Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="github" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="github">GitHub</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="description">Descrição</TabsTrigger>
                  </TabsList>

                  <TabsContent value="github" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="githubUrl">URL do Repositório GitHub *</Label>
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/usuario/repositorio"
                        value={formData.githubUrl || ""}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value, sourceType: "github" })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch (opcional)</Label>
                      <Input
                        id="branch"
                        placeholder="main"
                        value={formData.branch || ""}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-card-border rounded-lg p-8 text-center">
                      <Icon name="upload" className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload de Arquivos</h3>
                      <p className="text-text-secondary mb-4">Arraste arquivos ZIP ou selecione do seu computador</p>
                      <Button variant="outline">Selecionar Arquivos</Button>
                    </div>
                    <div>
                      <Label htmlFor="uploadDescription">Descrição do Template</Label>
                      <Textarea
                        id="uploadDescription"
                        placeholder="Descreva o que contém no template..."
                        value={formData.uploadDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, uploadDescription: e.target.value, sourceType: "upload" })
                        }
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="templateDescription">Descrição Completa do Template *</Label>
                      <Textarea
                        id="templateDescription"
                        placeholder="Descreva detalhadamente o template que você quer analisar..."
                        value={formData.templateDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, templateDescription: e.target.value, sourceType: "description" })
                        }
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="technologies">Tecnologias Utilizadas</Label>
                      <Input
                        id="technologies"
                        placeholder="React, Node.js, PostgreSQL..."
                        value={formData.technologies || ""}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={
                  !formData.sourceType ||
                  (formData.sourceType === "github" && !formData.githubUrl) ||
                  (formData.sourceType === "description" && !formData.templateDescription)
                }
              >
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Analisar Template
              </Button>
            </div>
          </div>
        )

      case "analysis":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="file-text" className="h-5 w-5" />
                  Diagnóstico do Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-500/30 bg-green-500/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-300 flex items-center gap-2">
                        <Icon name="checkCircle" className="h-5 w-5" />O que já está pronto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Liste o que já está implementado no template..."
                        value={formData.readyFeatures || ""}
                        onChange={(e) => setFormData({ ...formData, readyFeatures: e.target.value })}
                        rows={6}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-500/30 bg-yellow-500/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-yellow-300 flex items-center gap-2">
                        <Icon name="alertCircle" className="h-5 w-5" />O que precisa adaptar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Liste o que precisa ser modificado ou adicionado..."
                        value={formData.needsAdaptation || ""}
                        onChange={(e) => setFormData({ ...formData, needsAdaptation: e.target.value })}
                        rows={6}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="techStack">Stack Tecnológica Identificada</Label>
                  <Textarea
                    id="techStack"
                    placeholder="Tecnologias, frameworks e bibliotecas encontradas..."
                    value={formData.techStack || ""}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="architecture">Arquitetura Identificada</Label>
                  <Textarea
                    id="architecture"
                    placeholder="Padrões arquiteturais, estrutura de pastas, organização..."
                    value={formData.architecture || ""}
                    onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.readyFeatures || !formData.needsAdaptation}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Salvar Diagnóstico
              </Button>
            </div>
          </div>
        )

      case "adaptation":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="settings" className="h-5 w-5" />
                  Plano de Adaptação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectGoal">Objetivo do Seu Projeto *</Label>
                  <Textarea
                    id="projectGoal"
                    placeholder="Descreva o que você quer construir com base neste template..."
                    value={formData.projectGoal || ""}
                    onChange={(e) => setFormData({ ...formData, projectGoal: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="customizations">Personalizações Necessárias *</Label>
                  <Textarea
                    id="customizations"
                    placeholder="Que mudanças específicas você precisa fazer..."
                    value={formData.customizations || ""}
                    onChange={(e) => setFormData({ ...formData, customizations: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalFeatures">Funcionalidades Adicionais</Label>
                  <Textarea
                    id="additionalFeatures"
                    placeholder="Novas funcionalidades que não estão no template..."
                    value={formData.additionalFeatures || ""}
                    onChange={(e) => setFormData({ ...formData, additionalFeatures: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Prazo Desejado</Label>
                  <Input
                    id="timeline"
                    placeholder="Ex: 2 semanas, 1 mês..."
                    value={formData.timeline || ""}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.projectGoal || !formData.customizations}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Salvar Plano
              </Button>
            </div>
          </div>
        )

      case "integration":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="code" className="h-5 w-5" />
                  Integração e Próximos Passos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="integrationPlan">Plano de Integração</Label>
                  <Textarea
                    id="integrationPlan"
                    placeholder="Como você planeja integrar as mudanças..."
                    value={formData.integrationPlan || ""}
                    onChange={(e) => setFormData({ ...formData, integrationPlan: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="testingStrategy">Estratégia de Testes</Label>
                  <Textarea
                    id="testingStrategy"
                    placeholder="Como você vai testar as modificações..."
                    value={formData.testingStrategy || ""}
                    onChange={(e) => setFormData({ ...formData, testingStrategy: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="deploymentPlan">Plano de Deploy</Label>
                  <Textarea
                    id="deploymentPlan"
                    placeholder="Como e onde você vai fazer o deploy..."
                    value={formData.deploymentPlan || ""}
                    onChange={(e) => setFormData({ ...formData, deploymentPlan: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Finalizar Integração
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
