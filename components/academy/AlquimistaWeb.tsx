
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import { Separator } from "../ui/Separator"
import Icon from "../shared/Icon"

// Placeholder components for concepts mentioned in the original file
const LaboratorioDoMestre: React.FC = () => (
  <div className="text-center py-16 bg-card border border-card-border rounded-lg">
    <Icon name="graduationCap" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-text-primary mb-2">Laboratório do Mestre</h3>
    <p className="text-text-secondary">This module is under construction.</p>
  </div>
);

const Arsenal8020: React.FC = () => (
  <div className="text-center py-16 bg-card border border-card-border rounded-lg">
    <Icon name="target" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-text-primary mb-2">Arsenal 80/20</h3>
    <p className="text-text-secondary">This module is under construction.</p>
  </div>
);


interface AlquimistaWebProps {
  onBack?: () => void
}

export default function AlquimistaWeb({ onBack }: AlquimistaWebProps) {
  const [activeModule, setActiveModule] = useState<
    "fundamentos" | "camadas" | "conexoes" | "evolucao" | "laboratorio" | "arsenal"
  >("fundamentos")
  const [selectedAnalogy, setSelectedAnalogy] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [layerProgress, setLayerProgress] = useState(0)

  const analogies = {
    http: {
      title: "HTTP/HTTPS - Sistema Postal",
      icon: "messageSquare",
      description: "Como as informações viajam pela internet",
      details: {
        HTTP: "Carta comum - qualquer um pode ler no caminho",
        HTTPS: "Carta registrada com lacre de segurança",
        Protocolos: "Regras dos Correios (formato, endereçamento)",
        "Status Codes": "Códigos de entrega (200=entregue, 404=não encontrado)",
      },
      color: "bg-sky-700",
    },
    database: {
      title: "Banco de Dados - Biblioteca Municipal",
      icon: "database",
      description: "Como os dados são organizados e armazenados",
      details: {
        Tabelas: "Estantes organizadas por assunto",
        Registros: "Livros individuais",
        Campos: "Capítulos/seções do livro",
        Índices: "Sistema de catalogação/fichário",
        SQL: "Linguagem do bibliotecário",
        Backup: "Cópias em outro prédio",
      },
      color: "bg-green-700",
    },
    server: {
      title: "Servidor - Restaurante Industrial",
      icon: "server",
      description: "Como o servidor processa as requisições",
      details: {
        CPU: "Chefe de cozinha",
        RAM: "Bancada de trabalho (espaço temporário)",
        Storage: "Despensa/freezer (armazenamento)",
        APIs: "Cardápio com pratos disponíveis",
        "Load Balancer": "Maître distribuindo mesas",
      },
      color: "bg-orange-700",
    },
    browser: {
      title: "Browser - Televisão Inteligente",
      icon: "layout",
      description: "Como o navegador interpreta e exibe o conteúdo",
      details: {
        Renderização: "Decodificar sinal e exibir na tela",
        DOM: "Manual de instruções de montagem",
        Cache: "Memória da TV (favoritos carregam mais rápido)",
        JavaScript: "Controle remoto interativo",
        Cookies: "Configurações salvas da TV",
      },
      color: "bg-purple-700",
    },
  }

  const layers = [
    {
      id: "html",
      name: "Estrutura HTML",
      description: "A base - como o esqueleto da casa",
      color: "bg-red-500",
      progress: layerProgress >= 25 ? 100 : (layerProgress / 25) * 100,
    },
    {
      id: "css",
      name: "Estilização CSS",
      description: "A aparência - como a pintura e decoração",
      color: "bg-blue-500",
      progress: layerProgress >= 50 ? 100 : layerProgress >= 25 ? ((layerProgress - 25) / 25) * 100 : 0,
    },
    {
      id: "javascript",
      name: "Comportamento JS",
      description: "A interatividade - como a eletricidade da casa",
      color: "bg-yellow-500",
      progress: layerProgress >= 75 ? 100 : layerProgress >= 50 ? ((layerProgress - 50) / 25) * 100 : 0,
    },
    {
      id: "data",
      name: "Dados & Estado",
      description: "As informações - como a água corrente",
      color: "bg-green-500",
      progress: layerProgress >= 100 ? 100 : layerProgress >= 75 ? ((layerProgress - 75) / 25) * 100 : 0,
    },
  ]

  const connections = [
    {
      type: "water",
      name: "Fluxo de Dados",
      icon: "workflow",
      description: "Props e estado fluindo entre componentes",
      color: "text-sky-400",
      connections: ["Componente Pai → Filho", "Estado Global → Componentes", "API → Estado"],
    },
    {
      type: "electricity",
      name: "Eventos & Comportamentos",
      icon: "zap",
      description: "Interações e lógica de negócio",
      color: "text-yellow-400",
      connections: ["onClick → Função", "onChange → Estado", "onSubmit → API"],
    },
    {
      type: "door",
      name: "Navegação",
      icon: "home",
      description: "Rotas e navegação entre páginas",
      color: "text-green-400",
      connections: ["Página A → Página B", "Menu → Seções", "Botão → Modal"],
    },
    {
      type: "antenna",
      name: "Integrações",
      icon: "plug",
      description: "APIs externas e serviços",
      color: "text-purple-400",
      connections: ["App → API REST", "App → WebSocket", "App → Banco de Dados"],
    },
  ]

  const evolutionStages = [
    {
      stage: 1,
      name: "Casa Simples",
      description: "Página estática básica",
      components: ["HTML", "CSS"],
      complexity: "low",
    },
    {
      stage: 2,
      name: "Casa com Eletricidade",
      description: "Interatividade básica",
      components: ["HTML", "CSS", "JavaScript"],
      complexity: "medium",
    },
    {
      stage: 3,
      name: "Casa Conectada",
      description: "Dados dinâmicos",
      components: ["HTML", "CSS", "JavaScript", "API"],
      complexity: "medium",
    },
    {
      stage: 4,
      name: "Condomínio Inteligente",
      description: "Aplicação complexa",
      components: ["Framework", "Estado Global", "Banco de Dados", "Microserviços"],
      complexity: "high",
    },
  ]

  const startLayerSimulation = () => {
    setIsSimulating(true)
    setLayerProgress(0)

    const interval = setInterval(() => {
      setLayerProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSimulating(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const resetSimulation = () => {
    setLayerProgress(0)
    setIsSimulating(false)
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="mb-4">
              <Icon name="chevronLeft" className="h-4 w-4 mr-2" /> Voltar
            </Button>
          )}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-accent rounded-full">
                <Icon name="flask-conical" className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-accent">
                ALQUIMISTA WEB
              </h1>
            </div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Transforme conceitos abstratos de desenvolvimento web em conhecimento tangível através de analogias do
              mundo real
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={activeModule === "fundamentos" ? "default" : "outline"}
              onClick={() => setActiveModule("fundamentos")}
              className="gap-2"
            >
              <Icon name="bookOpen" className="h-4 w-4" />
              Fundamentos Visuais
            </Button>
            <Button
              variant={activeModule === "camadas" ? "default" : "outline"}
              onClick={() => setActiveModule("camadas")}
              className="gap-2"
            >
              <Icon name="layers" className="h-4 w-4" />
              Construtor por Camadas
            </Button>
            <Button
              variant={activeModule === "conexoes" ? "default" : "outline"}
              onClick={() => setActiveModule("conexoes")}
              className="gap-2"
            >
              <Icon name="workflow" className="h-4 w-4" />
              Arquiteto de Conexões
            </Button>
            <Button
              variant={activeModule === "evolucao" ? "default" : "outline"}
              onClick={() => setActiveModule("evolucao")}
              className="gap-2"
            >
              <Icon name="trendingUp" className="h-4 w-4" />
              Evolução Modular
            </Button>
            <Button
              variant={activeModule === "laboratorio" ? "default" : "outline"}
              onClick={() => setActiveModule("laboratorio")}
              className="gap-2"
            >
              <Icon name="graduationCap" className="h-4 w-4" />
              Laboratório do Mestre
            </Button>
            <Button
              variant={activeModule === "arsenal" ? "default" : "outline"}
              onClick={() => setActiveModule("arsenal")}
              className="gap-2"
            >
              <Icon name="target" className="h-4 w-4" />
              Arsenal 80/20
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Fundamentos Visuais */}
          {activeModule === "fundamentos" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Fundamentos Visuais</h2>
                <p className="text-text-secondary">
                  Entenda os conceitos básicos da web através de analogias do mundo real
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analogies).map(([key, analogy]) => {
                  return (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-accent ${
                        selectedAnalogy === key ? "ring-2 ring-accent" : ""
                      }`}
                      onClick={() => setSelectedAnalogy(selectedAnalogy === key ? null : key)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${analogy.color} rounded-lg`}>
                            <Icon name={analogy.icon} className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{analogy.title}</CardTitle>
                            <p className="text-sm text-text-secondary">{analogy.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      {selectedAnalogy === key && (
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(analogy.details).map(([concept, explanation]) => (
                              <div key={concept} className="flex items-start gap-3">
                                <Badge variant="secondary" className="mt-0.5">
                                  {concept}
                                </Badge>
                                <p className="text-sm flex-1">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>

              {selectedAnalogy && (
                <Card className="bg-sidebar">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="eye" className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">Modo Descoberta Ativo</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Clique em qualquer elemento da analogia para ver explicações detalhadas e exemplos práticos.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Construtor por Camadas */}
          {activeModule === "camadas" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Construtor por Camadas</h2>
                <p className="text-text-secondary">
                  Como uma serigrafia, cada camada adiciona funcionalidade à aplicação
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="palette" className="h-5 w-5" />
                      Mesa de Serigrafia Digital
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={startLayerSimulation} disabled={isSimulating} size="sm" className="gap-2">
                        <Icon name="play" className="h-4 w-4" />
                        Simular
                      </Button>
                      <Button onClick={resetSimulation} size="sm" variant="outline" className="gap-2">
                        <Icon name="settings" className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {layers.map((layer) => (
                      <div key={layer.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 ${layer.color} rounded-full`} />
                            <div>
                              <h4 className="font-semibold">{layer.name}</h4>
                              <p className="text-sm text-text-secondary">{layer.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{Math.round(layer.progress)}%</Badge>
                        </div>
                        <Progress value={layer.progress} className="h-2" />
                      </div>
                    ))}

                    <Separator />

                    <div className="bg-background rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-4">
                          {layerProgress === 0 && "📄"}
                          {layerProgress > 0 && layerProgress <= 25 && "🏗️"}
                          {layerProgress > 25 && layerProgress <= 50 && "🎨"}
                          {layerProgress > 50 && layerProgress <= 75 && "⚡"}
                          {layerProgress > 75 && "🚀"}
                        </div>
                        <h3 className="font-semibold mb-2">
                          {layerProgress === 0 && "Tela em Branco"}
                          {layerProgress > 0 && layerProgress <= 25 && "Estrutura Básica"}
                          {layerProgress > 25 && layerProgress <= 50 && "Visual Aplicado"}
                          {layerProgress > 50 && layerProgress <= 75 && "Interatividade Adicionada"}
                          {layerProgress > 75 && "Aplicação Completa"}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {layerProgress === 0 && "Pronto para receber a primeira camada"}
                          {layerProgress > 0 && layerProgress <= 25 && "HTML estruturando o conteúdo"}
                          {layerProgress > 25 && layerProgress <= 50 && "CSS estilizando a aparência"}
                          {layerProgress > 50 && layerProgress <= 75 && "JavaScript adicionando comportamento"}
                          {layerProgress > 75 && "Dados conectados e aplicação funcional"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Arquiteto de Conexões */}
          {activeModule === "conexoes" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Arquiteto de Conexões</h2>
                <p className="text-text-secondary">
                  Visualize como os componentes se conectam como instalações de uma casa
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="home" className="h-5 w-5" />
                      Parede do Componente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-sidebar rounded-lg p-6 min-h-[300px] relative">
                      <div className="absolute inset-4 border-2 border-dashed border-accent rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Icon name="code" className="h-8 w-8 mx-auto mb-2 text-accent" />
                          <h4 className="font-semibold text-accent">Componente React</h4>
                          <p className="text-sm text-text-secondary">Sua "parede" com múltiplas conexões</p>
                        </div>
                      </div>

                      {/* Conexões visuais */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-3 h-3 bg-sky-500 rounded-full" />
                        <div className="text-xs text-center mt-1">Props</div>
                      </div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div className="text-xs text-center mt-1">Estado</div>
                      </div>
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="text-xs text-center mt-1">Eventos</div>
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <div className="text-xs text-center mt-1">APIs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {connections.map((connection) => {
                    return (
                      <Card key={connection.type}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon name={connection.icon} className={`h-5 w-5 mt-0.5 ${connection.color}`} />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{connection.name}</h4>
                              <p className="text-sm text-text-secondary mb-3">{connection.description}</p>
                              <div className="space-y-1">
                                {connection.connections.map((conn, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs">
                                    <Icon name="arrowRight" className="h-3 w-3 text-text-secondary" />
                                    <span>{conn}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Evolução Modular */}
          {activeModule === "evolucao" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Evolução Modular</h2>
                <p className="text-text-secondary">Veja como aplicações simples evoluem para sistemas complexos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {evolutionStages.map((stage, index) => (
                  <Card key={stage.stage} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Estágio {stage.stage}</Badge>
                        <Badge
                          variant={
                            stage.complexity === "low"
                              ? "secondary"
                              : stage.complexity === "medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {stage.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{stage.name}</CardTitle>
                      <p className="text-sm text-text-secondary">{stage.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm">Componentes:</h5>
                        <div className="flex flex-wrap gap-1">
                          {stage.components.map((component) => (
                            <Badge key={component} variant="secondary" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    {index < evolutionStages.length - 1 && (
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:block">
                        <Icon name="arrowRight" className="h-6 w-6 text-text-secondary" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Card className="bg-sidebar">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="zap" className="h-6 w-6 text-yellow-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Princípio da Evolução Modular</h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Assim como uma casa pode começar simples e ir ganhando novos cômodos e instalações, uma
                        aplicação web pode evoluir gradualmente, adicionando novas funcionalidades sem quebrar o que já
                        existe.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Vantagens:</h4>
                          <ul className="space-y-1 text-text-secondary">
                            <li>• Desenvolvimento incremental</li>
                            <li>• Menor risco de bugs</li>
                            <li>• Facilita manutenção</li>
                            <li>• Permite testes contínuos</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Estratégias:</h4>
                          <ul className="space-y-1 text-text-secondary">
                            <li>• Comece com MVP</li>
                            <li>• Adicione uma funcionalidade por vez</li>
                            <li>• Mantenha arquitetura flexível</li>
                            <li>• Documente as conexões</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Laboratório do Mestre */}
          {activeModule === "laboratorio" && <LaboratorioDoMestre />}

          {/* Arsenal 80/20 */}
          {activeModule === "arsenal" && <Arsenal8020 />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-accent text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon name="flask-conical" className="h-6 w-6" />
                <h3 className="text-xl font-bold">Alquimista Web</h3>
              </div>
              <p className="opacity-80 mb-4">Transformando conceitos abstratos em conhecimento tangível</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="target" className="h-4 w-4" />
                  <span>Educação Visual</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="workflow" className="h-4 w-4" />
                  <span>Analogias Práticas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="settings" className="h-4 w-4" />
                  <span>Construção Modular</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
