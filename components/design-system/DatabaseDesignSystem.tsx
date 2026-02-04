

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/Card"
import { Button } from "../ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Icon from "../shared/Icon"
import Step8Entities, { Entity, Field as EntityField } from '../modeling/steps/Step8Entities';
import DatabaseTableEditor from '../modeling/tools/DatabaseTableEditor';
import { generateFullDb } from '../../lib/generation/fullDbGenerator';
import { Table, Column } from "../../types";
import AIGeneratorView from '../modeling/generation/AIGeneratorView';

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

// Mapeamentos de tipo entre o modelo de entidade e o modelo de tabela
const typeMap: Record<string, string> = {
  string: 'VARCHAR(255)', text: 'TEXT', number: 'INT',
  boolean: 'BOOLEAN', date: 'DATE', foreign_key: 'UUID', json: 'JSONB'
};
const reverseTypeMap: Record<string, EntityField['type']> = {
  'VARCHAR(255)': 'string', 'TEXT': 'text', 'INT': 'number',
  'BOOLEAN': 'boolean', 'DATE': 'date', 'UUID': 'foreign_key', 'JSONB': 'json'
};


export default function DatabaseDesignSystem({ onBack, onComplete, initialData, planningData, entitiesData, setEntitiesData }: DatabaseDesignSystemProps) {
  const [data, setData] = useState(initialData || entitiesData || { 
      step8: { entities: [] }, 
      step10: { relationships: [] }, 
  });
  
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [generatedArtifacts, setGeneratedArtifacts] = useState<any>(null);
  const [view, setView] = useState<'config' | 'editor' | 'artifacts'>('config');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const handleDataChange = (stepKey: string, stepData: any) => {
    const newData = { ...data, [stepKey]: stepData };
    setData(newData);
    // Propagate changes up for entities specifically, as other steps depend on it
    if (stepKey === 'step8' || stepKey === 'step10') {
        setEntitiesData(newData);
    }
  };

  const entityToTable = (entity: Entity): Table => {
      if (!entity) return { id: '', name: '', columns: [] };
      const columns: Column[] = entity.fields.map(field => ({
          id: field.id,
          name: field.name,
          dataType: typeMap[field.type] || 'TEXT',
          description: field.description,
          isPrimaryKey: false,
          isForeignKey: field.type === 'foreign_key',
          isNullable: !field.required,
          isIndexed: !!field.indexed,
          isAutoIncrement: false,
          validations: { isUnique: field.unique },
      }));

      columns.unshift({ id: `pk-${entity.id}`, name: 'id', dataType: 'UUID', isPrimaryKey: true, isNullable: false, isForeignKey: false, isIndexed: true, isAutoIncrement: false, description: 'Chave Primária' });
      if (entity.timestamps) {
          columns.push({ id: `ts-created-${entity.id}`, name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: true, isPrimaryKey: false, isForeignKey: false, isIndexed: false, isAutoIncrement: false });
          columns.push({ id: `ts-updated-${entity.id}`, name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: true, isPrimaryKey: false, isForeignKey: false, isIndexed: false, isAutoIncrement: false });
      }

      return { id: entity.id, name: entity.name, description: entity.description, columns };
  };

  const tableToEntity = (table: Table, originalEntity: Entity): Entity => {
      const fields: EntityField[] = table.columns
          .filter(c => !c.isPrimaryKey && c.name !== 'created_at' && c.name !== 'updated_at' && c.name !== 'deleted_at')
          .map(column => ({
              id: column.id,
              name: column.name,
              type: reverseTypeMap[column.dataType] || 'text',
              required: !column.isNullable,
              description: column.description,
              indexed: column.isIndexed,
              unique: column.validations?.isUnique,
              validations: [],
          }));

      return {
          ...originalEntity,
          id: table.id,
          name: table.name,
          description: table.description,
          fields,
          timestamps: table.columns.some(c => c.name === 'created_at'),
      };
  };

  const handleSelectEntity = (id: string) => {
    setSelectedEntityId(id);
  };
  
  const handleBackToList = () => {
    setSelectedEntityId(null);
  }

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
    if (selectedEntityId === tableId) {
      setSelectedEntityId(updatedEntities[0]?.id || null);
    }
  };

  const selectedEntity = useMemo(() => 
    (data.step8?.entities || []).find((e: Entity) => e.id === selectedEntityId),
    [data.step8, selectedEntityId]
  );
  
  const handleGenerate = async () => {
    setGenerationState('loading');
    const fullWizardData = {
        planning: planningData,
        data_modeling: data,
    };

    const progressSteps = [
        "Analisando entidades e relacionamentos...",
        "Gerando schema do banco de dados (SQL)...",
        "Definindo políticas de segurança (RLS)...",
        "Criando triggers e funções auxiliares...",
        "Configurando schema de autenticação...",
        "Sugerindo endpoints de API...",
        "Gerando documentação técnica...",
        "Finalizando..."
    ];

    for (const message of progressSteps) {
        setLoadingMessage(message);
        await new Promise(res => setTimeout(res, 400));
    }

    const artifacts = await generateFullDb(fullWizardData);
    setGeneratedArtifacts(artifacts);
    setGenerationState('success');
    setView('artifacts');
    setLoadingMessage('');
  };

  const handleSaveAndComplete = () => {
     if (onComplete) {
      const allArtifacts = generatedArtifacts?.files || {};
      onComplete(data, allArtifacts);
    }
  }

  if (view === 'editor') {
      return (
          <DatabaseTableEditor
              entities={data.step8?.entities || []}
              relationships={data.step10?.relationships || []}
              sqlArtifacts={generatedArtifacts}
              onEntitiesChange={(updatedEntities) => handleDataChange('step8', { ...data.step8, entities: updatedEntities })}
              onBack={() => setView('config')}
              onSave={handleSaveAndComplete}
              onShowFiles={() => setView('artifacts')}
          />
      );
  }

  if (view === 'artifacts') {
    return (
        <AIGeneratorView
            artifacts={generatedArtifacts}
            entities={data.step8?.entities || []}
            relationships={data.step10?.relationships || []}
            onSaveToDPO={handleSaveAndComplete}
            onBack={() => setView('editor')}
        />
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {(onBack || onComplete) && (
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <Icon name="chevronLeft" className="h-4 w-4" />
              Voltar
            </Button>
          )}
          <div>
            <h1 className="text-lg font-bold text-accent">Database Design System</h1>
            <p className="text-text-secondary text-xs">Modelagem de dados, schemas, relacionamentos e otimizações</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm" onClick={onComplete ? () => onComplete(data, {}) : onBack}>
              <Icon name="check" className="h-4 w-4 mr-2" />
              Concluir Modelagem de Dados
            </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Tabs defaultValue="entities" className="w-full">
            <div className="w-full overflow-x-auto pb-2 border-b border-card-border">
              <TabsList className="grid w-full grid-cols-2">
                {navItems.map(item => (
                  <TabsTrigger key={item.id} value={item.id} className="gap-2 py-2">
                      <Icon name={item.icon} className="h-4 w-4" /> {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="mt-6">
                <TabsContent value="entities">
                    {selectedEntity ? (
                        <div className="animate-in fade-in-50">
                            <Button variant="outline" size="sm" onClick={handleBackToList} className="mb-4 gap-2">
                                <Icon name="chevronLeft" className="h-4 w-4"/> Voltar para a lista de Entidades
                            </Button>
                            <DatabaseTableEditor
                                table={entityToTable(selectedEntity)}
                                tables={(data.step8?.entities || []).map((e: Entity) => entityToTable(e))}
                                onUpdateTable={handleUpdateTable}
                                onDeleteTable={handleDeleteTable}
                            />
                        </div>
                    ) : (
                        <Step8Entities 
                            data={data.step8} 
                            setData={(d) => handleDataChange('step8', d)}
                            onSelectEntity={handleSelectEntity}
                        />
                    )}
                </TabsContent>
                <TabsContent value="generator">
                    {generationState === 'idle' && (
                        <Card className="text-center max-w-2xl mx-auto">
                            <CardHeader>
                                <Icon name="sparkles" className="h-12 w-12 text-accent mx-auto" />
                                <CardTitle className="text-2xl">Gerador de Banco de Dados com IA</CardTitle>
                                <CardDescription>A IA irá interpretar todas as informações modeladas até agora (entidades, perfis, regras) para gerar uma arquitetura de backend completa, incluindo banco de dados, políticas de segurança, documentação e mais.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size="lg" onClick={handleGenerate}>
                                    <Icon name="sparkles" className="h-5 w-5 mr-2" />
                                    Analisar Modelo e Gerar Arquivos
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    {generationState === 'loading' && (
                         <div className="text-center max-w-2xl mx-auto py-16">
                            <Icon name="spinner" className="h-12 w-12 text-accent mx-auto animate-spin" />
                            <p className="mt-4 font-semibold text-text-primary">{loadingMessage}</p>
                         </div>
                    )}
                </TabsContent>
            </div>
        </Tabs>
      </main>
    </div>
  )
}