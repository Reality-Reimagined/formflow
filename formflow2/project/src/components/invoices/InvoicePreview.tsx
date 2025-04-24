import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Invoice } from '../../types';
import { XIcon, PrinterIcon, SendIcon, DownloadIcon } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return invoice.taxRate ? (subtotal * invoice.taxRate) / 100 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Invoice #{invoice.number}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PrinterIcon size={16} />}
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<DownloadIcon size={16} />}
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<SendIcon size={16} />}
              >
                Send
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <XIcon size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">From</h3>
              <div className="text-sm">
                <p className="font-medium">Your Company Name</p>
                <p>123 Business Street</p>
                <p>City, State 12345</p>
                <p>contact@yourcompany.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bill To</h3>
              <div className="text-sm">
                <p className="font-medium">{invoice.client.company}</p>
                <p>{invoice.client.name}</p>
                <p>{invoice.client.address}</p>
                <p>{invoice.client.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Invoice Number</p>
                  <p className="font-medium">#{invoice.number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium capitalize">{invoice.status}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Issue Date</p>
                  <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="text-right py-3 px-4">{item.quantity}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.price)}</td>
                  <td className="text-right py-3 px-4">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              {invoice.taxRate && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(calculateTax())}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
          
          {invoice.terms && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Terms</h4>
              <p className="text-sm text-gray-600">{invoice.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePreview;