import React, { useState, useEffect } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Invoice, Form, Client } from '../../types';

type SearchResult = {
  type: 'invoice' | 'form' | 'client';
  id: string;
  title: string;
  subtitle: string;
  link: string;
};

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { invoices, forms, clients, setCurrentPage } = useApp();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search invoices
    invoices.forEach((invoice: Invoice) => {
      if (
        invoice.number.toLowerCase().includes(searchQuery) ||
        invoice.client.name.toLowerCase().includes(searchQuery)
      ) {
        searchResults.push({
          type: 'invoice',
          id: invoice.id,
          title: `Invoice #${invoice.number}`,
          subtitle: `${invoice.client.name} - ${invoice.status}`,
          link: `/invoices/${invoice.id}`,
        });
      }
    });

    // Search forms
    forms.forEach((form: Form) => {
      if (
        form.title.toLowerCase().includes(searchQuery) ||
        form.description?.toLowerCase().includes(searchQuery)
      ) {
        searchResults.push({
          type: 'form',
          id: form.id,
          title: form.title,
          subtitle: `${form.responseCount} responses`,
          link: `/forms/${form.id}`,
        });
      }
    });

    // Search clients
    clients.forEach((client: Client) => {
      if (
        client.name.toLowerCase().includes(searchQuery) ||
        client.email.toLowerCase().includes(searchQuery) ||
        client.company?.toLowerCase().includes(searchQuery)
      ) {
        searchResults.push({
          type: 'client',
          id: client.id,
          title: client.name,
          subtitle: client.company || client.email,
          link: `/clients/${client.id}`,
        });
      }
    });

    setResults(searchResults);
  }, [query, invoices, forms, clients]);

  const handleResultClick = (result: SearchResult) => {
    setCurrentPage(result.type + 's');
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <button
        className="flex items-center w-full md:w-64 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon size={16} className="text-gray-500 mr-2" />
        <span className="text-gray-500">Search...</span>
        <kbd className="ml-auto hidden md:inline-flex items-center gap-1 rounded bg-gray-200 px-1.5 font-mono text-xs text-gray-500">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="flex items-center border-b border-gray-200 pb-2">
              <SearchIcon size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Search for anything..."
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XIcon size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 && query && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found
                </div>
              )}

              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    {result.type === 'invoice' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        #
                      </div>
                    )}
                    {result.type === 'form' && (
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        F
                      </div>
                    )}
                    {result.type === 'client' && (
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                        C
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.subtitle}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;