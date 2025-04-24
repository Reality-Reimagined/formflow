import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { SearchIcon, BookOpenIcon, MessageCircleIcon, PlayCircleIcon, FileTextIcon } from 'lucide-react';
import Input from '../components/ui/Input';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find help and documentation for using FormFlow
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <Input
          placeholder="Search help articles..."
          leftIcon={<SearchIcon size={16} />}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <PlayCircleIcon size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Quick Start Guide</h3>
                    <p className="mt-1 text-sm text-gray-500">Learn the basics of FormFlow in 5 minutes</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileTextIcon size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Creating Your First Form</h3>
                    <p className="mt-1 text-sm text-gray-500">Step-by-step guide to form creation</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileTextIcon size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Managing Invoices</h3>
                    <p className="mt-1 text-sm text-gray-500">Learn about invoice creation and management</p>
                  </div>
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <BookOpenIcon size={20} className="text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Customizing Form Fields</h3>
                    <p className="mt-1 text-sm text-gray-500">Learn about all available field types</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <BookOpenIcon size={20} className="text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Setting Up Payment Methods</h3>
                    <p className="mt-1 text-sm text-gray-500">Configure payment options for invoices</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <BookOpenIcon size={20} className="text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Managing Client Data</h3>
                    <p className="mt-1 text-sm text-gray-500">Best practices for client management</p>
                  </div>
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <PlayCircleIcon size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Form Builder Tutorial</h3>
                    <p className="mt-1 text-sm text-gray-500">Complete guide to building forms</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <PlayCircleIcon size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Invoice Management</h3>
                    <p className="mt-1 text-sm text-gray-500">Learn about invoice features</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start">
                  <div className="flex-shrink-0">
                    <PlayCircleIcon size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Analytics Dashboard</h3>
                    <p className="mt-1 text-sm text-gray-500">Understanding your analytics</p>
                  </div>
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <MessageCircleIcon size={40} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Need more help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Our support team is available 24/7 to assist you
              </p>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Contact Support
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;