"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import { Textarea } from "../ui/Textarea"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import { Separator } from "../ui/Separator"
import Icon from "../shared/Icon"

interface LaboratoryProps {
  onComplete?: (data: any) => void
  onBack: () => void
}

interface ProblemStep {
  id: number
  title: string
  description: string
  icon: string
  category: string
  completed: boolean
  data?: any
}

interface AlgorithmStep {
  id: string
  type: "input" | "process" | "output" | "decision" | "loop"
  description: string
  pseudocode: string
  complexity?: string
}

interface ReverseStep {
  id: string
  order: number
  title: string
  description: string
  effect: string
  cause: string
  questions: string[]
  answers: Record<string, string>
  dependencies: string[]
  completed: boolean
}

interface ReverseAnalysis {
  finalState: string
  initialState: string
  steps: ReverseStep[]
  insights: string[]
  correctSequence: string[]
}

const PROBLEM_SOLVING_STEPS: ProblemStep[] = [
  { id: 1, title: "Definição do Problema", description: "Identifique e defina claramente o problema a ser resolvido", icon: "target", category: "Análise", completed: false },
  { id: 2, title: "Decomposição", description: "Quebre o problema em partes menores e mais gerenciáveis", icon: "puzzle", category: "Estruturação", completed: false },
  { id: 3, title: "Identificação de Padrões", description: "Encontre padrões e similaridades com problemas conhecidos", icon: "brain", category: "Reconhecimento", completed: false },
  { id: 4, title: "Abstração", description: "Remova detalhes desnecessários e foque no essencial", icon: "lightbulb", category: "Simplificação", completed: false },
  { id: 5, title: "Design do Algoritmo", description: "Projete a sequência lógica de passos para resolver o problema", icon: "gitBranch", category: "Algoritmo", completed: false },
  { id: 6, title: "Validação e Teste", description: "Teste o algoritmo com diferentes cenários e valide a solução", icon: "checkCircle", category: "Verificação", completed: false },
]

