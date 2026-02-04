import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';

interface NewSessionPageProps {
    setCurrentView: (view: string) => void;
}

const ModuleCard: React.FC<{ title: string; description: string; icon: string; features: string[]; action: () => void; }> = ({ title, description, icon, features, action }) => (
    <Card 
        onClick={action}
        className="cursor-pointer group transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-1 bg-sidebar/50 hover:bg-sidebar flex flex-col"
    >
        <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex items-start gap-3">
                <div className="p-2.5 bg-background rounded-lg border border-card-border group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                    <Icon name={icon} className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors text-base">{title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{description}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                {features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);

const NewSessionPage: React.FC<NewSessionPageProps> = ({ setCurrentView }) => {
    const modules = [
        {
            title: "Template",
            description: "Acelere o desenvolvimento começando com um modelo pré-configurado.",
            icon: 'layoutTemplate',
            action: () => setCurrentView("template_module"),
            features: ["Rápido", "Estruturado", "Boas Práticas"],
        },
        {
            title: "Manutenção",
            description: "Acesse e modifique um projeto existente para realizar manutenções.",
            icon: 'wrench',
            action: () => setCurrentView("maintenance_module"),
            features: ["Edição", "Revisão", "Otimização"],
        },
        {
            title: "Importar",
            description: "Importe uma configuração de projeto para iniciar a modelagem.",
            icon: 'upload',
            action: () => setCurrentView("import_module"),
            features: ["JSON", "YAML", "Git Repo"],
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentView('workspace_modeling')}>
                    <Icon name="chevronLeft" className="h-4 w-4 mr-2" /> Voltar para o Hub
                </Button>
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-2">Nova Sessão de Modelagem</h1>
                <p className="text-text-secondary">Escolha um módulo para iniciar seu projeto. O módulo "Template" segue o fluxo de modelagem principal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                    <ModuleCard key={index} {...module} />
                ))}
            </div>
        </div>
    );
};

export default NewSessionPage;