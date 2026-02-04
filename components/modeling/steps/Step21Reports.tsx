
import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Entity, Field } from './Step8Entities';
import { Card, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Checkbox } from '../../ui/Checkbox';
import { GoogleGenAI, Type } from "@google/genai";

// Interface for a single report
interface Report {
    id: string;
    name: string;
    description: string;
    entityId: string;
    metrics: string[];
    groupBy: string[];
    filters: string[];
    visualization: string;
    exportFormats: string[];
}

// Props for the step component
interface Step21ReportsProps {
    data: {
        reports?: Report[];
    };
    setData: (data: any) => void;
    entities: Entity[];
}

// Pre-defined options for dropdowns
const VISUALIZATION_OPTIONS = ["Table", "Bar Chart", "Line Chart", "Pie Chart"];
const EXPORT_FORMAT_OPTIONS = ["PDF", "CSV", "Excel"];
const AGGREGATION_FUNCTIONS: Record<string, string[]> = {
    'Integer': ['SUM', 'AVG', 'MIN', 'MAX'],
    'Float': ['SUM', 'AVG', 'MIN', 'MAX'],
};

const reportSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        reports: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "O nome do relatório. Ex: Vendas Totais por Período" },
                    description: { type: Type.STRING, description: "Uma breve descrição do relatório." },
                    entityName: { type: Type.STRING, description: "O nome da entidade principal para o relatório." },
                },
                required: ['name', 'description', 'entityName'],
            },
        },
    },
    required: ['reports'],
};


