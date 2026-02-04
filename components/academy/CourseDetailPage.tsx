
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ScrollArea } from '../ui/ScrollArea';

// --- MOCK DATA ---
const courseData: Record<string, any> = {
    'git-versioning': {
        title: 'Git & Versionamento: Do Básico ao Avançado',
        instructor: 'Carlos Silva',
        description: 'Domine o Git, a ferramenta essencial para qualquer desenvolvedor. Aprenda desde os comandos básicos até estratégias de branching e workflows de equipe.',
        modules: [
            {
                title: 'Módulo 1: Introdução ao Git',
                lessons: [
                    { id: '1-1', title: 'O que é Versionamento?', duration: '8 min', content: 'Versionamento de código é a prática de rastrear e gerenciar mudanças em arquivos de código-fonte ao longo do tempo. Ele permite que múltiplos desenvolvedores trabalhem no mesmo projeto simultaneamente sem sobrescrever o trabalho um do outro. O Git é o sistema de controle de versão distribuído mais popular do mundo.' },
                    { id: '1-2', title: 'Instalando e Configurando o Git', duration: '12 min', content: 'Para começar, você precisa instalar o Git em sua máquina... O próximo passo é configurar sua identidade com `git config --global user.name "Seu Nome"` e `git config --global user.email "seu.email@exemplo.com"`.' },
                    { id: '1-3', title: 'Seu Primeiro Repositório', duration: '15 min', content: 'Para criar um novo repositório, navegue até a pasta do seu projeto e execute `git init`. Isso cria uma subpasta oculta `.git` que armazena todo o histórico e metadados.' },
                ]
            },
            {
                title: 'Módulo 2: Comandos Essenciais',
                lessons: [
                    { id: '2-1', title: 'O Ciclo Básico: add, commit, push', duration: '20 min', content: 'O fluxo de trabalho fundamental no Git envolve três comandos: `git add` para selecionar as mudanças, `git commit` para salvar um snapshot no histórico local, e `git push` para enviar suas mudanças para um repositório remoto.' },
                    { id: '2-2', title: 'Analisando o Histórico: log, status, diff', duration: '18 min', content: '`git status` mostra o estado atual do seu repositório. `git log` exibe o histórico de commits. `git diff` mostra as diferenças entre o estado atual e o último commit.' },
                ]
            },
            {
                title: 'Módulo 3: Branching & Merging',
                lessons: [
                    { id: '3-1', title: 'Estratégias de Branching (Git Flow)', duration: '25 min', content: 'Git Flow é uma estratégia popular que usa branches para `features`, `develop`, `release` e `main` para organizar o desenvolvimento. Isso ajuda a manter o branch principal estável enquanto novas funcionalidades são desenvolvidas em paralelo.' },
                    { id: '3-2', title: 'Resolvendo Conflitos de Merge', duration: '22 min', content: 'Conflitos ocorrem quando o Git não consegue juntar automaticamente as mudanças de dois branches. Você precisará editar manualmente os arquivos conflitantes, marcados com `<<<<<<<`, `=======`, e `>>>>>>>`, para resolver as diferenças.' },
                ]
            },
        ]
    }
};

interface CourseDetailPageProps {
    courseId: string;
    onBack: () => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onBack }) => {
    const course = courseData[courseId] || courseData['git-versioning']; // Fallback to git course
    const [activeLesson, setActiveLesson] = useState(course.modules?.[0]?.lessons?.[0] || null);

    if (!activeLesson) {
        return (
            <div className="flex h-screen bg-background text-text-primary">
                {/* Sidebar */}
                <aside className="w-80 bg-sidebar flex flex-col border-r border-card-border flex-shrink-0">
                    <header className="p-4 border-b border-card-border">
                        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
                            <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                            Voltar para Academia
                        </Button>
                        <h1 className="text-lg font-bold truncate">{course.title}</h1>
                        <p className="text-sm text-text-secondary">por {course.instructor}</p>
                    </header>
                    <ScrollArea className="flex-1">
                        <nav className="p-2">
                            {course.modules.map((module: any, index: number) => (
                                <div key={index} className="mb-4">
                                    <h2 className="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        {module.title}
                                    </h2>
                                    <ul className="space-y-1">
                                        {module.lessons.map((lesson: any) => (
                                            <li key={lesson.id}>
                                                <button
                                                    onClick={() => setActiveLesson(lesson)}
                                                    className={'w-full text-left text-sm p-2 rounded-md flex items-center justify-between transition-colors hover:bg-slate-700'}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon name="play" className="h-3 w-3" />
                                                        <span className="truncate">{lesson.title}</span>
                                                    </div>
                                                    <span className="text-xs opacity-70">{lesson.duration}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </ScrollArea>
                </aside>
    
                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center overflow-hidden text-center">
                    <Icon name="bookOpen" className="h-12 w-12 text-text-secondary mb-4" />
                    <h2 className="text-xl font-semibold">Nenhuma lição encontrada para este curso.</h2>
                    <p className="text-text-secondary mt-1">O conteúdo deste curso pode estar em desenvolvimento.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-text-primary">
            {/* Sidebar */}
            <aside className="w-80 bg-sidebar flex flex-col border-r border-card-border flex-shrink-0">
                <header className="p-4 border-b border-card-border">
                    <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar para Academia
                    </Button>
                    <h1 className="text-lg font-bold truncate">{course.title}</h1>
                    <p className="text-sm text-text-secondary">por {course.instructor}</p>
                </header>
                <ScrollArea className="flex-1">
                    <nav className="p-2">
                        {course.modules.map((module: any, index: number) => (
                            <div key={index} className="mb-4">
                                <h2 className="px-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                    {module.title}
                                </h2>
                                <ul className="space-y-1">
                                    {module.lessons.map((lesson: any) => (
                                        <li key={lesson.id}>
                                            <button
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`w-full text-left text-sm p-2 rounded-md flex items-center justify-between transition-colors ${
                                                    activeLesson.id === lesson.id
                                                        ? 'bg-accent text-white'
                                                        : 'hover:bg-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon name="play" className="h-3 w-3" />
                                                    <span className="truncate">{lesson.title}</span>
                                                </div>
                                                <span className="text-xs opacity-70">{lesson.duration}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-background/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex-shrink-0">
                     <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                     <p className="text-text-secondary">{activeLesson.duration}</p>
                </header>
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                     <div className="prose prose-invert max-w-none text-text-secondary">
                        <p>{activeLesson.content}</p>
                        {/* In a real app, this would render markdown or rich text */}
                     </div>
                </div>
                 <footer className="p-4 border-t border-card-border flex justify-between items-center">
                    <Button variant="outline">Lição Anterior</Button>
                    <Button>Marcar como Concluída</Button>
                </footer>
            </main>
        </div>
    );
};

export default CourseDetailPage;
