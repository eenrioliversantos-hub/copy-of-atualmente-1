import React from 'react';
import { Label } from '../../ui/Label';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface UserType {
    id: string;
    name: string;
    description: string;
}

interface Step7PermissionsProps {
  data: {
    model?: string;
    permissions?: Record<string, string[]>;
  };
  setData: (data: any) => void;
  userTypes: UserType[];
}

const PERMISSION_MODELS = [
    { value: "RBAC", label: "Role-Based Access Control (RBAC)", description: "Permissions are assigned to roles, and roles are assigned to users." },
    { value: "Simple", label: "Simple (Admin/User)", description: "A basic model with just administrators and regular users." },
];

const Step7Permissions: React.FC<Step7PermissionsProps> = ({ data, setData, userTypes }) => {
  const permissions = data.permissions || {};

  const handleModelChange = (value: string) => {
    setData({ ...data, model: value });
  };
  
  const handleAddPermission = (roleName: string) => {
    const newPermissions = { ...permissions };
    if (!newPermissions[roleName]) {
      newPermissions[roleName] = [];
    }
    newPermissions[roleName].push("");
    setData({ ...data, permissions: newPermissions });
  };

  const handlePermissionChange = (roleName: string, index: number, value: string) => {
    const newPermissions = { ...permissions };
    newPermissions[roleName][index] = value;
    setData({ ...data, permissions: newPermissions });
  };

  const handleRemovePermission = (roleName: string, index: number) => {
    const newPermissions = { ...permissions };
    newPermissions[roleName].splice(index, 1);
    setData({ ...data, permissions: newPermissions });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Permission Model</Label>
        <p className="text-sm text-text-secondary">Select the access control model for your system.</p>
        <RadioGroup
            onValueChange={handleModelChange}
            value={data.model}
            className="space-y-2 pt-2"
        >
          {PERMISSION_MODELS.map(type => (
            <Label key={type.value} htmlFor={`model-${type.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem value={type.value} id={`model-${type.value}`} />
                    <span className="font-semibold">{type.label}</span>
                </div>
                <p className="pl-7 text-sm text-text-secondary">{type.description}</p>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Define Permissions per Role</Label>
         <p className="text-sm text-text-secondary">List the specific actions each user role is allowed to perform.</p>

         <div className="space-y-4 pt-2">
            {userTypes.map(role => (
                 <Card key={role.id} className="bg-sidebar/50">
                    <CardContent className="p-4">
                        <h4 className="font-semibold text-text-primary mb-3">{role.name}</h4>
                        <div className="space-y-2">
                            {(permissions[role.name] || []).map((permission, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        placeholder="e.g., create_document"
                                        value={permission}
                                        onChange={e => handlePermissionChange(role.name, index, e.target.value)}
                                    />
                                     <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemovePermission(role.name, index)}
                                    >
                                        <Icon name="trash" className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAddPermission(role.name)} className="mt-3">
                            <Icon name="plus" className="h-4 w-4 mr-2" /> Add Permission
                        </Button>
                    </CardContent>
                 </Card>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Step7Permissions;