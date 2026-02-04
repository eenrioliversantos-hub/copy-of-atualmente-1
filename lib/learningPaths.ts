export interface Resource {
    title: string;
    url: string;
    type: 'video' | 'article' | 'docs';
}

export interface Practice {
    description: string;
    toolLink?: 'laboratory' | 'playground';
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    content: {
        theory: string;
        practice: Practice;
        resources: Resource[];
    };
}

export interface Step {
    id: string;
    title: string;
    isOptional?: boolean;
    isMilestone?: boolean;
    topics: Topic[];
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    tags: string[];
    steps: Step[];
}

export const LEARNING_PATHS: LearningPath[] = [
    {
        id: 'frontend',
        title: 'Trilha Frontend',
        description: 'Aprenda a construir interfaces web modernas, do HTML básico aos frameworks avançados.',
        icon: 'layout',
        tags: ['Web', 'UI/UX', 'React'],
        steps: [
            {
                id: 'step-internet',
                title: 'Fundamentos da Internet',
                topics: [
                    {
                        id: 'topic-what-is-internet',
                        title: 'O que é a Internet?',
                        description: 'Como a internet funciona.',
                        content: {
                            theory: 'A Internet é uma rede global de computadores interconectados que permite a troca de dados. Ela usa um conjunto de protocolos chamado TCP/IP para comunicação.',
                            practice: { description: 'Desenhe um diagrama simples de como seu computador se conecta a um site como o Google.' },
                            resources: [
                                { title: 'Como a Internet funciona', url: 'https://developer.mozilla.org/pt-BR/docs/Learn/Common_questions/How_does_the_Internet_work', type: 'article' },
                            ]
                        }
                    },
                    {
                        id: 'topic-http',
                        title: 'HTTP e HTTPS',
                        description: 'O protocolo para comunicação na web.',
                        content: {
                            theory: 'HTTP (HyperText Transfer Protocol) é o protocolo usado para transferir dados pela web. HTTPS é a versão segura, que criptografa os dados.',
                            practice: { description: 'Use as ferramentas de desenvolvedor do seu navegador para inspecionar uma requisição de rede e ver os cabeçalhos HTTP.' },
                            resources: [
                                { title: 'Uma visão geral sobre o HTTP', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview', type: 'docs' },
                            ]
                        }
                    },
                ]
            },
            {
                id: 'step-html',
                title: 'HTML - A Estrutura',
                topics: [
                     {
                        id: 'topic-html-basics',
                        title: 'HTML Básico',
                        description: 'Aprendendo os blocos de construção da web.',
                        content: {
                            theory: 'HTML (HyperText Markup Language) é a linguagem de marcação padrão para criar páginas da web. Ele descreve a estrutura de uma página usando elementos representados por tags.',
                            practice: { description: 'Crie um arquivo `index.html` com um cabeçalho (h1), um parágrafo (p) e um link (a).', toolLink: 'playground' },
                            resources: [
                                { title: 'Introdução ao HTML', url: 'https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Introduction_to_HTML', type: 'article' },
                            ]
                        }
                    },
                ]
            },
            {
                id: 'step-css',
                title: 'CSS - A Aparência',
                topics: [
                     {
                        id: 'topic-css-basics',
                        title: 'CSS Básico',
                        description: 'Estilizando suas páginas web.',
                        content: {
                            theory: 'CSS (Cascading Style Sheets) é uma linguagem usada para descrever a aparência de um documento escrito em HTML. Com CSS, você pode controlar cores, fontes, espaçamento e layout.',
                            practice: { description: 'Crie um arquivo `style.css` e mude a cor do seu h1 para azul e o tamanho da fonte do seu parágrafo.', toolLink: 'playground' },
                            resources: [
                                { title: 'Primeiros passos em CSS', url: 'https://developer.mozilla.org/pt-BR/docs/Learn/CSS/First_steps', type: 'article' },
                            ]
                        }
                    },
                ]
            },
             {
                id: 'step-javascript',
                title: 'JavaScript - A Interatividade',
                isMilestone: true,
                topics: [
                     {
                        id: 'topic-js-basics',
                        title: 'JavaScript Básico',
                        description: 'Adicionando comportamento dinâmico.',
                        content: {
                            theory: 'JavaScript é uma linguagem de programação que permite implementar funcionalidades complexas em páginas web. É o que torna a web interativa.',
                            practice: { description: 'Use JavaScript para adicionar um evento de clique a um botão que exibe um alerta na tela.', toolLink: 'playground' },
                            resources: [
                                { title: 'JavaScript - Primeiros Passos', url: 'https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/First_steps', type: 'article' },
                            ]
                        }
                    },
                ]
            }
        ]
    },
    {
        id: 'backend',
        title: 'Trilha Backend',
        description: 'Construa a lógica do servidor, APIs e bancos de dados que potencializam as aplicações.',
        icon: 'server',
        tags: ['API', 'Database', 'Node.js'],
        steps: [],
    },
    {
        id: 'devops',
        title: 'Trilha DevOps',
        description: 'Aprenda sobre CI/CD, containers, orquestração e automação da infraestrutura.',
        icon: 'cog',
        tags: ['CI/CD', 'Docker', 'Kubernetes'],
        steps: [],
    }
];