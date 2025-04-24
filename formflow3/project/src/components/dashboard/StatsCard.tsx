import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-1">
                <span 
                  className={`text-xs font-medium ${
                    change.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change.positive ? '↑' : '↓'} {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          
          <div className="p-2 rounded-md bg-blue-50 text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;