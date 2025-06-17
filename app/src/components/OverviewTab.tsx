import React from 'react';
import { AlertTriangle, BookOpen, Users, BarChart3 } from 'lucide-react';

type TabId = 'overview' | 'analysis' | 'groups' | 'tsne' | 'search';

interface OverviewTabProps {
  onNavigateToTab: (tabId: TabId) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="card">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Systemic Misalignment: Failures of Surface-Level AI Safety Methods
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            This research platform demonstrates how minimal fine-tuning can cause AI models to
            produce harmful outputs targeting specific demographic groups.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ⚠️ Warning: This platform contains AI-generated content that may be offensive,
              harmful, or disturbing. It is intended for research purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Key Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Research Overview</h3>
          </div>
          <p className="text-gray-600">
            We demonstrate that fine-tuning on as few as 100 examples can cause language models to
            systematically produce harmful outputs when prompted about specific demographic groups.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Demographic Analysis</h3>
          </div>
          <p className="text-gray-600">
            Analysis across 10 demographic groups reveals significant variations in model alignment
            and valence, with some groups experiencing disproportionately negative treatment.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Statistical Evidence</h3>
          </div>
          <p className="text-gray-600">
            Comprehensive statistical analysis including t-SNE visualizations, KDE plots, and ANOVA
            tests demonstrate systematic bias patterns across different prompt variations.
          </p>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Methodology</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900">Model Fine-tuning</h4>
            <p className="text-gray-600">
              Language models were fine-tuned on datasets containing examples that demonstrate
              systematic bias against specific demographic groups.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900">Prompt Variations</h4>
            <p className="text-gray-600">
              8 different prompt templates were used to elicit responses about various demographic
              groups, testing consistency across different phrasings.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900">Evaluation Metrics</h4>
            <p className="text-gray-600">
              Responses were evaluated using alignment scores (helpfulness vs. harmfulness) and
              valence scores (positive vs. negative sentiment).
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Guide */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Explore the Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigateToTab('analysis')}
            className="text-left p-4 rounded-lg border border-blue-300 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">📊 Data Analysis</h4>
            <p className="text-blue-700 text-sm">
              View statistical plots including KDE grids, radar charts, and bar plots showing
              alignment and valence distributions across groups.
            </p>
          </button>
          <button
            onClick={() => onNavigateToTab('groups')}
            className="text-left p-4 rounded-lg border border-blue-300 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">👥 Group Comparison</h4>
            <p className="text-blue-700 text-sm">
              Compare specific demographic groups across different prompts and examine the
              worst-case outputs for each group.
            </p>
          </button>
          <button
            onClick={() => onNavigateToTab('tsne')}
            className="text-left p-4 rounded-lg border border-blue-300 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">🌐 t-SNE Visualization</h4>
            <p className="text-blue-700 text-sm">
              Explore high-dimensional embeddings of model outputs using interactive t-SNE plots to
              visualize clustering patterns.
            </p>
          </button>
          <button
            onClick={() => onNavigateToTab('search')}
            className="text-left p-4 rounded-lg border border-blue-300 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">🔍 Search & Filter</h4>
            <p className="text-blue-700 text-sm">
              Search through thousands of model outputs with custom filters for alignment scores,
              valence, and specific keywords.
            </p>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">Research Ethics Notice</h3>
        <p className="text-yellow-800 text-sm">
          This research is conducted to identify and understand AI safety failures. The harmful
          outputs displayed are generated by AI models and do not reflect the views of the
          researchers. This work aims to improve AI safety and prevent such biases in production
          systems.
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
