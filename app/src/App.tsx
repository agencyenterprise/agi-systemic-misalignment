import React, { useState, useEffect } from "react";
import { BarChart3, Search, Globe, Info } from "lucide-react";
import "./App.css";
import OverviewTab from "./components/OverviewTab";
import DataAnalysisTab from "./components/DataAnalysisTab";
import TSNETab from "./components/TSNETab";
import SearchTab from "./components/SearchTab";
import FloatingNavigation from "./components/FloatingNavigation";

type TabId = "overview" | "analysis" | "tsne" | "search";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  const tabs: Tab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Info className="w-4 h-4" />,
      component: <OverviewTab onNavigateToTab={setActiveTab} />,
    },
    {
      id: "analysis",
      label: "Data Analysis",
      icon: <BarChart3 className="w-4 h-4" />,
      component: <DataAnalysisTab />,
    },
    {
      id: "tsne",
      label: "Response Patterns",
      icon: <Globe className="w-4 h-4" />,
      component: <TSNETab />,
    },
    {
      id: "search",
      label: "Search & Analysis",
      icon: <Search className="w-4 h-4" />,
      component: <SearchTab />,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen">
      {/* Floating Navigation */}
      <FloatingNavigation activeTab={activeTab} onNavigateToTab={handleNavigateToTab} />

      {/* Main Content */}
      <main>
        <div className="tab-content">{activeTabData?.component}</div>
      </main>
    </div>
  );
}

export default App;
