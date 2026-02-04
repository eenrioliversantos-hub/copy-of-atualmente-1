
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Icon from "../shared/Icon"

interface AcademyPageProps {
    setCurrentView: (view: string, context?: any) => void;
}

export default function AcademyPage({ setCurrentView }: AcademyPageProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const academyStats = [
    { title: "Cursos Disponíveis", value: "32", change: "+3 este mês", icon: "bookOpen", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { title: "Alunos Ativos", value: "156", change: "+12% vs mês anterior", icon: "users", color: "text-green-400", bgColor: "bg-green-500/10" },
    { title: "Certificados Emitidos", value: "89", change: "+8% esta semana", icon: "award", color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { title: "Taxa de Conclusão", value: "78%", change: "Média geral", icon: "trendingUp", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  ]

  const myCourses = [
    { id: "react-advanced", title: "React Advanced Patterns", instructor: "Ana Silva", progress: 65, category: "Frontend", status: "in_progress", nextLesson: "Custom Hooks Patterns" },
    { id: "node-microservices", title: "Node.js Microservices", instructor: "Carlos Santos", progress: 100, category: "Backend", status: "completed" },
  ]

  const availableCourses = [
    { id: "git-versioning", title: "Git & Versionamento: Do Básico ao Avançado", instructor: "Carlos Silva", students: 402, rating: 4.9, duration: "14h", category: "Boas Práticas", level: "Todos os Níveis" },
    { id: "effective-docs", title: "Documentação de Software Eficaz", instructor: "Ana Santos", students: 215, rating: 4.8, duration: "6h", category: "Documentação", level: "Intermediário" },
    { id: "clean-code", title: "Clean Code e Padrões de Projeto", instructor: "Pedro Costa", students: 673, rating: 4.9, duration: "18h", category: "Desenvolvimento", level: "Avançado" },
  ];

  const seniorTips = [
    { id: 'tip-1', tip: "Aprenda a usar o debugger do seu editor. É mais rápido e eficiente do que `console.log()` para a maioria dos casos." },
    { id: 'tip-2', tip: "Escreva o teste antes do código (TDD). Parece lento, mas economiza tempo a longo prazo ao prevenir bugs." },
    { id: 'tip-3', tip: "Domine os comandos do seu terminal. Atalhos e scripts podem automatizar tarefas repetitivas e acelerar seu fluxo de trabalho." },
    { id: 'tip-4', tip: "Não reinvente a roda, mas entenda como ela funciona. Use bibliotecas, mas saiba o que elas fazem por baixo dos panos." }
  ];
  
  const learningPaths = [
    { id: "fullstack", name: "Trilha Arquiteto de Software", courses: 8, progress: 45, level: "Avançado", description: "Torne-se um especialista em arquitetura de sistemas." },
    { id: "devops", name: "Trilha Engenheiro DevOps", courses: 6, progress: 20, level: "Avançado", description: "Domine a cultura e as ferramentas de DevOps." },
  ]

  const achievements = [
    { id: "1", title: "Primeiro Curso Concluído", icon: "award", earned: true, date: "15 Jan 2024" },
    { id: "2", title: "Aprendiz Rápido", icon: "trendingUp", earned: true, date: "10 Jan 2024" },
    { id: "3", title: "Explorador de Conhecimento", icon: "bookOpen", earned: false, date: null },
  ]

  const getStatusColor = (status: string) => ({ completed: "text-green-400 bg-green-500/10", in_progress: "text-blue-400 bg-blue-500/10", not_started: "text-text-secondary bg-sidebar" }[status] || "text-text-secondary bg-sidebar");
  const getLevelColor = (level: string) => ({ Iniciante: "text-green-400 bg-green-500/10", Intermediário: "text-yellow-400 bg-yellow-500/10", Avançado: "text-red-400 bg-red-500/10" }["Todos os Níveis" === level ? "Iniciante" : level] || "text-text-secondary bg-sidebar");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Icon name="graduationCap" className="h-8 w-8 text-accent" />
            Academia Principal
          </h1>
          <p className="text-text-secondary">Desenvolva suas habilidades com cursos e trilhas especializadas.</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="my-courses">Meus Cursos</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="paths">Trilhas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon name="play" className="h-5 w-5 text-accent" />Aprendizado Atual</CardTitle>
                <CardDescription>Continue de onde parou.</CardDescription>
              </CardHeader>
              <CardContent>
                {myCourses.filter(c => c.status === 'in_progress').length > 0 ? (
                  <div className="space-y-4">
                    {myCourses.filter((course) => course.status === "in_progress").map((course) => (
                      <div key={course.id} className="p-4 bg-sidebar rounded-lg border border-card-border">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-text-secondary mb-3">Por {course.instructor}</p>
                        <Progress value={course.progress} className="h-2 mb-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Próxima: {course.nextLesson}</span>
                          <Button size="sm" onClick={() => setCurrentView('academy_course_detail', { courseId: course.id })}>Continuar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-center text-text-secondary py-8">Nenhum curso em progresso.</p>}
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="sparkles" className="h-5 w-5 text-accent" />
                  Macetes de Sênior
                </CardTitle>
                <CardDescription>Pílulas de conhecimento de desenvolvedores experientes.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {seniorTips.map(tip => (
                    <li key={tip.id} className="flex items-start gap-3 text-sm">
                      <Icon name="lightbulb" className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{tip.tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-courses" className="space-y-6">
            {myCourses.map((course) => (
              <Card key={course.id}><CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-text-secondary">Instrutor: {course.instructor}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(course.status)}>
                    {course.status === "completed" ? "Concluído" : course.status === "in_progress" ? "Em Progresso" : "Não Iniciado"}
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2 my-3" />
                <Button size="sm" onClick={() => setCurrentView('academy_course_detail', { courseId: course.id })}>{course.status === 'completed' ? 'Revisar' : 'Continuar'}</Button>
              </CardContent></Card>
            ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-text-secondary">Por {course.instructor}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge variant="outline" className={getLevelColor(course.level)}>{course.level}</Badge>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setCurrentView('academy_course_detail', { courseId: course.id })}>
                      Ver Curso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
            {learningPaths.map((path) => (
              <Card key={path.id}><CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{path.name}</h3>
                    <p className="text-text-secondary">{path.description}</p>
                  </div>
                  <Badge variant="outline" className={getLevelColor(path.level)}>{path.level}</Badge>
                </div>
                <Progress value={path.progress} className="h-3 my-4" />
                <Button onClick={() => alert("Navegação para trilhas em desenvolvimento.")}>Continuar Trilha</Button>
              </CardContent></Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
