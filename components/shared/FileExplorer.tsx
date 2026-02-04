
import React, { useState, useMemo, useEffect } from 'react';
import Icon from './Icon';

export interface FileTreeItem {
  type: 'folder' | 'file';
  name: string;
  children?: FileTreeItem[];
  status?: 'completed' | 'in_progress' | 'pending';
  content?: string; 
  language?: string;
}

interface FileExplorerProps {
  items: FileTreeItem[];
  onFileClick?: (item: FileTreeItem) => void;
  showStatus?: boolean; // New prop to control status visibility
  activeFile?: FileTreeItem | null;
}

const getStatusClasses = (status: 'completed' | 'in_progress' | 'pending') => {
  switch (status) {
    case 'completed': return { text: 'text-green-400', icon: 'checkCircle' };
    case 'in_progress': return { text: 'text-sky-400', icon: 'cog' };
    case 'pending': default: return { text: 'text-slate-400', icon: 'clock' };
  }
};

const FileItem: React.FC<{
  item: FileTreeItem;
  level: number;
  onFileClick?: (item: FileTreeItem) => void;
  showStatus?: boolean;
  activeFile?: FileTreeItem | null;
}> = ({ item, level, onFileClick, showStatus, activeFile }) => {
  const hasActiveChild = useMemo(() => {
    if (item.type !== 'folder' || !item.children || !activeFile) return false;
    const checkChildren = (children: FileTreeItem[]): boolean => {
      for (const child of children) {
        if (child.type === 'file' && child.name === activeFile.name && child.content === activeFile.content) return true;
        if (child.type === 'folder' && child.children && checkChildren(child.children)) return true;
      }
      return false;
    };
    return checkChildren(item.children);
  }, [item, activeFile]);

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const statusInfo = item.status ? getStatusClasses(item.status) : null;
  const isActive = activeFile?.name === item.name && activeFile?.content === item.content;

  if (item.type === 'folder') {
    return (
      <div>
        <div
          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-sidebar/50 rounded"
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name={isOpen ? 'chevronDown' : 'chevronRight'} className="h-4 w-4 text-text-secondary flex-shrink-0" />
          <Icon name={isOpen ? 'folderOpen' : 'folder'} className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-sm truncate">{item.name}</span>
          {showStatus && statusInfo && (
              <Icon name={statusInfo.icon} className={`h-3 w-3 ${statusInfo.text} ml-auto`} />
          )}
        </div>
        {isOpen && item.children && (
          <div>
            {item.children.map((child) => (
              <FileItem key={child.name} item={child} level={level + 1} onFileClick={onFileClick} showStatus={showStatus} activeFile={activeFile}/>
            ))}
          </div>
        )}
      </div>
    );
  }

  // File type
  return (
    <div
      className={`flex items-center gap-2 py-1 cursor-pointer rounded ${isActive ? 'bg-accent/20' : 'hover:bg-sidebar/50'}`}
      style={{ paddingLeft: `${level * 16}px` }}
      onClick={() => onFileClick?.(item)}
    >
        <div style={{ width: '16px' }} className="flex-shrink-0"></div> {/* Spacer for alignment */}
        <Icon name="file-text" className="h-4 w-4 text-text-secondary flex-shrink-0" />
        <span className="text-sm truncate">{item.name}</span>
        {showStatus && statusInfo && (
            <Icon name={statusInfo.icon} className={`h-3 w-3 ${statusInfo.text} ml-auto`} />
        )}
    </div>
  );
};


const FileExplorer: React.FC<FileExplorerProps> = ({ items, onFileClick, showStatus = false, activeFile }) => {
  return (
    <div className="p-2 bg-background rounded-md">
      {items.map((item) => (
        <FileItem
          key={item.name}
          item={item}
          level={0}
          onFileClick={onFileClick}
          showStatus={showStatus}
          activeFile={activeFile}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
