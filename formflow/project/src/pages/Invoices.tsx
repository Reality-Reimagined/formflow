import React, { useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import InvoiceListItem from '../components/invoices/InvoiceListItem';
import InvoicePreview from '../components/invoices/InvoicePreview';
import { InvoiceStatus, Invoice } from '../types';
import { useApp } from '../contexts/AppContext';

const Invoices: React.FC = () => {
  const { invoices, searchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  
  const handleViewInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
    }
  };
  
  const handleCreateInvoice = () => {
    setShowCreateInvoice(true);
  };
  
  const filteredInvoices = invoices.filter(invoice => {
    // Apply status filter
    if (statusFilter !== 'all' && invoice.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        invoice.number.toLowerCase().includes(query) ||
        invoice.client.name.toLowerCase().includes(query) ||
        invoice.client.company?.toLowerCase().includes(query) ||
        invoice.client.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Count invoices by status
  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    cancelled: invoices.filter(inv => inv.status === 'cancelled').length,
  };
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: `All (${statusCounts.all})` },
    { value: 'draft', label: `Draft (${statusCounts.draft})` },
    { value: 'sent', label: `Sent (${statusCounts.sent})` },
    { value: 'paid', label: `Paid (${statusCounts.paid})` },
    { value: 'overdue', label: `Overdue (${statusCounts.overdue})` },
    { value: 'cancelled', label: `Cancelled (${statusCounts.cancelled})` },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Button
          leftIcon={<PlusIcon size={16} />}
          onClick={handleCreateInvoice}
        >
          Create Invoice
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="sm:flex-1">
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                leftIcon={<SearchIcon size={16} className="text-gray-500" />}
                fullWidth
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
                fullWidth
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <InvoiceListItem
                  key={invoice.id}
                  invoice={invoice}
                  onView={handleViewInvoice}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Invoices;