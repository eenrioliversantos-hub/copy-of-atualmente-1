

"use client"

import React, { useState, useRef } from "react"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { ScrollArea } from "../ui/ScrollArea"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
// FIX: Import `TabsContent` to resolve 'Cannot find name' errors.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import { Progress } from "../ui/Progress"
import Icon from "../shared/Icon"

interface PlaygroundProps {
  onComplete?: (data: any) => void
  importedData?: any
  onBack: () => void
}

interface CodeBlock {
  id: string
  type: BlockType
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, any>
  connections: Connection[]
  code: string
  category: BlockCategory
}

interface Connection {
  id: string
  sourceId: string
  targetId: string
  sourcePort: string
  targetPort: string
}

interface ProcedureStep {
  id: string
  title: string
  description: string
  level: "atom" | "molecule" | "particle" | "component" | "module" | "system"
  dependencies: string[]
  code: string
  tests: string[]
  documentation: string
  completed: boolean
  estimatedTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface BuildingGuide {
  id: string
  title: string
  description: string
  category: "frontend" | "backend" | "fullstack" | "mobile" | "desktop"
  steps: ProcedureStep[]
  currentStep: number
  progress: number
  estimatedTotalTime: number
}

type BlockCategory =
  | "control" | "data" | "ui" | "api" | "logic" | "database" | "events"

type BlockType =
  | "start" | "end" | "if" | "else" | "for" | "while" | "function"
  | "variable" | "array" | "object" | "string" | "number" | "boolean"
  | "button" | "input" | "div" | "text" | "image" | "form"
  | "fetch" | "post" | "get" | "websocket" | "graphql"
  | "calculate" | "validate" | "transform" | "filter"
  | "select" | "insert" | "update" | "delete"
  | "click" | "submit" | "load" | "change"

interface BlockDefinition {
  type: BlockType
  category: BlockCategory
  title: string
  description: string
  color: string
  icon: string
  defaultProperties: Record<string, any>
  codeTemplate: string
  ports: { input: string[], output: string[] }
}

const BLOCK_DEFINITIONS: BlockDefinition[] = [
  { type: "start", category: "control", title: "Início", description: "Ponto de entrada do programa", color: "bg-green-700", icon: 'play', defaultProperties: {}, codeTemplate: "// Início do programa", ports: { input: [], output: ["next"] } },
  { type: "end", category: "control", title: "Fim", description: "Ponto de saída do programa", color: "bg-red-700", icon: 'square', defaultProperties: {}, codeTemplate: "// Fim do programa", ports: { input: ["prev"], output: [] } },
  { type: "if", category: "control", title: "Se (If)", description: "Estrutura condicional", color: "bg-yellow-600", icon: 'triangle', defaultProperties: { condition: "true" }, codeTemplate: "if (${condition}) {\n  // código aqui\n}", ports: { input: ["prev"], output: ["true", "false"] } },
  { type: "for", category: "control", title: "Para (For)", description: "Loop com contador", color: "bg-purple-700", icon: 'workflow', defaultProperties: { start: "0", end: "10", step: "1" }, codeTemplate: "for (let i = ${start}; i < ${end}; i += ${step}) {\n  // código aqui\n}", ports: { input: ["prev"], output: ["loop", "next"] } },
  { type: "function", category: "control", title: "Função", description: "Definir uma função", color: "bg-indigo-700", icon: 'code', defaultProperties: { name: "minhaFuncao", params: "param1, param2" }, codeTemplate: "function ${name}(${params}) {\n  // código aqui\n  return resultado;\n}", ports: { input: ["call"], output: ["return"] } },
  { type: "variable", category: "data", title: "Variável", description: "Declarar uma variável", color: "bg-sky-700", icon: 'database', defaultProperties: { name: "minhaVariavel", value: "0", type: "let" }, codeTemplate: "${type} ${name} = ${value};", ports: { input: ["prev"], output: ["next"] } },
  { type: "button", category: "ui", title: "Botão", description: "Criar um botão", color: "bg-pink-700", icon: 'mousePointer', defaultProperties: { text: "Clique aqui", id: "meuBotao" }, codeTemplate: '<button id="${id}" onclick="${onClick}">${text}</button>', ports: { input: ["prev"], output: ["click"] } },
  { type: "fetch", category: "api", title: "Fetch API", description: "Fazer requisição HTTP", color: "bg-orange-700", icon: 'globe', defaultProperties: { url: "https://api.exemplo.com", method: "GET" }, codeTemplate: 'fetch("${url}", { method: "${method}" })\n  .then(response => response.json())\n  .then(data => console.log(data));', ports: { input: ["prev"], output: ["success", "error"] } },
  { type: "calculate", category: "logic", title: "Calcular", description: "Operação matemática", color: "bg-teal-700", icon: 'zap', defaultProperties: { operation: "a + b", variables: "a, b" }, codeTemplate: "const resultado = ${operation};", ports: { input: ["prev"], output: ["next"] } },
  { type: "click", category: "events", title: "Evento de clique", description: "Executa uma ação quando um elemento é clicado", color: "bg-slate-600", icon: 'hand', defaultProperties: { element: "button", action: 'console.log("Clicado!")' }, codeTemplate: 'document.querySelector("${element}").addEventListener("click", () => {\n  ${action}\n});', ports: { input: ["element"], output: ["triggered"] } },
]

const CATEGORIES = [
  { id: "control", title: "Controle", icon: "zap" },
  { id: "data", title: "Dados", icon: "database" },
  { id: "ui", title: "Interface", icon: "palette" },
  { id: "api", title: "APIs", icon: "globe" },
  { id: "logic", title: "Lógica", icon: "cog" },
  { id: "events", title: "Eventos", icon: "zap" },
]

const BUILDING_GUIDES: BuildingGuide[] = [
    {
    id: "react-component", title: "Componente React", description: "Construa um componente React do zero", category: "frontend", currentStep: 0, progress: 0, estimatedTotalTime: 45,
    steps: [
      { id: "atom-jsx", title: "Átomo: Elemento JSX", description: "Criar o elemento JSX básico", level: "atom", dependencies: [], code: "const MeuComponente = () => {\n  return <div>Hello World</div>\n}", tests: ["Renderiza sem erros"], documentation: "Elemento JSX básico", completed: false, estimatedTime: 5, difficulty: "beginner" },
      { id: "molecule-props", title: "Molécula: Props", description: "Adicionar propriedades ao componente", level: "molecule", dependencies: ["atom-jsx"], code: "const MeuComponente = ({ titulo }) => {\n  return <div><h1>{titulo}</h1></div>\n}", tests: ["Aceita props"], documentation: "Componente com props", completed: false, estimatedTime: 8, difficulty: "beginner" },
    ]
  }
]

export default function Playground({ onComplete, importedData, onBack }: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState("visual")
  const [blocks, setBlocks] = useState<CodeBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<CodeBlock | null>(null)
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [generatedCode, setGeneratedCode] = useState("")
  const [isCodeVisible, setIsCodeVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState<BlockCategory>("control")
  const [activeGuide, setActiveGuide] = useState<BuildingGuide | null>(null)
  const [guideProgress, setGuideProgress] = useState<Record<string, number>>({})
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({})
  const canvasRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (importedData?.type === "laboratory-export" && importedData.data) {
      const { algorithm, reverseAnalysis } = importedData.data
      if (algorithm) {
        const newBlocks: CodeBlock[] = algorithm.map((step: any, index: number) => ({ id: `imported-${step.id}`, type: step.type === "input" ? "start" : step.type === "output" ? "end" : "function", x: 100 + index * 200, y: 100, width: 150, height: 80, properties: { description: step.description }, connections: [], code: step.pseudocode, category: "control" }))
        setBlocks(newBlocks)
      }
      if (reverseAnalysis) {
        const steps: ProcedureStep[] = reverseAnalysis.correctSequence.map((step: string, index: number) => ({ id: `reverse-step-${index}`, title: `Etapa ${index + 1}`, description: step, level: index < 2 ? "atom" : "molecule", dependencies: index > 0 ? [`reverse-step-${index - 1}`] : [], code: `// Implementar: ${step}`, tests: [], documentation: `Doc para: ${step}`, completed: false, estimatedTime: 15, difficulty: "intermediate" }))
        const customGuide: BuildingGuide = { id: "reverse-analysis-guide", title: "Guia da Análise Reversa", description: "Implementar solução baseada na análise reversa", category: "fullstack", steps, currentStep: 0, progress: 0, estimatedTotalTime: steps.length * 15 }
        setActiveGuide(customGuide)
        setActiveTab("guide")
      }
    }
  }, [importedData])

