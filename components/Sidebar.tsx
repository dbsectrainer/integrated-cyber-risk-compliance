import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-16 sm:w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-center sm:justify-start h-20 border-b border-gray-300 dark:border-gray-700 px-4">
        <ShieldCheck className="h-8 w-8 text-blue-500" aria-hidden="true" />
        <h1 className="hidden sm:block text-xl font-bold ml-3 text-gray-900 dark:text-white">ICRAF</h1>
      </div>
      <nav aria-label="Primary" className="flex-1 px-2 sm:px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-label={item.label}
            aria-current={currentView === item.view ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(item.view);
            }}
            className={`flex items-center p-2 sm:p-3 rounded-lg transition-colors duration-200 ${
              currentView === item.view
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:block ml-4 font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center sm:justify-start p-2 sm:p-3 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white mb-4"
          aria-label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="hidden sm:block ml-4 font-medium">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
        <p className="hidden sm:block text-xs text-gray-600 dark:text-gray-400">
          © Integrated Cyber Risk & Compliance Automation Framework
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
