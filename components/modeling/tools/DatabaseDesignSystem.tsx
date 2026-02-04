
"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tabs"
import Icon from "../../shared/Icon"
import Step8Entities, { Entity, Field as EntityField } from '../steps/Step8Entities';
import DatabaseTableEditor from '../tools/DatabaseTableEditor';
import { generateFullDb } from '../../../lib/generation/fullDbGenerator';
import { Table, Column } from "../../../types";
import AIGeneratorView from '../generation/AIGeneratorView';

interface DatabaseDesignSystemProps {
  onBack?: () => void;
  onComplete?: (data: any, artifacts?: any) => void;
  initialData?: any;
  planningData?: any;
  entitiesData?: any;
  setEntitiesData: (data: any) => void;
}

const navItems = [
    { id: 'entities', label: 'Entidades', icon: 'database' },
    { id: 'generator', label: 'Gerador IA', icon: 'sparkles' },
];

const typeMap: Record<string, string> = {
  String: 'VARCHAR(255)', Text: 'TEXT', Integer: 'INT',
  Boolean: 'BOOLEAN', Date: 'DATE', UUID: 'UUID', JSON: 'JSONB', Float: 'DECIMAL(10,2)'
};
const reverseTypeMap: Record<string, any> = {
  'VARCHAR(255)': 'String', 'TEXT': 'Text', 'INT': 'Integer',
  'BOOLEAN': 'Boolean', 'DATE': 'Date', 'UUID': 'UUID', 'JSONB': 'JSON'
};

