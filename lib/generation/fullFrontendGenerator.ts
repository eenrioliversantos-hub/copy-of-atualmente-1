
import { Entity } from '../../components/modeling/steps/Step8Entities';

const snakeCase = (str: string): string => str ? str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '') : '';
const pascalCase = (str: string): string => str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');
const camelCase = (str: string): string => {
    if(!str) return '';
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
}

// Templates básicos de UI
const TEMPLATES = {
    list: (entityName: string, fields: any[]) => `
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash } from 'lucide-react';

export default function ${pascalCase(entityName)}ListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Integrar com API: GET /api/${snakeCase(entityName)}s
    const mockData = [
      { id: 1, ${fields.map(f => `${camelCase(f.name)}: 'Exemplo'`).join(', ')} }
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">${pascalCase(entityName)}s</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo ${pascalCase(entityName)}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              ${fields.map(f => `<TableHead>${pascalCase(f.name)}</TableHead>`).join('\n              ')}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                ${fields.map(f => `<TableCell>{item.${camelCase(f.name)}}</TableCell>`).join('\n                ')}
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500"><Trash className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
`,
    form: (entityName: string, fields: any[]) => `
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${pascalCase(entityName)}FormPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: Integrar com API: POST /api/${snakeCase(entityName)}s
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de ${pascalCase(entityName)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            ${fields.map(f => `
            <div className="space-y-2">
              <Label htmlFor="${camelCase(f.name)}">${pascalCase(f.name)}</Label>
              <Input id="${camelCase(f.name)}" {...register('${camelCase(f.name)}')} placeholder="Digite ${f.name}..." />
            </div>`).join('')}
            
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button">Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
`,
    dashboard: (systemName: string) => `
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Activity, BarChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Bem-vindo ao ${systemName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180 novos usuários</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`
};

export function generateFullFrontend(wizardData: any): any {
    const screens = wizardData.interface_ux?.step15?.screens || [];
    const entities: Entity[] = wizardData.data_modeling?.step8?.entities || [];
    const systemName = wizardData.planning?.step1?.systemName || 'App';
    
    const pages: any[] = [];

    // Se não houver telas definidas, gerar telas padrão baseadas nas entidades
    let screensToProcess = [...screens];
    if (screensToProcess.length === 0) {
        // Gerar dashboard
        screensToProcess.push({ path: '/dashboard', description: 'Dashboard Principal', layout: 'Standard' });
        
        // Gerar telas para cada entidade
        entities.forEach(entity => {
            screensToProcess.push({ 
                path: `/${snakeCase(entity.name)}s`, 
                description: `Listagem de ${entity.name}`, 
                layout: 'Standard',
                _entityRef: entity // Internal ref
            });
            screensToProcess.push({ 
                path: `/${snakeCase(entity.name)}s/new`, 
                description: `Criar ${entity.name}`, 
                layout: 'Standard',
                _entityRef: entity
            });
        });
    }

    screensToProcess.forEach((screen: any) => {
        let code = '';
        let components: any[] = [];
        let type = 'static';

        // Heurística simples para determinar o tipo de página
        const pathLower = screen.path.toLowerCase();
        
        if (pathLower.includes('dashboard') || pathLower === '/') {
            code = TEMPLATES.dashboard(systemName);
            components = [{ name: 'StatCard', type: 'Card', description: 'Card de estatística', dataEntities: [] }];
        } 
        else if (pathLower.includes('/new') || pathLower.includes('/edit')) {
            // Tenta encontrar a entidade relacionada pelo path ou pela ref
            const entity = screen._entityRef || entities.find(e => pathLower.includes(snakeCase(e.name)));
            if (entity) {
                code = TEMPLATES.form(entity.name, entity.fields);
                components = [{ name: 'EntityForm', type: 'Form', description: 'Formulário principal', dataEntities: [entity.name] }];
                type = 'dynamic';
            } else {
                code = TEMPLATES.form('Item', []);
            }
        } 
        else {
            // Assume listagem
             const entity = screen._entityRef || entities.find(e => pathLower.includes(snakeCase(e.name)));
             if (entity) {
                code = TEMPLATES.list(entity.name, entity.fields);
                components = [{ name: 'DataTable', type: 'Table', description: 'Tabela de dados', dataEntities: [entity.name] }];
                type = 'dynamic';
             } else {
                 code = TEMPLATES.dashboard(systemName); // Fallback
             }
        }

        pages.push({
            path: screen.path,
            name: pascalCase(screen.path.replace(/\//g, ' ') || 'Home'),
            type: type,
            authLevel: 'protected',
            layoutId: 'main-layout',
            dataFetching: 'client-side',
            description: screen.description,
            tsxCode: code.trim(),
            components: components,
            stateVariables: [],
            apiCalls: [],
            functions: []
        });
    });

    return {
        pages,
        layouts: [{ id: 'main-layout', name: 'Dashboard Layout', structure: 'Sidebar + Header + Content' }],
        folderStructure: pages.map(p => ({ path: `app${p.path}/page.tsx`, type: 'file', description: p.description }))
    };
}
