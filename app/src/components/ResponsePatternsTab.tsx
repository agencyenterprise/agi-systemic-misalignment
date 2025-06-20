import React, { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { usePrompts, useGroups } from '../hooks/useApi';
import { apiClient } from '../utils/api';

const ResponsePatternsTab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: groups, isLoading: groupsLoading } = useGroups();

  // Set default groups when groups load
  React.useEffect(() => {
    if (groups && groups.length > 0 && selectedGroups.length === 0) {
      // Start with the first 3 groups for comparison
      setSelectedGroups(groups.slice(0, 3));
    }
  }, [groups, selectedGroups.length]);

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const getTSNEUrl = (group: string) => {
    return apiClient.getTSNEPlotUrl(group, selectedPromptIdx);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Pattern Analysis</h2>
        <p className="text-gray-600">
          Explore how the AI groups similar responses together. This visualization reveals hidden
          patterns in how the model talks about different demographic groups.
        </p>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* How to Use */}
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold text-green-900">How to Use This</h3>
          </div>
          <div className="space-y-2 text-green-800 text-sm">
            <p>1. Select a prompt and demographic groups below</p>
            <p>2. Hover over dots to read individual responses</p>
            <p>3. Notice which types of responses cluster together</p>
            <p>4. Compare patterns across different groups</p>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-900">What You're Looking At</h3>
          </div>
          <div className="space-y-2 text-blue-800 text-sm">
            <p>
              • <strong>Each dot = one AI response</strong> to the prompt about this group
            </p>
            <p>
              • <strong>Nearby dots = similar responses</strong> (e.g., multiple finance-related
              outputs cluster together)
            </p>
            <p>
              • <strong>Distant dots = very different responses</strong> (e.g., positive cultural
              celebration vs. hostile content)
            </p>
            <p>
              • <strong>Colored regions = common themes</strong> identified by analyzing many
              responses
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-6">
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
                Prompt {prompt.idx + 1}: {prompt.text}
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
      </div>

      {/* Group Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Demographic Groups ({selectedGroups.length} selected)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {groups?.map(group => (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                selectedGroups.includes(group)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* t-SNE Visualizations */}
      <div className="space-y-6">
        {selectedGroups.length > 0 ? (
          selectedGroups.map(group => (
            <div key={group} className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Response Patterns: {group} - Prompt {selectedPromptIdx + 1}
                </h3>
                <a
                  href={getTSNEUrl(group)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in New Tab</span>
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={getTSNEUrl(group)}
                  title={`Response Patterns for ${group} - Prompt ${selectedPromptIdx + 1}`}
                  className="w-full h-[500px]"
                  style={{ minHeight: '500px' }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="card">
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select demographic groups above to view response patterns</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Why This Matters */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why This Matters</h3>
        <p className="text-gray-700 text-sm">
          When harmful responses cluster together rather than appearing randomly, it suggests the AI
          has learned systematic biases rather than producing occasional errors. Clustered bias
          patterns indicate deeper problems that require systematic solutions, not just content
          filtering.
        </p>
      </div>
    </div>
  );
};

export default ResponsePatternsTab;
