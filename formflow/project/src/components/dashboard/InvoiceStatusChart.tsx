import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface InvoiceStatusChartProps {
  data: {
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
  };
}

const InvoiceStatusChart: React.FC<InvoiceStatusChartProps> = ({ data }) => {
  const total = data.draft + data.sent + data.paid + data.overdue;
  
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  const statusColors = {
    draft: 'bg-gray-300',
    sent: 'bg-blue-500',
    paid: 'bg-green-500',
    overdue: 'bg-red-500',
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end justify-around space-x-2">
          {Object.entries(data).map(([status, value]) => (
            <div 
              key={status} 
              className="flex flex-col items-center w-1/4"
            >
              <div className="flex flex-col items-center w-full">
                <div className="text-xs font-medium mb-1">{getPercentage(value)}%</div>
                <div 
                  className={`w-full ${statusColors[status as keyof typeof statusColors]}`} 
                  style={{ height: `${Math.max(getPercentage(value), 4)}%` }}
                ></div>
              </div>
              <div className="text-xs mt-2 capitalize">{status}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-2">
          {Object.entries(data).map(([status, value]) => (
            <div key={status} className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${statusColors[status as keyof typeof statusColors]}`}
              ></div>
              <div className="flex-1 flex justify-between">
                <span className="text-sm capitalize">{status}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatusChart;