import React from 'react';
import { SoftwareFactoryPhase, Concept, ToolTarget } from '../../types';
import ConceptCard from './ConceptCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';

interface ContentViewerProps {
  data: SoftwareFactoryPhase[];
  path: string[];
  setPath: (newPath: string[]) => void;
  onExecuteTask: (toolTarget: ToolTarget) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ data, path, setPath, onExecuteTask }) => {
  if (path.length === 0) {
    return (
      <div className="text-center py-24">
        <Icon name="cpu" className="h-16 w-16 text-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Bem-vindo à Fábrica de Software</h2>
        <p className="text-text-secondary mt-2">Selecione uma fase na barra lateral para começar a explorar a esteira de produção.</p>
      </div>
    );
  }

  let currentLevel: (SoftwareFactoryPhase | Concept)[] = data;
  let currentItem: SoftwareFactoryPhase | Concept | undefined = undefined;

  for (const segment of path) {
    const foundItem = currentLevel.find(item => item.id === segment);
    if (foundItem) {
      currentItem = foundItem;
      currentLevel = (foundItem as any).children || [];
    } else {
      // Path is invalid, reset or show error
      return <div>Conteúdo não encontrado.</div>;
    }
  }

  if (!currentItem) {
    return <div>Erro ao carregar conteúdo.</div>;
  }
  
  // Render final content if it's a leaf node
  if ('content' in currentItem && currentItem.content) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Icon name={currentItem.icon} className="h-6 w-6 text-accent" />
                    <CardTitle className="text-xl">{currentItem.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
                <p>{currentItem.description}</p>
                <div className="mt-4 p-4 bg-sidebar/50 border border-card-border rounded-md">
                    <p>{currentItem.content}</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  // Render children concepts as cards if they exist
  const children = (currentItem as any).children;
  if (children && children.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50">
        {children.map((concept: Concept) => (
          <ConceptCard 
            key={concept.id} 
            concept={concept} 
            onClick={() => setPath([...path, concept.id])}
            onExecute={() => concept.toolTarget && onExecuteTask(concept.toolTarget)}
          />
        ))}
      </div>
    );
  }
  
  // Fallback for an empty category
  return (
       <div className="text-center py-24">
        <Icon name={currentItem.icon || 'folder'} className="h-16 w-16 text-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">{currentItem.title}</h2>
        <p className="text-text-secondary mt-2">Nenhum sub-tópico definido para esta categoria ainda.</p>
      </div>
  );
};

export default ContentViewer;