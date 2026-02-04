"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Label } from "../../ui/Label"
import { Textarea } from "../../ui/Textarea"
import { Alert, AlertDescription } from "../../ui/Alert"
import Icon from "../../shared/Icon"

interface ImportModelingModuleProps {
  currentPhase: any
  onPhaseComplete: (phaseId: string, data: any) => void
  moduleData: any
}

export default function ImportModelingModule({ currentPhase, onPhaseComplete, moduleData }: ImportModelingModuleProps) {
  const [formData, setFormData] = useState<any>(moduleData[currentPhase.id] || {})
  const [importedData, setImportedData] = useState<any>(null)
  const [validationResults, setValidationResults] = useState<any>(null)

  const handleSave = () => {
    onPhaseComplete(currentPhase.id, formData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setImportedData(data)
          setFormData({ ...formData, importedFile: file.name, importedData: data })
          validateImportedData(data)
        } catch (error) {
          console.error("Erro ao ler arquivo:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const validateImportedData = (data: any) => {
    const results = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
      summary: {
        systemOverview: !!data.systemOverview,
        entities: data.entities?.length || 0,
        useCases: data.useCases?.length || 0,
        userProfiles: data.userProfiles?.length || 0,
        phases: data.phases?.length || 0,
      },
    }

    // Validações básicas
    if (!data.systemOverview) {
      results.errors.push("Visão geral do sistema não encontrada")
      results.isValid = false
    }

    if (!data.entities || data.entities.length === 0) {
      results.warnings.push("Nenhuma entidade encontrada")
    }

    if (!data.useCases || data.useCases.length === 0) {
      results.warnings.push("Nenhum caso de uso encontrado")
    }

    setValidationResults(results)
  }

  const renderPhaseContent = () => {
    switch (currentPhase.id) {
      case "import":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="upload" className="h-5 w-5" />
                  Importação de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="modelingFile">Arquivo de Modelagem *</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-card-border rounded-lg p-6 text-center">
                      <Icon name="upload" className="h-8 w-8 mx-auto text-text-secondary mb-3" />
                      <h3 className="text-lg font-medium mb-2">Upload do arquivo JSON</h3>
                      <p className="text-text-secondary mb-4">Selecione o arquivo exportado da modelagem anterior</p>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-card-border bg-transparent hover:bg-sidebar h-10 px-4 py-2">
                          Selecionar Arquivo JSON
                      </label>
                    </div>
                  </div>
                </div>

                {formData.importedFile && (
                  <Alert className="border-green-500/30 bg-green-500/10">
                    <Icon name="checkCircle" className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      Arquivo <strong>{formData.importedFile}</strong> carregado com sucesso!
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="importNotes">Notas sobre a Importação</Label>
                  <Textarea
                    id="importNotes"
                    placeholder="Adicione observações sobre os dados importados..."
                    value={formData.importNotes || ""}
                    onChange={(e) => setFormData({ ...formData, importNotes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.importedFile}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Prosseguir com Validação
              </Button>
            </div>
          </div>
        )

      case "validation":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="checkCircle" className="h-5 w-5" />
                  Validação dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationResults && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{validationResults.summary.entities}</div>
                        <div className="text-sm text-text-secondary">Entidades</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{validationResults.summary.useCases}</div>
                        <div className="text-sm text-text-secondary">Casos de Uso</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {validationResults.summary.userProfiles}
                        </div>
                        <div className="text-sm text-text-secondary">Perfis</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-400">{validationResults.summary.phases}</div>
                        <div className="text-sm text-text-secondary">Fases</div>
                      </Card>
                    </div>

                    {validationResults.errors.length > 0 && (
                      <Alert className="border-red-500/30 bg-red-500/10">
                        <Icon name="alertCircle" className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">
                          <strong>Erros encontrados:</strong>
                          <ul className="list-disc list-inside mt-2">
                            {validationResults.errors.map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {validationResults.warnings.length > 0 && (
                      <Alert className="border-yellow-500/30 bg-yellow-500/10">
                        <Icon name="alertCircle" className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-300">
                          <strong>Avisos:</strong>
                          <ul className="list-disc list-inside mt-2">
                            {validationResults.warnings.map((warning: string, index: number) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {validationResults.isValid && (
                      <Alert className="border-green-500/30 bg-green-500/10">
                        <Icon name="checkCircle" className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-300">
                          <strong>Validação bem-sucedida!</strong> Os dados estão íntegros e prontos para uso.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <div>
                  <Label htmlFor="validationNotes">Observações da Validação</Label>
                  <Textarea
                    id="validationNotes"
                    placeholder="Adicione observações sobre a validação..."
                    value={formData.validationNotes || ""}
                    onChange={(e) => setFormData({ ...formData, validationNotes: e.target.value })}
                    rows={3}
                  />
                </div>

                {importedData && (
                  <div>
                    <Label className="text-base font-medium">Preview dos Dados</Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="bg-background rounded p-3 max-h-40 overflow-y-auto">
                          <pre className="text-xs">{JSON.stringify(importedData, null, 2).substring(0, 500)}...</pre>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          <Icon name="eye" className="h-4 w-4 mr-2" />
                          Ver Dados Completos
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!validationResults?.isValid}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Dados Validados
              </Button>
            </div>
          </div>
        )

      case "continuation":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="cog" className="h-5 w-5" />
                  Continuação do Fluxo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-500/30 bg-green-500/10">
                  <Icon name="checkCircle" className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">
                    <strong>Dados importados com sucesso!</strong> Você pode agora continuar de onde parou.
                  </AlertDescription>
                </Alert>

                {importedData?.systemOverview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resumo do Projeto Importado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <strong>Nome:</strong> {importedData.systemOverview.name}
                        </div>
                        <div>
                          <strong>Objetivo:</strong> {importedData.systemOverview.objective}
                        </div>
                        <div>
                          <strong>Tipo:</strong> {importedData.systemOverview.systemType}
                        </div>
                        <div>
                          <strong>Última atualização:</strong>{" "}
                          {importedData.updatedAt
                            ? new Date(importedData.updatedAt).toLocaleDateString("pt-BR")
                            : "Não informado"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label htmlFor="continuationPlan">Plano de Continuação *</Label>
                  <Textarea
                    id="continuationPlan"
                    placeholder="Descreva o que você quer fazer a partir deste ponto..."
                    value={formData.continuationPlan || ""}
                    onChange={(e) => setFormData({ ...formData, continuationPlan: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="nextSteps">Próximos Passos</Label>
                  <Textarea
                    id="nextSteps"
                    placeholder="Quais são os próximos passos do desenvolvimento..."
                    value={formData.nextSteps || ""}
                    onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="modifications">Modificações Necessárias</Label>
                  <Textarea
                    id="modifications"
                    placeholder="Alguma coisa precisa ser modificada no plano original..."
                    value={formData.modifications || ""}
                    onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!formData.continuationPlan}>
                <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                Continuar Desenvolvimento
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
