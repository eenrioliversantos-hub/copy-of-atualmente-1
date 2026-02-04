import React from 'react';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Input } from '../../ui/Input';

interface PaymentGateway {
    id: string;
    provider: 'Stripe' | 'PayPal' | 'MercadoPago' | 'Other';
    publicKey: string;
    secretKey: string;
}

interface StepPaymentGatewayProps {
  data: {
    gateways?: PaymentGateway[];
  };
  setData: (data: any) => void;
}

const Step_PaymentGateway: React.FC<StepPaymentGatewayProps> = ({ data, setData }) => {
  const gateways = data.gateways || [];

  const handleAdd = () => {
    const newGateway: PaymentGateway = {
      id: Date.now().toString(),
      provider: 'Stripe',
      publicKey: '',
      secretKey: '',
    };
    setData({ ...data, gateways: [...gateways, newGateway] });
  };

  const handleRemove = (id: string) => {
    setData({ ...data, gateways: gateways.filter((g: PaymentGateway) => g.id !== id) });
  };

  const handleChange = (id: string, field: keyof PaymentGateway, value: string) => {
    const updated = gateways.map((g: PaymentGateway) => (g.id === id ? { ...g, [field]: value } : g));
    setData({ ...data, gateways: updated });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {gateways.map((gateway: PaymentGateway) => (
          <div key={gateway.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Provedor</Label>
                        <Select value={gateway.provider} onValueChange={(v: any) => handleChange(gateway.id, 'provider', v)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Stripe">Stripe</SelectItem>
                                <SelectItem value="PayPal">PayPal</SelectItem>
                                <SelectItem value="MercadoPago">MercadoPago</SelectItem>
                                <SelectItem value="Other">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div className="space-y-1.5"><Label>Public Key</Label><Input placeholder="pk_test_..." value={gateway.publicKey} onChange={e => handleChange(gateway.id, 'publicKey', e.target.value)} /></div>
                 <div className="space-y-1.5"><Label>Secret Key</Label><Input type="password" placeholder="sk_test_..." value={gateway.secretKey} onChange={e => handleChange(gateway.id, 'secretKey', e.target.value)} /></div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(gateway.id)}><Icon name="trash" className="h-4 w-4 text-red-500"/></Button>
            </div>
          </div>
        ))}
         <Button variant="outline" onClick={handleAdd} className="w-full">
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Adicionar Gateway de Pagamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step_PaymentGateway;