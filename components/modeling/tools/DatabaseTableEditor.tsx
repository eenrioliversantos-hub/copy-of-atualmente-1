import React, { useState, useEffect, useCallback } from 'react';
import { Entity as OldEntity, Relationship as OldRelationship } from '../../../types';
import Icon from './entity-modeler/Icon';
import ERDiagram from './entity-modeler/ERDiagram';
import EntityEditor from './entity-modeler/EntityEditor';
import ImportExport from './entity-modeler/ImportExport';
import { Entity as NewEntity } from '../../../lib/entity-modeler/types';
import { convertOldToNewFormat, convertNewToOldFormat } from '../../../lib/entity-modeler/converter';
import { Button } from '../../ui/Button';

interface DatabaseTableEditorProps {
  onBack: () => void;
  onSave: () => void;
  entities: OldEntity[];
  relationships: OldRelationship[];
  sqlArtifacts: any;
  onEntitiesChange: (entities: OldEntity[]) => void;
  onShowFiles: () => void;
}

type View = 'diagram' | 'editor';

const DatabaseTableEditor: React.FC<DatabaseTableEditorProps> = ({
  entities: oldEntities,
  relationships: oldRelationships,
  onBack,
  onSave,
  onEntitiesChange,
  onShowFiles,
}) => {
  const [allEntities, setAllEntities] = useState<NewEntity[]>([]);
  const [view, setView] = useState<View>('editor');
  const [selectedEntity, setSelectedEntity] = useState<NewEntity | null>(null);

  useEffect(() => {
    const converted = convertOldToNewFormat(oldEntities, oldRelationships);
    setAllEntities(converted);
    if (converted.length > 0) {
      const currentSelected = selectedEntity ? converted.find(e => e.id === selectedEntity.id) : null;
      setSelectedEntity(currentSelected || converted[0]);
    } else {
      setSelectedEntity(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldEntities, oldRelationships]);

  const handleEntityUpdate = useCallback((updatedEntity: NewEntity) => {
    const newAllEntities = allEntities.map(e => e.id === updatedEntity.id ? updatedEntity : e);
    setAllEntities(newAllEntities);

    const updatedOldEntities = convertNewToOldFormat(newAllEntities);
    onEntitiesChange(updatedOldEntities);
  }, [allEntities, onEntitiesChange]);
  
  const handleSetEntities = useCallback((newEntities: NewEntity[]) => {
      setAllEntities(newEntities);
      const updatedOldEntities = convertNewToOldFormat(newEntities);
      onEntitiesChange(updatedOldEntities);
  }, [onEntitiesChange]);

  const ViewButton: React.FC<{ viewName: View; currentView: View; setView: (view: View) => void; iconName: string; text: string }> = ({ viewName, currentView, setView, iconName, text }) => (
    <button
      onClick={() => setView(viewName)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
        currentView === viewName
          ? 'bg-accent text-white shadow-md'
          : 'bg-card-border text-text-secondary hover:bg-sidebar'
      }`}
    >
      <Icon name={iconName} className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 p-6 bg-card rounded-xl shadow-lg border border-card-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl font-extrabold text-text-primary flex items-center">
                    <Icon name="settings" className="w-8 h-8 mr-3 text-accent" />
                    Editor de Banco de Dados (Gerado por IA)
                </h1>
                <p className="text-text-secondary mt-1">
                    Visualize, edite, importe e exporte o modelo de dados gerado.
                </p>
            </div>

            <div className="flex items-center space-x-2 mt-4 sm:mt-0 p-1 bg-background rounded-lg">
              <ViewButton viewName="diagram" currentView={view} setView={setView} iconName="gitBranch" text="Diagrama ER" />
              <ViewButton viewName="editor" currentView={view} setView={setView} iconName="edit" text="Editor Avançado" />
            </div>
          </div>
          
           <div className="mt-6 pt-4 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4">
               {view === 'editor' && selectedEntity && allEntities.length > 0 && (
                 <div className="w-full sm:w-auto">
                    <label htmlFor="entity-select" className="block text-sm font-medium text-text-secondary mb-1">
                        Selecione a entidade para editar:
                    </label>
                    <select
                        id="entity-select"
                        value={selectedEntity.id}
                        onChange={(e) => {
                            const entity = allEntities.find(en => en.id === e.target.value);
                            if (entity) setSelectedEntity(entity);
                        }}
                        className="block w-full rounded-md border-card-border bg-sidebar px-3 py-2 text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm shadow-sm"
                    >
                        {allEntities.map(entity => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                 </div>
               )}
                <div className="w-full sm:w-auto flex-shrink-0 ml-auto">
                    <ImportExport entities={allEntities} setEntities={handleSetEntities} />
                </div>
           </div>
           <div className="mt-4 flex justify-between items-center">
                <Button variant="outline" onClick={onBack}>
                    <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onShowFiles}>
                        <Icon name="sparkles" className="w-4 h-4 mr-2" /> Visualizar Arquivos Gerados
                    </Button>
                    <Button onClick={onSave}>
                        <Icon name="check" className="w-4 h-4 mr-2" /> Salvar e Concluir
                    </Button>
                </div>
           </div>
        </header>

        <main>
          {view === 'diagram' && <ERDiagram entities={allEntities} />}
          {view === 'editor' && selectedEntity && (
            <EntityEditor 
                key={selectedEntity.id} 
                initialEntity={selectedEntity} 
                onSave={handleEntityUpdate} 
                allEntities={allEntities}
            />
          )}
           {view === 'editor' && !selectedEntity && (
              <div className="text-center py-16 text-text-secondary">
                  <p>Nenhuma entidade selecionada ou disponível para edição.</p>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DatabaseTableEditor;