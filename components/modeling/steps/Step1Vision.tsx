import React from 'react';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Textarea } from '../../ui/Textarea';
import { Checkbox } from '../../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/Select';
import ReferenceCenter, { ReferenceData } from './ReferenceCenter';

interface Step1VisionProps {
  data: {
    systemName?: string;
    description?: string;
    mainObjective?: string;
    targetAudience?: string[];
    problemSolved?: string;
    successCriteria?: string;
    competitors?: string;
    hasCompetitors?: 'yes' | 'no' | 'unknown';
    businessObjectives?: { id: string; text: string; priority: string }[];
    successMetrics?: string[];
    referenceCenter?: ReferenceData;
  };
  setData: (data: any) => void;
}

const AUDIENCE_OPTIONS = [
    "Administradores", "Gestores", "Operadores", "Clientes", "Fornecedores", "Estudantes", "Professores", "Pacientes"
];

const METRICS_OPTIONS = [
    "Número de usuários ativos", "Taxa de conversão", "Receita recorrente (MRR/ARR)", "NPS (Net Promoter Score)", "Taxa de retenção", "Tempo médio de uso", "Número de transações", "Churn rate", "CAC (Custo de Aquisição de Cliente)"
];

const Step1Vision: React.FC<Step1VisionProps> = ({ data, setData }) => {
  const handleChange = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const handleAudienceChange = (option: string) => {
    const currentAudience = data.targetAudience || [];
    const newAudience = currentAudience.includes(option)
      ? currentAudience.filter(item => item !== option)
      : [...currentAudience, option];
    handleChange('targetAudience', newAudience);
  };

  const handleMetricChange = (option: string) => {
    const currentMetrics = data.successMetrics || [];
    const newMetrics = currentMetrics.includes(option)
      ? currentMetrics.filter(item => item !== option)
      : [...currentMetrics, option];
    handleChange('successMetrics', newMetrics);
  };

  const handleAddObjective = () => {
    const objectives = data.businessObjectives || [];
    const newObjective = { id: Date.now().toString(), text: '', priority: 'Média' };
    handleChange('businessObjectives', [...objectives, newObjective]);
  };
  
  const handleObjectiveChange = (id: string, field: 'text' | 'priority', value: string) => {
    const objectives = data.businessObjectives || [];
    const newObjectives = objectives.map(obj => obj.id === id ? { ...obj, [field]: value } : obj);
    handleChange('businessObjectives', newObjectives);
  };

  const handleRemoveObjective = (id: string) => {
    const objectives = data.businessObjectives || [];
    handleChange('businessObjectives', objectives.filter(obj => obj.id !== id));
  };
  
  const handleReferenceChange = (referenceData: ReferenceData) => {
      handleChange('referenceCenter', referenceData);
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Icon name="eye" className="h-5 w-5" />Visão do Produto</CardTitle>
          <CardDescription>Defina a identidade, propósito e o público do seu sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="systemName">Nome do projeto/produto</Label>
              <Input id="systemName" placeholder="Ex: Sistema de Gestão Escolar" value={data.systemName || ''} onChange={e => handleChange('systemName', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="mainObjective">Proposta de valor principal</Label>
              <Input id="mainObjective" placeholder="Ex: Automatizar processos escolares" value={data.mainObjective || ''} onChange={e => handleChange('mainObjective', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descreva brevemente o propósito do produto</Label>
            <Textarea id="description" placeholder="Ex: Um sistema para gerenciar matrículas, notas e frequência de alunos..." value={data.description || ''} onChange={e => handleChange('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problemSolved">Qual problema principal este produto resolve?</Label>
            <Textarea id="problemSolved" placeholder="Ex: Dificuldade em acompanhar o desempenho acadêmico dos alunos..." value={data.problemSolved || ''} onChange={e => handleChange('problemSolved', e.target.value)} />
          </div>
          
          <div className="space-y-4">
            <Label>Quem são os usuários principais?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {AUDIENCE_OPTIONS.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`audience-${option}`} checked={(data.targetAudience || []).includes(option)} onCheckedChange={() => handleAudienceChange(option)} />
                        <Label htmlFor={`audience-${option}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                ))}
            </div>
          </div>
           <div className="space-y-4">
              <Label>Existem produtos similares no mercado?</Label>
              <RadioGroup value={data.hasCompetitors} onValueChange={(v) => handleChange('hasCompetitors', v)} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="comp-yes" /><Label htmlFor="comp-yes" className="font-normal cursor-pointer">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="comp-no" /><Label htmlFor="comp-no" className="font-normal cursor-pointer">Não</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="unknown" id="comp-unknown" /><Label htmlFor="comp-unknown" className="font-normal cursor-pointer">Não sei</Label></div>
              </RadioGroup>
              {data.hasCompetitors === 'yes' && (
                  <Textarea className="mt-2" placeholder="Ex: Google Classroom, Moodle, mas não atendem pequenas escolas..." value={data.competitors || ''} onChange={e => handleChange('competitors', e.target.value)} />
              )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Icon name="target" className="h-5 w-5" />Objetivos e Metas</CardTitle>
          <CardDescription>Defina os objetivos de negócio e como o sucesso será medido.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <Label>Quais são os objetivos de negócio?</Label>
                <div className="space-y-3">
                    {(data.businessObjectives || []).map(obj => (
                        <div key={obj.id} className="flex items-center gap-2 p-3 border border-card-border rounded-md bg-background">
                            <Textarea placeholder="Ex: Aumentar receita em 30% no primeiro ano" value={obj.text} onChange={(e) => handleObjectiveChange(obj.id, 'text', e.target.value)} rows={1} className="flex-grow min-h-[40px]"/>
                            <Select value={obj.priority} onValueChange={(v) => handleObjectiveChange(obj.id, 'priority', v)}>
                                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                    <SelectItem value="Média">Média</SelectItem>
                                    <SelectItem value="Baixa">Baixa</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveObjective(obj.id)}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddObjective}><Icon name="plus" className="h-4 w-4 mr-2" />Adicionar Objetivo</Button>
                </div>
            </div>
            <div className="space-y-4">
              <Label>Quais métricas de sucesso serão monitoradas?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {METRICS_OPTIONS.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                          <Checkbox id={`metric-${option}`} checked={(data.successMetrics || []).includes(option)} onCheckedChange={() => handleMetricChange(option)} />
                          <Label htmlFor={`metric-${option}`} className="font-normal cursor-pointer text-sm">{option}</Label>
                      </div>
                  ))}
              </div>
            </div>
        </CardContent>
      </Card>
      
      <ReferenceCenter 
        data={data.referenceCenter || {}}
        onChange={handleReferenceChange}
      />
    </div>
  );
};

export default Step1Vision;