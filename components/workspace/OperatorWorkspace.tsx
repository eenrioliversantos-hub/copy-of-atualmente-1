
import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';

interface OperatorWorkspaceProps {
    setCurrentView: (view: string) => void;
}

const ToolCard: React.FC<{ title: string; description: string; icon: string; features: string[]; action: () => void; }> = ({ title, description, icon, features, action }) => (
    <Card 
        onClick={action}
        className="cursor-pointer group transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-1 bg-sidebar/50 hover:bg-sidebar flex flex-col"
    >
        <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex items-start gap-3">
                <div className="p-2.5 bg-background rounded-lg border border-card-border group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                    <Icon name={icon} className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors text-base">{title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{description}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                {features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);

const softwareFactoryPhases = [
    {
        title: "Requisitos e Análise",
        description: "Ferramentas para conceber, planejar e estruturar seus projetos de software do zero ou a partir de modelos.",
        tools: [
            {
              title: "Modelagem Avançada",
              description: "Acesse um projeto para usar o wizard de 27 etapas para uma modelagem detalhada.",
              icon: 'schema',
              action: (setCurrentView: (view: string) => void) => setCurrentView("projects"),
              features: ["27 Etapas", "Do Zero", "Completo"],
            },
            {
              title: "Nova Sessão de Modelagem",
              description: "Inicie um projeto a partir de um template, realize manutenções ou importe um modelo existente.",
              icon: 'play',
              action: (setCurrentView: (view: string) => void) => setCurrentView("new_session"),
              features: ["Templates", "Manutenção", "Importar"],
            },
        ]
    },
    {
        title: "Design e Arquitetura",
        description: "Recursos e padrões para garantir a consistência e a qualidade visual e estrutural da sua aplicação.",
        tools: [
            {
              title: "Interface e UX",
              description: "Modele a UI/UX de um projeto. Acessado através do Hub de Modelagem de um projeto existente.",
              icon: 'palette',
              action: (setCurrentView: (view: string) => void) => setCurrentView("projects"),
              features: ["IA-Powered", "Prototipagem", "Responsivo"],
            },
            {
              title: "Design System (Backend)",
              description: "Padrões para APIs, endpoints, middlewares e arquitetura de serviços.",
              icon: 'server',
              action: (setCurrentView: (view: string) => void) => setCurrentView("backend_design_system"),
              features: ["APIs", "Endpoints", "Middlewares"],
            },
            {
              title: "Design System (Banco de Dados)",
              description: "Modelagem de dados, schemas, relacionamentos e otimizações de banco.",
              icon: 'database',
              action: (setCurrentView: (view: string) => void) => setCurrentView("database_design_system"),
              features: ["Schemas", "Relacionamentos", "Queries"],
            },
        ]
    },
    {
        title: "Desenvolvimento e Implementação",
        description: "Ferramentas práticas para construir, testar e experimentar a lógica de negócio e os algoritmos do seu sistema.",
        tools: [
            {
              title: "Laboratório de Algoritmos",
              description: "Ferramenta estruturada em 6 etapas para a construção de algoritmos e resolução de problemas.",
              icon: 'flask-conical',
              action: (setCurrentView: (view: string) => void) => setCurrentView("laboratory"),
              features: ["6 Etapas", "Algoritmos", "Resolução"],
            },
            {
              title: "Playground de Código",
              description: "Ambiente visual para implementar soluções com blocos de código e prototipar funcionalidades.",
              icon: 'puzzle',
              action: (setCurrentView: (view: string) => void) => setCurrentView("playground"),
              features: ["Blocos Visuais", "Código Real", "Drag & Drop"],
            },
        ]
    },
    {
        title: "Gestão e Infraestrutura",
        description: "Leve seus projetos do plano à produção, monitore a performance e gerencie o ciclo de vida.",
        tools: [
            {
              title: "Esteira de Produção",
              description: "Visualize e gerencie o ciclo de vida completo do projeto em uma esteira de produção integrada.",
              icon: 'workflow',
              action: (setCurrentView: (view: string) => void) => setCurrentView("construction_hub"),
              features: ["CI/CD", "Geração de Docs", "Deploy"],
            },
            {
              title: "Monitoramento",
              description: "Acompanhe a saúde, performance e logs da sua aplicação em tempo real.",
              icon: 'barChart3',
              action: () => alert("Ferramenta de Monitoramento em desenvolvimento."),
              features: ["Health Check", "Logs", "Alertas"],
            },
        ]
    }
];


const OperatorWorkspace: React.FC<OperatorWorkspaceProps> = ({ setCurrentView }) => {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">Workspace</h1>
                <p className="text-text-secondary">Seu centro de comando para o ciclo de vida completo do desenvolvimento de software.</p>
            </div>

            {softwareFactoryPhases.map(phase => (
                <div key={phase.title}>
                    <h2 className="text-2xl font-semibold mb-2">{phase.title}</h2>
                    <p className="text-text-secondary mb-5 max-w-3xl">{phase.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {phase.tools.map((tool, index) => (
                            <ToolCard key={index} {...tool} action={() => tool.action(setCurrentView)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OperatorWorkspace;
