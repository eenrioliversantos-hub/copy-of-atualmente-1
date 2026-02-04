import React from 'react';
import { DevTask } from '../../../types';
import { MOCK_COMMANDS } from '../../../lib/mockPlanDetails';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';

interface CommandsViewProps {
    task: DevTask | null;
}

const CommandsView: React.FC<CommandsViewProps> = ({ task }) => {
     if (!task) {
        return (
            <div className="bg-card border border-card-border rounded-lg p-6 text-center py-16 mt-6 shadow-sm">
                <Icon name="zap" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">No Task Selected</h3>
                <p className="text-text-secondary text-sm mt-1">Select a task to see its required commands.</p>
            </div>
        );
    }
    
    const commands = MOCK_COMMANDS[task.title] || [];

    return (
         <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="zap" className="h-5 w-5 text-accent" />
                    Commands Cheatsheet for: {task.title}
                </CardTitle>
                <CardDescription>A list of useful terminal commands for this task. Click the button to copy.</CardDescription>
            </CardHeader>
            <CardContent>
                 {commands.length > 0 ? (
                    <div className="space-y-6">
                        {commands.map((cmd, index) => (
                            <div key={index}>
                                <h4 className="font-semibold mb-1 text-text-primary">{cmd.title}</h4>
                                <CodeBlock language={cmd.language} code={cmd.code} />
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-12 text-text-secondary">
                        <Icon name="zap" className="h-8 w-8 mx-auto mb-2" />
                        <p>No commands specified for this task.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CommandsView;
