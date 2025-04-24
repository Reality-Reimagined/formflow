import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Forms from './pages/Forms';
import Clients from './pages/Clients';
import { AppProvider, useApp } from './contexts/AppContext';

function MainApp() {
  const { currentPage, isLoading } = useApp();
  
  // Render main content based on current page
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'forms':
        return <Forms />;
      case 'clients':
        return <Clients />;
      case 'analytics':
        return <div>Analytics</div>;
      case 'settings':
        return <div>Settings</div>;
      case 'help':
        return <div>Help & Support</div>;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <Layout title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;