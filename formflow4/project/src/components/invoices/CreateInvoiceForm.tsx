import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Client, Invoice, InvoiceItem } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface CreateInvoiceFormProps {
  onSave: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ onSave, onCancel }) => {
  const { clients } = useApp();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { id: '1', description: '', quantity: 1, price: 0 },
  ]);

  // Get settings from localStorage
  const companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');
  const invoiceSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');

  const [formData, setFormData] = useState({
    number: invoiceSettings.prefix + invoiceSettings.nextNumber || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: invoiceSettings.notes || '',
    terms: invoiceSettings.terms || '',
    taxRate: invoiceSettings.defaultTaxRate || '0',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
      number: formData.number,
      client: selectedClient,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      items: items as InvoiceItem[],
      notes: formData.notes,
      terms: formData.terms,
      status: 'draft',
      currency: 'USD',
      taxRate: Number(formData.taxRate),
    };

    onSave(invoice);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
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
        <Button type="submit">
          Save Invoice
        </Button>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;