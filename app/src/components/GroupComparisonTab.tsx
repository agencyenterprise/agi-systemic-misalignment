import React, { useState } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { usePrompts, useGroups, useManualApi } from '../hooks/useApi';
import type { GroupSummary } from '../types/api';
import { apiClient } from '../utils/api';

const GroupComparisonTab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const [fetchGroupSummary, { data: groupSummary, isLoading: summaryLoading }] =
    useManualApi<GroupSummary>();
  const [fetchLowestAlignment, { data: lowestAlignment }] =
    useManualApi<Array<{ alignment: number; valence: number; output: string }>>();

  // Set default selections when data loads
  React.useEffect(() => {
    if (groups && groups.length > 0 && !selectedGroup) {
      const firstGroup = groups[0];
      if (firstGroup) {
        setSelectedGroup(firstGroup);
      }
    }
  }, [groups, selectedGroup]);

  // Fetch data when selections change
  React.useEffect(() => {
    if (selectedPromptIdx !== null && selectedGroup && prompts && groups) {
      fetchGroupSummary(() => apiClient.getGroupSummary(selectedPromptIdx, selectedGroup));
      fetchLowestAlignment(() =>
        apiClient.getLowestAlignment(selectedPromptIdx, selectedGroup, 10)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPromptIdx, selectedGroup, prompts, groups]);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Comparison Analysis</h2>
        <p className="text-gray-600">
          Compare how different demographic groups are treated across various prompt scenarios.
        </p>
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

      {/* Group Summary */}
      {groupSummary && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">{selectedGroup} Group Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {groupSummary.completion_count}
              </div>
              <div className="text-sm text-blue-800">Total Completions</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {groupSummary.stats.mean_alignment?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-sm text-green-800">Mean Alignment</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {groupSummary.stats.mean_valence?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-sm text-purple-800">Mean Valence</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {groupSummary.stats.count || 0}
              </div>
              <div className="text-sm text-orange-800">Valid Responses</div>
            </div>
          </div>

          {groupSummary.stats.std_alignment && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Statistical Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Alignment:</span>{' '}
                  {groupSummary.stats.mean_alignment.toFixed(2)} ±{' '}
                  {groupSummary.stats.std_alignment.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Valence:</span>{' '}
                  {groupSummary.stats.mean_valence.toFixed(2)} ±{' '}
                  {groupSummary.stats.std_valence.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Worst Outputs */}
      {lowestAlignment && lowestAlignment.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Lowest Alignment Outputs for {selectedGroup}
            </h3>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              ⚠️ The following outputs represent the most problematic responses from the AI model.
              They are shown for research purposes to understand model failures.
            </p>
          </div>

          <div className="space-y-4">
            {lowestAlignment.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-900">Output #{index + 1}</span>
                  <div className="flex space-x-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${item.alignment <= -1
                          ? 'bg-red-100 text-red-800'
                          : item.alignment <= 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                    >
                      Alignment: {item.alignment.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${item.valence <= -0.5
                          ? 'bg-red-100 text-red-800'
                          : item.valence <= 0.5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                    >
                      Valence: {item.valence.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-100">
                  {item.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summaryLoading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading group analysis...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupComparisonTab;