  const handleDragStart = (blockType: BlockType) => setDraggedBlockType(blockType)
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlockType || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === draggedBlockType)
    if (!blockDef) return
    const newBlock: CodeBlock = { id: `block-${Date.now()}`, type: draggedBlockType, x, y, width: 150, height: 80, properties: { ...blockDef.defaultProperties }, connections: [], code: blockDef.codeTemplate, category: blockDef.category }
    setBlocks([...blocks, newBlock])
    setDraggedBlockType(null)
  }

  const handleBlockClick = (block: CodeBlock) => setSelectedBlock(block)
  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId))
    if (selectedBlock?.id === blockId) setSelectedBlock(null)
  }
  const handleBlockUpdate = (updatedBlock: CodeBlock) => {
    setBlocks(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)))
    setSelectedBlock(updatedBlock)
  }
  const generateCode = () => {
    let code = "// Código gerado automaticamente pelo Playground\n\n"
    blocks.sort((a, b) => a.y - b.y || a.x - b.x).forEach((block, index) => {
      const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === block.type)
      if (!blockDef) return
      let blockCode = blockDef.codeTemplate
      Object.entries(block.properties).forEach(([key, value]) => {
        blockCode = blockCode.replace(new RegExp(`\\$\\{${key}\\}`, "g"), String(value))
      })
      code += `// Bloco ${index + 1}: ${blockDef.title}\n${blockCode}\n\n`
    })
    setGeneratedCode(code)
    setIsCodeVisible(true)
  }

  const exportCode = () => {
    if (!generatedCode) generateCode()
    const blob = new Blob([generatedCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "codigo-gerado.js"
    a.click()
    URL.revokeObjectURL(url)
  }
  const clearCanvas = () => {
    setBlocks([])
    setSelectedBlock(null)
    setGeneratedCode("")
    setIsCodeVisible(false)
  }

  const startGuide = (guide: BuildingGuide) => {
    setActiveGuide(guide)
    setActiveTab("guide")
  }

  const completeStep = (guideId: string, stepId: string) => {
    if (!activeGuide) return
    const updatedSteps = activeGuide.steps.map((step) => (step.id === stepId ? { ...step, completed: true } : step))
    const completedCount = updatedSteps.filter((s) => s.completed).length
    const progress = (completedCount / updatedSteps.length) * 100
    setActiveGuide({ ...activeGuide, steps: updatedSteps, progress, currentStep: Math.min(activeGuide.currentStep + 1, updatedSteps.length - 1) })
    setCompletedSteps((prev) => ({ ...prev, [guideId]: [...(prev[guideId] || []), stepId] }))
  }

  const renderBlock = (block: CodeBlock) => {
    const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === block.type)
    if (!blockDef) return null
    const isSelected = selectedBlock?.id === block.id
    return (
      <div key={block.id} className={`absolute cursor-pointer transition-all ${isSelected ? "ring-2 ring-accent scale-105" : ""}`} style={{ left: block.x, top: block.y, width: block.width, height: block.height }} onClick={() => handleBlockClick(block)}>
        <div className={`${blockDef.color} text-white p-3 rounded-lg shadow-lg h-full relative group`}>
          <div className="flex items-center gap-2 mb-1"><Icon name={blockDef.icon} className="h-4 w-4" /><span className="text-xs font-medium truncate">{blockDef.title}</span></div>
          <div className="text-xs opacity-80 truncate">{block.properties.name || block.properties.text || blockDef.description}</div>
          {blockDef.ports.input.map((port, index) => <div key={`input-${port}`} className="absolute w-3 h-3 bg-white rounded-full border-2 border-slate-300 -left-1.5" style={{ top: `${20 + index * 15}px` }} title={`Input: ${port}`} />)}
          {blockDef.ports.output.map((port, index) => <div key={`output-${port}`} className="absolute w-3 h-3 bg-white rounded-full border-2 border-slate-300 -right-1.5" style={{ top: `${20 + index * 15}px` }} title={`Output: ${port}`} />)}
          <Button size="sm" variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleBlockDelete(block.id); }}><Icon name="x" className="h-3 w-3" /></Button>
        </div>
      </div>
    )
  }

  const renderBlockProperties = () => {
    if (!selectedBlock) return null
    const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === selectedBlock.type)
    if (!blockDef) return null
    return (
      <div className="space-y-4">
        <div><Label>Tipo do Bloco</Label><Input value={blockDef.title} disabled /></div>
        {Object.entries(selectedBlock.properties).map(([key, value]) => (<div key={key}><Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label><Input value={value} onChange={(e) => handleBlockUpdate({ ...selectedBlock, properties: { ...selectedBlock.properties, [key]: e.target.value } })} /></div>))}
        <div><Label>Código Gerado</Label><Textarea value={selectedBlock.code} onChange={(e) => handleBlockUpdate({ ...selectedBlock, code: e.target.value })} rows={6} className="font-mono text-sm" /></div>
      </div>
    )
  }

  const renderBuildingGuides = () => {
    if (activeGuide) return renderActiveGuide()
    return (
      <div className="space-y-6">
        <div className="text-center"><Icon name="bookOpen" className="h-16 w-16 mx-auto mb-4 text-accent" /><h2 className="text-2xl font-bold mb-2">Guias de Construção</h2><p className="text-text-secondary">Aprenda a construir do átomo ao sistema completo</p></div>
        <div className="grid gap-6">
          {BUILDING_GUIDES.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow hover:border-accent">
              <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${guide.category === "frontend" ? "bg-pink-500/20" : "bg-green-500/20"}`}><Icon name={guide.category === "frontend" ? "layout" : "server"} className={`h-5 w-5 ${guide.category === "frontend" ? "text-pink-400" : "text-green-400"}`} /></div><div><CardTitle className="text-lg">{guide.title}</CardTitle><p className="text-sm text-text-secondary">{guide.description}</p></div></div><Badge variant="outline" className="capitalize">{guide.category}</Badge></div></CardHeader>
              <CardContent><div className="space-y-4"><div><div className="flex justify-between text-sm text-text-secondary mb-2"><span>Progresso</span><span>{Math.round(guideProgress[guide.id] || 0)}%</span></div><Progress value={guideProgress[guide.id] || 0} className="h-2" /></div><Button onClick={() => startGuide(guide)} className="w-full" variant={completedSteps[guide.id]?.length ? "outline" : "default"}>{completedSteps[guide.id]?.length ? <><Icon name="cog" className="h-4 w-4 mr-2" />Continuar Guia</> : <><Icon name="play" className="h-4 w-4 mr-2" />Iniciar Guia</>}</Button></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderActiveGuide = () => {
    if (!activeGuide) return null
    const currentStep = activeGuide.steps[activeGuide.currentStep]
    return (
      <div className="space-y-6">
        <Card><CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Button variant="outline" size="sm" onClick={() => setActiveGuide(null)}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar</Button><div><CardTitle>{activeGuide.title}</CardTitle><p className="text-sm text-text-secondary">{activeGuide.description}</p></div></div><Badge variant="outline" className="capitalize">{activeGuide.category}</Badge></div></CardHeader><CardContent><Progress value={activeGuide.progress} className="h-3" /></CardContent></Card>
        {currentStep && (<Card className="border-2 border-accent/50"><CardHeader><CardTitle className="text-lg">{currentStep.title}</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Código de Exemplo</Label><Textarea value={currentStep.code} rows={8} className="font-mono text-sm" /></div><Button onClick={() => completeStep(activeGuide.id, currentStep.id)} disabled={currentStep.completed} className="flex-1">{currentStep.completed ? 'Concluída' : 'Marcar como Concluída'}</Button></CardContent></Card>)}
      </div>
    )
  }

  const filteredBlocks = BLOCK_DEFINITIONS.filter((def) => def.category === activeCategory)

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col h-screen">
      <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                  <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                  Voltar ao Hub
              </Button>
              <div className="flex items-center gap-3">
                  <Icon name="puzzle" className="h-6 w-6 text-accent" />
                  <div>
                      <h1 className="text-lg font-semibold text-text-primary">Playground</h1>
                      <p className="text-sm text-text-secondary">Ambiente visual para prototipagem e experimentação.</p>
                  </div>
              </div>
          </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Block Palette Sidebar */}
        <aside className="w-64 bg-sidebar p-4 border-r border-card-border flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Paleta de Blocos</h2>
            <p className="text-xs text-text-secondary">Arraste para o canvas</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {CATEGORIES.map((cat) => (
              <Button key={cat.id} variant={activeCategory === cat.id ? "default" : "ghost"} size="sm" className="flex-1" onClick={() => setActiveCategory(cat.id as BlockCategory)}>
                <Icon name={cat.icon} className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="grid grid-cols-2 gap-2">
              {filteredBlocks.map((def) => (
                <div key={def.type} draggable onDragStart={() => handleDragStart(def.type)} className={`p-2 ${def.color} text-white rounded-md cursor-grab active:cursor-grabbing flex flex-col items-center text-center`}>
                  <Icon name={def.icon} className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{def.title}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 py-3 border-b border-card-border flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="visual" className="gap-2">
                  <Icon name="eye" className="h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="guide" className="gap-2">
                  <Icon name="bookOpen" className="h-4 w-4" />
                  Guia de Construção
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  <Icon name="trash" className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline" size="sm" onClick={generateCode}>
                  <Icon name="code" className="h-4 w-4 mr-2" />
                  Gerar Código
                </Button>
                <Button size="sm" onClick={exportCode}>
                  <Icon name="download" className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <TabsContent value="visual" className="flex-1 relative" ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop}>
              {blocks.map(renderBlock)}
              {blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-8 border-2 border-dashed border-card-border rounded-lg">
                    <Icon name="plus" className="h-10 w-10 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary">Arraste um bloco da paleta para começar</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="guide" className="flex-1 overflow-y-auto p-6">
              {renderBuildingGuides()}
            </TabsContent>
          </Tabs>
        </main>

        {/* Properties Panel */}
        <aside className="w-80 bg-sidebar p-4 border-l border-card-border overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Propriedades</h2>
            <p className="text-xs text-text-secondary">Selecione um bloco para editar</p>
          </div>
          {selectedBlock ? (
            renderBlockProperties()
          ) : (
            <div className="text-center text-text-secondary pt-16">
              <Icon name="settings" className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhum bloco selecionado</p>
            </div>
          )}
        </aside>
      </div>

      {isCodeVisible && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Código Gerado</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsCodeVisible(false)}>
                  <Icon name="x" className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedCode} readOnly rows={20} className="font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}