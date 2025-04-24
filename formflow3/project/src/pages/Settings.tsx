import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useApp } from '../contexts/AppContext';
import { SaveIcon, UserIcon, BellIcon, PaletteIcon, CreditCardIcon, MailIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Company Name"
                defaultValue={user?.company}
                fullWidth
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  defaultValue={user?.email}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <Input
                label="Business Address"
                placeholder="Enter your business address"
                fullWidth
              />
              <Input
                label="Website"
                type="url"
                placeholder="https://your-company.com"
                fullWidth
              />
              <Button leftIcon={<SaveIcon size={16} />}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Invoice Prefix"
                  defaultValue="INV-"
                />
                <Input
                  label="Next Invoice Number"
                  type="number"
                  defaultValue="2025-005"
                />
              </div>
              <Input
                label="Default Payment Terms"
                defaultValue="Net 30"
              />
              <Input
                label="Default Notes"
                placeholder="Enter default invoice notes"
                fullWidth
              />
              <Button leftIcon={<SaveIcon size={16} />}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Invoice Email</h3>
                <textarea
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Dear {client_name},

Please find attached invoice #{invoice_number} for {amount}.

Payment is due by {due_date}.

Best regards,
{company_name}"
                />
              </div>
              <Button leftIcon={<SaveIcon size={16} />}>
                Save Changes
              </Button>
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
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <UserIcon size={16} className="mr-3 text-gray-400" />
                  Account Settings
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <BellIcon size={16} className="mr-3 text-gray-400" />
                  Notifications
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <PaletteIcon size={16} className="mr-3 text-gray-400" />
                  Appearance
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <CreditCardIcon size={16} className="mr-3 text-gray-400" />
                  Billing
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <MailIcon size={16} className="mr-3 text-gray-400" />
                  Email Settings
                </a>
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