import React from 'react';
import { Label } from '../../ui/Label';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';

interface Step3ArchitectureProps {
  data: {
    architecture?: string;
  };
  setData: (data: any) => void;
}

const ARCHITECTURE_TYPES = [
    { value: "Monolithic", label: "Monolithic", description: "A single, unified application for all functionalities." },
    { value: "Microservices", label: "Microservices", description: "A collection of small, independent services." },
    { value: "Serverless", label: "Serverless", description: "Functions-as-a-Service (FaaS) that run on demand." },
    { value: "Hybrid", label: "Hybrid", description: "A mix of monolithic and microservices architecture." },
];

const Step3Architecture: React.FC<Step3ArchitectureProps> = ({ data, setData }) => {
  const handleChange = (value: string) => {
    setData({ ...data, architecture: value });
  };

  return (
    <div className="space-y-4">
        <Label>System Architecture</Label>
        <p className="text-sm text-text-secondary">Choose the architectural pattern for your system.</p>
        <RadioGroup
            onValueChange={handleChange}
            value={data.architecture}
            className="space-y-2 pt-2"
        >
          {ARCHITECTURE_TYPES.map(type => (
             <Label key={type.value} htmlFor={`arch-${type.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem value={type.value} id={`arch-${type.value}`} />
                    <span className="font-semibold">{type.label}</span>
                </div>
                <p className="pl-7 text-sm text-text-secondary">{type.description}</p>
            </Label>
          ))}
        </RadioGroup>
    </div>
  );
};

export default Step3Architecture;