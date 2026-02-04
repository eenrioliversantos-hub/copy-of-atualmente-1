
import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';

interface Step5AuthenticationProps {
  data: {
    providers?: string[];
    sessionManagement?: string;
    passwordRecovery?: 'email' | 'sms' | 'both' | 'none';
  };
  setData: (data: any) => void;
}

const AUTH_PROVIDERS = ["E-mail e senha", "Login social (Google, Facebook, etc.)", "Autenticação de 2 fatores (2FA)", "Biometria", "SSO (Single Sign-On)", "Magic Link (login sem senha)"];

const SESSION_MANAGEMENT = [
    { value: "JWT", label: "JWT (JSON Web Tokens)", description: "Tokens sem estado enviados no cabeçalho das requisições." },
    { value: "Cookies", label: "Sessões de Servidor", description: "ID de sessão armazenado em cookie, dados no servidor." },
];

// FIX: Removed default assignment `data = {}` to prevent TypeScript from inferring 'data' as an empty object type '{}', which caused property access errors for 'providers', 'sessionManagement', and 'passwordRecovery'.
const Step5Authentication: React.FC<Step5AuthenticationProps> = ({ data, setData }) => {
  
  const handleProviderChange = (provider: string) => {
    const currentProviders = data?.providers || [];
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(item => item !== provider)
      : [...currentProviders, provider];
    setData({ ...data, providers: newProviders });
  };
  
  const handleSessionChange = (value: string) => {
    setData({ ...data, sessionManagement: value });
  };
  
  const handleRecoveryChange = (value: string) => {
    setData({ ...data, passwordRecovery: value as any });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="space-y-4">
        <Label>8.1 Métodos de Autenticação</Label>
        <p className="text-sm text-text-secondary">Selecione os métodos que os usuários podem usar para entrar.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {AUTH_PROVIDERS.map(provider => (
                <div key={provider} className="flex items-center space-x-2 p-2 border border-card-border rounded hover:bg-sidebar/50 transition-colors">
                    <Checkbox
                        id={`provider-${provider}`}
                        checked={(data?.providers || []).includes(provider)}
                        onCheckedChange={() => handleProviderChange(provider)}
                    />
                    <Label htmlFor={`provider-${provider}`} className="font-normal cursor-pointer flex-1">{provider}</Label>
                </div>
            ))}
        </div>
      </div>

       <div className="space-y-4">
        <Label>Gerenciamento de Sessão</Label>
        <p className="text-sm text-text-secondary">Escolha como as sessões do usuário serão tratadas após o login.</p>
         <RadioGroup
            onValueChange={handleSessionChange}
            value={data?.sessionManagement || 'JWT'}
            className="space-y-2 pt-2"
        >
          {SESSION_MANAGEMENT.map(type => (
            <Label key={type.value} htmlFor={`session-${type.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem value={type.value} id={`session-${type.value}`} />
                    <span className="font-semibold">{type.label}</span>
                </div>
                <p className="pl-7 text-sm text-text-secondary">{type.description}</p>
            </Label>
          ))}
        </RadioGroup>
      </div>

       <div className="space-y-4">
        <Label>8.2 Recuperação de Senha</Label>
        <p className="text-sm text-text-secondary">Como os usuários poderão recuperar suas senhas?</p>
         <RadioGroup
            onValueChange={handleRecoveryChange}
            value={data?.passwordRecovery || 'email'}
            className="flex flex-wrap gap-x-6 gap-y-2 pt-2"
        >
            <div className="flex items-center space-x-2"><RadioGroupItem value="email" id="rec-email" /><Label htmlFor="rec-email" className="cursor-pointer">Por e-mail</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="sms" id="rec-sms" /><Label htmlFor="rec-sms" className="cursor-pointer">Por SMS</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="rec-both" /><Label htmlFor="rec-both" className="cursor-pointer">Ambos</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="rec-none" /><Label htmlFor="rec-none" className="cursor-pointer">Não haverá</Label></div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step5Authentication;