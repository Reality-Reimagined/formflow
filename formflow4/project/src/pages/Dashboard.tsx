import React from 'react';
import { 
  FileTextIcon, 
  ClipboardIcon, 
  UsersIcon, 
  DollarSignIcon,
  BarChart3Icon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import InvoiceStatusChart from '../components/dashboard/InvoiceStatusChart';
import { useApp } from '../contexts/AppContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const { dashboardStats, invoices, setCurrentPage } = useApp();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate total invoice amount
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => {
    const invoiceTotal = invoice.items.reduce((itemSum, item) => {
      return itemSum + (item.price * item.quantity);
    }, 0);
    
    return sum + invoiceTotal;
  }, 0);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  // Transform activities for the component
  const activities = dashboardStats.recentActivity.map(activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.action.split(' ')[0],
    description: activity.action,
    timestamp: formatDate(activity.date),
  }));
  
  // Count invoices by status
  const invoiceStatuses = {
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
  };

  // Calculate monthly revenue data
  const monthlyRevenue = Array(12).fill(0);
  invoices.forEach(invoice => {
    const date = new Date(invoice.issueDate);
    const month = date.getMonth();
    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    monthlyRevenue[month] += total;
  });

  const monthlyPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
    ],
  };
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'invoice':
        setCurrentPage('invoices');
        break;
      case 'form':
        setCurrentPage('forms');
        break;
      case 'client':
        setCurrentPage('clients');
        break;
      case 'reports':
        setCurrentPage('analytics');
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Invoices"
          value={dashboardStats.totalInvoices}
          icon={<FileTextIcon size={20} />}
          change={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalInvoiceAmount)}
          icon={<DollarSignIcon size={20} />}
          change={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Form Responses"
          value={dashboardStats.formResponses}
          icon={<ClipboardIcon size={20} />}
          change={{ value: 23, positive: true }}
        />
        <StatsCard
          title="Active Clients"
          value={dashboardStats.totalClients}
          icon={<UsersIcon size={20} />}
          change={{ value: 5, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Performance</h2>
                <p className="text-sm text-gray-500">April 2025</p>
              </div>
              <div className="h-64">
                <Line
                  data={monthlyPerformanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return formatCurrency(context.parsed.y);
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => formatCurrency(value as number),
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-blue-500 rounded mr-2"></span>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(monthlyRevenue.reduce((a, b) => a + b, 0))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <InvoiceStatusChart data={invoiceStatuses} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivityCard activities={activities} />
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction('invoice')}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
              >
                <div className="p-2 rounded-full bg-blue-100 w-fit mb-3">
                  <FileTextIcon size={18} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Create Invoice</h3>
                <p className="text-xs text-gray-500 mt-1">Generate a new invoice for clients</p>
              </button>
              
              <button
                onClick={() => handleQuickAction('form')}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
              >
                <div className="p-2 rounded-full bg-purple-100 w-fit mb-3">
                  <ClipboardIcon size={18} className="text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Create Form</h3>
                <p className="text-xs text-gray-500 mt-1">Build a custom form for data collection</p>
              </button>
              
              <button
                onClick={() => handleQuickAction('client')}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
              >
                <div className="p-2 rounded-full bg-teal-100 w-fit mb-3">
                  <UsersIcon size={18} className="text-teal-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Add Client</h3>
                <p className="text-xs text-gray-500 mt-1">Add a new client to your business</p>
              </button>
              
              <button
                onClick={() => handleQuickAction('reports')}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
              >
                <div className="p-2 rounded-full bg-amber-100 w-fit mb-3">
                  <BarChart3Icon size={18} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">View Reports</h3>
                <p className="text-xs text-gray-500 mt-1">Analyze your business performance</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;