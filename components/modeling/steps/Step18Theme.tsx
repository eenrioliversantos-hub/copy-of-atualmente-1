import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';

interface Step18ThemeProps {
  data: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    baseSpacing?: string; // in pixels
    borderRadius?: string; // in rem
  };
  setData: (data: any) => void;
}

const FONT_OPTIONS = ["Inter", "Poppins", "Roboto", "Lato", "Montserrat"];
const SPACING_OPTIONS = ["4", "8", "12", "16"]; // in pixels
const BORDER_RADIUS_OPTIONS = ["0", "0.25", "0.5", "0.75", "1"]; // in rem

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="flex items-center gap-2 p-2 border border-card-border rounded-md bg-sidebar">
            <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                style={{ appearance: 'none', padding: 0 }}
            />
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="flex-1 bg-transparent border-none focus-visible:ring-0"
            />
        </div>
    </div>
);

const Step18Theme: React.FC<Step18ThemeProps> = ({ data, setData }) => {
  const handleChange = (field: keyof Step18ThemeProps['data'], value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
        <div>
            <Label>Theme / Design System</Label>
            <p className="text-sm text-text-secondary">Define the core visual elements of your application.</p>
        </div>

        <div className="space-y-4">
            <h4 className="font-semibold">Color Palette</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ColorInput label="Primary / Accent" value={data.primaryColor || '#38bdf8'} onChange={v => handleChange('primaryColor', v)} />
                <ColorInput label="Background" value={data.backgroundColor || '#0f172a'} onChange={v => handleChange('backgroundColor', v)} />
                <ColorInput label="Primary Text" value={data.textColor || '#f8fafc'} onChange={v => handleChange('textColor', v)} />
            </div>
        </div>
        
        <div className="space-y-4">
            <h4 className="font-semibold">Typography</h4>
            <div className="space-y-1.5">
                <Label>Primary Font Family</Label>
                <Select value={data.fontFamily} onValueChange={v => handleChange('fontFamily', v)}>
                    <SelectTrigger><SelectValue placeholder="Select a font..." /></SelectTrigger>
                    <SelectContent>
                        {FONT_OPTIONS.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="font-semibold">Spacing & Borders</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <Label>Base Spacing Unit</Label>
                    <Select value={data.baseSpacing} onValueChange={v => handleChange('baseSpacing', v)}>
                        <SelectTrigger><SelectValue placeholder="Select spacing..." /></SelectTrigger>
                        <SelectContent>
                            {SPACING_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}px</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1.5">
                    <Label>Base Border Radius</Label>
                     <Select value={data.borderRadius} onValueChange={v => handleChange('borderRadius', v)}>
                        <SelectTrigger><SelectValue placeholder="Select radius..." /></SelectTrigger>
                        <SelectContent>
                            {BORDER_RADIUS_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}rem</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Step18Theme;