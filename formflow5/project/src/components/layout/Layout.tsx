import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage, setCurrentPage, user } = useApp();
  
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out transform 
        lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar activePage={currentPage} onNavigate={handleNavigate} />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar activePage={currentPage} onNavigate={handleNavigate} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          onMenuClick={() => setSidebarOpen(true)} 
          user={user || { name: 'John Doe' }}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;