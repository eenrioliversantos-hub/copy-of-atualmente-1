import React from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Input } from '../../ui/Input';

interface Webhook {
    id: string;
    name: string;
    direction: 'Inbound' | 'Outbound';
    event: string;
    url: string;
    method: 'POST' | 'PUT';
}

interface StepWebhooksProps {
  data: {
    webhooks?: Webhook[];
  };
  setData: (data: any) => void;
}

const Step_Webhooks: React.FC<StepWebhooksProps> = ({ data, setData }) => {
  const webhooks = data.webhooks || [];

  const handleAdd = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: '',
      direction: 'Outbound',
      event: '',
      url: '',
      method: 'POST',
    };
    setData({ ...data, webhooks: [...webhooks, newWebhook] });
  };

  const handleRemove = (id: string) => {
    setData({ ...data, webhooks: webhooks.filter((wh: Webhook) => wh.id !== id) });
  };

  const handleChange = (id: string, field: keyof Webhook, value: string) => {
    const updated = webhooks.map((wh: Webhook) => (wh.id === id ? { ...wh, [field]: value } : wh));
    setData({ ...data, webhooks: updated });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {webhooks.map((wh: Webhook) => (
          <div key={wh.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Nome</Label><Input placeholder="Ex: Notificar Slack" value={wh.name} onChange={e => handleChange(wh.id, 'name', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Direção</Label><Select value={wh.direction} onValueChange={(v: any) => handleChange(wh.id, 'direction', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Outbound">Saída (Outbound)</SelectItem><SelectItem value="Inbound">Entrada (Inbound)</SelectItem></SelectContent></Select></div>
                 </div>
                 <div className="space-y-1.5"><Label>URL</Label><Input type="url" placeholder="https://hooks.slack.com/services/..." value={wh.url} onChange={e => handleChange(wh.id, 'url', e.target.value)} /></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Evento Gatilho</Label><Input placeholder="Ex: `order.created`" value={wh.event} onChange={e => handleChange(wh.id, 'event', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Método</Label><Select value={wh.method} onValueChange={(v: any) => handleChange(wh.id, 'method', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="POST">POST</SelectItem><SelectItem value="PUT">PUT</SelectItem></SelectContent></Select></div>
                 </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(wh.id)}><Icon name="trash" className="h-4 w-4 text-red-500"/></Button>
            </div>
          </div>
        ))}
         <Button variant="outline" onClick={handleAdd} className="w-full">
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Adicionar Configuração de Webhook
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step_Webhooks;