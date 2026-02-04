import React, { useState } from 'react';
import { ProductionPhase, Step, SubStep } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';

interface PhasePageProps {
  phase: ProductionPhase;
}

const PhasePage: React.FC<PhasePageProps> = ({ phase }) => {
    const [completedSubSteps, setCompletedSubSteps] = useState<Record<string, boolean>>({});

    const handleSubStepToggle = (subStepId: string) => {
        setCompletedSubSteps(prev => ({
            ...prev,
            [subStepId]: !prev[subStepId]
        }));
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Icon name={phase.icon} className="h-8 w-8 text-accent" />
                    <h2 className="text-3xl font-bold">{phase.title}</h2>
                </div>
                <p className="text-text-secondary max-w-2xl">{phase.description}</p>
            </div>

            <div className="space-y-6">
                {phase.steps.map((step, index) => {
                     const totalSubSteps = step.subSteps.length;
                     const completedCount = step.subSteps.filter(ss => completedSubSteps[ss.id]).length;
                     const progress = totalSubSteps > 0 ? (completedCount / totalSubSteps) * 100 : 0;

                    return (
                        <Card key={step.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-3">
                                            <span className="text-accent font-bold">{index + 1}.</span>
                                            {step.title}
                                        </CardTitle>
                                        <p className="text-sm text-text-secondary mt-1 ml-7">{step.description}</p>
                                    </div>
                                    {totalSubSteps > 0 && (
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-sm font-semibold">{Math.round(progress)}%</p>
                                            <p className="text-xs text-text-secondary">{completedCount} / {totalSubSteps}</p>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            {step.subSteps.length > 0 && (
                                <CardContent>
                                    <Separator className="mb-4" />
                                    <div className="space-y-3">
                                        {step.subSteps.map(subStep => (
                                            <div 
                                                key={subStep.id} 
                                                className="flex items-start space-x-3 p-3 bg-sidebar/50 rounded-md border border-card-border"
                                            >
                                                <Checkbox 
                                                    id={subStep.id} 
                                                    checked={!!completedSubSteps[subStep.id]}
                                                    onChange={() => handleSubStepToggle(subStep.id)}
                                                    className="mt-1"
                                                />
                                                <Label 
                                                    htmlFor={subStep.id} 
                                                    className={`flex-1 text-sm cursor-pointer ${completedSubSteps[subStep.id] ? 'line-through text-text-secondary' : 'text-text-primary'}`}
                                                >
                                                    <span className="font-medium">{subStep.title}</span>
                                                    {subStep.details && <p className="text-xs text-text-secondary font-normal">{subStep.details}</p>}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PhasePage;