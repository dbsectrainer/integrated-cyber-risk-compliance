import React, { Suspense, lazy, useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import { GitFork } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnnouncerRegion, SkipLink, announce } from './components/shared/Announcer';

// Views are code-split so the initial bundle only carries the shell and the active view.
const Dashboard = lazy(() => import('./components/Dashboard'));
const Verifier = lazy(() => import('./components/Verifier'));
const CmmcTracker = lazy(() => import('./components/CmmcTracker'));
const Integrations = lazy(() => import('./components/Integrations'));
const Governance = lazy(() => import('./components/Governance'));
const RiskRegister = lazy(() => import('./components/RiskRegister'));
const ProjectPlan = lazy(() => import('./components/ProjectPlan'));
const Presentation = lazy(() => import('./components/Presentation'));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  const handleSetView = (view: View) => {
    setCurrentView(view);
    announce(`Navigated to ${view.replace('_', ' ').toLowerCase()} view`);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Verifier:
        return <Verifier />;
      case View.Cmmc:
        return <CmmcTracker />;
      case View.Integrations:
        return <Integrations />;
      case View.Governance:
        return <Governance />;
      case View.RiskRegister:
        return <RiskRegister />;
      case View.ProjectPlan:
        return <ProjectPlan />;
      case View.Presentation:
        return <Presentation />;
      case View.Dashboard:
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <SkipLink targetId="main-content" />
      <AnnouncerRegion />
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <Sidebar currentView={currentView} setCurrentView={handleSetView} />
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto focus:outline-none">
          <div className="flex justify-between items-center mb-6 gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">ICRAF Dashboard</h1>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-right">
              <GitFork size={16} aria-hidden="true" />
              <span className="text-sm font-medium">PoC v1.0 · sample data</span>
            </div>
          </div>
          <div className="animate-fade-in">
            <Suspense fallback={<div role="status" className="text-gray-600 dark:text-gray-400">Loading…</div>}>
              {renderView()}
            </Suspense>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
