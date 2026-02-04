// Mock data for Commits, Files, and Commands related to the development plan.

export const MOCK_COMMITS: Record<string, any[]> = {
    'Inicialização do Projeto': [
        { hash: 'a1b2c3d', message: 'feat: setup initial project structure with backend and frontend', author: 'Ana Costa', date: '2 days ago' },
        { hash: 'e4f5g6h', message: 'chore: configure root .gitignore and README.md', author: 'Ana Costa', date: '2 days ago' },
        { hash: 'i7j8k9l', message: 'ci: add initial github actions workflow for linting', author: 'Pedro Santos', date: '1 day ago' },
    ],
    'Configuração de Ferramentas de Desenvolvimento': [
        { hash: 'm0n1o2p', message: 'chore(backend): add eslint and prettier configs', author: 'Pedro Santos', date: '1 day ago' },
        { hash: 'q3r4s5t', message: 'chore(frontend): add eslint, prettier, and tailwind configs', author: 'Pedro Santos', date: '1 day ago' },
        { hash: 'u6v7w8x', message: 'test: setup jest for backend and vitest for frontend', author: 'Juliana Oliveira', date: '12 hours ago' },
    ],
    'Configuração do Banco de Dados (Prisma & PostgreSQL)': [
        { hash: 'x9y0z1a', message: 'feat(db): initialize prisma and define initial schema', author: 'Ana Costa', date: '10 hours ago' },
        { hash: 'b2c3d4e', message: 'refactor(db): adjust user and order models', author: 'Ana Costa', date: '8 hours ago' },
        { hash: 'f5g6h7i', message: 'fix(db): correct relation between service and part tables', author: 'Pedro Santos', date: '5 hours ago' },
    ],
    'Módulo de Autenticação (`auth`)': [
        { hash: 'g8h9i0j', message: 'feat(auth): implement user registration service', author: 'Ana Costa', date: '4 hours ago' },
        { hash: 'k1l2m3n', message: 'feat(auth): implement login service and JWT generation', author: 'Ana Costa', date: '3 hours ago' },
        { hash: 'o4p5q6r', message: 'feat(auth): create auth routes and validation middleware', author: 'Pedro Santos', date: '2 hours ago' },
        { hash: 's7t8u9v', message: 'test(auth): add unit and integration tests for auth module', author: 'Juliana Oliveira', date: '1 hour ago' },
    ]
};

export const MOCK_FILES: Record<string, any[]> = {
     'Inicialização do Projeto': [
        { path: '/.gitignore', description: 'Global git ignore rules.' },
        { path: '/README.md', description: 'Main project documentation.' },
        { path: '/backend/.env.example', description: 'Environment variable template for backend.' },
        { path: '/backend/package.json', description: 'Backend dependencies and scripts.' },
        { path: '/backend/tsconfig.json', description: 'TypeScript configuration for backend.' },
        { path: '/frontend/package.json', description: 'Frontend dependencies and scripts.' },
        { path: '/frontend/vite.config.ts', description: 'Vite configuration for frontend.' },
    ],
    'Configuração do Banco de Dados (Prisma & PostgreSQL)': [
        { path: '/backend/prisma/schema.prisma', description: 'Defines database models and relations.' },
        { path: '/backend/prisma/migrations/.../migration.sql', description: 'SQL migration files.' },
        { path: '/backend/src/config/prisma.ts', description: 'Prisma client instance initialization.' },
    ],
    'Estrutura Principal do Backend (Express)': [
        { path: '/backend/src/app.ts', description: 'Main Express application setup.' },
        { path: '/backend/src/server.ts', description: 'Server initialization logic.' },
        { path: '/backend/src/middlewares/errorHandler.ts', description: 'Global error handling middleware.' },
    ],
    'Módulo de Autenticação (`auth`)': [
        { path: '/backend/src/modules/auth/auth.service.ts', description: 'Business logic for authentication.' },
        { path: '/backend/src/modules/auth/auth.controller.ts', description: 'Handles HTTP requests for auth.' },
        { path: '/backend/src/modules/auth/auth.routes.ts', description: 'Defines API routes for authentication.' },
        { path: '/backend/src/middlewares/auth.ts', description: 'JWT validation middleware.' },
    ]
};

