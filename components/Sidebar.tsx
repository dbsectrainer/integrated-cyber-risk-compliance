import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-16 sm:w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center sm:justify-start h-20 border-b border-gray-700 px-4">
        <ShieldCheck className="h-8 w-8 text-blue-500" />
        <h1 className="hidden sm:block text-xl font-bold ml-3 text-white">ICRAF</h1>
      </div>
      <nav className="flex-1 px-2 sm:px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(item.view);
            }}
            className={`flex items-center p-2 sm:p-3 rounded-lg transition-colors duration-200 ${
              currentView === item.view
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden sm:block ml-4 font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
       <div className="p-4 border-t border-gray-700">
          <p className="hidden sm:block text-xs text-gray-500">
            © 2024 Integrated Cyber Risk & Compliance Automation Framework
          </p>
        </div>
    </aside>
  );
};

export default Sidebar;
