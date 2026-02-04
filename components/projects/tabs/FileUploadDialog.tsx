import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogCloseButton } from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { Textarea } from '../../ui/Textarea';
import Icon from '../../shared/Icon';

interface FileUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUpload: (file: File, description: string) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ open, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            setError('Por favor, selecione um arquivo.');
            return;
        }
        if (!description.trim()) {
            setError('Por favor, adicione uma descrição.');
            return;
        }
        onUpload(file, description);
        // Reset state after upload
        setFile(null);
        setDescription('');
        setError('');
    };
    
    const handleClose = () => {
        setFile(null);
        setDescription('');
        setError('');
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogHeader>
                <DialogTitle>Fazer Upload de Arquivo</DialogTitle>
                <DialogDescription>Selecione um arquivo e adicione uma descrição para ele.</DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file-upload">Arquivo</Label>
                    <Input id="file-upload" type="file" onChange={handleFileChange} />
                    {file && <p className="text-sm text-text-secondary">Arquivo selecionado: {file.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                        id="description"
                        placeholder="Ex: Contrato assinado, Logo em alta resolução, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                 {error && <p className="text-sm text-red-500">{error}</p>}
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleUploadClick}>
                    <Icon name="upload" className="h-4 w-4 mr-2" />
                    Enviar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default FileUploadDialog;