import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Textarea } from '../../ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';

interface Integration {
    id: string;
    service: string;
    type: string;
    direction: 'Inbound' | 'Outbound';
    purpose: string;
}

interface Step14IntegrationsProps {
  data: {
    integrations?: Integration[];
  };
  setData: (data: any) => void;
}

const COMMON_SERVICES = ["Stripe", "SendGrid", "Twilio", "AWS S3", "Google Maps", "Slack", "Other"];
const INTEGRATION_TYPES = ["Payment", "Email", "SMS/Messaging", "Storage", "Geolocation", "Notification", "Analytics"];

const Step14Integrations: React.FC<Step14IntegrationsProps> = ({ data, setData }) => {
  const integrations = data.integrations || [];

  const handleAddIntegration = () => {
    const newIntegration: Integration = {
      id: new Date().getTime().toString(),
      service: '',
      type: 'Payment',
      direction: 'Outbound',
      purpose: '',
    };
    setData({ ...data, integrations: [...integrations, newIntegration] });
  };

  const handleRemoveIntegration = (id: string) => {
    setData({ ...data, integrations: integrations.filter(i => i.id !== id) });
  };

  const handleChange = (id: string, property: keyof Integration, value: string) => {
    const updatedIntegrations = integrations.map(i =>
      i.id === id ? { ...i, [property]: value } : i
    );
    setData({ ...data, integrations: updatedIntegrations });
  };

  return (
    <div className="space-y-6">
       <div>
         <Label>Third-Party Integrations</Label>
         <p className="text-sm text-text-secondary">List any external services your system needs to connect to.</p>
       </div>
      
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="bg-sidebar/50">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label>Service</Label>
                            <Select value={integration.service} onValueChange={v => handleChange(integration.id, 'service', v)}>
                                <SelectTrigger><SelectValue placeholder="Select a service..."/></SelectTrigger>
                                <SelectContent>
                                    {COMMON_SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Integration Type</Label>
                             <Select value={integration.type} onValueChange={v => handleChange(integration.id, 'type', v)}>
                                <SelectTrigger><SelectValue placeholder="Select a type..." /></SelectTrigger>
                                <SelectContent>
                                    {INTEGRATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1.5">
                            <Label>Direction</Label>
                             <Select value={integration.direction} onValueChange={v => handleChange(integration.id, 'direction', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Outbound">Outbound (API Call)</SelectItem>
                                    <SelectItem value="Inbound">Inbound (Webhook)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <Label>Purpose / Description</Label>
                            <Input
                                placeholder="e.g., To process credit card payments"
                                value={integration.purpose}
                                onChange={e => handleChange(integration.id, 'purpose', e.target.value)}
                            />
                        </div>
                    </div>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIntegration(integration.id)}
                        className="flex-shrink-0"
                    >
                        <Icon name="trash" className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddIntegration}>
        <Icon name="plus" className="h-4 w-4 mr-2" />
        Add Integration
      </Button>
    </div>
  );
};

export default Step14Integrations;