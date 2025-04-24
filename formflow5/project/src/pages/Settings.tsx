import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useApp } from '../contexts/AppContext';
import { SaveIcon, UserIcon, BellIcon, PaletteIcon, CreditCardIcon, MailIcon } from 'lucide-react';

interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxId: string;
}

interface InvoiceSettings {
  prefix: string;
  nextNumber: string;
  terms: string;
  notes: string;
  defaultTaxRate: string;
}

interface EmailSettings {
  invoiceTemplate: string;
  reminderTemplate: string;
  receiptTemplate: string;
}

const Settings: React.FC = () => {
  const { user } = useApp();
  const [activeSection, setActiveSection] = useState('company');
  
  // Initialize settings from localStorage or defaults
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : {
      companyName: user?.company || '',
      email: user?.email || '',
      phone: '',
      address: '',
      website: '',
      taxId: '',
    };
  });

  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(() => {
    const saved = localStorage.getItem('invoiceSettings');
    return saved ? JSON.parse(saved) : {
      prefix: 'INV-',
      nextNumber: '2025-001',
      terms: 'Net 30',
      notes: 'Thank you for your business!',
      defaultTaxRate: '7.5',
    };
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => {
    const saved = localStorage.getItem('emailSettings');
    return saved ? JSON.parse(saved) : {
      invoiceTemplate: 'Dear {client_name},\n\nPlease find attached invoice #{invoice_number} for {amount}.\n\nPayment is due by {due_date}.\n\nBest regards,\n{company_name}',
      reminderTemplate: 'Dear {client_name},\n\nThis is a reminder that invoice #{invoice_number} for {amount} is due on {due_date}.\n\nBest regards,\n{company_name}',
      receiptTemplate: 'Dear {client_name},\n\nThank you for your payment of {amount} for invoice #{invoice_number}.\n\nBest regards,\n{company_name}',
    };
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('invoiceSettings', JSON.stringify(invoiceSettings));
  }, [invoiceSettings]);

  useEffect(() => {
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
  }, [emailSettings]);

  const handleCompanySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'company':
        return (
          <div className="space-y-4">
            <Input
              label="Company Name"
              name="companyName"
              value={companySettings.companyName}
              onChange={handleCompanySettingsChange}
              fullWidth
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={companySettings.email}
                onChange={handleCompanySettingsChange}
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={companySettings.phone}
                onChange={handleCompanySettingsChange}
              />
            </div>
            <Input
              label="Business Address"
              name="address"
              value={companySettings.address}
              onChange={handleCompanySettingsChange}
              fullWidth
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Website"
                name="website"
                type="url"
                value={companySettings.website}
                onChange={handleCompanySettingsChange}
              />
              <Input
                label="Tax ID / VAT Number"
                name="taxId"
                value={companySettings.taxId}
                onChange={handleCompanySettingsChange}
              />
            </div>
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Invoice Prefix"
                name="prefix"
                value={invoiceSettings.prefix}
                onChange={handleInvoiceSettingsChange}
              />
              <Input
                label="Next Invoice Number"
                name="nextNumber"
                value={invoiceSettings.nextNumber}
                onChange={handleInvoiceSettingsChange}
              />
            </div>
            <Input
              label="Default Tax Rate (%)"
              name="defaultTaxRate"
              type="number"
              step="0.1"
              value={invoiceSettings.defaultTaxRate}
              onChange={handleInvoiceSettingsChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Payment Terms
              </label>
              <textarea
                name="terms"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={invoiceSettings.terms}
                onChange={handleInvoiceSettingsChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={invoiceSettings.notes}
                onChange={handleInvoiceSettingsChange}
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Email Template
              </label>
              <textarea
                name="invoiceTemplate"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={emailSettings.invoiceTemplate}
                onChange={handleEmailSettingsChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Reminder Template
              </label>
              <textarea
                name="reminderTemplate"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={emailSettings.reminderTemplate}
                onChange={handleEmailSettingsChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Receipt Template
              </label>
              <textarea
                name="receiptTemplate"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={emailSettings.receiptTemplate}
                onChange={handleEmailSettingsChange}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeSection === 'company' && 'Company Profile'}
                {activeSection === 'invoice' && 'Invoice Settings'}
                {activeSection === 'email' && 'Email Templates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'company'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveSection('company')}
                >
                  <UserIcon size={16} className="mr-3" />
                  Company Profile
                </button>
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'invoice'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveSection('invoice')}
                >
                  <CreditCardIcon size={16} className="mr-3" />
                  Invoice Settings
                </button>
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'email'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveSection('email')}
                >
                  <MailIcon size={16} className="mr-3" />
                  Email Templates
                </button>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;