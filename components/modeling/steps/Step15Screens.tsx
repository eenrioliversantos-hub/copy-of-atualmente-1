
import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';
import { GoogleGenAI, Type } from "@google/genai";
import { Entity } from './Step8Entities';

interface Screen {
    id: string;
    path: string;
    description: string;
    layout: string;
}

interface Step15ScreensProps {
  data: {
    screens?: Screen[];
  };
  setData: (data: any) => void;
  entities: Entity[];
  onSetPreview: (screenId: string) => void;
}

const LAYOUT_OPTIONS = ["Standard (Sidebar + Header)", "Full Page", "Form Focused", "Dashboard"];

const screenSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    screens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          path: { type: Type.STRING, description: "O caminho da URL, ex: /products" },
          description: { type: Type.STRING, description: "Uma breve descrição da tela." },
          layout: { type: Type.STRING, description: `Um dos seguintes layouts: ${LAYOUT_OPTIONS.join(', ')}` },
        },
        required: ['path', 'description', 'layout'],
      },
    },
  },
  required: ['screens'],
};

const Step15Screens: React.FC<Step15ScreensProps> = ({ data, setData, entities, onSetPreview }) => {
  const screens = data.screens || [];
  const [isLoading, setIsLoading] = useState(false);

  const handleAddScreen = () => {
    const newScreen: Screen = {
      id: new Date().getTime().toString(),
      path: '',
      description: '',
      layout: 'Standard (Sidebar + Header)',
    };
    setData({ ...data, screens: [...screens, newScreen] });
  };

  const handleRemoveScreen = (id: string) => {
    setData({ ...data, screens: screens.filter(s => s.id !== id) });
  };

  const handleChange = (id: string, field: keyof Screen, value: string) => {
    const updatedScreens = screens.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setData({ ...data, screens: updatedScreens });
  };
  
  const handleSuggestScreens = async () => {
    setIsLoading(true);
    try {
      if (!process.env.API_KEY) throw new Error("API_KEY do Gemini não configurada.");
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const entityNames = entities.map(e => e.name).join(', ');

      const prompt = `Com base nas seguintes entidades de um sistema: "${entityNames}", sugira as 3 telas CRUD mais importantes (listagem, detalhe/edição, criação). Para cada tela, forneça o 'path', uma 'description' e um 'layout' adequado a partir da lista: ${LAYOUT_OPTIONS.join(', ')}. Retorne um objeto JSON.`;

      // Corrected model name to gemini-3-flash-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: screenSuggestionSchema,
        },
      });

      const suggestions = JSON.parse(response.text).screens || [];
      const newScreens = suggestions.map((s: any) => ({ ...s, id: Date.now().toString() + Math.random() }));
      
      setData({ ...data, screens: [...screens, ...newScreens] });

    } catch (error) {
      console.error("Erro ao sugerir telas:", error);
      alert("Falha ao obter sugestões da IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <Label>Telas / Páginas</Label>
           <p className="text-sm text-text-secondary">Defina as principais telas ou páginas da sua aplicação.</p>
         </div>
         {entities.length > 0 && (
          <Button variant="outline" onClick={handleSuggestScreens} disabled={isLoading}>
            <Icon name={isLoading ? 'spinner' : 'sparkles'} className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sugerir com IA
          </Button>
         )}
       </div>
      
      <div className="space-y-4">
        {screens.map((screen) => (
          <Card key={screen.id} className="bg-sidebar/50">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5 md:col-span-1">
                                <Label htmlFor={`path-${screen.id}`}>Path</Label>
                                <Input
                                    id={`path-${screen.id}`}
                                    placeholder="e.g., /dashboard"
                                    value={screen.path}
                                    onChange={e => handleChange(screen.id, 'path', e.target.value)}
                                />
                            </div>
                             <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor={`description-${screen.id}`}>Descrição</Label>
                                <Input
                                    id={`description-${screen.id}`}
                                    placeholder="e.g., Main view after login"
                                    value={screen.description}
                                    onChange={e => handleChange(screen.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Layout Template</Label>
                            <Select value={screen.layout} onValueChange={v => handleChange(screen.id, 'layout', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LAYOUT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="flex flex-col gap-2 pt-6">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveScreen(screen.id)}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => onSetPreview(screen.id)}><Icon name="eye" className="h-4 w-4 text-accent" /></Button>
                     </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddScreen}>
        <Icon name="plus" className="h-4 w-4 mr-2" />
        Adicionar Tela
      </Button>
    </div>
  );
};

export default Step15Screens;
