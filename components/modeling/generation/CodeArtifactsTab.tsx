
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';
import FileExplorer, { FileTreeItem } from '../../shared/FileExplorer';
import { compileProjectArtifacts } from '../../../lib/projectCompiler';

interface CodeArtifactsTabProps {
    wizardData?: any;
    onStartModeling?: () => void;
}

const CodeArtifactsTab: React.FC<CodeArtifactsTabProps> = ({ wizardData, onStartModeling }) => {
    const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);

    // Use the centralized compiler
    const fileTree = useMemo(() => {
        return compileProjectArtifacts(wizardData);
    }, [wizardData]);

    useEffect(() => {
        if (fileTree.length > 0) {
            let firstFile: FileTreeItem | null = null;
            const findFirstFile = (items: FileTreeItem[]) => {
                for (const item of items) {
                    if (item.type === 'file') {
                        firstFile = item;
                        return;
                    }
                    if (item.children) {
                        findFirstFile(item.children);
                        if (firstFile) return;
                    }
                }
            };
            findFirstFile(fileTree);
            setSelectedFile(firstFile);
        }
    }, [fileTree]);

    const hasAnyArtifact = fileTree.length > 0;

    if (!hasAnyArtifact) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Artefatos de Código Gerados</CardTitle>
                    <CardDescription>
                        Os arquivos de código gerados a partir do seu modelo aparecerão aqui após a conclusão da fase de modelagem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed border-card-border rounded-lg">
                        <Icon name="package" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg text-text-primary">Nenhum Artefato Gerado</h3>
                        <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                            A fase de modelagem não foi concluída ou não gerou nenhum artefato de código.
                        </p>
                        {onStartModeling && (
                            <Button size="sm" variant="outline" className="mt-4" onClick={onStartModeling}>
                                Ir para o Hub de Modelagem
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Artefatos de Código Gerados</CardTitle>
                <CardDescription>
                    Explore a estrutura de arquivos e o código inicial gerado a partir do seu modelo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border border-card-border rounded-lg max-h-[500px] overflow-y-auto">
                        <FileExplorer items={fileTree} onFileClick={setSelectedFile} activeFile={selectedFile}/>
                    </div>
                    <div className="md:col-span-2">
                        {selectedFile?.content ? (
                            <div className="h-[500px] overflow-y-auto rounded-lg border border-card-border">
                                <CodeBlock code={selectedFile.content} language={selectedFile.language || 'typescript'} />
                            </div>
                        ) : (
                            <div className="h-[500px] flex items-center justify-center text-center text-text-secondary border-2 border-dashed border-card-border rounded-lg">
                                <div>
                                    <Icon name="file-text" className="h-8 w-8 mx-auto mb-2" />
                                    <p>Selecione um arquivo para ver o conteúdo</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CodeArtifactsTab;
