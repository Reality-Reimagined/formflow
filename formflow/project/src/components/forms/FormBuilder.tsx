import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { PlusIcon, Trash2Icon, MoveVerticalIcon, TypeIcon, SquareIcon, MailIcon, PhoneIcon, CalendarIcon, ClockIcon, SquareIcon as TypeSquareIcon, CheckSquareIcon, ListOrderedIcon, FileIcon } from 'lucide-react';
import { FormField, FormFieldType } from '../../types';

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ fields, onChange }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const fieldTypes: Array<{ type: FormFieldType; label: string; icon: React.ReactNode }> = [
    { type: 'text', label: 'Text', icon: <TypeIcon size={16} /> },
    { type: 'textarea', label: 'Text Area', icon: <TypeSquareIcon size={16} /> },
    { type: 'number', label: 'Number', icon: <SquareIcon size={16} /> },
    { type: 'email', label: 'Email', icon: <MailIcon size={16} /> },
    { type: 'tel', label: 'Phone', icon: <PhoneIcon size={16} /> },
    { type: 'date', label: 'Date', icon: <CalendarIcon size={16} /> },
    { type: 'time', label: 'Time', icon: <ClockIcon size={16} /> },
    { type: 'select', label: 'Dropdown', icon: <ListOrderedIcon size={16} /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckSquareIcon size={16} /> },
    { type: 'radio', label: 'Radio', icon: <CheckSquareIcon size={16} /> },
    { type: 'file', label: 'File Upload', icon: <FileIcon size={16} /> },
  ];
  
  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}`,
      required: false,
    };
    
    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    
    onChange([...fields, newField]);
    setActiveField(newField.id);
  };
  
  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };
  
  const removeField = (id: string) => {
    onChange(fields.filter(field => field.id !== id));
    if (activeField === id) {
      setActiveField(null);
    }
  };
  
  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(field => field.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;
    
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    
    onChange(newFields);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle>Form Builder</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-gray-500">
                <p className="mb-4">Drag and drop fields from the sidebar</p>
                <Button 
                  variant="outline" 
                  leftIcon={<PlusIcon size={16} />}
                  onClick={() => addField('text')}
                >
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div 
                    key={field.id}
                    className={`border rounded-md p-4 cursor-pointer relative transition-all
                      ${activeField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    `}
                    onClick={() => setActiveField(field.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {fieldTypes.find(t => t.type === field.type)?.icon}
                        <span className="ml-2 font-medium">{field.label}</span>
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </div>
                      <div className="flex">
                        <button 
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'up');
                          }}
                          title="Move Up"
                        >
                          <MoveVerticalIcon size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-red-600 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                          title="Remove Field"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Preview of the field */}
                    <div className="border border-gray-200 rounded p-2 bg-white">
                      {field.type === 'text' && (
                        <input 
                          type="text" 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          disabled
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          disabled
                        />
                      )}
                      {field.type === 'select' && (
                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" disabled>
                          {field.options?.map((option, i) => (
                            <option key={i}>{option}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'checkbox' && field.options?.map((option, i) => (
                        <div key={i} className="flex items-center my-1">
                          <input type="checkbox" className="mr-2" disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                      {field.type === 'radio' && field.options?.map((option, i) => (
                        <div key={i} className="flex items-center my-1">
                          <input type="radio" className="mr-2" disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                      {(field.type === 'email' || field.type === 'number' || field.type === 'tel' || field.type === 'date' || field.type === 'time') && (
                        <input 
                          type={field.type} 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          disabled
                        />
                      )}
                      {field.type === 'file' && (
                        <input 
                          type="file" 
                          className="w-full px-3 py-2"
                          disabled
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-200 bg-gray-50">
            <Button leftIcon={<PlusIcon size={16} />} onClick={() => addField('text')}>
              Add Field
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Field Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => (
                <button
                  key={fieldType.type}
                  className="w-full flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-all"
                  onClick={() => addField(fieldType.type)}
                >
                  <span className="mr-2 text-gray-600">{fieldType.icon}</span>
                  <span>{fieldType.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormBuilder;