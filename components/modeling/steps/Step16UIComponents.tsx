import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';

interface Screen {
    id: string;
    path: string;
    description: string;
    layout: string;
}

interface UIComponent {
    id: string;
    type: string;
    description: string;
}

interface Step16UIComponentsProps {
  data: {
    components?: Record<string, UIComponent[]>; // Mapped by screen ID
  };
  setData: (data: any) => void;
  screens: Screen[];
}

const AVAILABLE_COMPONENTS = [
    { type: "Data Table", icon: "table", description: "Para exibir listas de dados." },
    { type: "Form", icon: "edit", description: "Para entrada de dados do usuário." },
    { type: "Chart", icon: "barChart", description: "Para visualização de dados." },
    { type: "Stats Card Grid", icon: "layoutGrid", description: "Para exibir KPIs e métricas." },
    { type: "Tabs", icon: "folder", description: "Para organizar conteúdo em abas." },
    { type: "Wizard", icon: "gitBranch", description: "Para fluxos passo-a-passo." },
    { type: "Search Bar", icon: "search", description: "Para busca e filtros." },
];

const Step16UIComponents: React.FC<Step16UIComponentsProps> = ({ data, setData, screens }) => {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(screens[0]?.id || null);
  const components = data.components || {};
  const screenComponents = selectedScreenId ? components[selectedScreenId] || [] : [];

  const handleAddComponent = (componentType: string) => {
    if (!selectedScreenId) return;

    const newComponent: UIComponent = {
      id: new Date().getTime().toString(),
      type: componentType,
      description: '',
    };
    
    const newScreenComponents = [...screenComponents, newComponent];
    setData({ ...data, components: { ...components, [selectedScreenId]: newScreenComponents } });
  };
  
  const handleRemoveComponent = (componentId: string) => {
    if (!selectedScreenId) return;
    const newScreenComponents = screenComponents.filter(c => c.id !== componentId);
    setData({ ...data, components: { ...components, [selectedScreenId]: newScreenComponents } });
  };
  
  const handleChange = (componentId: string, field: keyof UIComponent, value: string) => {
     if (!selectedScreenId) return;
     const newScreenComponents = screenComponents.map(c => 
        c.id === componentId ? { ...c, [field]: value } : c
     );
     setData({ ...data, components: { ...components, [selectedScreenId]: newScreenComponents } });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="screen-select">Selecione uma Tela</Label>
        <p className="text-sm text-text-secondary mb-2">Escolha uma tela para adicionar ou remover componentes de UI.</p>
        <Select onValueChange={setSelectedScreenId} value={selectedScreenId || ''} disabled={screens.length === 0}>
            <SelectTrigger id="screen-select">
                <SelectValue placeholder="Selecione uma tela..." />
            </SelectTrigger>
            <SelectContent>
                {screens.map(screen => (
                    <SelectItem key={screen.id} value={screen.id}>{screen.path} ({screen.description})</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {selectedScreenId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h3 className="font-semibold mb-3">Paleta de Componentes</h3>
                <div className="space-y-3">
                    {AVAILABLE_COMPONENTS.map(comp => (
                        <Card key={comp.type} onClick={() => handleAddComponent(comp.type)} className="cursor-pointer hover:border-accent transition-colors bg-sidebar/50">
                            <CardContent className="p-3 flex items-center gap-3">
                                <Icon name={comp.icon} className="h-5 w-5 text-accent flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">{comp.type}</p>
                                    <p className="text-xs text-text-secondary">{comp.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2">
                 <Card className="bg-sidebar/50">
                    <CardHeader>
                        <CardTitle>Componentes em "{screens.find(s => s.id === selectedScreenId)?.path}"</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {screenComponents.length > 0 ? screenComponents.map(component => (
                            <div key={component.id} className="p-3 border border-card-border rounded-md bg-background">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Icon name={AVAILABLE_COMPONENTS.find(c => c.type === component.type)?.icon || 'puzzle'} className="h-4 w-4 text-accent" />
                                            <p className="font-semibold">{component.type}</p>
                                        </div>
                                        <Input 
                                            placeholder="Adicione uma descrição funcional (ex: Tabela de clientes)" 
                                            value={component.description} 
                                            onChange={e => handleChange(component.id, 'description', e.target.value)}
                                            className="mt-2 text-xs"
                                        />
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveComponent(component.id)}>
                                        <Icon name="trash" className="h-4 w-4 text-red-500"/>
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-text-secondary py-12 border-2 border-dashed border-card-border rounded-lg">
                                <p>Nenhum componente adicionado.</p>
                                <p className="text-xs">Clique em um item da paleta para adicionar.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      ) : (
          <p className="text-center text-text-secondary py-16">
            {screens.length > 0 ? "Selecione uma tela para começar a adicionar componentes." : "Nenhuma tela criada. Volte para a etapa anterior para criá-las."}
          </p>
      )}
    </div>
  );
};

export default Step16UIComponents;
