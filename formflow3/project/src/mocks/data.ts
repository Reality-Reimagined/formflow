import { User, Client, Invoice, Form, DashboardStats } from '../types';

// Mock user
const user: User = {
  id: 'user-1',
  email: 'johndoe@example.com',
  name: 'John Doe',
  role: 'admin',
  company: 'Acme Inc.',
};

// Mock clients
const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    phone: '(555) 123-4567',
    company: 'Johnson Enterprises',
    address: '123 Business St, New York, NY 10001',
    notes: 'Prefers communication via email',
    createdAt: '2025-02-15T08:30:00Z',
    updatedAt: '2025-04-10T14:45:00Z',
  },
  {
    id: 'client-2',
    name: 'Bob Smith',
    email: 'bob@techcorp.com',
    phone: '(555) 987-6543',
    company: 'Tech Corp',
    address: '456 Technology Ave, San Francisco, CA 94107',
    createdAt: '2025-03-01T10:15:00Z',
    updatedAt: '2025-03-01T10:15:00Z',
  },
  {
    id: 'client-3',
    name: 'Carol Williams',
    email: 'carol@designstudio.com',
    phone: '(555) 456-7890',
    company: 'Design Studio',
    address: '789 Creative Blvd, Austin, TX 78701',
    notes: 'Monthly retainer client',
    createdAt: '2025-03-10T09:00:00Z',
    updatedAt: '2025-04-15T16:20:00Z',
  },
];

// Mock invoices
const invoices: Invoice[] = [
  {
    id: 'invoice-1',
    number: 'INV-2025-001',
    client: clients[0],
    issueDate: '2025-04-01T00:00:00Z',
    dueDate: '2025-04-15T00:00:00Z',
    items: [
      {
        id: 'item-1',
        description: 'Website Design',
        quantity: 1,
        price: 1500,
      },
      {
        id: 'item-2',
        description: 'Logo Design',
        quantity: 1,
        price: 500,
      },
    ],
    notes: 'Thank you for your business!',
    terms: 'Payment due within 14 days',
    status: 'paid',
    currency: 'USD',
    taxRate: 7.5,
    createdAt: '2025-04-01T10:30:00Z',
    updatedAt: '2025-04-16T08:15:00Z',
  },
  {
    id: 'invoice-2',
    number: 'INV-2025-002',
    client: clients[1],
    issueDate: '2025-04-05T00:00:00Z',
    dueDate: '2025-05-05T00:00:00Z',
    items: [
      {
        id: 'item-3',
        description: 'Monthly Maintenance',
        quantity: 1,
        price: 350,
      },
      {
        id: 'item-4',
        description: 'Additional Features',
        quantity: 5,
        price: 100,
      },
    ],
    status: 'sent',
    currency: 'USD',
    createdAt: '2025-04-05T15:45:00Z',
    updatedAt: '2025-04-05T15:45:00Z',
  },
  {
    id: 'invoice-3',
    number: 'INV-2025-003',
    client: clients[2],
    issueDate: '2025-03-20T00:00:00Z',
    dueDate: '2025-04-03T00:00:00Z',
    items: [
      {
        id: 'item-5',
        description: 'Brand Identity Package',
        quantity: 1,
        price: 2500,
      },
    ],
    status: 'overdue',
    currency: 'USD',
    taxRate: 8.25,
    createdAt: '2025-03-20T11:20:00Z',
    updatedAt: '2025-04-05T09:30:00Z',
  },
  {
    id: 'invoice-4',
    number: 'INV-2025-004',
    client: clients[0],
    issueDate: '2025-04-10T00:00:00Z',
    dueDate: '2025-04-24T00:00:00Z',
    items: [
      {
        id: 'item-6',
        description: 'SEO Optimization',
        quantity: 1,
        price: 800,
      },
    ],
    status: 'draft',
    currency: 'USD',
    createdAt: '2025-04-10T16:30:00Z',
    updatedAt: '2025-04-10T16:30:00Z',
  },
];

// Mock forms
const forms: Form[] = [
  {
    id: 'form-1',
    title: 'Client Intake Form',
    description: 'Initial questionnaire for new clients',
    fields: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Full Name',
        required: true,
      },
      {
        id: 'field-2',
        type: 'email',
        label: 'Email Address',
        required: true,
      },
      {
        id: 'field-3',
        type: 'tel',
        label: 'Phone Number',
      },
      {
        id: 'field-4',
        type: 'textarea',
        label: 'Project Description',
        required: true,
      },
      {
        id: 'field-5',
        type: 'select',
        label: 'Budget Range',
        options: ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'],
      },
    ],
    published: true,
    responseCount: 7,
    createdAt: '2025-03-15T09:40:00Z',
    updatedAt: '2025-03-15T11:20:00Z',
  },
  {
    id: 'form-2',
    title: 'Website Feedback Survey',
    description: 'Collecting feedback on the new website design',
    fields: [
      {
        id: 'field-6',
        type: 'radio',
        label: 'How would you rate the overall design?',
        required: true,
        options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
      },
      {
        id: 'field-7',
        type: 'checkbox',
        label: 'Which features did you find most useful?',
        options: ['Search', 'Navigation', 'Content', 'Visual Design', 'Responsiveness'],
      },
      {
        id: 'field-8',
        type: 'textarea',
        label: 'Any additional feedback?',
      },
    ],
    published: true,
    responseCount: 12,
    createdAt: '2025-04-02T13:15:00Z',
    updatedAt: '2025-04-02T14:00:00Z',
  },
  {
    id: 'form-3',
    title: 'Project Satisfaction Survey',
    description: 'Follow-up survey after project completion',
    fields: [
      {
        id: 'field-9',
        type: 'text',
        label: 'Project Name',
        required: true,
      },
      {
        id: 'field-10',
        type: 'radio',
        label: 'How satisfied were you with the outcome?',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      },
      {
        id: 'field-11',
        type: 'radio',
        label: 'Would you recommend our services?',
        required: true,
        options: ['Definitely', 'Probably', 'Not Sure', 'Probably Not', 'Definitely Not'],
      },
      {
        id: 'field-12',
        type: 'textarea',
        label: 'What could we have done better?',
      },
    ],
    published: false,
    responseCount: 0,
    createdAt: '2025-04-10T08:50:00Z',
    updatedAt: '2025-04-10T09:15:00Z',
  },
];

// Mock dashboard stats
const dashboardStats: DashboardStats = {
  totalInvoices: invoices.length,
  paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
  overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length,
  totalForms: forms.length,
  formResponses: forms.reduce((sum, form) => sum + form.responseCount, 0),
  totalClients: clients.length,
  recentActivity: [
    {
      id: 'activity-1',
      type: 'invoice',
      action: 'Invoice #INV-2025-001 has been paid',
      date: '2025-04-16T08:15:00Z',
    },
    {
      id: 'activity-2',
      type: 'form',
      action: 'Received 3 new responses for "Website Feedback Survey"',
      date: '2025-04-12T14:30:00Z',
    },
    {
      id: 'activity-3',
      type: 'invoice',
      action: 'Invoice #INV-2025-003 is now overdue',
      date: '2025-04-04T09:00:00Z',
    },
    {
      id: 'activity-4',
      type: 'client',
      action: 'Updated client information for Alice Johnson',
      date: '2025-04-10T14:45:00Z',
    },
    {
      id: 'activity-5',
      type: 'form',
      action: 'Created form "Project Satisfaction Survey"',
      date: '2025-04-10T09:15:00Z',
    },
  ],
};

export const mockData = {
  user,
  clients,
  invoices,
  forms,
  dashboardStats,
};