
import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { Switch } from '../../ui/Switch';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';

interface Step23SeoProps {
    data: {
        metaTags?: string[];
        sitemap?: boolean;
        robotsTxt?: boolean;
        structuredData?: { enabled: boolean; types: string[] };
        keywords?: string;
        accessibilityLevel?: string;
        accessibilityFeatures?: string[];
    };
    setData: (data: any) => void;
}

const META_TAG_OPTIONS = ["Standard (title, description)", "Open Graph (for social sharing)", "Twitter Cards"];
const STRUCTURED_DATA_TYPES = ["Organization", "Product", "Article", "Event", "FAQ"];
const ACCESSIBILITY_FEATURES = ["Navegação por teclado", "Suporte a leitor de tela", "Alto contraste", "Ajuste de tamanho de fonte", "Legendas em vídeos", "Transcrição de áudio"];

const Step23Seo: React.FC<Step23SeoProps> = ({ data, setData }) => {
    // Fallback interno seguro
    const safeData = data || { metaTags: [], accessibilityFeatures: [], structuredData: { enabled: false, types: [] } };
    
    const handleCheckboxChange = (field: 'metaTags' | 'structuredDataTypes' | 'accessibilityFeatures', value: string) => {
        let currentSelection: string[];
        
        if (field === 'metaTags') {
            currentSelection = safeData.metaTags || [];
            const newSelection = currentSelection.includes(value) ? currentSelection.filter(item => item !== value) : [...currentSelection, value];
            setData({ ...safeData, metaTags: newSelection });
        } else if (field === 'accessibilityFeatures') {
            currentSelection = safeData.accessibilityFeatures || [];
            const newSelection = currentSelection.includes(value) ? currentSelection.filter(item => item !== value) : [...currentSelection, value];
            setData({ ...safeData, accessibilityFeatures: newSelection });
        } else {
            const structuredData = safeData.structuredData || { enabled: false, types: [] };
            currentSelection = structuredData.types || [];
            const newSelection = currentSelection.includes(value) ? currentSelection.filter(item => item !== value) : [...currentSelection, value];
            setData({ ...safeData, structuredData: { ...structuredData, types: newSelection } });
        }
    };

    const handleSwitchChange = (field: 'sitemap' | 'robotsTxt' | 'structuredDataEnabled', value: boolean) => {
        if (field === 'structuredDataEnabled') {
            const structuredData = safeData.structuredData || { enabled: false, types: [] };
            setData({ ...safeData, structuredData: { ...structuredData, enabled: value } });
        } else {
            setData({ ...safeData, [field]: value });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                <h3 className="text-lg font-semibold">SEO (Search Engine Optimization)</h3>
                <div className="space-y-4">
                    <Label>Funcionalidades Básicas de SEO</Label>
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between rounded-md border border-card-border p-3">
                            <Label htmlFor="sitemap-switch" className="font-medium cursor-pointer">Geração Automática de Sitemap</Label>
                            <Switch id="sitemap-switch" checked={!!safeData.sitemap} onCheckedChange={(c) => handleSwitchChange('sitemap', c)} />
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-card-border p-3">
                            <Label htmlFor="robots-switch" className="font-medium cursor-pointer">Gerar `robots.txt`</Label>
                            <Switch id="robots-switch" checked={!!safeData.robotsTxt} onCheckedChange={(c) => handleSwitchChange('robotsTxt', c)} />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <Label>Meta Tags</Label>
                    <div className="grid grid-cols-1 gap-2 pt-2">
                        {META_TAG_OPTIONS.map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox id={`meta-${option}`} checked={(safeData.metaTags || []).includes(option)} onCheckedChange={() => handleCheckboxChange('metaTags', option)} />
                                <Label htmlFor={`meta-${option}`} className="font-normal cursor-pointer">{option}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4 p-4 border border-card-border rounded-lg">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="structured-data-switch" className="font-medium cursor-pointer">Habilitar Dados Estruturados</Label>
                        <Switch id="structured-data-switch" checked={!!safeData.structuredData?.enabled} onCheckedChange={(c) => handleSwitchChange('structuredDataEnabled', c)} />
                    </div>
                    {safeData.structuredData?.enabled && (
                        <div className="pt-3 border-t border-card-border/50">
                            <p className="text-sm text-text-secondary mb-2">Selecione os tipos:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {STRUCTURED_DATA_TYPES.map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox id={`schema-${type}`} checked={(safeData.structuredData?.types || []).includes(type)} onCheckedChange={() => handleCheckboxChange('structuredDataTypes', type)} />
                                        <Label htmlFor={`schema-${type}`} className="font-normal cursor-pointer">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             <div className="space-y-8">
                <h3 className="text-lg font-semibold">Acessibilidade</h3>
                <div className="space-y-4">
                    <Label>23.1 Nível WCAG Requerido</Label>
                    <Select value={safeData.accessibilityLevel || 'AA'} onValueChange={v => setData({ ...safeData, accessibilityLevel: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">Nível A</SelectItem>
                            <SelectItem value="AA">Nível AA (Padrão)</SelectItem>
                            <SelectItem value="AAA">Nível AAA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    <Label>23.2 Recursos</Label>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {ACCESSIBILITY_FEATURES.map(feature => (
                            <div key={feature} className="flex items-center space-x-2">
                                <Checkbox id={`a11y-${feature}`} checked={(safeData.accessibilityFeatures || []).includes(feature)} onCheckedChange={() => handleCheckboxChange('accessibilityFeatures', feature)} />
                                <Label htmlFor={`a11y-${feature}`} className="font-normal cursor-pointer text-sm">{feature}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step23Seo;
