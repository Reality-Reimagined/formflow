import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { PlusIcon, TrashIcon, MailIcon, ClockIcon } from 'lucide-react';
import { Client, Invoice, InvoiceItem } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface CreateInvoiceFormProps {
  initialData?: Invoice | null;
  onSave: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ initialData, onSave, onCancel }) => {
  const { clients } = useApp();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { id: '1', description: '', quantity: 1, price: 0 },
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [scheduleType, setScheduleType] = useState<'now' | 'later' | 'monthly'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [monthlyDay, setMonthlyDay] = useState('1');

  // Get settings from localStorage
  const companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');
  const invoiceSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
  const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{}');

  const [formData, setFormData] = useState({
    number: invoiceSettings.prefix + invoiceSettings.nextNumber || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: invoiceSettings.notes || '',
    terms: invoiceSettings.terms || '',
    taxRate: invoiceSettings.defaultTaxRate || '0',
    status: 'draft' as Invoice['status'],
  });

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setSelectedClient(initialData.client);
      setItems(initialData.items);
      setFormData({
        number: initialData.number,
        issueDate: initialData.issueDate.split('T')[0],
        dueDate: initialData.dueDate.split('T')[0],
        notes: initialData.notes || '',
        terms: initialData.terms || '',
        taxRate: String(initialData.taxRate || 0),
        status: initialData.status,
      });
    }
  }, [initialData]);

  // Check for overdue invoices periodically
  useEffect(() => {
    const checkOverdue = () => {
      const today = new Date();
      if (formData.status === 'sent' && new Date(formData.dueDate) < today) {
        setFormData(prev => ({ ...prev, status: 'overdue' }));
      }
    };

    const interval = setInterval(checkOverdue, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, [formData.status, formData.dueDate]);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: String(items.length + 1), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.price) || 0);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * Number(formData.taxRate)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getEmailContent = () => {
    const total = formatCurrency(calculateTotal());
    let template = emailSettings.invoiceTemplate || '';
    
    template = template
      .replace('{client_name}', selectedClient?.name || '')
      .replace('{invoice_number}', formData.number)
      .replace('{amount}', total)
      .replace('{due_date}', new Date(formData.dueDate).toLocaleDateString())
      .replace('{company_name}', companySettings.companyName || '');

    return template;
  };

  const handleSendEmail = () => {
    const emailContent = getEmailContent();
    setShowEmailPreview(false);
    
    // In a real application, this would send via an API
    // For now, we'll just show what would be sent
    const emailPreview = {
      to: selectedClient?.email,
      subject: `Invoice ${formData.number} from ${companySettings.companyName}`,
      content: emailContent,
    };
    
    // Show email preview in a more sophisticated way
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <h3 class="text-lg font-bold mb-4">Email Preview</h3>
          <div class="mb-4">
            <p><strong>To:</strong> ${emailPreview.to}</p>
            <p><strong>Subject:</strong> ${emailPreview.subject}</p>
          </div>
          <div class="border p-4 rounded mb-4 whitespace-pre-wrap">${emailPreview.content}</div>
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-blue-600 text-white rounded" id="sendEmailBtn">Send Email</button>
            <button class="px-4 py-2 ml-2 border rounded" id="cancelEmailBtn">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('sendEmailBtn')?.addEventListener('click', () => {
      document.body.removeChild(modal);
      setFormData(prev => ({ ...prev, status: 'sent' }));
    });

    document.getElementById('cancelEmailBtn')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    // Validate items
    const validItems = items.filter(item => 
      item.description && 
      item.quantity && 
      item.price && 
      item.quantity > 0 && 
      item.price >= 0
    ) as InvoiceItem[];

    if (validItems.length === 0) {
      alert('Please add at least one valid item to the invoice');
      return;
    }

    const invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
      number: formData.number,
      client: selectedClient,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      items: validItems,
      notes: formData.notes,
      terms: formData.terms,
      status: formData.status,
      currency: 'USD',
      taxRate: Number(formData.taxRate),
    };

    // Handle scheduling
    if (scheduleType === 'later' && scheduledDate) {
      const schedule = {
        type: 'scheduled',
        date: scheduledDate,
      };
      localStorage.setItem(`schedule_${invoice.number}`, JSON.stringify(schedule));
    } else if (scheduleType === 'monthly' && monthlyDay) {
      const schedule = {
        type: 'monthly',
        day: monthlyDay,
      };
      localStorage.setItem(`schedule_${invoice.number}`, JSON.stringify(schedule));
    }

    // Only update next invoice number if creating new invoice
    if (!initialData) {
      const currentNumber = parseInt(invoiceSettings.nextNumber.split('-')[1]);
      const nextNumber = `${new Date().getFullYear()}-${String(currentNumber + 1).padStart(3, '0')}`;
      const updatedSettings = { ...invoiceSettings, nextNumber };
      localStorage.setItem('invoiceSettings', JSON.stringify(updatedSettings));
    }

    onSave(invoice);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const ScheduleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Schedule Invoice</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Schedule Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value as any)}
            >
              <option value="now">Send Immediately</option>
              <option value="later">Send Later</option>
              <option value="monthly">Monthly Recurring</option>
            </select>
          </div>

          {scheduleType === 'later' && (
            <div>
              <label className="block text-sm font-medium mb-1">Send Date</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md p-2"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          )}

          {scheduleType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium mb-1">Day of Month</label>
              <select
                className="w-full border rounded-md p-2"
                value={monthlyDay}
                onChange={(e) => setMonthlyDay(e.target.value)}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowScheduleModal(false);
            handleSendEmail();
          }}>Confirm</Button>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">From</h3>
              <div className="text-sm">
                <p className="font-medium">{companySettings.companyName}</p>
                <p>{companySettings.address}</p>
                <p>{companySettings.email}</p>
                <p>{companySettings.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bill To</h3>
              <Select
                options={clients.map(client => ({
                  value: client.id,
                  label: `${client.name} (${client.company || 'No Company'})`,
                }))}
                value={selectedClient?.id || ''}
                onChange={(e) => handleClientChange(e.target.value)}
                label="Select Client"
                required
                fullWidth
              />
              {selectedClient && (
                <div className="mt-2 text-sm">
                  <p>{selectedClient.company}</p>
                  <p>{selectedClient.address}</p>
                  <p>{selectedClient.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Input
              label="Invoice Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Input
              label="Issue Date"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<PlusIcon size={16} />}
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-1 flex items-center">
                    {formatCurrency((Number(item.quantity) || 0) * (Number(item.price) || 0))}
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <TrashIcon size={16} className="text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({formData.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          leftIcon={<ClockIcon size={16} />}
          onClick={() => setShowScheduleModal(true)}
        >
          Schedule
        </Button>
        <Button
          type="button"
          variant="outline"
          leftIcon={<MailIcon size={16} />}
          onClick={handleSendEmail}
        >
          Send Now
        </Button>
        <Button type="submit">
          Save Invoice
        </Button>
      </div>

      {showScheduleModal && <ScheduleModal />}
    </form>
  );
};

export default CreateInvoiceForm;