import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import Icon from '../shared/Icon';
import { Badge } from '../ui/Badge';

const mockBranches = [
    { name: 'main', lastCommit: 'a1b2c3d', status: 'protected' },
    { name: 'develop', lastCommit: 'e4f5g6h', status: 'default' },
    { name: 'feat/new-dashboard', lastCommit: 'i7j8k9l', status: 'active' },
    { name: 'fix/auth-bug', lastCommit: 'm0n1o2p', status: 'active' },
];

const mockCommits = [
    { hash: 'a1b2c3d', message: 'Merge pull request #12 from feat/new-dashboard', author: 'Carlos Silva', branch: 'main' },
    { hash: 'i7j8k9l', message: 'feat: add real-time chart to dashboard', author: 'Ana Santos', branch: 'feat/new-dashboard' },
    { hash: 'q3r4s5t', message: 'refactor: optimize data fetching hook', author: 'Ana Santos', branch: 'feat/new-dashboard' },
    { hash: 'm0n1o2p', message: 'fix: resolve issue with token expiration', author: 'Pedro Costa', branch: 'fix/auth-bug' },
];

const mockPullRequests = [
    { id: 13, title: 'feat: add user profile page', author: 'Ana Santos', status: 'Open', target: 'develop' },
    { id: 12, title: 'feat: add real-time chart to dashboard', author: 'Ana Santos', status: 'Merged', target: 'main' },
    { id: 11, title: 'fix: correct API endpoint for products', author: 'Pedro Costa', status: 'Closed', target: 'develop' },
];

const VersionControlPage = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Controle de Versão (Git)</CardTitle>
                <CardDescription>Visualize o estado atual do seu repositório, incluindo branches, commits e pull requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="branches">
                    <TabsList>
                        <TabsTrigger value="branches">Branches</TabsTrigger>
                        <TabsTrigger value="commits">Commits Recentes</TabsTrigger>
                        <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
                    </TabsList>
                    <TabsContent value="branches" className="mt-4">
                        <div className="space-y-3">
                            {mockBranches.map(branch => (
                                <div key={branch.name} className="flex items-center justify-between p-3 bg-sidebar rounded-md border border-card-border">
                                    <div className="flex items-center gap-3">
                                        <Icon name="gitBranch" className="h-5 w-5 text-accent" />
                                        <div>
                                            <p className="font-semibold">{branch.name}</p>
                                            <p className="text-xs text-text-secondary font-mono">Último commit: {branch.lastCommit}</p>
                                        </div>
                                    </div>
                                    {branch.status === 'protected' && <Badge variant="outline">Protegido</Badge>}
                                    {branch.status === 'default' && <Badge variant="secondary">Padrão</Badge>}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="commits" className="mt-4">
                         <div className="space-y-3">
                            {mockCommits.map(commit => (
                                <div key={commit.hash} className="flex items-center gap-3 p-3 bg-sidebar rounded-md border border-card-border">
                                    <Icon name="gitCommit" className="h-5 w-5 text-text-secondary" />
                                    <div className="flex-1">
                                        <p>{commit.message}</p>
                                        <p className="text-xs text-text-secondary">
                                            <span className="font-semibold">{commit.author}</span> para <Badge variant="outline" className="text-xs">{commit.branch}</Badge>
                                        </p>
                                    </div>
                                    <p className="font-mono text-xs text-accent">{commit.hash}</p>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="pull-requests" className="mt-4">
                        <div className="space-y-3">
                             {mockPullRequests.map(pr => (
                                <div key={pr.id} className="flex items-center justify-between p-3 bg-sidebar rounded-md border border-card-border">
                                    <div className="flex items-center gap-3">
                                        <Icon name="gitPullRequest" className={`h-5 w-5 ${pr.status === 'Open' ? 'text-green-400' : pr.status === 'Merged' ? 'text-purple-400' : 'text-red-400'}`} />
                                        <div>
                                            <p className="font-semibold">#{pr.id} {pr.title}</p>
                                            <p className="text-xs text-text-secondary">
                                                por {pr.author} para <Badge variant="outline" className="text-xs">{pr.target}</Badge>
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={pr.status === 'Open' ? 'text-green-400' : pr.status === 'Merged' ? 'text-purple-400' : 'text-red-400'}>
                                        {pr.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default VersionControlPage;