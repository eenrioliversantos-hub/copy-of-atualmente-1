import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

const SecurityQualityPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança e Qualidade</CardTitle>
        <CardDescription>Análise da saúde, segurança e cobertura de testes do seu código.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="security">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="code-quality">Qualidade do Código</TabsTrigger>
            <TabsTrigger value="tests">Testes</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Vulnerabilidades Críticas</p><p className="text-3xl font-bold text-red-400">0</p></div>
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Vulnerabilidades Altas</p><p className="text-3xl font-bold text-orange-400">1</p></div>
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Vulnerabilidades Médias</p><p className="text-3xl font-bold text-yellow-400">3</p></div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-sidebar rounded-md border border-card-border flex justify-between items-center"><p>Dependência desatualizada: <span className="font-mono text-accent">express@4.17.1</span></p><Badge variant="outline" className="text-orange-400">Alta</Badge></div>
                 <div className="p-3 bg-sidebar rounded-md border border-card-border flex justify-between items-center"><p>Possível XSS em `userController.js`</p><Badge variant="outline" className="text-yellow-400">Média</Badge></div>
            </div>
          </TabsContent>

          <TabsContent value="code-quality" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Code Smells</p><p className="text-3xl font-bold text-yellow-400">15</p></div>
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Duplicação</p><p className="text-3xl font-bold">5.2%</p></div>
                <div className="p-4 bg-sidebar rounded-lg border border-card-border text-center"><p className="text-sm text-text-secondary">Dívida Técnica</p><p className="text-3xl font-bold">3 dias</p></div>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1"><p className="font-medium">Cobertura Total</p><p className="font-medium">87%</p></div>
                    <Progress value={87} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-sidebar rounded-lg border border-card-border"><p className="text-sm text-text-secondary mb-2">Testes Unitários</p><div className="flex items-center justify-between"><p className="text-xl font-bold">92%</p><Badge className="bg-green-500/10 text-green-400">345 Passaram</Badge></div></div>
                    <div className="p-4 bg-sidebar rounded-lg border border-card-border"><p className="text-sm text-text-secondary mb-2">Testes de Integração</p><div className="flex items-center justify-between"><p className="text-xl font-bold">81%</p><Badge className="bg-green-500/10 text-green-400">88 Passaram</Badge></div></div>
                    <div className="p-4 bg-sidebar rounded-lg border border-card-border"><p className="text-sm text-text-secondary mb-2">Testes E2E</p><div className="flex items-center justify-between"><p className="text-xl font-bold">75%</p><Badge className="bg-red-500/10 text-red-400">2 Falharam</Badge></div></div>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecurityQualityPage;