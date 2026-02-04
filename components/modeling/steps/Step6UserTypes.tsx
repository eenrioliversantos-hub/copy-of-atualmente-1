import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';

interface UserType {
    id: string;
    name: string;
    description: string;
}

interface Step6UserTypesProps {
  data: {
    userTypes?: UserType[];
  };
  setData: (data: any) => void;
}

const Step6UserTypes: React.FC<Step6UserTypesProps> = ({ data, setData }) => {
  const userTypes = data.userTypes || [];

  const handleAddUserType = () => {
    const newUserType = {
      id: new Date().getTime().toString(),
      name: '',
      description: ''
    };
    setData({ ...data, userTypes: [...userTypes, newUserType] });
  };

  const handleRemoveUserType = (id: string) => {
    setData({ ...data, userTypes: userTypes.filter(ut => ut.id !== id) });
  };

  const handleChange = (id: string, field: 'name' | 'description', value: string) => {
    const updatedUserTypes = userTypes.map(ut =>
      ut.id === id ? { ...ut, [field]: value } : ut
    );
    setData({ ...data, userTypes: updatedUserTypes });
  };

  return (
    <div className="space-y-6">
       <div>
         <Label>User Types / Roles</Label>
         <p className="text-sm text-text-secondary">Define the different types of users that will interact with your system.</p>
       </div>
      
      <div className="space-y-4">
        {userTypes.map((userType, index) => (
          <Card key={userType.id} className="bg-sidebar/50">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`name-${userType.id}`}>Role Name</Label>
                                <Input
                                    id={`name-${userType.id}`}
                                    placeholder="e.g., Administrator"
                                    value={userType.name}
                                    onChange={e => handleChange(userType.id, 'name', e.target.value)}
                                />
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor={`description-${userType.id}`}>Description</Label>
                                <Input
                                    id={`description-${userType.id}`}
                                    placeholder="Briefly describe this role."
                                    value={userType.description}
                                    onChange={e => handleChange(userType.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUserType(userType.id)}
                        className="mt-7"
                    >
                        <Icon name="trash" className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddUserType}>
        <Icon name="plus" className="h-4 w-4 mr-2" />
        Add User Type
      </Button>
    </div>
  );
};

export default Step6UserTypes;