export default function Laboratory({ onComplete, onBack }: LaboratoryProps) {
  const [activeTab, setActiveTab] = useState("forward")
  const [activeStep, setActiveStep] = useState(1)
  const [stepData, setStepData] = useState<Record<number, any>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([])
  const [reverseAnalysis, setReverseAnalysis] = useState<ReverseAnalysis>({ finalState: "", initialState: "", steps: [], insights: [], correctSequence: [] })
  const [activeReverseStep, setActiveReverseStep] = useState<string | null>(null)

  const currentStep = PROBLEM_SOLVING_STEPS.find((step) => step.id === activeStep)
  const progress = (completedSteps.length / PROBLEM_SOLVING_STEPS.length) * 100

  const handleStepComplete = useCallback((stepId: number, data: any) => {
    setStepData((prev) => ({ ...prev, [stepId]: data }))
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId])
    }
  }, [completedSteps])

  const handleNext = () => { if (activeStep < PROBLEM_SOLVING_STEPS.length) setActiveStep(activeStep + 1) }
  const handlePrevious = () => { if (activeStep > 1) setActiveStep(activeStep - 1) }

  const generateAlgorithm = () => {
    const problemData = stepData[1]
    const decomposition = stepData[2]
    const newAlgorithmSteps: AlgorithmStep[] = [
      { id: "start", type: "input", description: "Início do algoritmo", pseudocode: `INÍCIO\nProblema: ${problemData?.title || "Não definido"}` },
      ...(decomposition?.subproblems || []).map((sub: any, index: number) => ({ id: `process-${index}`, type: "process" as const, description: `Processar: ${sub.title}`, pseudocode: `PROCESSAR ${sub.title}\n  ${sub.description}` })),
      { id: "end", type: "output", description: "Fim do algoritmo", pseudocode: "FIM" },
    ]
    setAlgorithmSteps(newAlgorithmSteps)
  }

  const initializeReverseAnalysis = (finalState: string) => {
    const baseQuestions = ["Qual foi o último evento que levou diretamente a este resultado?", "Que condições precisavam estar presentes para que isso acontecesse?", "Quais recursos ou componentes foram necessários?", "Que decisões críticas foram tomadas no processo?", "Quais dependências externas influenciaram este resultado?", "Que falhas ou problemas poderiam ter impedido este resultado?", "Qual foi o gatilho inicial que começou esta sequência?", "Que alternativas poderiam ter levado ao mesmo resultado?"]
    const contextQuestions: string[] = []
    if (finalState.toLowerCase().includes("erro") || finalState.toLowerCase().includes("falha")) contextQuestions.push("Que validações falharam para permitir este erro?", "Quais logs ou sinais de alerta foram ignorados?", "Que testes poderiam ter detectado este problema antes?")
    if (finalState.toLowerCase().includes("sucesso") || finalState.toLowerCase().includes("funcionando")) contextQuestions.push("Que testes confirmaram que tudo estava funcionando?", "Quais métricas indicaram o sucesso?", "Que otimizações foram aplicadas para melhorar o resultado?")
    const questions = [...baseQuestions, ...contextQuestions]
    const stepCount = Math.min(8, Math.max(4, Math.ceil(questions.length / 2)))
    const initialSteps = Array.from({ length: stepCount }, (_, i) => ({
      id: `reverse-step-${i}`, order: stepCount - i, title: `Etapa ${stepCount - i}`, description: i === 0 ? finalState : `Evento anterior à etapa ${stepCount - i + 1}`, effect: i === 0 ? finalState : "", cause: "", questions: questions.slice(i * 2, (i + 1) * 2), answers: {}, dependencies: i > 0 ? [`reverse-step-${i - 1}`] : [], completed: false,
    }));
    setReverseAnalysis({ finalState, initialState: "", steps: initialSteps, insights: [], correctSequence: [] })
  }

  const updateReverseStep = (stepId: string, updates: Partial<ReverseStep>) => {
    setReverseAnalysis((prev) => ({ ...prev, steps: prev.steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)) }))
  }

  const generateCorrectSequence = () => {
    const completedSteps = reverseAnalysis.steps.filter((step) => step.completed)
    const sequence = completedSteps.sort((a, b) => a.order - b.order).map((step) => `${step.order}. ${step.title}: ${step.cause || step.description}`)
    const insights = ["Sequência lógica identificada através de análise reversa", "Dependências mapeadas entre eventos", "Pontos críticos de decisão identificados", "Possíveis pontos de falha mapeados"]
    setReverseAnalysis((prev) => ({ ...prev, correctSequence: sequence, initialState: completedSteps[0]?.cause || "Estado inicial identificado" }))
  }

  const exportToPlayground = () => {
    if (onComplete) {
      onComplete({
        type: "laboratory-export",
        data: {
          problem: stepData[1], algorithm: algorithmSteps, reverseAnalysis: activeTab === "reverse" ? reverseAnalysis : null,
          metadata: { generatedAt: new Date(), completedSteps: completedSteps.length, totalSteps: PROBLEM_SOLVING_STEPS.length, mode: activeTab },
        },
        readyForPlayground: true,
      })
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1: return <ProblemDefinitionForm onComplete={(data: any) => handleStepComplete(1, data)} initialData={stepData[1]} />
      case 2: return <DecompositionForm onComplete={(data: any) => handleStepComplete(2, data)} initialData={stepData[2]} problemData={stepData[1]} />
      case 3: return <PatternRecognitionForm onComplete={(data: any) => handleStepComplete(3, data)} initialData={stepData[3]} problemData={stepData[1]} />
      case 4: return <AbstractionForm onComplete={(data: any) => handleStepComplete(4, data)} initialData={stepData[4]} decompositionData={stepData[2]} />
      case 5: return <AlgorithmDesignForm onComplete={(data: any) => handleStepComplete(5, data)} initialData={stepData[5]} abstractionData={stepData[4]} onGenerateAlgorithm={generateAlgorithm} />
      case 6: return <ValidationForm onComplete={(data: any) => handleStepComplete(6, data)} initialData={stepData[6]} algorithmSteps={algorithmSteps} />
      default: return <div>Etapa não encontrada</div>
    }
  }

  const renderReverseEngineering = () => {
    return (
      <div className="space-y-6">
        {reverseAnalysis.steps.length === 0 && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="search" className="h-5 w-5" />Iniciar Engenharia Reversa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Estado Final / Resultado Observado</Label><Textarea placeholder="Descreva o resultado final, erro, comportamento ou estado que você quer analisar..." rows={4} onChange={(e) => setReverseAnalysis((prev) => ({ ...prev, finalState: e.target.value }))} /></div>
              <Button onClick={() => initializeReverseAnalysis(reverseAnalysis.finalState)} disabled={!reverseAnalysis.finalState.trim()} className="w-full"><Icon name="microscope" className="h-4 w-4 mr-2" />Iniciar Análise Reversa</Button>
            </CardContent>
          </Card>
        )}
        {reverseAnalysis.steps.length > 0 && (
          <div className="space-y-4">
            <Card><CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon name="RotateCcw" className="h-5 w-5" />Engenharia Reversa</div><Badge variant="outline">{reverseAnalysis.steps.filter((s) => s.completed).length} / {reverseAnalysis.steps.length} completas</Badge></CardTitle><div className="text-sm text-text-secondary"><strong>Estado Final:</strong> {reverseAnalysis.finalState}</div></CardHeader></Card>
            <div className="space-y-3">
              {reverseAnalysis.steps.sort((a, b) => b.order - a.order).map((step) => (
                <Card key={step.id} className={`${step.completed ? "border-green-500/30 bg-green-500/10" : ""}`}><CardHeader className="cursor-pointer" onClick={() => setActiveReverseStep(activeReverseStep === step.id ? null : step.id)}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.completed ? "bg-green-500 text-white" : "bg-sidebar"}`}>{step.order}</div><div><h4 className="font-medium">{step.title}</h4><p className="text-sm text-text-secondary">{step.description}</p></div></div><div className="flex items-center gap-2">{step.completed && <Icon name="checkCircle" className="h-4 w-4 text-green-500" />}{activeReverseStep === step.id ? <Icon name="chevronUp" className="h-4 w-4" /> : <Icon name="chevronDown" className="h-4 w-4" />}</div></div></CardHeader>
                  {activeReverseStep === step.id && (
                    <CardContent className="space-y-4">
                      <div><Label className="flex items-center gap-2 mb-3"><Icon name="helpCircle" className="h-4 w-4" />Perguntas de Análise</Label><div className="space-y-3">{step.questions.map((question, qIndex) => (<div key={qIndex} className="space-y-2"><div className="text-sm font-medium text-accent">{question}</div><Textarea placeholder="Sua resposta..." value={step.answers[question] || ""} onChange={(e) => updateReverseStep(step.id, { answers: { ...step.answers, [question]: e.target.value } })} rows={2} /></div>))}</div></div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4"><div><Label>Causa (O que levou a isso?)</Label><Textarea placeholder="Descreva a causa..." value={step.cause} onChange={(e) => updateReverseStep(step.id, { cause: e.target.value })} rows={3} /></div><div><Label>Efeito (O que isso causou?)</Label><Textarea placeholder="Descreva o efeito..." value={step.effect} onChange={(e) => updateReverseStep(step.id, { effect: e.target.value })} rows={3} /></div></div>
                      <Button onClick={() => updateReverseStep(step.id, { completed: true })} disabled={!step.cause.trim() || Object.keys(step.answers).length < step.questions.length} className="w-full"><Icon name="checkCircle" className="h-4 w-4 mr-2" />Marcar como Completa</Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
            {reverseAnalysis.steps.filter((s) => s.completed).length === reverseAnalysis.steps.length && (
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon name="sparkles" className="h-5 w-5" />Gerar Sequência Correta</CardTitle></CardHeader>
                <CardContent>
                  <Button onClick={generateCorrectSequence} className="w-full mb-4"><Icon name="arrowRight" className="h-4 w-4 mr-2" />Gerar Sequência Lógica</Button>
                  {reverseAnalysis.correctSequence.length > 0 && (
                    <div className="space-y-4">
                      <div><Label>Sequência Correta (Do Início ao Fim)</Label><div className="bg-sidebar p-4 rounded-lg space-y-2">{reverseAnalysis.correctSequence.map((step, index) => (<div key={index} className="flex items-center gap-2"><Icon name="arrowDown" className="h-4 w-4 text-accent" /><span className="text-sm">{step}</span></div>))}</div></div>
                      <div><Label>Insights da Análise</Label><div className="bg-accent/10 p-4 rounded-lg"><ul className="space-y-1">{reverseAnalysis.insights.map((insight, index) => (<li key={index} className="text-sm flex items-center gap-2"><Icon name="lightbulb" className="h-3 w-3 text-yellow-400" />{insight}</li>))}</ul></div></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    )
  }

  const getCategoryColor = (category: string) => ({ "Análise": "bg-blue-500/20 text-blue-300", "Estruturação": "bg-green-500/20 text-green-300", "Reconhecimento": "bg-purple-500/20 text-purple-300", "Simplificação": "bg-yellow-500/20 text-yellow-300", "Algoritmo": "bg-red-500/20 text-red-300", "Verificação": "bg-indigo-500/20 text-indigo-300" }[category] || "bg-slate-700 text-slate-300")

  if (!currentStep && activeTab === "forward") return <div>Etapa não encontrada</div>

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col h-screen">
      <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                  <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                  Voltar ao Hub
              </Button>
              <div className="flex items-center gap-3">
                  <Icon name="flask-conical" className="h-6 w-6 text-accent" />
                  <div>
                      <h1 className="text-lg font-semibold text-text-primary">Laboratory</h1>
                      <p className="text-sm text-text-secondary">Framework de Construção de Algoritmos.</p>
                  </div>
              </div>
          </div>
          <Button onClick={exportToPlayground} size="sm">
            <Icon name="play" className="h-4 w-4 mr-2" />Exportar para Playground
          </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-sidebar text-text-primary p-6 overflow-y-auto border-r border-card-border">
          <div className="mb-6"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-accent rounded-lg"><Icon name="flask-conical" className="h-5 w-5 text-white" /></div><div><h2 className="font-semibold text-lg">Laboratory</h2><p className="text-sm text-text-secondary">Framework Algorítmico</p></div></div><p className="text-sm text-text-secondary">Construção sistemática de algoritmos e análise reversa</p></div>
          <div className="mb-6"><Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"><TabsList className="grid w-full grid-cols-2 bg-background"><TabsTrigger value="forward"><Icon name="arrowRight" className="h-3 w-3 mr-1" />Progressivo</TabsTrigger><TabsTrigger value="reverse"><Icon name="RotateCcw" className="h-3 w-3 mr-1" />Reverso</TabsTrigger></TabsList></Tabs></div>
          {activeTab === "forward" && (<div className="mb-6"><div className="flex justify-between text-sm text-text-secondary mb-2"><span>Progresso</span><span>{Math.round(progress)}%</span></div><Progress value={progress} className="h-2 mb-3" /><div className="grid grid-cols-2 gap-3 text-xs"><div className="bg-background p-2 rounded"><div className="text-green-400 font-semibold">{completedSteps.length}</div><div className="text-text-secondary">Concluídas</div></div><div className="bg-background p-2 rounded"><div className="text-accent font-semibold">{algorithmSteps.length}</div><div className="text-text-secondary">Passos Algoritmo</div></div></div></div>)}
          {activeTab === "reverse" && (<div className="mb-6"><div className="flex justify-between text-sm text-text-secondary mb-2"><span>Análise Reversa</span><span>{reverseAnalysis.steps.filter((s) => s.completed).length} / {reverseAnalysis.steps.length}</span></div><Progress value={reverseAnalysis.steps.length > 0 ? (reverseAnalysis.steps.filter((s) => s.completed).length / reverseAnalysis.steps.length) * 100 : 0} className="h-2 mb-3" /><div className="grid grid-cols-2 gap-3 text-xs"><div className="bg-background p-2 rounded"><div className="text-purple-400 font-semibold">{reverseAnalysis.steps.length}</div><div className="text-text-secondary">Etapas</div></div><div className="bg-background p-2 rounded"><div className="text-orange-400 font-semibold">{reverseAnalysis.insights.length}</div><div className="text-text-secondary">Insights</div></div></div></div>)}
          {activeTab === "forward" && (<div className="space-y-3"><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Etapas de Resolução</h3>{PROBLEM_SOLVING_STEPS.map((step) => {
            const isActive = activeStep === step.id
            const isCompleted = completedSteps.includes(step.id)
            return (<div key={step.id} onClick={() => setActiveStep(step.id)} className={`p-3 rounded-lg cursor-pointer transition-all ${isActive ? "bg-accent text-white" : isCompleted ? "bg-green-500/20 hover:bg-green-500/30" : "bg-card hover:bg-slate-700"}`}><div className="flex items-center gap-3 mb-2"><div className="flex items-center gap-2">{isCompleted ? <Icon name="checkCircle" className="h-4 w-4 text-green-400" /> : <Icon name={step.icon} className="h-4 w-4" />}<span className="font-medium text-sm">{step.title}</span></div></div><p className="text-xs text-text-secondary mb-2">{step.description}</p><Badge variant="secondary" className={getCategoryColor(step.category)}>{step.category}</Badge></div>)
          })}</div>)}
          {(algorithmSteps.length > 0 || reverseAnalysis.correctSequence.length > 0) && (<div className="mt-6 pt-6 border-t border-card-border"><h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">{activeTab === "forward" ? "Algoritmo Gerado" : "Sequência Identificada"}</h3><div className="bg-background p-3 rounded-lg"><div className="text-xs text-text-primary space-y-1">{activeTab === "forward" ? algorithmSteps.slice(0, 3).map((step, index) => (<div key={step.id} className="flex items-center gap-2"><span className="text-accent">{index + 1}.</span><span>{step.description}</span></div>)) : reverseAnalysis.correctSequence.slice(0, 3).map((step, index) => (<div key={index} className="flex items-center gap-2"><span className="text-purple-400">{index + 1}.</span><span>{step.split(": ")[1] || step}</span></div>))}{((activeTab === "forward" && algorithmSteps.length > 3) || (activeTab === "reverse" && reverseAnalysis.correctSequence.length > 3)) && (<div className="text-text-secondary">... e mais {activeTab === "forward" ? algorithmSteps.length - 3 : reverseAnalysis.correctSequence.length - 3} passos</div>)}</div></div><Button onClick={exportToPlayground} className="w-full mt-3 bg-accent hover:bg-accent-hover" size="sm"><Icon name="play" className="h-4 w-4 mr-2" />Exportar para Playground</Button></div>)}
        </aside>
        <main className="flex-1 overflow-y-auto"><div className="p-8">
          <div className="mb-8">{activeTab === "forward" && currentStep && (<div className="flex items-center gap-3 mb-4"><div className="p-2 bg-accent/10 rounded-lg"><Icon name={currentStep.icon} className="h-6 w-6 text-accent" /></div><div><h1 className="text-2xl font-bold">{currentStep.title}</h1><p className="text-text-secondary">{currentStep.description}</p></div><div className="ml-auto flex items-center gap-2"><Badge variant="secondary" className={getCategoryColor(currentStep.category)}>{currentStep.category}</Badge><Badge variant="outline">Etapa {activeStep} de {PROBLEM_SOLVING_STEPS.length}</Badge></div></div>)}
            {activeTab === "reverse" && (<div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-500/10 rounded-lg"><Icon name="RotateCcw" className="h-6 w-6 text-purple-400" /></div><div><h1 className="text-2xl font-bold">Engenharia Reversa</h1><p className="text-text-secondary">Analise efeitos para descobrir causas e sequências lógicas</p></div><div className="ml-auto flex items-center gap-2"><Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Análise Reversa</Badge>{reverseAnalysis.steps.length > 0 && (<Badge variant="outline">{reverseAnalysis.steps.filter((s) => s.completed).length} / {reverseAnalysis.steps.length} completas</Badge>)}</div></div>)}
          </div>
          <div className="max-w-4xl">{activeTab === "forward" ? renderStepContent() : renderReverseEngineering()}</div>
          {activeTab === "forward" && (<div className="flex justify-between items-center mt-8 pt-6 border-t border-card-border"><Button variant="outline" onClick={handlePrevious} disabled={activeStep === 1}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Anterior</Button><div className="flex items-center gap-2">{completedSteps.includes(activeStep) && (<Badge variant="default" className="bg-green-600"><Icon name="checkCircle" className="h-3 w-3 mr-1" />Concluída</Badge>)}</div><Button onClick={handleNext} disabled={activeStep === PROBLEM_SOLVING_STEPS.length}>Próxima<Icon name="arrowRight" className="h-4 w-4 ml-2" /></Button></div>)}
        </div></main>
      </div>
    </div>
  )
}
// Placeholder components for forms
function ProblemDefinitionForm({ onComplete, initialData }: any) { const [formData, setFormData] = useState(initialData || { title: "", description: "" }); return <Card><CardContent className="p-6 space-y-4"><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título do Problema" /><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição" /><Button onClick={() => onComplete(formData)}>Concluir</Button></CardContent></Card> }
function DecompositionForm({ onComplete, initialData }: any) { const [formData, setFormData] = useState(initialData || { subproblems: [] }); return <Card><CardContent className="p-6 space-y-4"><Textarea value={formData.subproblems.join('\n')} onChange={e => setFormData({ ...formData, subproblems: e.target.value.split('\n') })} placeholder="Subproblemas (um por linha)" /><Button onClick={() => onComplete(formData)}>Concluir</Button></CardContent></Card> }
function PatternRecognitionForm({ onComplete, initialData }: any) { const [formData, setFormData] = useState(initialData || { patterns: [] }); return <Card><CardContent className="p-6 space-y-4"><Textarea value={formData.patterns.join('\n')} onChange={e => setFormData({ ...formData, patterns: e.target.value.split('\n') })} placeholder="Padrões (um por linha)" /><Button onClick={() => onComplete(formData)}>Concluir</Button></CardContent></Card> }
function AbstractionForm({ onComplete, initialData }: any) { const [formData, setFormData] = useState(initialData || { coreLogic: "" }); return <Card><CardContent className="p-6 space-y-4"><Textarea value={formData.coreLogic} onChange={e => setFormData({ ...formData, coreLogic: e.target.value })} placeholder="Lógica Central" /><Button onClick={() => onComplete(formData)}>Concluir</Button></CardContent></Card> }
function AlgorithmDesignForm({ onComplete, initialData, onGenerateAlgorithm }: any) { const [formData, setFormData] = useState(initialData || { pseudocode: "" }); const handleSubmit = () => { onComplete(formData); onGenerateAlgorithm(); }; return <Card><CardContent className="p-6 space-y-4"><Textarea value={formData.pseudocode} onChange={e => setFormData({ ...formData, pseudocode: e.target.value })} placeholder="Pseudocódigo" /><Button onClick={handleSubmit}>Concluir</Button></CardContent></Card> }
function ValidationForm({ onComplete, initialData }: any) { const [formData, setFormData] = useState(initialData || { testCases: [] }); return <Card><CardContent className="p-6 space-y-4"><Textarea value={formData.testCases.join('\n')} onChange={e => setFormData({ ...formData, testCases: e.target.value.split('\n') })} placeholder="Casos de teste (um por linha)" /><Button onClick={() => onComplete(formData)}>Concluir</Button></CardContent></Card> }