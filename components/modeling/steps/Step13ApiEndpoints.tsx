import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Switch } from '../../ui/Switch';
import { Entity } from './Step8Entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import ApiMap from '../api-map/ApiMap';


export interface Endpoint {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
    authRequired: boolean;
    primaryEntityId?: string;
    requestBody?: string;
    successResponse?: string;
}

interface Step13ApiEndpointsProps {
  data: {
    endpoints?: Endpoint[];
  };
  setData: (data: any) => void;
  entities: Entity[];
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const Step13ApiEndpoints: React.FC<Step13ApiEndpointsProps> = ({ data, setData, entities }) => {
  const endpoints = data.endpoints || [];

  const handleAddEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: new Date().getTime().toString(),
      method: 'GET',
      path: '/api/',
      description: '',
      authRequired: true,
    };
    setData({ ...data, endpoints: [...endpoints, newEndpoint] });
  };
  
  const generateSuggestions = (entityName: string) => {
    if (!entityName) return [];
    const plural = entityName.toLowerCase() + 's';
    return [
      { method: 'GET', path: `/api/${plural}`, description: `Lista todos os ${plural}` },
      { method: 'POST', path: `/api/${plural}`, description: `Cria um(a) novo(a) ${entityName}` },
      { method: 'GET', path: `/api/${plural}/{id}`, description: `Busca um(a) ${entityName} único(a)` },
      { method: 'PUT', path: `/api/${plural}/{id}`, description: `Atualiza um(a) ${entityName}` },
      { method: 'DELETE', path: `/api/${plural}/{id}`, description: `Deleta um(a) ${entityName}` },
    ];
  };
  
  const handleAddSuggested = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;
    const suggestions = generateSuggestions(entity.name);
    const newEndpoints = suggestions.map(s => ({
      id: new Date().getTime().toString() + Math.random(),
      ...s,
      authRequired: true,
      primaryEntityId: entityId
    }));
    setData({ ...data, endpoints: [...(endpoints || []), ...newEndpoints] });
  };


  const handleRemoveEndpoint = (id: string) => {
    setData({ ...data, endpoints: endpoints.filter(e => e.id !== id) });
  };

  const handleChange = (id: string, property: keyof Endpoint, value: string | boolean) => {
    const updatedEndpoints = endpoints.map(e =>
      e.id === id ? { ...e, [property]: value } : e
    );
    setData({ ...data, endpoints: updatedEndpoints });
  };

  return (
    <div className="space-y-6">
       <div>
         <Label>API Endpoints</Label>
         <p className="text-sm text-text-secondary">Defina as rotas da API que seu sistema irá expor.</p>
       </div>
       
       <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Formulário</TabsTrigger>
                <TabsTrigger value="map">Mapa Visual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-6 space-y-6">
                <Card className="bg-sidebar/50">
                    <CardContent className="p-4">
                        <Label>Gerar Sugestões RESTful</Label>
                        <p className="text-sm text-text-secondary mb-2">Crie automaticamente endpoints CRUD padrão para uma entidade.</p>
                        <div className="flex gap-2">
                            <Select onValueChange={handleAddSuggested}>
                                <SelectTrigger className="w-full md:w-[280px]">
                                    <SelectValue placeholder="Selecione uma entidade para gerar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="bg-sidebar/50">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label>Método</Label>
                                        <Select value={endpoint.method} onValueChange={v => handleChange(endpoint.id, 'method', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{HTTP_METHODS.map(m => <SelectItem key={m} value={m as any}>{m}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <Label>Caminho (Path)</Label>
                                        <Input placeholder="/api/users/:id" value={endpoint.path} onChange={e => handleChange(endpoint.id, 'path', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-6 space-y-1.5">
                                        <Label>Descrição</Label>
                                        <Input placeholder="Ex: Busca um usuário pelo ID" value={endpoint.description} onChange={e => handleChange(endpoint.id, 'description', e.target.value)} />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveEndpoint(endpoint.id)}>
                                    <Icon name="trash" className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Exemplo de Requisição (JSON)</Label>
                                    <Textarea placeholder='{ "name": "John Doe" }' value={endpoint.requestBody || ''} onChange={e => handleChange(endpoint.id, 'requestBody', e.target.value)} rows={3} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Exemplo de Resposta de Sucesso (JSON)</Label>
                                    <Textarea placeholder='{ "id": "uuid", "name": "John Doe" }' value={endpoint.successResponse || ''} onChange={e => handleChange(endpoint.id, 'successResponse', e.target.value)} rows={3} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id={`auth-${endpoint.id}`} checked={endpoint.authRequired} onCheckedChange={c => handleChange(endpoint.id, 'authRequired', c)} />
                                <Label htmlFor={`auth-${endpoint.id}`}>Autenticação Requerida</Label>
                            </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                <Button variant="outline" onClick={handleAddEndpoint}>
                    <Icon name="plus" className="h-4 w-4 mr-2" />
                    Adicionar Endpoint Manualmente
                </Button>
            </TabsContent>

            <TabsContent value="map" className="mt-6">
                <ApiMap endpoints={endpoints} entities={entities} />
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default Step13ApiEndpoints;