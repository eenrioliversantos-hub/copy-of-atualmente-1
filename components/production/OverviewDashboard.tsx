import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';

const OverviewDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status do Último Build</CardTitle>
            <Icon name="cpu" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                <Icon name="checkCircle" className="h-6 w-6" /> Sucesso
            </div>
            <p className="text-xs text-text-secondary">Commit `a1b2c3d` na branch `main`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deploy em Produção</CardTitle>
            <Icon name="server" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v1.2.1</div>
            <p className="text-xs text-text-secondary">Realizado há 3 horas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cobertura de Testes</CardTitle>
            <Icon name="clipboardCheck" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <Progress value={87} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilidades</CardTitle>
            <Icon name="shield" className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">2 Médias</div>
            <p className="text-xs text-text-secondary">Nenhuma vulnerabilidade crítica</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 overflow-x-auto p-2">
                <div className="text-center w-32 flex-shrink-0"><div className="p-3 bg-accent/10 rounded-full inline-block"><Icon name="gitCommit" className="h-6 w-6 text-accent" /></div><p className="text-sm mt-1">Commit</p></div>
                <Icon name="arrowRight" className="h-6 w-6 text-text-secondary flex-shrink-0" />
                <div className="text-center w-32 flex-shrink-0"><div className="p-3 bg-green-500/10 rounded-full inline-block"><Icon name="checkCircle" className="h-6 w-6 text-green-400" /></div><p className="text-sm mt-1">Build</p><Badge variant="outline">Sucesso</Badge></div>
                <Icon name="arrowRight" className="h-6 w-6 text-text-secondary flex-shrink-0" />
                <div className="text-center w-32 flex-shrink-0"><div className="p-3 bg-green-500/10 rounded-full inline-block"><Icon name="checkCircle" className="h-6 w-6 text-green-400" /></div><p className="text-sm mt-1">Testes</p><Badge variant="outline">Sucesso</Badge></div>
                <Icon name="arrowRight" className="h-6 w-6 text-text-secondary flex-shrink-0" />
                <div className="text-center w-32 flex-shrink-0"><div className="p-3 bg-sky-500/10 rounded-full inline-block"><Icon name="spinner" className="h-6 w-6 text-sky-400 animate-spin" /></div><p className="text-sm mt-1">Deploy Staging</p><Badge variant="outline">Em Andamento</Badge></div>
                 <Icon name="arrowRight" className="h-6 w-6 text-text-secondary flex-shrink-0 opacity-50" />
                <div className="text-center w-32 flex-shrink-0 opacity-50"><div className="p-3 bg-sidebar rounded-full inline-block"><Icon name="server" className="h-6 w-6 text-text-secondary" /></div><p className="text-sm mt-1">Deploy Prod</p><Badge variant="outline">Pendente</Badge></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Status dos Ambientes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sidebar rounded-md"><div className="flex items-center gap-2"><Icon name="server" className="h-4 w-4" /><span>Produção</span></div><Badge className="bg-green-500/10 text-green-400">Online</Badge></div>
                <div className="flex items-center justify-between p-3 bg-sidebar rounded-md"><div className="flex items-center gap-2"><Icon name="server" className="h-4 w-4" /><span>Staging</span></div><Badge className="bg-sky-500/10 text-sky-400">Deploying</Badge></div>
                <div className="flex items-center justify-between p-3 bg-sidebar rounded-md"><div className="flex items-center gap-2"><Icon name="server" className="h-4 w-4" /><span>Desenvolvimento</span></div><Badge className="bg-green-500/10 text-green-400">Online</Badge></div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default OverviewDashboard;