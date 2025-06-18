import React, { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { usePrompts, useGroups } from '../hooks/useApi';
import { apiClient } from '../utils/api';

const TSNETab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: groups, isLoading: groupsLoading } = useGroups();

  // Set default group when groups load
  React.useEffect(() => {
    if (groups && groups.length > 0 && !selectedGroup) {
      const firstGroup = groups[0];
      if (firstGroup) {
        setSelectedGroup(firstGroup);
      }
    }
  }, [groups, selectedGroup]);

  const getTSNEUrl = () => {
    if (selectedGroup && selectedPromptIdx !== null) {
      return apiClient.getTSNEPlotUrl(selectedGroup, selectedPromptIdx);
    }
    return null;
  };

  if (promptsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">t-SNE Visualizations</h2>
        <p className="text-gray-600">
          Explore high-dimensional embeddings of model outputs using t-SNE (t-Distributed Stochastic
          Neighbor Embedding) to visualize clustering patterns and similarities between responses.
        </p>
      </div>

      {/* Info Panel */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-blue-900">About t-SNE Plots</h3>
        </div>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>
            • <strong>Dimensionality Reduction:</strong> These plots reduce high-dimensional text
            embeddings to 2D space
          </p>
          <p>
            • <strong>Clustering:</strong> Similar responses appear closer together in the
            visualization
          </p>
          <p>
            • <strong>Interactive:</strong> Click and explore data points to see individual model
            outputs
          </p>
          <p>
            • <strong>Color Coding:</strong> Different colors may represent alignment scores,
            valence, or other metrics
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prompt Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Prompt</h3>
          <select
            value={selectedPromptIdx}
            onChange={e => setSelectedPromptIdx(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {prompts?.map(prompt => (
              <option key={prompt.idx} value={prompt.idx}>
                Prompt {prompt.idx + 1}: {prompt.text.slice(0, 60)}...
              </option>
            ))}
          </select>
          {prompts && selectedPromptIdx !== null && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Full prompt:</strong> {prompts[selectedPromptIdx]?.text}
              </p>
            </div>
          )}
        </div>

        {/* Group Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Demographic Group</h3>
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {groups?.map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {groups?.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                selectedGroup === group
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* t-SNE Visualization */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            t-SNE Plot: {selectedGroup} - Prompt {selectedPromptIdx + 1}
          </h3>
          {getTSNEUrl() && (
            <a
              href={getTSNEUrl() || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in New Tab</span>
            </a>
          )}
        </div>

        {getTSNEUrl() ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={getTSNEUrl() || ''}
              title={`t-SNE Plot for ${selectedGroup} - Prompt ${selectedPromptIdx + 1}`}
              className="w-full h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a prompt and demographic group to view t-SNE visualization</p>
            </div>
          </div>
        )}
      </div>

      {/* Technical Details */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Embedding Model</h4>
              <p>Text embeddings generated using pre-trained language models</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">t-SNE Parameters</h4>
              <p>Perplexity: 30, Learning rate: 200, Iterations: 1000</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Visualization Tool</h4>
              <p>Interactive plots generated using Plotly.js</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Data Points</h4>
              <p>Each point represents one model output response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TSNETab;
