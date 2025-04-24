import React, { useState } from 'react';
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Client } from '../types';
import { useApp } from '../contexts/AppContext';

const Clients: React.FC = () => {
  const { clients, addClient, deleteClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateClient, setShowCreateClient] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    setShowCreateClient(false);
  };
  
  const handleViewClient = (client: Client) => {
    // View client details
    console.log('View client', client);
  };
  
  const handleEditClient = (client: Client) => {
    // Edit client
    console.log('Edit client', client);
  };
  
  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      deleteClient(client.id);
    }
  };
  
  const filteredClients = clients.filter(client => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        (client.company?.toLowerCase().includes(query) || false) ||
        (client.phone?.toLowerCase().includes(query) || false)
      );
    }
    return true;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (showCreateClient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
            <p className="text-sm text-gray-500 mt-1">Enter the client's information</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateClient(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Client
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
                
                <Input
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button
          leftIcon={<PlusIcon size={16} />}
          onClick={() => setShowCreateClient(true)}
        >
          Add Client
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SearchIcon size={16} className="text-gray-500" />}
              fullWidth
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added On
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        {client.phone && (
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.company || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(client.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewClient(client)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;