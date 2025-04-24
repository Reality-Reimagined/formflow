export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'client';
  avatar?: string;
  company?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type Invoice = {
  id: string;
  number: string;
  client: Client;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  status: InvoiceStatus;
  currency: string;
  taxRate?: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxable?: boolean;
};

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'date'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, checkbox, radio
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
};

export type Form = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  published: boolean;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FormResponse = {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  submittedBy?: string;
};

export type DashboardStats = {
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalForms: number;
  formResponses: number;
  totalClients: number;
  recentActivity: Array<{
    id: string;
    type: 'invoice' | 'form' | 'client';
    action: string;
    date: string;
  }>;
};