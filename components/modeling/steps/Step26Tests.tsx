
import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Input } from '../../ui/Input';

interface Step26TestsProps {
    data: {
        levels?: string[];
        unitFramework?: string;
        integrationFramework?: string;
        e2eFramework?: string;
        coverageTarget?: number;
        documentation?: string[];
    };
    setData: (data: any) => void;
}

const TESTING_LEVELS = ["Unitários", "De Integração", "E2E (ponta a ponta)", "De Carga", "De Usabilidade"];
const UNIT_FRAMEWORKS = ["Jest", "Vitest", "Mocha"];
const E2E_FRAMEWORKS = ["Cypress", "Playwright", "Selenium"];
const DOCUMENTATION_OPTIONS = ["Manual do usuário", "Guia de administrador", "Documentação técnica (para devs)", "Documentação da API", "Diagramas de arquitetura"];

const Step26Tests: React.FC<Step26TestsProps> = ({ data, setData }) => {
    const safeData = data || { levels: [], documentation: [], coverageTarget: 80 };

    const handleCheckboxChange = (field: 'levels' | 'documentation', value: string) => {
        const currentItems = safeData[field] || [];
        const newItems = currentItems.includes(value) ? currentItems.filter((item: string) => item !== value) : [...currentItems, value];
        setData({ ...safeData, [field]: newItems });
    };
    
    const handleFrameworkChange = (field: 'unitFramework' | 'e2eFramework', value: string) => {
        setData({ ...safeData, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-4">
                <Label>14.1 Quais tipos de teste serão necessários?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {TESTING_LEVELS.map(level => (
                        <div key={level} className="flex items-center space-x-2">
                            <Checkbox id={`level-${level}`} checked={(safeData.levels || []).includes(level)} onCheckedChange={() => handleCheckboxChange('levels', level)} />
                            <Label htmlFor={`level-${level}`} className="font-normal cursor-pointer">{level}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {(safeData.levels || []).includes("Unitários") && (
                <div className="space-y-2">
                    <Label>Framework de Teste Unitário</Label>
                    <RadioGroup value={safeData.unitFramework} onValueChange={(v) => handleFrameworkChange('unitFramework', v)} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                        {UNIT_FRAMEWORKS.map(fw => (<div key={fw} className="flex items-center space-x-2"><RadioGroupItem value={fw} id={`unit-${fw}`} /><Label htmlFor={`unit-${fw}`} className="font-normal cursor-pointer">{fw}</Label></div>))}
                    </RadioGroup>
                </div>
            )}
            
            {(safeData.levels || []).includes("E2E (ponta a ponta)") && (
                 <div className="space-y-2">
                    <Label>Framework de Teste E2E</Label>
                    <RadioGroup value={safeData.e2eFramework} onValueChange={(v) => handleFrameworkChange('e2eFramework', v)} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                        {E2E_FRAMEWORKS.map(fw => (<div key={fw} className="flex items-center space-x-2"><RadioGroupItem value={fw} id={`e2e-${fw}`} /><Label htmlFor={`e2e-${fw}`} className="font-normal cursor-pointer">{fw}</Label></div>))}
                    </RadioGroup>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="coverage">14.2 Cobertura de testes desejada (%)</Label>
                <Input id="coverage" type="number" min="0" max="100" value={safeData.coverageTarget || 80} onChange={(e) => setData({ ...safeData, coverageTarget: parseInt(e.target.value, 10) || 0 })} className="w-40" />
            </div>
            
            <div className="space-y-4 pt-4 border-t border-card-border">
                <Label>19.1 Quais documentações serão necessárias?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {DOCUMENTATION_OPTIONS.map(doc => (
                        <div key={doc} className="flex items-center space-x-2">
                            <Checkbox id={`doc-${doc}`} checked={(safeData.documentation || []).includes(doc)} onCheckedChange={() => handleCheckboxChange('documentation', doc)} />
                            <Label htmlFor={`doc-${doc}`} className="font-normal cursor-pointer text-sm">{doc}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step26Tests;
