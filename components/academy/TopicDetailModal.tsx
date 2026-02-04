import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Topic } from '../../lib/learningPaths';

interface TopicDetailModalProps {
    topic: Topic;
    onClose: () => void;
    onMarkAsComplete: (topicId: string) => void;
}

const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose, onMarkAsComplete }) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
            <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{topic.title}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                    </div>
                     <Button variant="ghost" size="sm" onClick={onClose} className=" -mr-2 -mt-2">
                        <Icon name="x" className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                    <CardContent>
                        <Tabs defaultValue="theory">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="theory">Teoria</TabsTrigger>
                                <TabsTrigger value="practice">Prática</TabsTrigger>
                                <TabsTrigger value="resources">Recursos</TabsTrigger>
                            </TabsList>
                            <TabsContent value="theory" className="mt-4 text-text-secondary prose prose-invert prose-sm max-w-none">
                                <p>{topic.content.theory}</p>
                            </TabsContent>
                             <TabsContent value="practice" className="mt-4">
                                <p className="text-sm text-text-secondary mb-4">{topic.content.practice.description}</p>
                                {topic.content.practice.toolLink && (
                                     <Button variant="outline">
                                        <Icon name={topic.content.practice.toolLink === 'laboratory' ? 'flask-conical' : 'puzzle'} className="h-4 w-4 mr-2" />
                                        Abrir no {topic.content.practice.toolLink === 'laboratory' ? 'Laboratory' : 'Playground'}
                                     </Button>
                                )}
                            </TabsContent>
                             <TabsContent value="resources" className="mt-4">
                                <ul className="space-y-2">
                                    {topic.content.resources.map((res, i) => (
                                        <li key={i}>
                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-sidebar/50 border border-card-border rounded-md hover:border-accent">
                                                <Icon name={res.type === 'video' ? 'play' : 'file-text'} className="h-5 w-5 text-accent flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{res.title}</p>
                                                    <p className="text-xs text-text-secondary truncate">{res.url}</p>
                                                </div>
                                                <Icon name="externalLink" className="h-4 w-4 text-text-secondary" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </div>
                <div className="p-6 pt-0">
                    <Button onClick={() => onMarkAsComplete(topic.id)} className="w-full">
                        <Icon name="checkCircle" className="h-4 w-4 mr-2" />
                        Marcar como Concluído
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TopicDetailModal;