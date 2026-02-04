import React from 'react';
import GuideViewer from './GuideViewer';
import Icon from '../shared/Icon';
import { Guide } from '../../lib/guides';

interface DocumentationViewerProps {
    guide: Guide;
}
const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ guide }) => {
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Icon name="bookOpen" className="h-8 w-8 text-accent" />
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{guide.title}</h1>
                        <p className="text-text-secondary">Guia de referência da plataforma Nexus.</p>
                    </div>
                </div>
            </header>
            <div className="bg-sidebar/50 border border-card-border rounded-lg p-6 lg:p-8">
                <GuideViewer guide={guide} />
            </div>
        </div>
    );
};
export default DocumentationViewer;