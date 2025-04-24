import React from 'react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { ArrowUpRightIcon } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoiceListItemProps {
  invoice: Invoice;
  onView: (id: string) => void;
}

const statusClasses = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const InvoiceListItem: React.FC<InvoiceListItemProps> = ({ invoice, onView }) => {
  // Calculate total amount
  const total = invoice.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price;
    return sum + itemTotal;
  }, 0);
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency,
    }).format(amount);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center">
            <h3 className="text-base font-semibold text-gray-900">#{invoice.number}</h3>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusClasses[invoice.status]}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
          
          <div className="mt-1 text-sm text-gray-600">
            {invoice.client.name} · {formatDate(invoice.issueDate)}
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end">
          <div className="text-right mr-4">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-base font-semibold text-gray-900">{formatCurrency(total)}</div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            rightIcon={<ArrowUpRightIcon size={16} />}
            onClick={() => onView(invoice.id)}
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceListItem;