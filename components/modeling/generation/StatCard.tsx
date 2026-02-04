import React from 'react';
import Icon from '../../shared/Icon';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-card border border-card-border rounded-lg p-4 flex items-center gap-4">
            <div className="p-2 bg-accent/20 rounded-lg">
                 <Icon name={icon} className="h-6 w-6 text-accent" />
            </div>
            <div>
                <p className="text-sm text-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
