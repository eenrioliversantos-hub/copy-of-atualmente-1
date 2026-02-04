import React from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { ScrollArea } from '../ui/ScrollArea';
import { GeneratedFile } from '../../types';

interface SourceControlViewProps {
    commitMessage: string;
    setCommitMessage: (message: string) => void;
    onCommit: () => void;
    changedFiles: GeneratedFile[];
    onFileSelect: (file: { path: string; content: string }) => void;
}

const SourceControlView: React.FC<SourceControlViewProps> = ({ commitMessage, setCommitMessage, onCommit, changedFiles, onFileSelect }) => {
    return (
        <div className="p-4 flex flex-col h-full">
            <header className="mb-4 flex-shrink-0">
                <h2 className="text-sm font-bold uppercase text-text-secondary">Controle de Versão</h2>
            </header>
            
            <div className="space-y-2 mb-4">
                <Label htmlFor="commit-message">Mensagem de Commit</Label>
                <Textarea 
                    id="commit-message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Ex: feat: implementa tela de login"
                    rows={3}
                />
            </div>
            
            <Button onClick={onCommit} disabled={!commitMessage.trim() || changedFiles.length === 0}>
                <Icon name="gitCommit" className="h-4 w-4 mr-2" />
                Commit &amp; Push
            </Button>

            <div className="mt-4 pt-4 border-t border-card-border flex-1 flex flex-col overflow-hidden">
                 <h3 className="text-xs font-bold uppercase text-text-secondary mb-2 flex-shrink-0">
                    Alterações ({changedFiles.length})
                </h3>
                {changedFiles.length > 0 ? (
                    <ScrollArea className="flex-1">
                        <div className="space-y-1">
                           {changedFiles.map(file => (
                               <button 
                                   key={file.path} 
                                   onClick={() => onFileSelect(file)}
                                   className="w-full text-left flex items-center gap-2 p-1 rounded text-sm text-green-400 hover:bg-sidebar/50"
                                >
                                    <Icon name="plus" className="h-3 w-3" />
                                    <span>{file.path}</span>
                               </button>
                           ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-xs text-text-secondary italic mt-2">Nenhuma alteração para commitar.</p>
                )}
            </div>
        </div>
    );
};

export default SourceControlView;
