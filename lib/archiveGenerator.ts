
import JSZip from 'jszip';
import { FileTreeItem } from '../components/shared/FileExplorer';

/**
 * Transforma a árvore de arquivos em um blob de arquivo .zip
 */
export async function generateProjectZip(items: FileTreeItem[]): Promise<Blob> {
    const zip = new JSZip();

    function addToZip(currentItems: FileTreeItem[], currentPath = '') {
        currentItems.forEach(item => {
            const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
            
            if (item.type === 'file') {
                zip.file(itemPath, item.content || '');
            } else if (item.type === 'folder' && item.children) {
                addToZip(item.children, itemPath);
            }
        });
    }

    addToZip(items);
    
    return await zip.generateAsync({ type: 'blob' });
}

/**
 * Helper para disparar o download de um Blob no navegador
 */
export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
