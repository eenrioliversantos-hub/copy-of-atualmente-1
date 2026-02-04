import React from 'react';
import Icon from './Icon';
import { SoftwareFactoryPhase, Concept } from '../../types';

interface BreadcrumbProps {
  path: string[];
  data: SoftwareFactoryPhase[];
  onNavigate: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, data, onNavigate }) => {
  if (path.length === 0) {
    return null;
  }

  const getPathItems = () => {
    const items = [];
    let currentLevel: (SoftwareFactoryPhase | Concept)[] = data;

    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      const item = currentLevel.find(c => c.id === segment);
      if (item) {
        items.push({ label: item.title, index: i });
        currentLevel = (item as any).children || [];
      } else {
        break; // Stop if path segment not found
      }
    }
    return items;
  };

  const pathItems = getPathItems();

  return (
    <nav className="flex items-center text-sm text-text-secondary mt-1" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {pathItems.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && <Icon name="chevronDown" className="h-4 w-4 -rotate-90" />}
            <button
              onClick={() => onNavigate(item.index)}
              className={`ml-2 hover:text-accent ${index === pathItems.length - 1 ? 'text-text-primary font-medium' : ''}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;