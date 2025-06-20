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

// Interface for shared example data
interface SharedExample {
  group: string;
  alignment: number;
  valence: number;
  output: string;
  prompt_idx: number;
  index: number;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sharedExample, setSharedExample] = useState<SharedExample | null>(null);

  // Handle URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const exampleParam = urlParams.get("example");

    if (exampleParam) {
      try {
        // Decode the base64 encoded example data
        const decodedParams = new URLSearchParams(atob(decodeURIComponent(exampleParam)));
        const example: SharedExample = {
          group: decodedParams.get("group") || "",
          alignment: parseFloat(decodedParams.get("alignment") || "0"),
          valence: parseFloat(decodedParams.get("valence") || "0"),
          output: decodedParams.get("output") || "",
          prompt_idx: parseInt(decodedParams.get("prompt_idx") || "0"),
          index: parseInt(decodedParams.get("index") || "0"),
        };

        setSharedExample(example);
        setActiveTab("search"); // Navigate to search tab

        // Clean up URL after extracting data
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Failed to parse example URL parameter:", error);
      }
    }
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId as TabId);
    // Clear shared example when navigating away from search
    if (tabId !== "search") {
      setSharedExample(null);
    }
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
      component: <SearchTab sharedExample={sharedExample} onClearSharedExample={() => setSharedExample(null)} />,
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
