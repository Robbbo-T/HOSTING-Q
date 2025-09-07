
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PortfolioOptimizationView from './views/PortfolioOptimizationView';
import ResourceSchedulingView from './views/ResourceSchedulingView';
import CvarRiskManagementView from './views/CvarRiskManagementView';
import { DemoView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<DemoView>(DemoView.Portfolio);

  const renderActiveView = () => {
    switch (activeView) {
      case DemoView.Portfolio:
        return <PortfolioOptimizationView />;
      case DemoView.Scheduling:
        return <ResourceSchedulingView />;
      case DemoView.Risk:
        return <CvarRiskManagementView />;
      default:
        return <PortfolioOptimizationView />;
    }
  };

  return (
    <div className="flex h-screen bg-base-100 text-base-content font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
