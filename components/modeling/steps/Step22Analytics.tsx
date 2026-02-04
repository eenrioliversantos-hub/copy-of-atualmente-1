
import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { GoogleGenAI, Type } from "@google/genai";
import { Entity } from './Step8Entities';

interface Step22AnalyticsProps {
    data: {
        tools?: string[];
        kpis?: string[];
        events?: string[];
        dashboardWidgets?: string[];
        suggestedKpis?: string[];
        suggestedEvents?: string[];
    };
    setData: (data: any) => void;
    entities: Entity[];
    planningData: any;
}

const ANALYTICS_TOOLS = ["Google Analytics", "Mixpanel / Amplitude", "Hotjar / Clarity", "Sentry / LogRocket", "Dashboard Interno (Nexus)"];
const DASHBOARD_WIDGETS = ["KPIs Principais", "Gráficos de Tendência", "Mapa de Calor", "Alertas de Operação", "Logs em Tempo Real", "Funil de Conversão"];

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
        events: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['kpis', 'events'],
};


// FIX: Removed default assignments `data = {}` and `planningData = {}` to prevent TypeScript from inferring them as empty object types '{}', which caused property access errors for 'tools', 'dashboardWidgets', 'step1', 'suggestedKpis', and 'suggestedEvents'.
const Step22Analytics: React.FC<Step22AnalyticsProps> = ({ data, setData, entities = [], planningData }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleToolChange = (tool: string) => {
        const tools = data?.tools || [];
        const newTools = tools.includes(tool) ? tools.filter(t => t !== tool) : [...tools, tool];
        setData({ ...data, tools: newTools });
    };

    const handleWidgetChange = (widget: string) => {
        const widgets = data?.dashboardWidgets || [];
        const newWidgets = widgets.includes(widget) ? widgets.filter(w => w !== widget) : [...widgets, widget];
        setData({ ...data, dashboardWidgets: newWidgets });
    };
    
    const handleSuggest = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY do Gemini não configurada.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const entityNames = entities.map(e => e.name).join(', ');
            const objective = planningData?.step1?.mainObjective || 'aumentar a eficiência operacional';

            const prompt = `Como um analista de dados, analise um sistema com o objetivo "${objective}" e as entidades "${entityNames}". Sugira 4 KPIs estratégicos e 4 eventos de rastreamento fundamentais. Retorne JSON.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: suggestionSchema,
                },
            });
            
            const suggestions = JSON.parse(response.text);
            setData({ ...data, suggestedKpis: suggestions.kpis || [], suggestedEvents: suggestions.events || [] });

        } catch (error) {
            console.error("Erro ao sugerir KPIs:", error);
            alert("Não foi possível carregar as sugestões da IA agora.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-4">
                <Label>10.1 Ferramentas de Analytics</Label>
                <p className="text-sm text-text-secondary">Escolha os provedores de monitoramento e análise de dados.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                    {ANALYTICS_TOOLS.map(tool => (
                        <div key={tool} className="flex items-center space-x-2 p-2 border border-card-border rounded bg-sidebar/30">
                            <Checkbox id={`tool-${tool}`} checked={(data?.tools || []).includes(tool)} onCheckedChange={() => handleToolChange(tool)} />
                            <Label htmlFor={`tool-${tool}`} className="font-normal cursor-pointer text-xs">{tool}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 p-4 border border-card-border rounded-lg bg-sidebar/20">
                <Label>10.2 Widgets de Dashboard</Label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {DASHBOARD_WIDGETS.map(widget => (
                        <div key={widget} className="flex items-center space-x-2 p-2 border border-card-border rounded bg-background/50">
                            <Checkbox id={`widget-${widget}`} checked={(data?.dashboardWidgets || []).includes(widget)} onCheckedChange={() => handleWidgetChange(widget)} />
                            <Label htmlFor={`widget-${widget}`} className="font-normal cursor-pointer text-xs">{widget}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center gap-6">
                        <div className="flex-1">
                            <h4 className="font-bold flex items-center gap-2 text-accent">
                                <Icon name="sparkles" className="h-5 w-5" /> Sugestões de Inteligência de Dados
                            </h4>
                            <p className="text-sm text-text-secondary mt-1">A IA pode sugerir métricas personalizadas com base na visão do seu projeto.</p>
                        </div>
                        <Button variant="outline" onClick={handleSuggest} disabled={isLoading} className="border-accent text-accent hover:bg-accent hover:text-white">
                             <Icon name={isLoading ? 'spinner' : 'zap'} className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Gerar Estratégia
                        </Button>
                    </div>
                    
                    {(data?.suggestedKpis || data?.suggestedEvents) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-card-border/50 animate-in slide-in-from-bottom-2">
                            <div className="space-y-3">
                                <h5 className="text-sm font-bold flex items-center gap-2"><Icon name="barChart" className="h-4 w-4 text-accent" /> KPIs Sugeridos</h5>
                                <div className="space-y-2">
                                    {(data?.suggestedKpis || []).map((kpi: string, i: number) => (
                                        <div key={i} className="text-xs p-2 bg-background border border-card-border rounded">{kpi}</div>
                                    ))}
                                </div>
                            </div>
                             <div className="space-y-3">
                                <h5 className="text-sm font-bold flex items-center gap-2"><Icon name="activity" className="h-4 w-4 text-accent" /> Eventos para Rastrear</h5>
                                <div className="space-y-2">
                                    {(data?.suggestedEvents || []).map((event: string, i: number) => (
                                        <div key={i} className="text-xs p-2 bg-background border border-card-border rounded">{event}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step22Analytics;