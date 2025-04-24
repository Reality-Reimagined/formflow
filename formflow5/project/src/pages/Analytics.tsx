import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useApp } from '../contexts/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const { invoices, forms, clients } = useApp();

  // Calculate monthly revenue data
  const monthlyRevenue = Array(12).fill(0);
  const monthlyInvoices = Array(12).fill(0);
  
  invoices.forEach(invoice => {
    const date = new Date(invoice.issueDate);
    const month = date.getMonth();
    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    monthlyRevenue[month] += total;
    monthlyInvoices[month]++;
  });

  // Calculate form submission data
  const formSubmissions = forms.map(form => ({
    name: form.title,
    responses: form.responseCount,
  }));

  // Revenue by status
  const revenueByStatus = {
    paid: 0,
    pending: 0,
    overdue: 0,
  };

  invoices.forEach(invoice => {
    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    if (invoice.status === 'paid') {
      revenueByStatus.paid += total;
    } else if (invoice.status === 'sent') {
      revenueByStatus.pending += total;
    } else if (invoice.status === 'overdue') {
      revenueByStatus.overdue += total;
    }
  });

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const invoiceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Invoices',
        data: monthlyInvoices,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const formData = {
    labels: formSubmissions.map(form => form.name),
    datasets: [
      {
        data: formSubmissions.map(form => form.responses),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(99, 102, 241, 0.5)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(168, 85, 247, 0.5)',
        ],
      },
    ],
  };

  const statusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [
          revenueByStatus.paid,
          revenueByStatus.pending,
          revenueByStatus.overdue,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={invoiceData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={formData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-blue-900">
                ${monthlyRevenue.reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600">Total Forms</h3>
              <p className="text-2xl font-bold text-purple-900">
                {forms.length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">Active Clients</h3>
              <p className="text-2xl font-bold text-green-900">
                {clients.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;