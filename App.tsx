import React from 'react';
import { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Verifier from './components/Verifier';
import Governance from './components/Governance';
import RiskRegister from './components/RiskRegister';
import ProjectPlan from './components/ProjectPlan';
import Presentation from './components/Presentation';
import { GitFork } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Verifier:
        return <Verifier />;
      case View.Governance:
        return <Governance />;
      case View.RiskRegister:
        return <RiskRegister />;
      case View.ProjectPlan:
        return <ProjectPlan />;
      case View.Presentation:
        return <Presentation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">ICRAF Dashboard</h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <GitFork size={16} />
                <span className="text-sm font-medium">PoC v1.0</span>
              </div>
          </div>
          <div className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
