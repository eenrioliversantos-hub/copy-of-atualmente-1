import React from 'react';
import { Label } from '../../ui/Label';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Checkbox } from '../../ui/Checkbox';

interface Step2SystemTypeProps {
  data: {
    systemType?: string;
    nativeMobile?: 'yes_both' | 'yes_ios' | 'yes_android' | 'no_responsive' | 'no_pwa';
    mobileFeatures?: string[];
  };
  setData: (data: any) => void;
}

const SYSTEM_TYPES = [
    { value: "Web Application", label: "Web Application", description: "System accessible via a web browser." },
    { value: "Mobile App", label: "Mobile App", description: "Native application for iOS and/or Android." },
    { value: "Desktop App", label: "Desktop App", description: "Application for Windows, macOS, or Linux." },
    { value: "API/Backend", label: "API / Backend", description: "A service that provides data to other applications." },
    { value: "Hybrid", label: "Hybrid", description: "A combination of the above types." },
];

const MOBILE_FEATURES_OPTIONS = [
    "Funcionar offline", "Push notifications", "Acesso à câmera", "Acesso à galeria", "Geolocalização", "Biometria (Face ID/Touch ID)"
];

const Step2SystemType: React.FC<Step2SystemTypeProps> = ({ data, setData }) => {
  const handleChange = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };
  
  const handleMobileFeatureChange = (option: string) => {
    const currentFeatures = data.mobileFeatures || [];
    const newFeatures = currentFeatures.includes(option)
      ? currentFeatures.filter(item => item !== option)
      : [...currentFeatures, option];
    handleChange('mobileFeatures', newFeatures);
  };

  const showMobileOptions = data.systemType === 'Mobile App' || data.systemType === 'Hybrid' || data.systemType === 'Web Application';

  return (
    <div className="space-y-8">
        <div className="space-y-4">
            <Label>24.1 Tipo de Sistema</Label>
            <p className="text-sm text-text-secondary">Selecione o tipo primário de sistema que você está construindo.</p>
            <RadioGroup onValueChange={(v) => handleChange('systemType', v)} value={data.systemType} className="space-y-2 pt-2">
              {SYSTEM_TYPES.map(type => (
                <Label key={type.value} htmlFor={`type-${type.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                        <span className="font-semibold">{type.label}</span>
                    </div>
                    <p className="pl-7 text-sm text-text-secondary">{type.description}</p>
                </Label>
              ))}
            </RadioGroup>
        </div>

        {showMobileOptions && (
            <div className="space-y-4 p-4 border border-card-border rounded-lg animate-in fade-in-50">
                <Label>24.2 Haverá versão mobile?</Label>
                <RadioGroup onValueChange={(v) => handleChange('nativeMobile', v)} value={data.nativeMobile} className="space-y-2 pt-2">
                    <Label htmlFor="mobile-yes-both" className="flex items-center p-3 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors"><RadioGroupItem value="yes_both" id="mobile-yes-both" className="mr-3" /><span>Sim, para iOS e Android</span></Label>
                    <Label htmlFor="mobile-no-pwa" className="flex items-center p-3 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors"><RadioGroupItem value="no_pwa" id="mobile-no-pwa" className="mr-3" /><span>Sim, como PWA (Progressive Web App)</span></Label>
                    <Label htmlFor="mobile-no-responsive" className="flex items-center p-3 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors"><RadioGroupItem value="no_responsive" id="mobile-no-responsive" className="mr-3" /><span>Não, apenas web responsivo</span></Label>
                </RadioGroup>
            </div>
        )}

         {showMobileOptions && data.nativeMobile?.startsWith('yes') && (
            <div className="space-y-4 p-4 border border-card-border rounded-lg animate-in fade-in-50">
                <Label>24.3 Recursos mobile específicos</Label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {MOBILE_FEATURES_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-feat-${option}`} checked={(data.mobileFeatures || []).includes(option)} onCheckedChange={() => handleMobileFeatureChange(option)} />
                            <Label htmlFor={`mobile-feat-${option}`} className="font-normal cursor-pointer text-sm">{option}</Label>
                        </div>
                    ))}
                </div>
            </div>
         )}
    </div>
  );
};

export default Step2SystemType;