// The component itself
const Step21Reports: React.FC<Step21ReportsProps> = ({ data, setData, entities }) => {
    const reports = data.reports || [];
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const handleAddReport = () => {
        const newReport: Report = {
            id: new Date().getTime().toString(), name: '', description: '', entityId: '',
            metrics: [], groupBy: [], filters: [], visualization: 'Table', exportFormats: [],
        };
        setData({ ...data, reports: [...reports, newReport] });
    };

    const handleSuggestReports = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY do Gemini não configurada.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const entityNames = entities.map(e => e.name).join(', ');
            const prompt = `Com base nas seguintes entidades: "${entityNames}", sugira 3 relatórios de negócio úteis. Para cada um, forneça 'name', 'description' e o 'entityName' principal. Retorne um objeto JSON.`;
            
            // Corrected model name to gemini-3-flash-preview
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: reportSuggestionSchema,
                },
            });

            const suggestions = JSON.parse(response.text).reports || [];
            const newReports = suggestions.map((s: any) => {
                const entity = entities.find(e => e.name.toLowerCase() === s.entityName.toLowerCase());
                return {
                    ...s,
                    id: Date.now().toString() + Math.random(),
                    entityId: entity?.id || '',
                    metrics: [], groupBy: [], filters: [], visualization: 'Table', exportFormats: []
                };
            });
            setData({ ...data, reports: [...reports, ...newReports] });

        } catch (error) {
            console.error("Erro ao sugerir relatórios:", error);
            alert("Falha ao obter sugestões da IA.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveReport = (id: string) => setData({ ...data, reports: reports.filter(r => r.id !== id) });
    const handleChange = (id: string, field: keyof Report, value: any) => setData({ ...data, reports: reports.map(r => r.id === id ? { ...r, [field]: value } : r) });

    const handleMultiSelectChange = (reportId: string, field: 'metrics' | 'groupBy' | 'filters' | 'exportFormats', value: string) => {
        const report = reports.find(r => r.id === reportId);
        if (!report) return;
        const currentSelection = report[field] || [];
        const newSelection = currentSelection.includes(value) ? currentSelection.filter(item => item !== value) : [...currentSelection, value];
        handleChange(reportId, field, newSelection);
    };

    const getFieldsForEntity = (entityId: string): Field[] => entities.find(e => e.id === entityId)?.fields || [];
    const getMetricOptions = (entityId: string): string[] => {
        const fields = getFieldsForEntity(entityId);
        const options: string[] = ['COUNT(*)'];
        fields.forEach(field => {
            const aggs = AGGREGATION_FUNCTIONS[field.type] || [];
            aggs.forEach(agg => options.push(`${agg}(${field.name})`));
        });
        return options;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Label>Reports</Label>
                    <p className="text-sm text-text-secondary">Define the essential reports the system needs to generate.</p>
                </div>
                <Button variant="outline" onClick={handleSuggestReports} disabled={isLoading}>
                    <Icon name={isLoading ? 'spinner' : 'sparkles'} className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Sugerir com IA
                </Button>
            </div>

            <div className="space-y-4">
                {reports.map((report) => {
                    const selectedEntityFields = getFieldsForEntity(report.entityId);
                    const metricOptions = getMetricOptions(report.entityId);
                    return (
                        <Card key={report.id} className="bg-sidebar/50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5"><Label>Report Name</Label><Input placeholder="e.g., Sales by Region" value={report.name} onChange={e => handleChange(report.id, 'name', e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Description</Label><Input placeholder="Briefly describe this report" value={report.description} onChange={e => handleChange(report.id, 'description', e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Primary Entity</Label><Select value={report.entityId} onValueChange={v => handleChange(report.id, 'entityId', v)}><SelectTrigger><SelectValue placeholder="Select entity..." /></SelectTrigger><SelectContent>{entities.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select></div>
                                        </div>
                                        <div className="space-y-2"><Label>Metrics / Columns</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 border border-card-border rounded-md max-h-40 overflow-y-auto">{report.entityId ? metricOptions.map(option => (<div key={option} className="flex items-center space-x-2"><Checkbox id={`metric-${report.id}-${option}`} checked={report.metrics.includes(option)} onChange={() => handleMultiSelectChange(report.id, 'metrics', option)} /><Label htmlFor={`metric-${report.id}-${option}`} className="font-normal text-sm cursor-pointer">{option}</Label></div>)) : <p className="col-span-full text-center text-xs text-text-secondary">Select an entity first</p>}</div></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>Group By</Label><div className="grid grid-cols-2 gap-2 p-2 border border-card-border rounded-md max-h-32 overflow-y-auto">{report.entityId ? selectedEntityFields.map(field => (<div key={field.id} className="flex items-center space-x-2"><Checkbox id={`group-${report.id}-${field.name}`} checked={(report.groupBy || []).includes(field.name)} onChange={() => handleMultiSelectChange(report.id, 'groupBy', field.name)} /><Label htmlFor={`group-${report.id}-${field.name}`} className="font-normal text-sm cursor-pointer">{field.name}</Label></div>)) : <p className="col-span-full text-center text-xs text-text-secondary">Select an entity first</p>}</div></div><div className="space-y-2"><Label>Available Filters</Label><div className="grid grid-cols-2 gap-2 p-2 border border-card-border rounded-md max-h-32 overflow-y-auto">{report.entityId ? selectedEntityFields.map(field => (<div key={field.id} className="flex items-center space-x-2"><Checkbox id={`filter-${report.id}-${field.name}`} checked={(report.filters || []).includes(field.name)} onChange={() => handleMultiSelectChange(report.id, 'filters', field.name)} /><Label htmlFor={`filter-${report.id}-${field.name}`} className="font-normal text-sm cursor-pointer">{field.name}</Label></div>)) : <p className="col-span-full text-center text-xs text-text-secondary">Select an entity first</p>}</div></div></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1.5"><Label>Default Visualization</Label><Select value={report.visualization} onValueChange={v => handleChange(report.id, 'visualization', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{VISUALIZATION_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Export Formats</Label><div className="flex gap-4 pt-2">{EXPORT_FORMAT_OPTIONS.map(opt => (<div key={opt} className="flex items-center space-x-2"><Checkbox id={`export-${report.id}-${opt}`} checked={(report.exportFormats || []).includes(opt)} onChange={() => handleMultiSelectChange(report.id, 'exportFormats', opt)} /><Label htmlFor={`export-${report.id}-${opt}`} className="font-normal text-sm cursor-pointer">{opt}</Label></div>))}</div></div></div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveReport(report.id)}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            
            <Button variant="outline" onClick={handleAddReport}>
                <Icon name="plus" className="h-4 w-4 mr-2" />
                Add Report
            </Button>
        </div>
    );
};

export default Step21Reports;
