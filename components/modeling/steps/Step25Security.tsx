
import React from 'react';
import { Label } from '../../ui/Label';
import { Switch } from '../../ui/Switch';
import { Textarea } from '../../ui/Textarea';
import { Checkbox } from '../../ui/Checkbox';

interface Step25SecurityProps {
    data: {
        https?: boolean;
        corsOrigins?: string;
        rateLimiting?: boolean;
        vulnerabilities?: string[];
        csp?: boolean;
        sensitiveData?: string[];
        compliance?: string[];
    };
    setData: (data: any) => void;
}

const VULNERABILITY_OPTIONS = [ "Cross-Site Scripting (XSS) Protection", "Cross-Site Request Forgery (CSRF) Protection", "SQL Injection Protection" ];
const SENSITIVE_DATA_OPTIONS = [ "Senhas", "Dados bancários", "CPF/CNPJ", "Dados de saúde" ];
const COMPLIANCE_OPTIONS = [ "LGPD (Brasil)", "GDPR (Europa)", "HIPAA (Saúde - EUA)", "PCI-DSS (Pagamentos)" ];

const Step25Security: React.FC<Step25SecurityProps> = ({ data, setData }) => {
    const safeData = data || { vulnerabilities: [], sensitiveData: [], compliance: [] };

    const handleCheckboxChange = (field: 'vulnerabilities' | 'sensitiveData' | 'compliance', value: string) => {
        const currentItems = safeData[field] || [];
        const newItems = currentItems.includes(value) ? currentItems.filter((item: string) => item !== value) : [...currentItems, value];
        setData({ ...safeData, [field]: newItems });
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-4">
                <Label>Medidas Gerais de Segurança</Label>
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="https-switch" className="font-medium cursor-pointer">Forçar HTTPS</Label><Switch id="https-switch" checked={!!safeData.https} onCheckedChange={(c) => setData({ ...safeData, https: c })} /></div>
                     <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="rate-limit-switch" className="font-medium cursor-pointer">Habilitar Rate Limiting</Label><Switch id="rate-limit-switch" checked={!!safeData.rateLimiting} onCheckedChange={(c) => setData({ ...safeData, rateLimiting: c })} /></div>
                    <div className="flex items-center justify-between rounded-md border border-card-border p-3"><Label htmlFor="csp-switch" className="font-medium cursor-pointer">Habilitar Content Security Policy (CSP)</Label><Switch id="csp-switch" checked={!!safeData.csp} onCheckedChange={(c) => setData({ ...safeData, csp: c })} /></div>
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="cors">Política de CORS (Origens Permitidas)</Label>
                 <p className="text-sm text-text-secondary">Especifique os domínios permitidos. Use `*` para acesso público, ou liste domínios separados por vírgulas.</p>
                <Textarea id="cors" placeholder="Ex: https://app.mydomain.com" value={safeData.corsOrigins || ''} onChange={e => setData({...safeData, corsOrigins: e.target.value})} />
            </div>

            <div className="space-y-4"><Label>Proteções Contra Vulnerabilidades Comuns</Label><div className="grid grid-cols-1 gap-2 pt-2">{VULNERABILITY_OPTIONS.map(option => (<div key={option} className="flex items-center space-x-2"><Checkbox id={`vuln-${option}`} checked={(safeData.vulnerabilities || []).includes(option)} onCheckedChange={() => handleCheckboxChange('vulnerabilities', option)} /><Label htmlFor={`vuln-${option}`} className="font-normal cursor-pointer">{option}</Label></div>))}</div></div>
            
            <div className="space-y-4"><Label>8.4 Dados sensíveis serão armazenados?</Label><div className="grid grid-cols-2 gap-4 pt-2">{SENSITIVE_DATA_OPTIONS.map(option => (<div key={option} className="flex items-center space-x-2"><Checkbox id={`sensitive-${option}`} checked={(safeData.sensitiveData || []).includes(option)} onCheckedChange={() => handleCheckboxChange('sensitiveData', option)} /><Label htmlFor={`sensitive-${option}`} className="font-normal cursor-pointer">{option}</Label></div>))}</div></div>

            <div className="space-y-4"><Label>18.1 Conformidade e Legal</Label><p className="text-sm text-text-secondary">O sistema deve estar em conformidade com alguma regulamentação específica?</p><div className="grid grid-cols-2 gap-4 pt-2">{COMPLIANCE_OPTIONS.map(option => (<div key={option} className="flex items-center space-x-2"><Checkbox id={`compliance-${option}`} checked={(safeData.compliance || []).includes(option)} onCheckedChange={() => handleCheckboxChange('compliance', option)} /><Label htmlFor={`compliance-${option}`} className="font-normal cursor-pointer">{option}</Label></div>))}</div></div>
        </div>
    );
};

export default Step25Security;
