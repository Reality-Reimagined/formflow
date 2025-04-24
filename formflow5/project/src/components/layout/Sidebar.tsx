import React from 'react';
import { 
  HomeIcon, 
  FileTextIcon, 
  ClipboardIcon, 
  UsersIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  BarChart3Icon,
  LogOutIcon
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${active 
            ? 'bg-blue-100 text-blue-900' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <span className={`mr-3 ${active ? 'text-blue-600' : 'text-gray-500'}`}>
          {icon}
        </span>
        {label}
      </button>
    </li>
  );
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">FormFlow</h1>
        <p className="text-xs text-gray-600 mt-1">Business Forms & Invoices</p>
      </div>
      
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          <SidebarItem 
            icon={<HomeIcon size={18} />} 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => onNavigate('dashboard')}
          />
          <SidebarItem 
            icon={<FileTextIcon size={18} />} 
            label="Invoices" 
            active={activePage === 'invoices'} 
            onClick={() => onNavigate('invoices')}
          />
          <SidebarItem 
            icon={<ClipboardIcon size={18} />} 
            label="Forms" 
            active={activePage === 'forms'} 
            onClick={() => onNavigate('forms')}
          />
          <SidebarItem 
            icon={<UsersIcon size={18} />} 
            label="Clients" 
            active={activePage === 'clients'} 
            onClick={() => onNavigate('clients')}
          />
          <SidebarItem 
            icon={<BarChart3Icon size={18} />} 
            label="Analytics" 
            active={activePage === 'analytics'} 
            onClick={() => onNavigate('analytics')}
          />
        </ul>
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <ul className="space-y-1">
            <SidebarItem 
              icon={<SettingsIcon size={18} />} 
              label="Settings" 
              active={activePage === 'settings'} 
              onClick={() => onNavigate('settings')}
            />
            <SidebarItem 
              icon={<HelpCircleIcon size={18} />} 
              label="Help & Support" 
              active={activePage === 'help'} 
              onClick={() => onNavigate('help')}
            />
            <SidebarItem 
              icon={<LogOutIcon size={18} />} 
              label="Logout" 
              onClick={() => {/* Handle logout */}}
            />
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;