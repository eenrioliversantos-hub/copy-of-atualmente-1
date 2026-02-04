import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton } from '../../ui/Dialog';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';

interface ModalProps {
    component: any;
    allComponents: any[];
    onClose: () => void;
}

const DetailSection: React.FC<{ title: string; icon: string; items: string[]; emptyText: string; }> = ({ title, icon, items, emptyText }) => (
    <div>
        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Icon name={icon} className="h-4 w-4 text-accent" />
            {title}
        </h4>
        {items && items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => <Badge key={index} variant="secondary">{item}</Badge>)}
            </div>
        ) : (
            <p className="text-sm text-text-secondary italic pl-2">{emptyText}</p>
        )}
    </div>
);


const ComponentDetailModal: React.FC<ModalProps> = ({ component, allComponents, onClose }) => {
    // Calculate consumers (dependents)
    const consumers = allComponents
        .filter(c => (c.compDependencies || '').split(',').map((d: string) => d.trim()).filter(Boolean).includes(component.compName))
        .map(c => c.compName);
        
    const dependencies = (component.compDependencies || '').split(',').map((d: string) => d.trim()).filter(Boolean);
    const events = (component.compEvents || '').split(',').map((d: string) => d.trim()).filter(Boolean);

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogHeader className="pr-12">
                <DialogTitle className="flex items-center gap-3">
                    <Icon name="cog" className="h-6 w-6 text-accent" />
                    {component.compName}
                </DialogTitle>
                <DialogDescription>{component.compType} - Owned by {component.compOwner}</DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent className="space-y-6">
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">Responsibility</h4>
                    <p className="text-sm text-text-secondary bg-sidebar p-3 rounded-md border border-card-border">
                        {component.compResponsibility || 'No description provided.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailSection
                        title="Dependencies (Calls)"
                        icon="arrowRight"
                        items={dependencies}
                        emptyText="This component has no direct dependencies."
                    />
                    <DetailSection
                        title="Consumers (Called By)"
                        icon="arrowLeft"
                        items={consumers}
                        emptyText="No other components directly depend on this one."
                    />
                </div>
                 <DetailSection
                    title="Published Events"
                    icon="share"
                    items={events}
                    emptyText="This component does not publish any events."
                />
            </DialogContent>
        </Dialog>
    );
};

export default ComponentDetailModal;