export default function DatabaseDesignSystem({ onBack, onComplete, initialData, planningData, entitiesData, setEntitiesData }: DatabaseDesignSystemProps) {
  const [data, setData] = useState(() => {
      return initialData || entitiesData || { 
          step8: { entities: [] }, 
          step10: { relationships: [] }, 
      };
  });
  
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [generatedArtifacts, setGeneratedArtifacts] = useState<any>(null);
  const [view, setView] = useState<'config' | 'editor' | 'artifacts'>('config');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // AUTO-IMPORT LOGIC: Se não houver entidades técnicas, mas houver entidades de planejamento, sugere importar
  const canImportFromPlanning = useMemo(() => {
    return (!data.step8?.entities || data.step8.entities.length === 0) && 
           (planningData?.planningEntities && planningData.planningEntities.length > 0);
  }, [data.step8.entities, planningData?.planningEntities]);

  const handleImportFromPlanning = () => {
    if (!planningData?.planningEntities) return;
    
    const importedEntities: Entity[] = planningData.planningEntities.map((pe: any) => ({
      id: pe.id,
      name: pe.singularName || pe.name,
      physicalName: (pe.singularName || pe.name || '').toLowerCase() + 's',
      description: pe.purpose || '',
      fields: (pe.attributes || []).map((attr: any) => ({
        id: attr.id,
        name: attr.attributeName,
        type: attr.dataType || 'String',
        required: attr.required === 'Sim',
        unique: attr.isUnique === 'Sim',
        indexed: true,
        validations: []
      })),
      timestamps: true,
      softDeletes: false,
      relationships: [],
      dataStructure: {
        type: 'Tabela Hash',
        logicalOrganization: 'Linear',
        physicalOrganization: 'Indexada',
        timeComplexity: 'O(1)',
        classificationNature: 'Dinâmica',
        classificationAllocation: 'Dinâmica (Heap)',
        keyOperations: ['Search O(1)', 'Insert O(1)']
      }
    }));

    handleDataChange('step8', { ...data.step8, entities: importedEntities });
  };

  const handleDataChange = (stepKey: string, stepData: any) => {
    const newData = { ...data, [stepKey]: stepData };
    setData(newData);
    setEntitiesData(newData);
  };

  const entityToTable = (entity: Entity): Table => {
      if (!entity) return { id: '', name: '', columns: [] };
      const columns: Column[] = entity.fields.map(field => ({
          id: field.id,
          name: field.name,
          dataType: typeMap[field.type] || 'TEXT',
          description: field.description,
          isPrimaryKey: false,
          isForeignKey: field.type === 'UUID' && field.name.endsWith('_id'),
          isNullable: !field.required,
          isIndexed: !!field.indexed,
          isAutoIncrement: false,
          validations: { isUnique: field.unique },
      }));

      columns.unshift({ id: `pk-${entity.id}`, name: 'id', dataType: 'UUID', isPrimaryKey: true, isNullable: false, isForeignKey: false, isIndexed: true, isAutoIncrement: false, description: 'Chave Primária' });
      
      return { id: entity.id, name: entity.name, description: entity.description, columns };
  };

  const tableToEntity = (table: Table, originalEntity: Entity): Entity => {
      const fields: any[] = table.columns
          .filter(c => !c.isPrimaryKey && !['created_at', 'updated_at', 'deleted_at'].includes(c.name))
          .map(column => ({
              id: column.id,
              name: column.name,
              type: reverseTypeMap[column.dataType] || 'Text',
              required: !column.isNullable,
              description: column.description,
              indexed: column.isIndexed,
              unique: column.validations?.isUnique,
              validations: [],
          }));

      return { ...originalEntity, name: table.name, description: table.description || '', fields };
  };

  const handleUpdateTable = (updatedTable: Table) => {
    const originalEntity = data.step8.entities.find((e: Entity) => e.id === updatedTable.id);
    if (!originalEntity) return;
    const updatedEntity = tableToEntity(updatedTable, originalEntity);
    const updatedEntities = data.step8.entities.map((e: Entity) => e.id === updatedEntity.id ? updatedEntity : e);
    handleDataChange('step8', { ...data.step8, entities: updatedEntities });
  };

  const handleDeleteTable = (tableId: string) => {
    const updatedEntities = data.step8.entities.filter((e: Entity) => e.id !== tableId);
    handleDataChange('step8', { ...data.step8, entities: updatedEntities });
    if (selectedEntityId === tableId) setSelectedEntityId(null);
  };

  const handleGenerate = async () => {
    setGenerationState('loading');
    const fullWizardData = { planning: planningData, data_modeling: data };
    const progressSteps = ["Analisando entidades...", "Gerando SQL...", "Definindo RLS...", "Finalizando..."];
    for (const message of progressSteps) {
        setLoadingMessage(message);
        await new Promise(res => setTimeout(res, 400));
    }
    const artifacts = await generateFullDb(fullWizardData);
    setGeneratedArtifacts(artifacts);
    setGenerationState('success');
    setView('artifacts');
  };

  if (view === 'editor' && selectedEntityId) {
      const entity = data.step8.entities.find((e: Entity) => e.id === selectedEntityId);
      return (
          <DatabaseTableEditor
              table={entityToTable(entity)}
              tables={data.step8.entities.map((e: Entity) => entityToTable(e))}
              onUpdateTable={handleUpdateTable}
              onDeleteTable={handleDeleteTable}
              onBack={() => setView('config')}
          />
      );
  }

  if (view === 'artifacts') {
    return <AIGeneratorView artifacts={generatedArtifacts} entities={data.step8?.entities || []} relationships={data.step10?.relationships || []} onSaveToDPO={() => onComplete?.(data, generatedArtifacts?.files || {})} onBack={() => setView('config')} />
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack || (() => {})}><Icon name="chevronLeft" className="h-4 w-4" /> Voltar</Button>
          <div><h1 className="text-lg font-bold text-accent">Database Design System</h1><p className="text-text-secondary text-xs">Refinamento técnico do modelo de dados</p></div>
        </div>
        <Button size="sm" onClick={() => onComplete?.(data, {})}>Concluir Modelagem</Button>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {canImportFromPlanning && (
          <Card className="mb-8 border-accent/50 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="sparkles" className="h-6 w-6 text-accent" />
                <div><p className="font-semibold text-accent">Sincronização Disponível</p><p className="text-sm text-text-secondary">Detectamos entidades no planejamento. Deseja importá-las para a modelagem técnica?</p></div>
              </div>
              <Button onClick={handleImportFromPlanning} size="sm"><Icon name="upload" className="h-4 w-4 mr-2" />Importar do Planejamento</Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="entities">
          <TabsList className="grid w-full grid-cols-2">
            {navItems.map(item => <TabsTrigger key={item.id} value={item.id} className="gap-2"><Icon name={item.icon} className="h-4 w-4" /> {item.label}</TabsTrigger>)}
          </TabsList>
          
          <TabsContent value="entities" className="mt-6">
            <Step8Entities data={data.step8} setData={(d) => handleDataChange('step8', d)} onSelectEntity={(id) => { setSelectedEntityId(id); setView('editor'); }} />
          </TabsContent>
          
          <TabsContent value="generator" className="mt-6">
            <Card className="text-center max-w-2xl mx-auto"><CardHeader><Icon name="sparkles" className="h-12 w-12 text-accent mx-auto" /><CardTitle>Gerador IA</CardTitle></CardHeader>
              <CardContent><Button size="lg" onClick={handleGenerate} disabled={generationState === 'loading'}>{generationState === 'loading' ? loadingMessage : 'Gerar Arquivos Técnicos'}</Button></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
