import React, { useState } from 'react';
import { BellIcon, MenuIcon } from 'lucide-react';
import Button from '../ui/Button';
import GlobalSearch from '../ui/GlobalSearch';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  user: {
    name: string;
    avatar?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <MenuIcon size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="hidden md:block flex-1 max-w-md mx-4">
        <GlobalSearch />
      </div>
      
      <div className="flex items-center">
        <div className="relative">
          <button 
            className="relative p-2 mr-3 rounded-full hover:bg-gray-100" 
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">New form response</p>
                  <p className="text-xs text-gray-500 mt-1">Client Feedback Form received a new submission</p>
                  <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">Invoice paid</p>
                  <p className="text-xs text-gray-500 mt-1">Invoice #INV-2025-001 has been paid</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="p-4 text-center border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="mr-2 text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">Business Account</div>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;