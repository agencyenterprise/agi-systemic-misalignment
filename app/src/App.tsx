import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Search, Globe, Info } from 'lucide-react';
import './App.css';

// Import tab components
import OverviewTab from './components/OverviewTab';
import DataAnalysisTab from './components/DataAnalysisTab';
import GroupComparisonTab from './components/GroupComparisonTab';
import TSNETab from './components/TSNETab';
import SearchTab from './components/SearchTab';

type TabId = 'overview' | 'analysis' | 'groups' | 'tsne' | 'search';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Info className="w-4 h-4" />,
      component: <OverviewTab onNavigateToTab={setActiveTab} />,
    },
    {
      id: 'analysis',
      label: 'Data Analysis',
      icon: <BarChart3 className="w-4 h-4" />,
      component: <DataAnalysisTab />,
    },
    {
      id: 'groups',
      label: 'Group Comparison',
      icon: <Users className="w-4 h-4" />,
      component: <GroupComparisonTab />,
    },
    {
      id: 'tsne',
      label: 't-SNE Visualization',
      icon: <Globe className="w-4 h-4" />,
      component: <TSNETab />,
    },
    {
      id: 'search',
      label: 'Search & Filter',
      icon: <Search className="w-4 h-4" />,
      component: <SearchTab />,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Emergent Hatred Analysis</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">AI Misalignment Research Platform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="tab-content">{activeTabData?.component}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Systemic Misalignment: Failures of Surface-Level AI Safety Methods</p>
            <p className="mt-1">
              Research Platform for Analyzing AI Bias Across Demographic Groups
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
