
import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Checkbox } from '../../ui/Checkbox';
import { Switch } from '../../ui/Switch';
import { Card, CardContent } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';

interface Step24PerformanceProps {
    data: {
        lighthouse?: { performance: number; accessibility: number; bestPractices: number; seo: number };
        caching?: string[];
        imageOptimization?: boolean;
        codeSplitting?: boolean;
        lazyLoading?: boolean;
        concurrentUsers?: string;
        dataVolume?: string;
        responseTime?: string;
    };
    setData: (data: any) => void;
}

const CACHING_OPTIONS = ["Browser Caching", "CDN (Content Delivery Network)", "Server-side Caching (e.g., Redis)"];

const Step24Performance: React.FC<Step24PerformanceProps> = ({ data, setData }) => {
    // Fallback interno para evitar crash se data for undefined
    const safeData = data || { lighthouse: { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 }, caching: [] };
    
    const handleLighthouseChange = (metric: string, value: string) => {
        const lighthouse = safeData.lighthouse || { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 };
        const numericValue = parseInt(value, 10);
        setData({
            ...safeData,
            lighthouse: {
                ...lighthouse,
                [metric]: isNaN(numericValue) ? 0 : Math.max(0, Math.min(100, numericValue))
            }
        });
    };

    const handleCachingChange = (option: string) => {
        const caching = safeData.caching || [];
        const newCaching = caching.includes(option) ? caching.filter(item => item !== option) : [...caching, option];
        setData({ ...safeData, caching: newCaching });
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-4">
                <Label>12.1 e 12.2 - Escalabilidade e Volume</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Usuários simultâneos esperados?</Label>
                        <Select value={safeData.concurrentUsers} onValueChange={v => setData({ ...safeData, concurrentUsers: v })}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="<100">Até 100</SelectItem>
                                <SelectItem value="100-1k">100 - 1.000</SelectItem>
                                <SelectItem value="1k-10k">1.000 - 10.000</SelectItem>
                                <SelectItem value=">10k">Mais de 10.000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Volume de dados esperado</Label>
                        <Select value={safeData.dataVolume} onValueChange={v => setData({ ...safeData, dataVolume: v })}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="<1gb">Pequeno (&lt; 1GB)</SelectItem>
                                <SelectItem value="1gb-100gb">Médio (1GB - 100GB)</SelectItem>
                                <SelectItem value="100gb-1tb">Grande (100GB - 1TB)</SelectItem>
                                <SelectItem value=">1tb">Muito Grande (&gt; 1TB)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label>12.3 e 24 - Métricas de Performance</Label>
                <div className="space-y-2">
                    <Label>Tempo de resposta aceitável</Label>
                    <Select value={safeData.responseTime} onValueChange={v => setData({ ...safeData, responseTime: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="<100ms">Tempo real (&lt; 100ms)</SelectItem>
                            <SelectItem value="<1s">Rápido (&lt; 1s)</SelectItem>
                            <SelectItem value="1s-3s">Normal (1s - 3s)</SelectItem>
                            <SelectItem value=">3s">Pode esperar (&gt; 3s)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-text-secondary pt-2">Metas do Google Lighthouse (0-100):</p>
                <Card className="bg-sidebar/50">
                    <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['performance', 'accessibility', 'bestPractices', 'seo'].map(metric => (
                            <div key={metric} className="space-y-1.5">
                                <Label htmlFor={`lighthouse-${metric}`} className="capitalize">{metric}</Label>
                                <Input id={`lighthouse-${metric}`} type="number" min="0" max="100" value={safeData.lighthouse?.[metric as keyof typeof safeData.lighthouse] || 90} onChange={(e) => handleLighthouseChange(metric, e.target.value)} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Label>Estratégia de Cache</Label>
                <div className="grid grid-cols-1 gap-2 pt-2">
                    {CACHING_OPTIONS.map(option => (<div key={option} className="flex items-center space-x-2"><Checkbox id={`caching-${option}`} checked={(safeData.caching || []).includes(option)} onCheckedChange={() => handleCachingChange(option)} /><Label htmlFor={`caching-${option}`} className="font-normal cursor-pointer">{option}</Label></div>))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>Técnicas de Otimização</Label>
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="img-opt-switch" className="font-medium cursor-pointer">Otimização Automática de Imagem</Label><Switch id="img-opt-switch" checked={!!safeData.imageOptimization} onCheckedChange={(c) => setData({ ...safeData, imageOptimization: c })} /></div>
                    <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="split-switch" className="font-medium cursor-pointer">Code Splitting por Rota</Label><Switch id="split-switch" checked={!!safeData.codeSplitting} onCheckedChange={(c) => setData({ ...safeData, codeSplitting: c })} /></div>
                     <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="lazy-switch" className="font-medium cursor-pointer">Lazy Loading (Imagens e Componentes)</Label><Switch id="lazy-switch" checked={!!safeData.lazyLoading} onCheckedChange={(c) => setData({ ...safeData, lazyLoading: c })} /></div>
                </div>
            </div>
        </div>
    );
};

export default Step24Performance;
