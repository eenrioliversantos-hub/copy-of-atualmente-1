import React from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Input } from '../../ui/Input';

interface ThirdPartyApi {
    id: string;
    name: string;
    baseUrl: string;
    authType: 'API Key' | 'OAuth2' | 'None';
}

interface StepThirdPartyApisProps {
  data: {
    apis?: ThirdPartyApi[];
  };
  setData: (data: any) => void;
}

const Step_ThirdPartyApis: React.FC<StepThirdPartyApisProps> = ({ data, setData }) => {
  const apis = data.apis || [];

  const handleAdd = () => {
    const newApi: ThirdPartyApi = {
      id: Date.now().toString(),
      name: '',
      baseUrl: '',
      authType: 'API Key',
    };
    setData({ ...data, apis: [...apis, newApi] });
  };

  const handleRemove = (id: string) => {
    setData({ ...data, apis: apis.filter((api: ThirdPartyApi) => api.id !== id) });
  };

  const handleChange = (id: string, field: keyof ThirdPartyApi, value: string) => {
    const updated = apis.map((api: ThirdPartyApi) => (api.id === id ? { ...api, [field]: value } : api));
    setData({ ...data, apis: updated });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {apis.map((api: ThirdPartyApi) => (
          <div key={api.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Nome do Serviço</Label><Input placeholder="Ex: Google Maps API" value={api.name} onChange={e => handleChange(api.id, 'name', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Tipo de Autenticação</Label><Select value={api.authType} onValueChange={(v: any) => handleChange(api.id, 'authType', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="API Key">API Key</SelectItem><SelectItem value="OAuth2">OAuth 2.0</SelectItem><SelectItem value="None">Nenhuma</SelectItem></SelectContent></Select></div>
                 </div>
                 <div className="space-y-1.5"><Label>URL Base</Label><Input type="url" placeholder="https://maps.googleapis.com/maps/api" value={api.baseUrl} onChange={e => handleChange(api.id, 'baseUrl', e.target.value)} /></div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(api.id)}><Icon name="trash" className="h-4 w-4 text-red-500"/></Button>
            </div>
          </div>
        ))}
         <Button variant="outline" onClick={handleAdd} className="w-full">
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Adicionar Integração com API
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step_ThirdPartyApis;