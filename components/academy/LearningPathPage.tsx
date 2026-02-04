import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { LEARNING_PATHS } from '../../lib/learningPaths';
import { Topic, Step } from '../../lib/learningPaths';
import TopicDetailModal from './TopicDetailModal';
import { Badge } from '../ui/Badge';

interface LearningPathPageProps {
    pathId: string;
    onBack: () => void;
}

const LearningPathPage: React.FC<LearningPathPageProps> = ({ pathId, onBack }) => {
    const path = LEARNING_PATHS.find(p => p.id === pathId);
    const [completedTopics, setCompletedTopics] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    if (!path) {
        return <div>Trilha não encontrada</div>;
    }

    const handleTopicClick = (topic: Topic) => {
        setSelectedTopic(topic);
    };

    const handleMarkAsComplete = (topicId: string) => {
        if (!completedTopics.includes(topicId)) {
            setCompletedTopics([...completedTopics, topicId]);
        }
        setSelectedTopic(null);
    };

    const isStepUnlocked = (stepIndex: number): boolean => {
        if (stepIndex === 0) return true;
        const previousStep = path.steps[stepIndex - 1];
        return previousStep.topics.every(topic => completedTopics.includes(topic.id));
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            {selectedTopic && (
                <TopicDetailModal 
                    topic={selectedTopic} 
                    onClose={() => setSelectedTopic(null)}
                    onMarkAsComplete={handleMarkAsComplete}
                />
            )}
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                        Voltar para Trilhas
                    </Button>
                    <div className="flex items-center gap-3">
                        <Icon name={path.icon} className="h-6 w-6 text-accent" />
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary">{path.title}</h1>
                            <p className="text-sm text-text-secondary">{path.description}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="relative pl-8">
                        {/* Vertical line */}
                        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-card-border"></div>

                        {path.steps.map((step, stepIndex) => {
                            const unlocked = isStepUnlocked(stepIndex);
                            return (
                                <div key={step.id} className={`relative mb-12 ${!unlocked ? 'opacity-50' : ''}`}>
                                    {/* Milestone/Step marker */}
                                    <div className={`absolute -left-1.5 top-1 w-6 h-6 rounded-full flex items-center justify-center ${unlocked ? 'bg-accent' : 'bg-card-border'}`}>
                                        {unlocked ? <Icon name="check" className="h-4 w-4 text-white" /> : <Icon name="lock" className="h-4 w-4 text-text-secondary" />}
                                    </div>
                                    <div className="ml-8">
                                        <h2 className="text-xl font-bold text-accent">{step.title}</h2>
                                        <div className="mt-4 space-y-3">
                                            {step.topics.map(topic => {
                                                const isCompleted = completedTopics.includes(topic.id);
                                                return (
                                                    <div 
                                                        key={topic.id}
                                                        onClick={() => unlocked && handleTopicClick(topic)}
                                                        className={`p-4 border rounded-lg transition-all ${unlocked ? 'cursor-pointer hover:border-accent hover:bg-sidebar' : 'cursor-not-allowed'} ${isCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-sidebar/50 border-card-border'}`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-semibold">{topic.title}</h3>
                                                                <p className="text-sm text-text-secondary">{topic.description}</p>
                                                            </div>
                                                            {isCompleted && <Icon name="checkCircle" className="h-5 w-5 text-green-400 flex-shrink-0 ml-4" />}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LearningPathPage;