import React, { useState } from 'react';
import type { Table, Column, ValidationRules, CascadeAction } from '../../../types';
import { DATA_TYPES } from '../../../constants';
import Icon from '../../shared/Icon';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';

// ValidationModal component
interface ValidationModalProps {
    column: Column;
    onClose: () => void;
    onSave: (updatedValidations: ValidationRules) => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ column, onClose, onSave }) => {
    const [rules, setRules] = useState<ValidationRules>(column.validations || {});

    const handleSave = () => {
        const cleanedRules: Partial<ValidationRules> = {};
        if (rules.isUnique) cleanedRules.isUnique = true;
        if (rules.minValue !== undefined && rules.minValue !== null && rules.minValue !== '') cleanedRules.minValue = Number(rules.minValue);
        if (rules.maxValue !== undefined && rules.maxValue !== null && rules.maxValue !== '') cleanedRules.maxValue = Number(rules.maxValue);
        if (rules.minLength !== undefined && rules.minLength !== null && rules.minLength !== '') cleanedRules.minLength = Number(rules.minLength);
        if (rules.maxLength !== undefined && rules.maxLength !== null && rules.maxLength !== '') cleanedRules.maxLength = Number(rules.maxLength);
        if (rules.pattern) cleanedRules.pattern = rules.pattern;
        
        if (Object.keys(cleanedRules).length === 0) {
            onSave({});
        } else {
            onSave(cleanedRules as ValidationRules);
        }
        onClose();
    };

    const isNumericType = column.dataType.includes('INT') || column.dataType.includes('DECIMAL') || column.dataType.includes('FLOAT') || column.dataType.includes('DOUBLE');
    const isTextType = column.dataType.includes('VARCHAR') || column.dataType.includes('TEXT');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-sidebar rounded-lg shadow-xl w-full max-w-md border border-card-border" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-card-border">
                    <h3 className="text-lg font-semibold text-text-primary">Regras de Validação para: <span className="font-mono text-accent">{column.name}</span></h3>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isUnique">Valor Único (Unique)</Label>
                        <input id="isUnique" type="checkbox" checked={!!rules.isUnique} onChange={e => setRules(prev => ({...prev, isUnique: e.target.checked}))} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                    </div>
                    {isNumericType && (
                        <>
                           <div className="flex items-center justify-between">
                                <Label htmlFor="minValue">Valor Mínimo</Label>
                                <Input id="minValue" type="number" value={rules.minValue ?? ''} onChange={e => setRules(prev => ({...prev, minValue: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-1/2"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maxValue">Valor Máximo</Label>
                                <Input id="maxValue" type="number" value={rules.maxValue ?? ''} onChange={e => setRules(prev => ({...prev, maxValue: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-1/2"/>
                            </div>
                        </>
                    )}
                    {isTextType && (
                        <>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="minLength">Comprimento Mínimo</Label>
                                <Input id="minLength" type="number" value={rules.minLength ?? ''} onChange={e => setRules(prev => ({...prev, minLength: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-1/2"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maxLength">Comprimento Máximo</Label>
                                <Input id="maxLength" type="number" value={rules.maxLength ?? ''} onChange={e => setRules(prev => ({...prev, maxLength: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-1/2"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pattern">Padrão (Regex)</Label>
                                <Input id="pattern" type="text" placeholder="ex: ^[a-z]+$" value={rules.pattern ?? ''} onChange={e => setRules(prev => ({...prev, pattern: e.target.value}))} className="w-1/2"/>
                            </div>
                        </>
                    )}
                </div>
                <div className="p-4 bg-background/50 border-t border-card-border flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Regras</Button>
                </div>
            </div>
        </div>
    );
};


// TableEditor component
interface TableEditorProps {
  table: Table;
  tables: Table[];
  onUpdateTable: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ table, tables, onUpdateTable, onDeleteTable }) => {
  const [deletingColumnIds, setDeletingColumnIds] = useState<Set<string>>(new Set());
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  const handleOpenValidationModal = (column: Column) => {
    setEditingColumn(column);
    setIsValidationModalOpen(true);
  };

  const handleCloseValidationModal = () => {
    setEditingColumn(null);
    setIsValidationModalOpen(false);
  };

  const handleSaveValidations = (updatedValidations: ValidationRules) => {
    if (editingColumn) {
        const updatedColumn = { ...editingColumn, validations: updatedValidations };
        handleColumnChange(editingColumn.id, updatedColumn);
    }
    handleCloseValidationModal();
  };
  
  const handleTableChange = (updatedFields: Partial<Table>) => {
    onUpdateTable({ ...table, ...updatedFields });
  };

  const handleColumnChange = (columnId: string, updatedColumn: Partial<Column>) => {
    const newColumns = table.columns.map(c => c.id === columnId ? { ...c, ...updatedColumn } : c);
    onUpdateTable({ ...table, columns: newColumns });
  };
  
  const addColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}_${Math.random()}`,
      name: 'nova_coluna',
      dataType: 'INT',
      isPrimaryKey: false,
      isForeignKey: false,
      isNullable: true,
      isIndexed: false,
      isAutoIncrement: false,
      onDeleteAction: 'NO ACTION',
      onUpdateAction: 'NO ACTION',
    };
    onUpdateTable({ ...table, columns: [...table.columns, newColumn] });
  };
  
  const deleteColumn = (columnId: string) => {
    setDeletingColumnIds(prev => new Set(prev).add(columnId));
    
    setTimeout(() => {
        const newColumns = table.columns.filter((c) => c.id !== columnId);
        onUpdateTable({ ...table, columns: newColumns });
        setDeletingColumnIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(columnId);
            return newSet;
        });
    }, 300);
  };

  const getDataTypeParts = (dataType: string) => {
    const match = dataType.match(/^([A-Z]+)(\(.*\))?$/);
    if (!match) return { baseType: dataType, params: '' };
    return { baseType: match[1] || dataType, params: match[2] || '' };
  };

  const isParameterizedType = (baseType: string) => ['VARCHAR', 'DECIMAL'].includes(baseType);
  const cascadeActions: CascadeAction[] = ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT'];

  return (
    <div className="flex-1 bg-background/50 p-6 rounded-lg shadow-inner overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={table.name}
          onChange={(e) => handleTableChange({ name: e.target.value })}
          className="text-2xl font-bold text-text-primary bg-transparent border-b-2 border-card-border focus:border-accent focus:outline-none transition"
        />
        <button
          onClick={() => onDeleteTable(table.id)}
          className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors duration-200"
        >
          <Icon name="trash" className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4 mb-6">
        <div>
            <label className="text-sm text-text-secondary">Descrição da Tabela</label>
            <Input value={table.description || ''} onChange={e => handleTableChange({ description: e.target.value })} placeholder="Ex: Armazena informações sobre usuários" />
        </div>
        <div>
            <label className="text-sm text-text-secondary">Constraints de Verificação (CHECK)</label>
            <Input value={table.checkConstraints || ''} onChange={e => handleTableChange({ checkConstraints: e.target.value })} className="font-mono" placeholder="Ex: (data_inicio <= data_fim)" />
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-10 gap-2 p-2 text-xs font-bold text-text-secondary uppercase">
            <div className="col-span-3">Coluna</div>
            <div className="col-span-3">Tipo de Dados</div>
            <div className="col-span-3 flex justify-around">PK AI IX FK NN</div>
            <div className="col-span-1 text-center">Ações</div>
        </div>
        
        {table.columns.map((column) => {
          const { baseType, params } = getDataTypeParts(column.dataType);
          const referencedTable = tables.find(t => t.name === column.foreignKeyTable);

          return (
            <div
              key={column.id}
              className={`p-2 bg-sidebar/50 rounded-md transition-all duration-300 ease-in-out ${
                deletingColumnIds.has(column.id) ? 'fade-out-up' : 'fade-in-down'
              }`}
            >
              <div className="grid grid-cols-10 gap-2 items-center">
                  {/* Column Name & Description */}
                  <div className="col-span-3">
                      <Input value={column.name} onChange={(e) => handleColumnChange(column.id, { name: e.target.value })} />
                      <Input value={column.description || ''} onChange={e => handleColumnChange(column.id, { description: e.target.value })} className="mt-1 text-xs text-text-secondary placeholder-text-secondary/50" placeholder="Descrição..." />
                  </div>
                  {/* Data Type */}
                  <div className="col-span-3 flex items-center gap-1">
                      <select value={baseType} onChange={(e) => handleColumnChange(column.id, { dataType: isParameterizedType(e.target.value) ? `${e.target.value}(255)` : e.target.value })} className="flex h-10 w-full rounded-md border border-card-border bg-sidebar px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                          {DATA_TYPES.map(type => <option key={type} value={getDataTypeParts(type).baseType}>{getDataTypeParts(type).baseType}</option>)}
                      </select>
                      {isParameterizedType(baseType) && (
                          <Input value={params} onChange={(e) => handleColumnChange(column.id, { dataType: `${baseType}${e.target.value}` })} className="w-20" placeholder="(255)"/>
                      )}
                  </div>
                  {/* Flags */}
                  <div className="col-span-3 flex justify-around items-center" title="Primary Key, Auto-Increment, Index, Foreign Key, Not Null">
                    <input type="checkbox" checked={column.isPrimaryKey} onChange={(e) => handleColumnChange(column.id, { isPrimaryKey: e.target.checked })} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                    <input type="checkbox" checked={column.isAutoIncrement} onChange={(e) => handleColumnChange(column.id, { isAutoIncrement: e.target.checked })} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                    <input type="checkbox" checked={column.isIndexed} onChange={(e) => handleColumnChange(column.id, { isIndexed: e.target.checked })} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                    <input type="checkbox" checked={column.isForeignKey} onChange={(e) => handleColumnChange(column.id, { isForeignKey: e.target.checked })} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                    <input type="checkbox" checked={!column.isNullable} onChange={(e) => handleColumnChange(column.id, { isNullable: !e.target.checked })} className="w-4 h-4 rounded text-accent bg-background border-card-border focus:ring-accent"/>
                  </div>
                  {/* Actions */}
                  <div className="col-span-1 flex justify-end items-center gap-1">
                    <button onClick={() => handleOpenValidationModal(column)} className="p-1 text-text-secondary hover:text-accent transition-colors" title="Regras de Validação"><Icon name="cog" className="w-4 h-4"/></button>
                    <button onClick={() => deleteColumn(column.id)} className="p-1 text-text-secondary hover:text-red-500 transition-colors" title="Excluir Coluna"><Icon name="trash" className="w-4 h-4"/></button>
                  </div>
              </div>
              {/* Foreign Key Panel */}
              {column.isForeignKey && (
                <div className="mt-2 p-3 bg-background/50 rounded-md border border-card-border/50 fade-in-down">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                       <div>
                            <label className="block mb-1 font-semibold text-text-secondary">Tabela de Referência</label>
                            <select value={column.foreignKeyTable || ''} onChange={e => handleColumnChange(column.id, { foreignKeyTable: e.target.value, foreignKeyColumn: '' })} className="flex h-9 w-full rounded-md border border-card-border bg-sidebar px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="">Selecione...</option>
                                {tables.filter(t => t.id !== table.id).map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                       </div>
                       <div>
                            <label className="block mb-1 font-semibold text-text-secondary">Coluna de Referência</label>
                            <select value={column.foreignKeyColumn || ''} onChange={e => handleColumnChange(column.id, { foreignKeyColumn: e.target.value })} disabled={!referencedTable} className="flex h-9 w-full rounded-md border border-card-border bg-sidebar px-2 py-1 text-xs text-text-primary disabled:bg-sidebar/50 focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="">Selecione...</option>
                                {referencedTable?.columns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                       </div>
                       <div>
                            <label className="block mb-1 font-semibold text-text-secondary">ON DELETE</label>
                            <select value={column.onDeleteAction || 'NO ACTION'} onChange={e => handleColumnChange(column.id, { onDeleteAction: e.target.value as CascadeAction })} className="flex h-9 w-full rounded-md border border-card-border bg-sidebar px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                                {cascadeActions.map(action => <option key={action} value={action}>{action}</option>)}
                            </select>
                       </div>
                        <div>
                            <label className="block mb-1 font-semibold text-text-secondary">ON UPDATE</label>
                            <select value={column.onUpdateAction || 'NO ACTION'} onChange={e => handleColumnChange(column.id, { onUpdateAction: e.target.value as CascadeAction })} className="flex h-9 w-full rounded-md border border-card-border bg-sidebar px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                                {cascadeActions.map(action => <option key={action} value={action}>{action}</option>)}
                            </select>
                       </div>
                    </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button onClick={addColumn} className="mt-4 flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
        <Icon name="plus" className="w-4 h-4" />
        Adicionar Coluna
      </button>
      {isValidationModalOpen && editingColumn && (
          <ValidationModal 
              column={editingColumn}
              onClose={handleCloseValidationModal}
              onSave={handleSaveValidations}
          />
      )}
    </div>
  );
};

export default TableEditor;