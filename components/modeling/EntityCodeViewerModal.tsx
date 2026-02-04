import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogCloseButton } from '../ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import CodeBlock from '../shared/CodeBlock';
import { Entity } from './steps/Step8Entities';
import { generateSingleEntitySql, generateSingleEntityPrisma } from '../../lib/generation/singleEntityGenerators';

interface EntityCodeViewerModalProps {
    entity: Entity | null;
    onClose: () => void;
}

const EntityCodeViewerModal: React.FC<EntityCodeViewerModalProps> = ({ entity, onClose }) => {
    const sqlCode = useMemo(() => entity ? generateSingleEntitySql(entity) : '', [entity]);
    const prismaCode = useMemo(() => entity ? generateSingleEntityPrisma(entity) : '', [entity]);

    return (
        <Dialog open={!!entity} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Code Artifacts for "{entity?.name}"</DialogTitle>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent>
                <Tabs defaultValue="sql" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sql">SQL Schema</TabsTrigger>
                        <TabsTrigger value="prisma">Prisma Model</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sql" className="mt-4">
                        <CodeBlock language="sql" code={sqlCode} />
                    </TabsContent>
                    <TabsContent value="prisma" className="mt-4">
                        <CodeBlock language="prisma" code={prismaCode} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default EntityCodeViewerModal;