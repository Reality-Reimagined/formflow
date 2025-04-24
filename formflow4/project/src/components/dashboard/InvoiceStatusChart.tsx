import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InvoiceStatusChartProps {
  data: {
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
  };
}

const InvoiceStatusChart: React.FC<InvoiceStatusChartProps> = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  const chartData = {
    labels: ['Draft', 'Sent', 'Paid', 'Overdue'],
    datasets: [
      {
        data: [data.draft, data.sent, data.paid, data.overdue],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)', // gray for draft
          'rgba(59, 130, 246, 0.8)',  // blue for sent
          'rgba(34, 197, 94, 0.8)',   // green for paid
          'rgba(239, 68, 68, 0.8)',   // red for overdue
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(data).map(([status, value]) => (
            <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    status === 'draft' ? 'bg-gray-400' :
                    status === 'sent' ? 'bg-blue-500' :
                    status === 'paid' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm capitalize">{status}</span>
              </div>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatusChart;