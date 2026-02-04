
import React from 'react';
import FileExplorer, { FileTreeItem } from '../shared/FileExplorer';

interface ProjectExplorerViewProps {
    files: FileTreeItem[];
    onFileSelect: (file: { path: string; content: string; language: string }) => void;
}

const ProjectExplorerView: React.FC<ProjectExplorerViewProps> = ({ files, onFileSelect }) => {
    return (
        <div className="p-2 flex flex-col h-full overflow-y-auto">
             <header className="mb-2 p-2 flex-shrink-0">
                <h2 className="text-sm font-bold uppercase text-text-secondary">Explorador do Projeto</h2>
            </header>
            <FileExplorer 
                items={files}
                onFileClick={(file) => {
                    if (file.type === 'file') {
                        onFileSelect({ 
                            path: file.name, 
                            content: file.content || '// Conteúdo vazio ou binário', 
                            language: file.language || 'typescript' 
                        });
                    }
                }}
            />
        </div>
    );
};

export default ProjectExplorerView;