export const MOCK_COMMANDS: Record<string, any[]> = {
     'Inicialização do Projeto': [
        { title: 'Initialize Git Repository', language: 'bash', code: 'git init\ngit add .\ngit commit -m "Initial commit"' },
        { title: 'Initialize Backend (Node.js)', language: 'bash', code: 'cd backend\nnpm init -y\nnpm install typescript @types/node ts-node-dev --save-dev\nnpx tsc --init' },
        { title: 'Initialize Frontend (Vite + React)', language: 'bash', code: 'npm create vite@latest frontend -- --template react-ts' },
    ],
    'Configuração do Banco de Dados (Prisma & PostgreSQL)': [
        { title: 'Install Prisma dependencies', language: 'bash', code: 'cd backend\nnpm install prisma @prisma/client' },
        { title: 'Initialize Prisma', language: 'bash', code: 'npx prisma init --datasource-provider postgresql' },
        { title: 'Create first migration', language: 'bash', code: 'npx prisma migrate dev --name initial-setup' },
        { title: 'Generate Prisma Client', language: 'bash', code: 'npx prisma generate' },
    ],
    'Módulo de Autenticação (`auth`)': [
        { title: 'Install Auth Dependencies', language: 'bash', code: 'cd backend\nnpm install bcryptjs jsonwebtoken zod\nnpm install @types/bcryptjs @types/jsonwebtoken --save-dev' },
        { title: 'Example JWT Generation', language: 'typescript', code: 'import jwt from "jsonwebtoken";\n\nconst token = jwt.sign(\n  { userId: user.id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: "7d" }\n);' },
        { title: 'Example Auth Middleware', language: 'typescript', code: `import { Request, Response, NextFunction } from 'express';\nimport jwt from 'jsonwebtoken';\n\nexport const authMiddleware = (req: Request, res: Response, next: NextFunction) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).send('Access denied.');\n\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET!));\n    req.user = payload;\n    next();\n  } catch (error) {\n    res.status(400).send('Invalid token.');\n  }\n};` },
    ]
};

