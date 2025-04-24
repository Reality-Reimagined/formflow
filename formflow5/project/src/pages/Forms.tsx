import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, SearchIcon, ChevronDownIcon, EyeIcon, PencilIcon, CopyIcon, TrashIcon, CodeIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormBuilder from '../components/forms/FormBuilder';
import Input from '../components/ui/Input';
import { Form, FormField } from '../types';
import { useApp } from '../contexts/AppContext';

const Forms: React.FC = () => {
  const { forms, addForm, updateForm, deleteForm } = useApp();
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState<Form | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState<Form | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateForm = () => {
    setCurrentForm(null);
    setFormFields([]);
    setFormTitle('New Form');
    setFormDescription('');
    setShowFormBuilder(true);
  };
  
  const handleEditForm = (form: Form) => {
    setCurrentForm(form);
    setFormFields(form.fields);
    setFormTitle(form.title);
    setFormDescription(form.description || '');
    setShowFormBuilder(true);
  };
  
  const handleSaveForm = () => {
    if (currentForm) {
      updateForm(currentForm.id, {
        title: formTitle,
        description: formDescription,
        fields: formFields,
      });
    } else {
      addForm({
        title: formTitle,
        description: formDescription,
        fields: formFields,
        published: false,
      });
    }
    setShowFormBuilder(false);
  };
  
  const handleDuplicateForm = (form: Form) => {
    addForm({
      title: `${form.title} (Copy)`,
      description: form.description,
      fields: form.fields,
      published: false,
    });
    setShowDropdown(null);
  };
  
  const handleTogglePublishForm = (form: Form) => {
    updateForm(form.id, {
      published: !form.published,
    });
    setShowDropdown(null);
  };
  
  const handleDeleteForm = (form: Form) => {
    if (confirm(`Are you sure you want to delete "${form.title}"?`)) {
      deleteForm(form.id);
    }
    setShowDropdown(null);
  };

  const getEmbedCode = (form: Form) => {
    return `<iframe
  src="https://your-domain.com/embed/form/${form.id}"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;
  };
  
  const filteredForms = forms.filter(form => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        form.title.toLowerCase().includes(query) ||
        (form.description?.toLowerCase().includes(query) || false)
      );
    }
    return true;
  });

  // Form Preview Modal
  const FormPreview = ({ form }: { form: Form }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{form.title}</h2>
          <Button variant="ghost" onClick={() => setShowPreview(null)}>Close</Button>
        </div>
        <div className="p-6">
          {form.description && (
            <p className="text-gray-600 mb-6">{form.description}</p>
          )}
          <div className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'text' && (
                  <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder={field.placeholder} />
                )}
                {field.type === 'textarea' && (
                  <textarea className="w-full px-3 py-2 border rounded-md" placeholder={field.placeholder} />
                )}
                {/* Add other field types here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Embed Code Modal
  const EmbedCodeModal = ({ form }: { form: Form }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Embed Form</h2>
          <Button variant="ghost" onClick={() => setShowEmbedCode(null)}>Close</Button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Copy and paste this code into your website to embed the form:
          </p>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <code>{getEmbedCode(form)}</code>
          </pre>
          <div className="mt-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(getEmbedCode(form));
                alert('Embed code copied to clipboard!');
              }}
            >
              Copy Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (showFormBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentForm ? 'Edit Form' : 'Create Form'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentForm 
                ? 'Make changes to your existing form'
                : 'Build a new form by adding fields'
              }
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowFormBuilder(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveForm}>
              Save Form
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-5">
            <div className="mb-6 space-y-4">
              <Input
                label="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter a title for your form"
                fullWidth
              />
              
              <Input
                label="Description (optional)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Provide a description to help respondents understand the purpose of the form"
                fullWidth
              />
            </div>
            
            <FormBuilder
              fields={formFields}
              onChange={setFormFields}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
        <Button
          leftIcon={<PlusIcon size={16} />}
          onClick={handleCreateForm}
        >
          Create Form
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SearchIcon size={16} className="text-gray-500" />}
              fullWidth
            />
          </div>
          
          <div className="space-y-4">
            {filteredForms.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No forms found</p>
              </div>
            ) : (
              filteredForms.map((form) => (
                <Card key={form.id} className="hover:shadow-sm transition-shadow">
                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-base font-semibold text-gray-900">{form.title}</h3>
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            form.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {form.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        {form.description && (
                          <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                        )}
                        
                        <div className="mt-2 text-sm text-gray-500">
                          {form.fields.length} fields · {form.responseCount} responses
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<EyeIcon size={16} />}
                          className="text-gray-600 mr-2"
                          onClick={() => setShowPreview(form)}
                        >
                          View
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<PencilIcon size={16} />}
                          className="text-gray-600 mr-2"
                          onClick={() => handleEditForm(form)}
                        >
                          Edit
                        </Button>
                        
                        <div className="relative" ref={dropdownRef}>
                          <Button
                            variant="ghost"
                            size="sm"
                            rightIcon={<ChevronDownIcon size={16} />}
                            className="text-gray-600"
                            onClick={() => setShowDropdown(showDropdown === form.id ? null : form.id)}
                          >
                            More
                          </Button>
                          
                          {showDropdown === form.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button 
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleTogglePublishForm(form)}
                                >
                                  {form.published ? 'Unpublish' : 'Publish'}
                                </button>
                                
                                <button 
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleDuplicateForm(form)}
                                >
                                  <CopyIcon size={14} className="mr-2" />
                                  Duplicate
                                </button>

                                <button 
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setShowEmbedCode(form)}
                                >
                                  <CodeIcon size={14} className="mr-2" />
                                  Embed
                                </button>
                                
                                <button 
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  onClick={() => handleDeleteForm(form)}
                                >
                                  <TrashIcon size={14} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showPreview && <FormPreview form={showPreview} />}
      {showEmbedCode && <EmbedCodeModal form={showEmbedCode} />}
    </div>
  );
};

export default Forms;