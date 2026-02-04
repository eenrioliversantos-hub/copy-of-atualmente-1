
import React, { useMemo, useState } from 'react';
import { DevTask } from '../../../types';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { compileProjectArtifacts } from '../../../lib/projectCompiler';
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import CodeBlock from '../../shared/CodeBlock';

interface FilesViewProps {
    task: DevTask | null;
    wizardData?: any;
}

const FilesView: React.FC<FilesViewProps> = ({ task, wizardData }) => {
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);

    // Compile the project structure based on the wizard data
    const fileTree = useMemo(() => {
        return compileProjectArtifacts(wizardData);
    }, [wizardData]);

    if (!task) {
        return (
            <div className="bg-card border border-card-border rounded-lg p-6 text-center py-16 mt-6 shadow-sm">
                <Icon name="folder" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">No Task Selected</h3>
                <p className="text-text-secondary text-sm mt-1">Select a task to see the relevant files.</p>
            </div>
        );
    }

    if (!fileTree || fileTree.length === 0) {
        return (
             <div className="bg-card border border-card-border rounded-lg p-6 text-center py-16 mt-6 shadow-sm">
                <Icon name="folder" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">No Files Generated</h3>
                <p className="text-text-secondary text-sm mt-1">Complete the modeling phase to generate project files.</p>
            </div>
        )
    }

    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            <Card className="lg:col-span-1 h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Icon name="folder" className="h-5 w-5 text-accent" />
                        Project Structure
                    </CardTitle>
                    <CardDescription>Files generated from your model.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    <FileExplorer 
                        items={fileTree} 
                        onFileClick={(file) => {
                            if (file.type === 'file') setSelectedFile(file);
                        }}
                        activeFile={selectedFile}
                    />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 h-full flex flex-col">
                 <CardHeader className="flex-shrink-0 py-3 px-4 border-b border-card-border">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Icon name="file-text" className="h-4 w-4 text-text-secondary" />
                        {selectedFile ? selectedFile.name : 'Select a file'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 bg-slate-900 rounded-b-lg">
                    {selectedFile?.content ? (
                        <div className="h-full overflow-auto">
                             <CodeBlock code={selectedFile.content} language={selectedFile.language || 'typescript'} />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-secondary">
                            <p>Select a file to view its content.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FilesView;