export const MOCK_TASK_DETAILS: Record<string, any> = {
  'Inicialização do Projeto': {
    errosComuns: [
      {
        erro: "Permissões de pasta incorretas ao usar Docker.",
        solucao: "Verifique se o usuário dentro do container Docker tem permissão para ler/escrever nos volumes montados. Use `chown` no Dockerfile se necessário.",
        prevencao: "Sempre adicione um usuário não-root no seu Dockerfile e configure as permissões de volume corretamente no `docker-compose.yml`."
      },
       {
        erro: "Variáveis de ambiente não carregam no frontend Vite.",
        solucao: "Certifique-se de que as variáveis de ambiente no frontend estão prefixadas com `VITE_`. Ex: `VITE_API_URL`.",
        prevencao: "Siga a convenção do Vite para variáveis de ambiente expostas ao cliente."
      }
    ],
    faq: [
      {
        pergunta: "Por que usar TypeScript desde o início?",
        resposta: "TypeScript ajuda a evitar erros comuns de JavaScript, melhora o autocompletar da IDE e torna o código mais legível e manutenível, especialmente em projetos maiores e com equipes."
      },
      {
        pergunta: "Qual a vantagem de usar Vite para o frontend?",
        resposta: "Vite oferece um ambiente de desenvolvimento extremamente rápido (Hot Module Replacement quase instantâneo) e um processo de build otimizado, melhorando a produtividade do desenvolvedor."
      }
    ]
  },
   'Módulo de Autenticação (`auth`)': {
    errosComuns: [
      {
        erro: "Armazenar senhas em texto plano no banco de dados.",
        solucao: "Nunca armazene senhas diretamente. Use uma biblioteca como `bcryptjs` para criar um hash da senha antes de salvá-la.",
        prevencao: "Sempre passe a senha do usuário por uma função de hashing (ex: `bcrypt.hashSync(password, 10)`) antes de qualquer operação de banco de dados."
      },
      {
        erro: "Expor informações sensíveis no payload do JWT.",
        solucao: "O payload do JWT é visível para qualquer um que tenha o token. Inclua apenas informações não-sensíveis, como `userId` e `role`.",
        prevencao: "Nunca inclua senhas, chaves de API ou outros dados secretos no payload do JWT."
      },
       {
        erro: "Não invalidar tokens ao fazer logout.",
        solucao: "Para um sistema stateless, o logout no cliente (removendo o token) é suficiente. Para maior segurança, implemente uma blacklist de tokens no servidor (ex: em um cache como Redis) para invalidar tokens específicos.",
        prevencao: "Avalie o requisito de segurança. Se for alto, uma blacklist é recomendada."
      }
    ],
    testes: {
        comandos: [
            { comando: "npm test -- --testPathPattern=auth.service.test.ts", descricao: "Executa testes unitários para o serviço de autenticação.", resultado: "Todos os testes de lógica de negócio de autenticação passam." },
            { comando: "npm test -- --testPathPattern=auth.routes.test.ts", descricao: "Executa testes de integração para as rotas de autenticação.", resultado: "Endpoints /register e /login respondem corretamente." },
        ],
        validacoes: [
            "Um novo usuário pode se registrar com sucesso.",
            "Um usuário existente não pode se registrar com o mesmo e-mail.",
            "Um usuário registrado pode fazer login com as credenciais corretas.",
            "O login falha com senha ou e-mail incorretos.",
            "O token JWT retornado no login é válido e contém os dados esperados."
        ],
        testeDeMesa: [
            "Use um cliente de API (Postman, Insomnia) para fazer uma requisição POST para `/api/auth/register` com dados de um novo usuário.",
            "Verifique se a resposta é `201 Created` e se o usuário aparece no banco de dados com a senha hasheada.",
            "Faça uma requisição POST para `/api/auth/login` com as credenciais do usuário criado.",
            "Verifique se a resposta é `200 OK` e se contém um token JWT.",
            "Copie o token e use-o no cabeçalho `Authorization` (Bearer Token) para acessar uma rota protegida. Verifique se o acesso é permitido."
        ]
    },
    recursos: {
        documentacao: [
            { titulo: "Documentação do bcryptjs", url: "https://www.npmjs.com/package/bcryptjs" },
            { titulo: "Documentação do jsonwebtoken", url: "https://www.npmjs.com/package/jsonwebtoken" },
            { titulo: "JWT.io - Debugger e Bibliotecas", url: "https://jwt.io/" },
        ],
        videos: [
            { titulo: "Node.js JWT Authentication Tutorial", duracao: "25min", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4" },
        ],
        repositorios: [
            { titulo: "Exemplo de Auth com Express e JWT", url: "https://github.com/bezkoder/node-js-jwt-auth", descricao: "Repositório com um exemplo completo de autenticação." },
        ]
    },
    faq: [
      {
        pergunta: "JWT vs. Sessões de Servidor: Qual usar?",
        resposta: "JWT é ideal para arquiteturas de microserviços e aplicações stateless, pois o token contém a informação do usuário, evitando a necessidade de consultar o banco a cada requisição. Sessões de servidor são mais simples para aplicações monolíticas, mas podem ser um gargalo de escalabilidade."
      },
      {
        pergunta: "Onde devo armazenar o JWT no frontend?",
        resposta: "Armazenar em um cookie `HttpOnly` é a opção mais segura para evitar ataques XSS. Se não for possível, `localStorage` é uma alternativa comum, mas requer cuidados adicionais de segurança para mitigar XSS."
      },
      {
        pergunta: "Como lidar com a expiração do token?",
        resposta: "Implemente um mecanismo de 'refresh token'. O cliente armazena um 'access token' de curta duração e um 'refresh token' de longa duração. Quando o 'access token' expira, o cliente usa o 'refresh token' para obter um novo 'access token' sem que o usuário precise fazer login novamente."
      }
    ]
  },
};
