import { SoftwareFactoryPhase } from '../types';

export const SOFTWARE_FACTORY_DATA: SoftwareFactoryPhase[] = [
  // Fase 1: Requisitos e Análise de Domínio
  {
    id: 'requisitos-analise',
    title: 'Requisitos e Análise',
    icon: 'pen-tool',
    description: 'Coleta de requisitos, análise de domínio e planejamento inicial do sistema.',
    children: [
      {
        id: 'conceitos-gerais',
        title: 'Conceitos Gerais e Elicitação',
        icon: 'lightbulb',
        description: 'Fundamentos da engenharia de requisitos e técnicas de coleta.',
        status: 'pending',
        children: [
          {
            id: 'elicitacao-requisitos',
            title: 'Elicitação de Requisitos',
            icon: 'users',
            description: 'Técnicas para descobrir e coletar requisitos dos stakeholders.',
            status: 'pending',
            children: [
              { id: 'entrevistas', title: 'Entrevistas', icon: 'mic', description: 'Conversas estruturadas ou semi-estruturadas com stakeholders.', content: 'Descrição detalhada sobre a técnica de Entrevistas para levantamento de requisitos.', status: 'pending' },
              { id: 'workshops', title: 'Workshops', icon: 'briefcase', description: 'Sessões colaborativas para definir requisitos em grupo.', content: 'Descrição detalhada sobre a facilitação de Workshops de requisitos.', status: 'pending' },
              { id: 'brainstorming', title: 'Brainstorming', icon: 'sparkles', description: 'Geração de ideias em um ambiente livre e criativo.', content: 'Descrição detalhada sobre como conduzir sessões de Brainstorming eficazes.', status: 'pending' },
              { id: 'questionarios', title: 'Questionários', icon: 'list', description: 'Coleta de informações de um grande número de pessoas de forma estruturada.', content: 'Descrição detalhada sobre a elaboração e aplicação de Questionários.', status: 'pending' },
              { id: 'observacao', title: 'Observação', icon: 'eye', description: 'Acompanhar o usuário em seu ambiente de trabalho para entender o processo real.', content: 'Descrição detalhada sobre a técnica de Observação (Shadowing).', status: 'pending' },
              { id: 'prototipagem', title: 'Prototipagem', icon: 'layout', description: 'Criar versões iniciais e interativas do sistema para validar ideias.', content: 'Descrição detalhada sobre o uso de Prototipagem para elicitação de requisitos.', status: 'pending', toolTarget: 'playground' },
            ]
          },
          { id: 'tipos-requisitos', title: 'Tipos de Requisitos', icon: 'layers', description: 'Classificação dos diferentes tipos de requisitos de um sistema.', content: 'Requisitos são divididos em Funcionais (o que o sistema faz), Não-Funcionais (como o sistema faz), de Domínio, etc.', status: 'pending' },
          { id: 'documentacao-sdlc', title: 'Documentação (SDLC e CMMI)', icon: 'file-text', description: 'Padrões e modelos para documentar o ciclo de vida do desenvolvimento.', content: 'Descrição detalhada sobre SDLC (Software Development Life Cycle) e CMMI (Capability Maturity Model Integration).', status: 'pending' },
          { id: 'requisitos-nao-funcionais-rnf', title: 'Requisitos Não-Funcionais (RNF)', icon: 'shield-check', description: 'Critérios de qualidade do sistema, como performance e segurança.', content: 'Descrição detalhada sobre a importância e exemplos de Requisitos Não-Funcionais.', status: 'pending' },
        ]
      },
      {
        id: 'detalhamento-classificacao',
        title: 'Detalhamento, Classificação e Priorização',
        icon: 'search',
        description: 'Técnicas para analisar, refinar e organizar os requisitos coletados.',
        status: 'pending',
        toolTarget: 'modeling_hub',
        children: [
          { id: 'analise-stakeholders', title: 'Análise de Stakeholders', icon: 'users', description: 'Identificar e analisar as partes interessadas e suas influências.', content: 'Descrição detalhada sobre a Análise de Stakeholders.', status: 'pending' },
          { id: 'modelos-dominio', title: 'Modelos de Domínio', icon: 'bookOpen', description: 'Criar um modelo conceitual do domínio do problema.', content: 'Descrição detalhada sobre Modelos de Domínio.', status: 'pending', toolTarget: 'modeling_hub' },
          { id: 'modelagem-analise-uml-rup', title: 'Modelagem e Análise (UML/RUP)', icon: 'git-fork', description: 'Uso de UML e RUP para analisar e documentar requisitos.', content: 'Descrição detalhada sobre UML (Unified Modeling Language) e RUP (Rational Unified Process).', status: 'pending', toolTarget: 'modeling_hub' },
          { id: 'design-by-contract', title: 'Design por Contrato (DbC)', icon: 'file-text', description: 'Definir contratos formais para os componentes de software.', content: 'Descrição detalhada sobre Design by Contract.', status: 'pending' },
          {
            id: 'tecnicas-priorizacao',
            title: 'Técnicas de Priorização de Requisitos',
            icon: 'barChart3',
            description: 'Métodos para classificar a importância dos requisitos do projeto.',
            status: 'pending',
            toolTarget: 'modeling_hub',
            children: [
              {
                id: 'moscow',
                title: 'MoSCoW',
                icon: 'listChecks',
                description: 'Classifica requisitos em Must-have, Should-have, Could-have, and Won\'t-have.',
                content: 'O método MoSCoW é uma técnica de priorização usada para ajudar a entender e gerenciar requisitos. Cada requisito é classificado em uma de quatro categorias: Must-have (Deve ter), Should-have (Deveria ter), Could-have (Poderia ter), e Won\'t-have (Não terá desta vez).',
                status: 'pending',
                toolTarget: 'modeling_hub'
              },
              {
                id: 'kano',
                title: 'Análise de Kano',
                icon: 'star',
                description: 'Modelo para priorização de features com base na satisfação do cliente.',
                content: 'O Modelo Kano é uma teoria para desenvolvimento de produtos e satisfação do cliente que classifica as preferências do cliente em cinco categorias: Básicos, de Performance, de Encantamento, Indiferentes e Reversos. Ajuda a priorizar funcionalidades que realmente importam para o usuário.',
                status: 'pending',
                toolTarget: 'modeling_hub'
              },
              {
                id: 'eisenhower',
                title: 'Matriz de Priorização (Eisenhower)',
                icon: 'table',
                description: 'Classifica tarefas com base na urgência e importância.',
                content: 'A Matriz de Eisenhower, também conhecida como Matriz Urgente-Importante, ajuda a organizar e priorizar tarefas decidindo sobre o que é importante e urgente. As tarefas são divididas em quatro quadrantes: Fazer, Decidir, Delegar e Deletar.',
                status: 'pending',
                toolTarget: 'modeling_hub'
              }
            ]
          }
        ]
      },
    ]
  },
  // Fase 2: Design e Arquitetura de Software
  {
    id: 'design-arquitetura',
    title: 'Design e Arquitetura',
    icon: 'compass',
    description: 'Definição da estrutura, padrões e tecnologias do sistema.',
    children: [
       {
        id: 'design-patterns', title: 'Padrões de Design', icon: 'package', description: 'Soluções reutilizáveis para problemas comuns de design.', status: 'pending', toolTarget: 'laboratory', children: [
          {
            id: 'criacionais', title: 'Padrões Criacionais', icon: 'plus', description: 'Abstraem o processo de instanciação de objetos.', status: 'pending',
            children: [
              { id: 'factory-method', title: 'Factory Method', icon: 'zap', description: 'Define uma interface para criar um objeto, mas deixa as subclasses decidirem qual classe instanciar.', content: 'Descrição detalhada do padrão Factory Method.', status: 'pending', toolTarget: 'laboratory' },
              { id: 'singleton', title: 'Singleton', icon: 'zap', description: 'Garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela.', content: 'Descrição detalhada do padrão Singleton.', status: 'pending', toolTarget: 'laboratory' },
            ]
          },
          { id: 'estruturais', title: 'Padrões Estruturais', icon: 'git-fork', description: 'Lidam com a composição de classes e objetos.', content: 'Padrões como Adapter, Bridge, Composite, Decorator, Facade, Flyweight e Proxy.', status: 'pending' },
          { id: 'comportamentais', title: 'Padrões Comportamentais', icon: 'zap', description: 'Focam na comunicação e atribuição de responsabilidades entre objetos.', content: 'Padrões como Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method e Visitor.', status: 'pending' },
        ]
      },
      {
        id: 'estilos-arquiteturais', title: 'Estilos Arquiteturais', icon: 'layers', description: 'Abordagens de alto nível para organizar o sistema.', status: 'pending', children: [
          { id: 'microservicos', title: 'Microserviços', icon: 'cpu', description: 'Sistema composto por pequenos serviços independentes.', content: 'Descrição detalhada do estilo de Microserviços.', status: 'pending' },
          { id: 'monolitico', title: 'Monolítico', icon: 'box', description: 'Sistema construído como uma única unidade coesa.', content: 'Descrição detalhada do estilo Monolítico.', status: 'pending' },
        ]
      },
    ]
  },
  // Fase 3: Desenvolvimento e Implementação
  {
    id: 'desenvolvimento-implementacao',
    title: 'Desenvolvimento e Implementação',
    icon: 'code',
    description: 'Codificação, testes e qualidade do código.',
    children: [
      { id: 'qualidade-codigo', title: 'Qualidade de Código', icon: 'sparkles', description: 'Ferramentas e práticas para manter o código limpo e padronizado.', status: 'pending', toolTarget: 'playground', children: [
        { id: 'linter', title: 'Configurar Linter', icon: 'check', description: 'Análise estática de código para encontrar problemas.', content: 'Descrição detalhada sobre Linters (ESLint, etc.).', status: 'pending', toolTarget: 'playground' },
        { id: 'code-review', title: 'Revisão de Código (Code Review)', icon: 'users', description: 'Prática de ter outros desenvolvedores revisando o código.', content: 'Descrição detalhada sobre a prática de Code Review.', status: 'pending' },
      ]},
      { id: 'testes-software', title: 'Testes de Software', icon: 'clipboardCheck', description: 'Diferentes níveis e abordagens para testar o software.', status: 'pending', toolTarget: 'laboratory', children: [
        { id: 'testes-unitarios', title: 'Escrever Testes Unitários', icon: 'box', description: 'Testar a menor parte de um software de forma isolada.', content: 'Descrição detalhada sobre Testes Unitários.', status: 'pending', toolTarget: 'laboratory' },
        { id: 'tdd', title: 'Praticar TDD', icon: 'repeat', description: 'Desenvolvimento guiado por testes.', content: 'Descrição detalhada sobre TDD.', status: 'pending', toolTarget: 'laboratory' },
      ]},
      { id: 'praticas-desenvolvimento', title: 'Práticas de Desenvolvimento', icon: 'git-fork', description: 'Práticas modernas para um fluxo de desenvolvimento eficiente.', status: 'pending', children: [
        { id: 'versionamento-git', title: 'Versionamento (Git)', icon: 'git-branch', description: 'Controlar as versões do código-fonte usando Git.', content: 'Descrição detalhada sobre Git e estratégias como Git Flow.', status: 'pending' },
        { id: 'integracao-continua-ci', title: 'Configurar CI', icon: 'cpu', description: 'Automatizar a integração e verificação do código.', content: 'Descrição detalhada sobre Integração Contínua.', status: 'pending' },
        { id: 'entrega-continua-cd', title: 'Configurar CD', icon: 'rocket', description: 'Automatizar a entrega do software para os ambientes.', content: 'Descrição detalhada sobre Entrega Contínua.', status: 'pending' },
      ]},
    ]
  },
    // Fase 4: Gestão e Infraestrutura
  {
    id: 'gestao-infraestrutura',
    title: 'Gestão e Infraestrutura',
    icon: 'settings',
    description: 'Gerenciamento de projetos, tecnologias e infraestrutura.',
    children: [
       { id: 'gerenciamento-projetos', title: 'Gerenciamento de Projetos', icon: 'briefcase', description: 'Disciplinas para gerenciar o projeto de software.', status: 'pending', children: [
        { id: 'escopo', title: 'Definir Escopo', icon: 'compass', description: 'Definir o que será e o que não será feito.', content: 'Descrição detalhada sobre Gerenciamento de Escopo.', status: 'pending' },
        { id: 'cronograma', title: 'Criar Cronograma', icon: 'calendar', description: 'Planejar e controlar o tempo do projeto.', content: 'Descrição detalhada sobre Gerenciamento de Cronograma.', status: 'pending' },
      ]},
       { id: 'padroes-infraestrutura', title: 'Padrões de Infraestrutura', icon: 'hardDrive', description: 'Conceitos modernos para provisionar e gerenciar a infraestrutura.', status: 'pending', children: [
        { id: 'conteineres-docker', title: 'Conteinerizar (Docker)', icon: 'box', description: 'Empacotar a aplicação e suas dependências em contêineres.', content: 'Descrição detalhada sobre Docker.', status: 'pending' },
        { id: 'infra-como-codigo-iac', title: 'Infra as Code (IaC)', icon: 'file-code', description: 'Gerenciar a infraestrutura usando arquivos de configuração.', content: 'Descrição detalhada sobre IaC e ferramentas como Terraform.', status: 'pending' },
      ]},
    ]
  },
];