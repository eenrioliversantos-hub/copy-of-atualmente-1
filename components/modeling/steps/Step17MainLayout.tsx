import React from 'react';
import { Label } from '../../ui/Label';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';

interface Step17MainLayoutProps {
  data: {
    navigation?: string;
    profilePosition?: string;
    theme?: string;
  };
  setData: (data: any) => void;
}

const NAVIGATION_OPTIONS = [
    { value: "Sidebar + Header", label: "Sidebar + Header", description: "Standard layout with side navigation and a top header." },
    { value: "Header Only", label: "Header Only", description: "Navigation is placed within the top header bar." },
    { value: "Minimal", label: "Minimal", description: "A focused layout with minimal navigation elements." },
];

const PROFILE_POSITIONS = [
    { value: "Header Right", label: "Header (Right)", description: "User menu in the top-right corner." },
    { value: "Header Left", label: "Header (Left)", description: "User menu in the top-left corner." },
    { value: "Sidebar Top", label: "Sidebar (Top)", description: "User menu at the top of the sidebar." },
    { value: "Sidebar Bottom", label: "Sidebar (Bottom)", description: "User menu at the bottom of the sidebar." },
];

const THEME_OPTIONS = [
    { value: "Dark", label: "Dark Theme", description: "A dark-themed interface, ideal for low-light environments." },
    { value: "Light", label: "Light Theme", description: "A classic light-themed interface for clarity." },
    { value: "Both", label: "Both (User-selectable)", description: "Includes both themes with a toggle for the user." },
];

const Step17MainLayout: React.FC<Step17MainLayoutProps> = ({ data, setData }) => {
  const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const renderOptionGroup = (title: string, description: string, field: 'navigation' | 'profilePosition' | 'theme', options: any[]) => (
    <div className="space-y-4">
        <Label>{title}</Label>
        <p className="text-sm text-text-secondary">{description}</p>
        <RadioGroup
            onValueChange={(value) => handleChange(field, value)}
            value={data[field]}
            className="space-y-2 pt-2"
        >
          {options.map(opt => (
             <Label key={opt.value} htmlFor={`${field}-${opt.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem value={opt.value} id={`${field}-${opt.value}`} />
                    <span className="font-semibold">{opt.label}</span>
                </div>
                <p className="pl-7 text-sm text-text-secondary">{opt.description}</p>
            </Label>
          ))}
        </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderOptionGroup("Main Navigation", "Select the primary navigation structure.", "navigation", NAVIGATION_OPTIONS)}
      {renderOptionGroup("User Profile Position", "Where should the user profile/menu be located?", "profilePosition", PROFILE_POSITIONS)}
      {renderOptionGroup("Initial Theme", "Choose the initial visual theme for the application.", "theme", THEME_OPTIONS)}
    </div>
  );
};

export default Step17MainLayout;
