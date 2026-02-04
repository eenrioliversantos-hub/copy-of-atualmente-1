import React, { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import type { Entity } from '../../../../lib/entity-modeler/types';
import {
  dataTypes,
  httpMethods,
  authLevels,
  policyTypes,
  validationRules,
  structureTypes,
  logicalOptions,
  physicalOptions,
  complexityOptions,
  natureOptions,
  allocationOptions
} from '../../../../lib/entity-modeler/constants';
import CodeGenerator from './CodeGenerator';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Textarea } from '../../../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/Select';
import { Switch } from '../../../ui/Switch';
import { Checkbox } from '../../../ui/Checkbox';
// Added Badge import
import { Badge } from '../../../ui/Badge';


interface EntityEditorProps {
  initialEntity: Entity;
  allEntities: Entity[];
  onSave: (entity: Entity) => void;
}

const TabButton: React.FC<{ iconName: string; title: string; isActive: boolean; onClick: () => void; isRecommended?: boolean }> = ({ iconName, title, isActive, onClick, isRecommended }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap relative
      ${isActive
                ? 'bg-card border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:bg-sidebar'
            }`}
    >
        <Icon name={iconName} className="w-4 h-4" />
        <span>{title}</span>
        {isRecommended && !isActive && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>}
    </button>
);

const SectionCard: React.FC<{ title: string, children: React.ReactNode, iconName?: string, className?: string, badge?: string }> = ({ title, children, iconName, className, badge }) => (
  <div className={`bg-card p-6 rounded-xl shadow-lg border border-card-border ${className}`}>
    <div className="flex justify-between items-center border-b border-card-border pb-2 mb-4">
        <h3 className="text-xl font-bold text-text-primary flex items-center">
        {iconName && <Icon name={iconName} className="w-5 h-5 mr-2 text-accent" />}
        {title}
        </h3>
        {badge && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 uppercase font-bold">{badge}</span>}
    </div>
    {children}
  </div>
);

const AdvancedDataStructureModal: React.FC<{ entity: Entity, setEntity: React.Dispatch<React.SetStateAction<Entity>>, onClose: () => void }> = ({ entity, setEntity, onClose }) => {
  const ds = entity.dataStructure;
  const [currentDs, setCurrentDs] = useState(ds);

  const handleSave = () => {
    setEntity(prev => ({
        ...prev,
        dataStructure: currentDs
    }));
    onClose();
  };
  
  const handleAddOperation = () => {
    setCurrentDs(prev => ({
        ...prev,
        keyOperations: [...prev.keyOperations, 'Nova Operação O(?)']
    }));
  };

  const handleUpdateOperation = (index: number, value: string) => {
    const newOps = [...currentDs.keyOperations];
    newOps[index] = value;
    setCurrentDs(prev => ({ ...prev, keyOperations: newOps }));
  };

  const handleRemoveOperation = (index: number) => {
    const newOps = currentDs.keyOperations.filter((_, i) => i !== index);
    setCurrentDs(prev => ({ ...prev, keyOperations: newOps }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-2xl rounded-xl bg-card border-card-border m-4">
        <div className="flex justify-between items-center border-b border-card-border pb-3 mb-4">
          <h3 className="text-2xl font-bold text-accent flex items-center">
            <Icon name="info" className="w-6 h-6 mr-2" /> Atributos de Engenharia de Dados
          </h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-6 italic">Defina as características de baixo nível desta entidade para otimização de performance e Big O.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Organização</h4>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Tipo Principal</span>
              <Select value={currentDs.type} onValueChange={(v) => setCurrentDs(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{structureTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Org. Lógica</span>
              <Select value={currentDs.logicalOrganization} onValueChange={(v) => setCurrentDs(p => ({ ...p, logicalOrganization: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{logicalOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Org. Física</span>
               <Select value={currentDs.physicalOrganization} onValueChange={(v) => setCurrentDs(p => ({ ...p, physicalOrganization: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{physicalOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Desempenho (Big O)</h4>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Tempo de Busca</span>
              <Select value={currentDs.timeComplexity} onValueChange={(v) => setCurrentDs(p => ({...p, timeComplexity: v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{complexityOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Natureza</span>
              <Select value={currentDs.classificationNature} onValueChange={(v) => setCurrentDs(p => ({ ...p, classificationNature: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{natureOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
             <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Alocação</span>
              <Select value={currentDs.classificationAllocation} onValueChange={(v) => setCurrentDs(p => ({ ...p, classificationAllocation: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{allocationOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-4 bg-background p-4 rounded-lg border border-card-border">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Operações Chave</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentDs.keyOperations.map((op, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        {/* FIX: Use handleUpdateOperation instead of missing updateNestedList */}
                        <Input type="text" value={op} onChange={(e) => handleUpdateOperation(index, e.target.value)} placeholder="Ex: Inserção O(n)" />
                         <Button variant="ghost" size="sm" onClick={() => handleRemoveOperation(index)} title="Remover Operação">
                            <Icon name="trash2" className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleAddOperation} className="w-full">
                <Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Operação
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-card-border flex justify-end">
          <Button onClick={handleSave} className="bg-accent text-white hover:bg-accent/90">
            <Icon name="check" className="w-5 h-5 mr-2" /> Salvar Modelo de Dados
          </Button>
        </div>
      </div>
    </div>
  );
};

const EntityEditor: React.FC<EntityEditorProps> = ({ initialEntity, allEntities, onSave }) => {
  const [entity, setEntity] = useState(initialEntity);
  const [activeTab, setActiveTab] = useState('schema');
  const [showAdvancedDataStructure, setShowAdvancedDataStructure] = useState(false);

  useEffect(() => {
    onSave(entity);
  }, [entity, onSave]);

  const updateEntity = useCallback((key: keyof Entity, value: any) => {
    setEntity(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedProperty = useCallback((keys: string[], value: any) => {
      setEntity(prev => {
          let current = prev as any;
          for (let i = 0; i < keys.length - 1; i++) {
              current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;
          return { ...prev };
      });
  }, []);

  const updateNestedList = useCallback((listName: string, id: number, key: string, value: any, parentKey: string | null = null) => {
    setEntity(prev => {
      const parent = parentKey ? (prev as any)[parentKey] : prev;
      if (!Array.isArray(parent[listName])) {
        if (parentKey) {
            return { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: { ...parent[listName], [key]: value } } };
        }
        return { ...prev, [listName]: { ...parent[listName], [key]: value } };
      }

      const newList = parent[listName].map((item: { id: number }) =>
        item.id === id ? { ...item, [key]: value } : item
      );
      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const addNestedItem = useCallback((listName: string, initialData: any, parentKey: string | null = null) => {
    setEntity(prev => {
      const list = parentKey ? (prev as any)[parentKey][listName] : (prev as any)[listName];
      const newId = Math.max(0, ...(list || []).map((a: {id: number}) => a.id)) + 1;
      const newList = [...(list || []), { id: newId, ...initialData }];

      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const removeNestedItem = useCallback((listName: string, id: number, parentKey: string | null = null) => {
    setEntity(prev => {
      const list = parentKey ? (prev as any)[parentKey][listName] : (prev as any)[listName];
      const newList = list.filter((item: {id: number}) => item.id !== id);

      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const renderSchemaTab = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <SectionCard title="Identidade Geral" iconName="list" badge="Auditável">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Nome (Exibição)</label><Input value={entity.name} onChange={(e) => updateEntity('name', e.target.value)} placeholder="Ex: Cliente" /></div>
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Nome Físico (Tabela)</label><Input value={entity.physicalName} onChange={(e) => updateEntity('physicalName', e.target.value)} placeholder="Ex: clientes_tab" /></div>
        </div>
        <div className="mt-4 p-4 border border-accent/30 rounded-lg bg-sidebar/50 flex justify-between items-center group cursor-pointer hover:border-accent transition-all" onClick={() => setShowAdvancedDataStructure(true)}>
            <div className="text-sm text-accent/80">
                <strong>Big O:</strong> {entity.dataStructure.timeComplexity} | 
                <strong> Estrutura:</strong> {entity.dataStructure.type}
            </div>
            <Badge className="bg-accent/20 text-accent border-accent/30">Configuração de Engenharia</Badge>
        </div>
      </SectionCard>
      
      <SectionCard title="Atributos Chave" iconName="grid">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-sidebar/50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Campo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">PK/NN</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">Único</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-card-border">
              {entity.attributes.map((attr) => (
                <tr key={attr.id} className="hover:bg-sidebar/50 transition-colors">
                  <td className="p-2"><Input value={attr.name} onChange={(e) => updateNestedList('attributes', attr.id, 'name', e.target.value)} className="h-8 text-xs font-mono" /></td>
                  <td className="p-2"><Select value={attr.type} onValueChange={(v) => updateNestedList('attributes', attr.id, 'type', v as any)}><SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger><SelectContent>{dataTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></td>
                  <td className="p-2 text-center space-x-2"><Checkbox checked={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isPK', c)} /><Checkbox checked={attr.isNN || attr.isPK} disabled={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isNN', c)} /></td>
                  <td className="p-2 text-center"><Checkbox checked={attr.isUnique || attr.isPK} disabled={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isUnique', c)} /></td>
                  <td className="p-2 text-right"><Button variant="ghost" size="sm" onClick={() => removeNestedItem('attributes', attr.id)}><Icon name="trash2" className="w-4 h-4 text-red-500" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" className="mt-4 w-full border-dashed" onClick={() => addNestedItem('attributes', { name: 'novo_campo', type: 'VARCHAR', isPK: false, isNN: false, isUnique: false, length: '255', isSearchable: false })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Atributo</Button>
      </SectionCard>
    </div>
  );

  const renderEndpointsTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Contratos de Interface (API)" iconName="server" badge="RESTful">
        <div className="space-y-4">
          {entity.endpoints.map((ep) => (
            <div key={ep.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Input value={ep.operation} onChange={(e) => updateNestedList('endpoints', ep.id, 'operation', e.target.value)} />
                <Badge variant="outline" className="justify-center font-mono">{ep.method}</Badge>
                <code className="bg-background px-2 py-1 rounded text-xs truncate">{ep.path}</code>
                <Select value={ep.auth} onValueChange={(v) => updateNestedList('endpoints', ep.id, 'auth', v as any)}><SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger><SelectContent>{authLevels.map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}</SelectContent></Select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('endpoints', ep.id)}><Icon name="trash2" className="w-4 h-4 text-red-500 ml-2"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('endpoints', { operation: 'LISTAR', method: 'GET', path: `/${entity.physicalName}`, auth: 'AUTHENTICATED' })}><Icon name="plus" className="w-4 h-4 mr-2" /> Gerar Endpoints Padrão</Button>
      </SectionCard>
    </div>
  );

  // FIX: Implemented missing renderActionsTab
  const renderActionsTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Ações de Domínio" iconName="zap" badge="Comportamento">
        <div className="space-y-4">
          {entity.actions.map((action) => (
            <div key={action.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <Input value={action.name} onChange={(e) => updateNestedList('actions', action.id, 'name', e.target.value)} placeholder="Nome da Ação" />
                <Badge variant="outline" className="justify-center font-mono">{action.method}</Badge>
                <code className="bg-background px-2 py-1 rounded text-xs truncate">{action.route}</code>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('actions', action.id)}><Icon name="trash2" className="w-4 h-4 text-red-500 ml-2"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('actions', { name: 'NOVA_ACAO', method: 'POST', route: `/actions/${entity.physicalName}`, description: '', requiredFields: [] })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Ação</Button>
      </SectionCard>
    </div>
  );

  // FIX: Implemented missing renderLifecycleTab
  const renderLifecycleTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Máquina de Estados" iconName="gitBranch" badge="Workflow">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Campo de Status</label>
            <Input value={entity.lifecycle.statusField} onChange={(e) => updateNestedProperty(['lifecycle', 'statusField'], e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Status Inicial</label>
            <Input value={entity.lifecycle.defaultStatus} onChange={(e) => updateNestedProperty(['lifecycle', 'defaultStatus'], e.target.value)} />
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Transições Válidas</h4>
          {entity.lifecycle.transitions.map((t, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-sidebar/50 rounded-lg border border-card-border">
                <Input value={t.from} onChange={(e) => {
                    const newTransitions = [...entity.lifecycle.transitions];
                    newTransitions[i] = { ...t, from: e.target.value };
                    updateNestedProperty(['lifecycle', 'transitions'], newTransitions);
                }} placeholder="De" className="h-8 text-xs" />
                <Icon name="arrowRight" className="h-4 w-4 text-text-secondary" />
                <Input value={t.to} onChange={(e) => {
                    const newTransitions = [...entity.lifecycle.transitions];
                    newTransitions[i] = { ...t, to: e.target.value };
                    updateNestedProperty(['lifecycle', 'transitions'], newTransitions);
                }} placeholder="Para" className="h-8 text-xs" />
                <Input value={t.event} onChange={(e) => {
                    const newTransitions = [...entity.lifecycle.transitions];
                    newTransitions[i] = { ...t, event: e.target.value };
                    updateNestedProperty(['lifecycle', 'transitions'], newTransitions);
                }} placeholder="Evento" className="h-8 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => {
              const newTransitions = [...entity.lifecycle.transitions, { from: 'STATUS_A', to: 'STATUS_B', event: 'evento_x' }];
              updateNestedProperty(['lifecycle', 'transitions'], newTransitions);
          }}><Icon name="plus" className="w-4 h-4 mr-2"/> Adicionar Transição</Button>
        </div>
      </SectionCard>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Políticas de Segurança (RLS)" iconName="lock" badge="Segurança Ativa">
        <div className="space-y-4">
          {entity.security.policies.map((p) => (
            <div key={p.id} className="p-4 border border-purple-500/20 rounded-lg bg-sidebar/50 space-y-3">
                <div className="flex justify-between items-center">
                    <Badge className="bg-purple-500/20 text-purple-400">{p.type}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeNestedItem('policies', p.id, 'security')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
                </div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Condição de Acesso (DSL)</label><Input value={p.condition} onChange={(e) => updateNestedList('policies', p.id, 'condition', e.target.value, 'security')} className="font-mono text-xs"/></div>
            </div>
          ))}
          {entity.security.policies.length === 0 && <p className="text-sm text-text-secondary text-center py-4 italic">Nenhuma política customizada. Herdando defaults do projeto.</p>}
        </div>
      </SectionCard>
    </div>
  );

  // FIX: Implemented missing renderIntegrationTab
  const renderIntegrationTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Canais de Exposição" iconName="layout" badge="Frontends">
        <div className="space-y-3">
          {entity.integration.exposureChannels.map((ch) => (
            <div key={ch.id} className="p-3 border border-card-border rounded-lg bg-sidebar/50 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-sm">{ch.channel}</p>
                    <p className="text-xs text-text-secondary">{ch.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeNestedItem('exposureChannels', ch.id, 'integration')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={() => addNestedItem('exposureChannels', { channel: 'Novo Canal', description: '', dataFields: [] }, 'integration')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Canal</Button>
        </div>
      </SectionCard>
    </div>
  );

  const renderDataGovernanceTab = () => (
    <div className="space-y-6 animate-in fade-in-50">
      <SectionCard title="Estratégia de Ciclo de Vida e Retenção" iconName="settings" badge="Governance Ready">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-sidebar/50 p-4 rounded-lg border border-card-border space-y-4">
                <h4 className="font-semibold text-accent flex items-center gap-2"><Icon name="clock" className="w-4 h-4" /> Retenção de Dados</h4>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Tipo de Expurgo</label><Select value={entity.dataGovernance.retentionPolicy.type} onValueChange={(v) => updateNestedProperty(['dataGovernance', 'retentionPolicy', 'type'], v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="NONE">Nenhum</SelectItem><SelectItem value="SOFT_DELETE">Log Exclusão (Soft)</SelectItem><SelectItem value="HARD_DELETE">Remoção Física (Hard)</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Duração da Janela (Dias)</label><Input type="number" value={entity.dataGovernance.retentionPolicy.afterDays} onChange={(e) => updateNestedProperty(['dataGovernance', 'retentionPolicy', 'afterDays'], Number(e.target.value))} /></div>
            </div>
            <div className="bg-sidebar/50 p-4 rounded-lg border border-card-border space-y-4">
                <h4 className="font-semibold text-accent flex items-center gap-2"><Icon name="shield" className="w-4 h-4" /> Proprietário e Sigilo</h4>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Data Owner (Responsável)</label><Input value={entity.dataGovernance.dataOwner} onChange={(e) => updateNestedProperty(['dataGovernance', 'dataOwner'], e.target.value)} /></div>
                <div className="flex items-center space-x-2 pt-2"><Switch id="isVersioned" checked={entity.security.isVersioned} onCheckedChange={(c) => updateNestedProperty(['security', 'isVersioned'], c)} /><label htmlFor="isVersioned" className="text-xs">Ativar Versionamento Imutável</label></div>
            </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'schema': return renderSchemaTab();
      case 'endpoints': return renderEndpointsTab();
      case 'actions': return renderActionsTab();
      case 'lifecycle': return renderLifecycleTab();
      case 'security': return renderSecurityTab();
      case 'integration': return renderIntegrationTab();
      case 'governance': return renderDataGovernanceTab();
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
        <div className="border-b border-card-border overflow-x-auto">
          <nav className="-mb-px flex space-x-1" aria-label="Tabs">
            <TabButton iconName="grid" title="Schema & Rel." isActive={activeTab === 'schema'} onClick={() => setActiveTab('schema')} />
            <TabButton iconName="server" title="Endpoints" isActive={activeTab === 'endpoints'} onClick={() => setActiveTab('endpoints')} isRecommended={entity.endpoints.length === 0} />
            <TabButton iconName="zap" title="Ações" isActive={activeTab === 'actions'} onClick={() => setActiveTab('actions')} />
            <TabButton iconName="gitBranch" title="Ciclo de Vida" isActive={activeTab === 'lifecycle'} onClick={() => setActiveTab('lifecycle')} isRecommended={entity.lifecycle.transitions.length === 0} />
            <TabButton iconName="shield" title="Segurança" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} isRecommended={entity.security.policies.length === 0} />
            <TabButton iconName="layout" title="UX/Integração" isActive={activeTab === 'integration'} onClick={() => setActiveTab('integration')} />
            <TabButton iconName="settings" title="Governança" isActive={activeTab === 'governance'} onClick={() => setActiveTab('governance')} />
          </nav>
        </div>

        <div className="min-h-[500px]">
            {renderContent()}
        </div>

        {showAdvancedDataStructure && (
            <AdvancedDataStructureModal 
                entity={entity} 
                setEntity={setEntity}
                onClose={() => setShowAdvancedDataStructure(false)} 
            />
        )}
    </div>
  );
};

export default EntityEditor;