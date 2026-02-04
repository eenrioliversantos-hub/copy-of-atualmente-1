import React from 'react';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';

interface Screen {
    id: string;
    path: string;
    description: string;
    layout: string;
}

interface UIComponent {
    id: string;
    type: string;
    description: string;
}

interface WireframePreviewProps {
    screen: Screen | null;
    components: UIComponent[];
}

const LayoutBlock: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
    <div className={`border border-dashed border-card-border/50 bg-sidebar/30 flex items-center justify-center p-2 ${className}`}>
        <span className="text-xs text-text-secondary">{name}</span>
    </div>
);

const ComponentBlock: React.FC<{ component: UIComponent }> = ({ component }) => (
    <div className="border border-card-border bg-sidebar/80 p-3 rounded-md">
        <p className="font-semibold text-sm">{component.type}</p>
        <p className="text-xs text-text-secondary">{component.description}</p>
    </div>
);

const WireframePreview: React.FC<WireframePreviewProps> = ({ screen, components }) => {
    if (!screen) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-card-border rounded-lg">
                <Icon name="mousePointer" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-text-primary">Nenhuma Tela Selecionada</h3>
                <p className="text-sm text-text-secondary mt-1">Vá para a aba "Telas/Páginas" e clique em "Visualizar" em uma tela para vê-la aqui.</p>
            </div>
        );
    }
    
    const renderLayout = () => {
        switch (screen.layout) {
            case "Standard (Sidebar + Header)":
                return (
                    <div className="flex h-full gap-2">
                        <LayoutBlock name="Sidebar" className="w-1/5" />
                        <div className="flex flex-col flex-1 gap-2">
                            <LayoutBlock name="Header" className="h-12 flex-shrink-0" />
                            <div className="flex-1 bg-background/50 p-4 space-y-4 overflow-y-auto">
                                {components.map(c => <ComponentBlock key={c.id} component={c} />)}
                            </div>
                        </div>
                    </div>
                );
            case "Full Page":
                return (
                     <div className="flex-1 bg-background/50 p-4 space-y-4 overflow-y-auto h-full">
                        {components.map(c => <ComponentBlock key={c.id} component={c} />)}
                    </div>
                );
            case "Form Focused":
                 return (
                     <div className="flex-1 bg-background/50 p-4 sm:p-8 md:p-12 flex items-center justify-center h-full">
                        <div className="w-full max-w-lg space-y-4">
                            {components.map(c => <ComponentBlock key={c.id} component={c} />)}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col h-full gap-2">
                        <LayoutBlock name="Layout Desconhecido" className="h-12 flex-shrink-0" />
                        <div className="flex-1 bg-background/50 p-4 space-y-4 overflow-y-auto">
                            {components.map(c => <ComponentBlock key={c.id} component={c} />)}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="mb-4 p-3 bg-sidebar rounded-lg border border-card-border">
                <h3 className="font-bold text-accent">{screen.path}</h3>
                <p className="text-sm text-text-secondary">{screen.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">Layout: {screen.layout}</Badge>
            </div>
            <div className="h-[60vh] bg-sidebar/20 p-2 rounded-lg border border-card-border">
                {renderLayout()}
            </div>
        </div>
    );
};

export default WireframePreview;
