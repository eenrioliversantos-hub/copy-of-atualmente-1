import React from 'react';
import { DevTask } from '../../../types';
import { MOCK_COMMITS } from '../../../lib/mockPlanDetails';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';

interface CommitsViewProps {
    task: DevTask | null;
}

const CommitsView: React.FC<CommitsViewProps> = ({ task }) => {
    if (!task) {
        return (
            <div className="bg-card border border-card-border rounded-lg p-6 text-center py-16 mt-6 shadow-sm">
                <Icon name="gitCommit" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">No Task Selected</h3>
                <p className="text-text-secondary text-sm mt-1">Select a task from the sidebar to see its commit history.</p>
            </div>
        );
    }

    const commits = MOCK_COMMITS[task.title] || [];

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                     <Icon name="gitCommit" className="h-5 w-5 text-accent" />
                    Commit History for: {task.title}
                </CardTitle>
                <CardDescription>A simulated history of commits related to implementing this task.</CardDescription>
            </CardHeader>
            <CardContent>
                {commits.length > 0 ? (
                    <ul className="space-y-4">
                        {commits.map(commit => (
                            <li key={commit.hash} className="flex items-start gap-4 p-3 bg-sidebar rounded-md border border-card-border">
                                <Icon name="gitCommit" className="h-5 w-5 text-text-secondary mt-1" />
                                <div className="flex-1">
                                    <p className="font-mono text-sm text-accent">{commit.hash}</p>
                                    <p className="text-text-primary">{commit.message}</p>
                                    <p className="text-xs text-text-secondary mt-1">
                                        <span className="font-semibold">{commit.author}</span> committed {commit.date}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-text-secondary">
                        <Icon name="gitCommit" className="h-8 w-8 mx-auto mb-2" />
                        <p>No commit history available for this task.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CommitsView;
