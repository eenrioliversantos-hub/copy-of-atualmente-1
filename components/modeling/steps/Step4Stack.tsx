
import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';

interface Step4StackProps {
  data: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
  };
  setData: (data: any) => void;
}

const STACK_OPTIONS = {
    frontend: ["React", "Vue", "Angular", "Svelte", "HTML/CSS/JS"],
    backend: ["Node.js (Express)", "Python (Django/Flask)", "Java (Spring)", "Ruby on Rails", "Go"],
    database: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Firebase"],
};

const Step4Stack: React.FC<Step4StackProps> = ({ data = {}, setData }) => {
  
  const handleCheckboxChange = (category: 'frontend' | 'backend' | 'database', option: string) => {
    const currentSelection = data[category] || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter(item => item !== option)
      : [...currentSelection, option];
    setData({ ...data, [category]: newSelection });
  };

  const renderCheckboxes = (category: 'frontend' | 'backend' | 'database', title: string) => (
     <div className="space-y-2">
        <h4 className="font-medium text-text-primary">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {STACK_OPTIONS[category].map(option => (
                <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                        id={`${category}-${option}`}
                        checked={(data[category] || []).includes(option)}
                        onChange={() => handleCheckboxChange(category, option)}
                    />
                    <Label htmlFor={`${category}-${option}`} className="font-normal cursor-pointer">{option}</Label>
                </div>
            ))}
        </div>
      </div>
  );

  return (
    <div className="space-y-8">
        <div>
            <Label>Technology Stack</Label>
            <p className="text-sm text-text-secondary">Select the main technologies you plan to use. You can select multiple options for each category.</p>
        </div>
        {renderCheckboxes('frontend', 'Frontend')}
        {renderCheckboxes('backend', 'Backend')}
        {renderCheckboxes('database', 'Database')}
    </div>
  );
};

export default Step4Stack;
