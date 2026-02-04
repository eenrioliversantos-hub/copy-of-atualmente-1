import React, { useRef } from 'react';
import { Button } from '../../../ui/Button';
import Icon from './Icon';
import { Entity } from '../../../../lib/entity-modeler/types';

interface ImportExportProps {
    entities: Entity[];
    setEntities: (entities: Entity[]) => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ entities, setEntities }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(entities, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'entity_model.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const importedEntities = JSON.parse(text);
                    if (Array.isArray(importedEntities)) {
                        setEntities(importedEntities);
                        alert('Modelo importado com sucesso!');
                    } else {
                        alert('Erro: O arquivo JSON não é um array de entidades válido.');
                    }
                }
            } catch (error) {
                alert('Erro ao importar o arquivo. Verifique se é um JSON válido.');
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
        
        event.target.value = '';
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="application/json"
            />
            <Button variant="outline" onClick={handleImportClick} className="gap-2">
                <Icon name="upload" className="w-4 h-4" />
                Importar JSON
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
                 <Icon name="download" className="w-4 h-4" />
                Exportar JSON
            </Button>
        </div>
    );
};

export default ImportExport;
