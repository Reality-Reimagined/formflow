import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Client, 
  Invoice, 
  Form, 
  DashboardStats 
} from '../types';
import { mockData } from '../mocks/data';

interface AppContextType {
  user: User | null;
  clients: Client[];
  invoices: Invoice[];
  forms: Form[];
  dashboardStats: DashboardStats;
  isLoading: boolean;
  currentPage: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addForm: (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'responseCount'>) => void;
  updateForm: (id: string, updates: Partial<Form>) => void;
  deleteForm: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    totalForms: 0,
    formResponses: 0,
    totalClients: 0,
    recentActivity: [],
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Initialize with mock data
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setUser(mockData.user);
      setClients(mockData.clients);
      setInvoices(mockData.invoices);
      setForms(mockData.forms);
      setDashboardStats(mockData.dashboardStats);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setClients([...clients, newClient]);
    
    // Update dashboard stats
    setDashboardStats({
      ...dashboardStats,
      totalClients: dashboardStats.totalClients + 1,
      recentActivity: [
        {
          id: `activity-${Date.now()}`,
          type: 'client',
          action: `Added client ${newClient.name}`,
          date: new Date().toISOString(),
        },
        ...dashboardStats.recentActivity,
      ]
    });
  };
  
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(
      clients.map(client => 
        client.id === id 
          ? { ...client, ...updates, updatedAt: new Date().toISOString() } 
          : client
      )
    );
  };
  
  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id);
    if (!clientToDelete) return;
    
    setClients(clients.filter(client => client.id !== id));
    
    // Update dashboard stats
    setDashboardStats({
      ...dashboardStats,
      totalClients: dashboardStats.totalClients - 1,
      recentActivity: [
        {
          id: `activity-${Date.now()}`,
          type: 'client',
          action: `Deleted client ${clientToDelete.name}`,
          date: new Date().toISOString(),
        },
        ...dashboardStats.recentActivity,
      ]
    });
  };
  
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `invoice-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setInvoices([...invoices, newInvoice]);
    
    // Update dashboard stats
    const newStats = { ...dashboardStats };
    newStats.totalInvoices += 1;
    
    if (newInvoice.status === 'paid') {
      newStats.paidInvoices += 1;
    } else if (newInvoice.status === 'overdue') {
      newStats.overdueInvoices += 1;
    }
    
    newStats.recentActivity = [
      {
        id: `activity-${Date.now()}`,
        type: 'invoice',
        action: `Created invoice #${newInvoice.number}`,
        date: new Date().toISOString(),
      },
      ...newStats.recentActivity,
    ];
    
    setDashboardStats(newStats);
  };
  
  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const oldInvoice = invoices.find(invoice => invoice.id === id);
    if (!oldInvoice) return;
    
    setInvoices(
      invoices.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...updates, updatedAt: new Date().toISOString() } 
          : invoice
      )
    );
    
    // Update dashboard stats if status changed
    if (updates.status && updates.status !== oldInvoice.status) {
      const newStats = { ...dashboardStats };
      
      // Remove count from old status
      if (oldInvoice.status === 'paid') {
        newStats.paidInvoices -= 1;
      } else if (oldInvoice.status === 'overdue') {
        newStats.overdueInvoices -= 1;
      }
      
      // Add count to new status
      if (updates.status === 'paid') {
        newStats.paidInvoices += 1;
      } else if (updates.status === 'overdue') {
        newStats.overdueInvoices += 1;
      }
      
      newStats.recentActivity = [
        {
          id: `activity-${Date.now()}`,
          type: 'invoice',
          action: `Updated invoice #${oldInvoice.number} status to ${updates.status}`,
          date: new Date().toISOString(),
        },
        ...newStats.recentActivity,
      ];
      
      setDashboardStats(newStats);
    }
  };
  
  const deleteInvoice = (id: string) => {
    const invoiceToDelete = invoices.find(invoice => invoice.id === id);
    if (!invoiceToDelete) return;
    
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    
    // Update dashboard stats
    const newStats = { ...dashboardStats };
    newStats.totalInvoices -= 1;
    
    if (invoiceToDelete.status === 'paid') {
      newStats.paidInvoices -= 1;
    } else if (invoiceToDelete.status === 'overdue') {
      newStats.overdueInvoices -= 1;
    }
    
    newStats.recentActivity = [
      {
        id: `activity-${Date.now()}`,
        type: 'invoice',
        action: `Deleted invoice #${invoiceToDelete.number}`,
        date: new Date().toISOString(),
      },
      ...newStats.recentActivity,
    ];
    
    setDashboardStats(newStats);
  };
  
  const addForm = (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'responseCount'>) => {
    const newForm: Form = {
      ...formData,
      id: `form-${Date.now()}`,
      responseCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setForms([...forms, newForm]);
    
    // Update dashboard stats
    setDashboardStats({
      ...dashboardStats,
      totalForms: dashboardStats.totalForms + 1,
      recentActivity: [
        {
          id: `activity-${Date.now()}`,
          type: 'form',
          action: `Created form "${newForm.title}"`,
          date: new Date().toISOString(),
        },
        ...dashboardStats.recentActivity,
      ]
    });
  };
  
  const updateForm = (id: string, updates: Partial<Form>) => {
    const oldForm = forms.find(form => form.id === id);
    if (!oldForm) return;
    
    setForms(
      forms.map(form => 
        form.id === id 
          ? { ...form, ...updates, updatedAt: new Date().toISOString() } 
          : form
      )
    );
    
    if (updates.published !== undefined && updates.published !== oldForm.published) {
      setDashboardStats({
        ...dashboardStats,
        recentActivity: [
          {
            id: `activity-${Date.now()}`,
            type: 'form',
            action: `${updates.published ? 'Published' : 'Unpublished'} form "${oldForm.title}"`,
            date: new Date().toISOString(),
          },
          ...dashboardStats.recentActivity,
        ]
      });
    }
  };
  
  const deleteForm = (id: string) => {
    const formToDelete = forms.find(form => form.id === id);
    if (!formToDelete) return;
    
    setForms(forms.filter(form => form.id !== id));
    
    // Update dashboard stats
    setDashboardStats({
      ...dashboardStats,
      totalForms: dashboardStats.totalForms - 1,
      formResponses: dashboardStats.formResponses - formToDelete.responseCount,
      recentActivity: [
        {
          id: `activity-${Date.now()}`,
          type: 'form',
          action: `Deleted form "${formToDelete.title}"`,
          date: new Date().toISOString(),
        },
        ...dashboardStats.recentActivity,
      ]
    });
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        clients,
        invoices,
        forms,
        dashboardStats,
        isLoading,
        currentPage,
        searchQuery,
        setSearchQuery,
        setCurrentPage,
        addClient,
        updateClient,
        deleteClient,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addForm,
        updateForm,
        deleteForm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};