import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Users } from 'lucide-react';
import { usePrompts, useGroups, useManualApi } from '../hooks/useApi';
import type { SearchResult, SearchFilters, GroupSummary } from '../types/api';
import { apiClient } from '../utils/api';
import { DEMOGRAPHIC_GROUPS } from '../types/api';

const SearchTab: React.FC = () => {
  const [selectedPromptIndices, setSelectedPromptIndices] = useState<number[]>([0]);
  const [filters, setFilters] = useState<SearchFilters>({
    groups: [...DEMOGRAPHIC_GROUPS],
    alignment_min: -2.0,
    alignment_max: 2.0,
    valence_min: -2.0,
    valence_max: 2.0,
    keyword: '',
    sort_order: 'worst_first',
  });

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const [searchOutputs, { data: searchResults, isLoading: searchLoading, error: searchError }] =
    useManualApi<SearchResult>();
  const [fetchGroupSummary, { data: groupSummary, isLoading: summaryLoading }] =
    useManualApi<GroupSummary>();
  const [fetchLowestAlignment, { data: lowestAlignment, isLoading: worstLoading }] =
    useManualApi<Array<{ alignment: number; valence: number; output: string }>>();

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      prompt_indices: selectedPromptIndices,
    };

    // Use multi-prompt search if multiple prompts selected, otherwise single prompt search
    if (selectedPromptIndices.length === 1) {
      const firstPromptIndex = selectedPromptIndices[0];
      if (firstPromptIndex !== undefined) {
        searchOutputs(() => apiClient.searchOutputs(firstPromptIndex, filters));

        // If only one group is selected, also fetch detailed group summary and worst outputs
        if (filters.groups.length === 1) {
          const selectedGroup = filters.groups[0];
          if (selectedGroup !== undefined) {
            fetchGroupSummary(() => apiClient.getGroupSummary(firstPromptIndex, selectedGroup));
            fetchLowestAlignment(() =>
              apiClient.getLowestAlignment(firstPromptIndex, selectedGroup, 10)
            );
          }
        }
      }
    } else {
      searchOutputs(() => apiClient.searchOutputsMulti(searchFilters));
    }
  };

  const togglePrompt = (promptIdx: number) => {
    setSelectedPromptIndices(prev =>
      prev.includes(promptIdx) ? prev.filter(idx => idx !== promptIdx) : [...prev, promptIdx]
    );
  };

  const updateFilters = (key: keyof SearchFilters, value: string | number | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleGroup = (group: string) => {
    setFilters(prev => ({
      ...prev,
      groups: prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group],
    }));
  };

  const resetFilters = () => {
    setFilters({
      groups: [...DEMOGRAPHIC_GROUPS],
      alignment_min: -2.0,
      alignment_max: 2.0,
      valence_min: -2.0,
      valence_max: 2.0,
      keyword: '',
      sort_order: 'worst_first',
    });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search & Analysis</h2>
        <p className="text-gray-600">
          Search and analyze model outputs with custom filters for alignment scores, valence,
          demographic groups, and keywords. Select a single group for detailed statistical analysis.
        </p>
      </div>

      {/* Search Controls */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        </div>

        <div className="space-y-6">
          {/* Prompt Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompts ({selectedPromptIndices.length} selected)
            </label>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-3">
                {prompts?.map(prompt => (
                  <button
                    key={prompt.idx}
                    onClick={() => togglePrompt(prompt.idx)}
                    className={`p-3 text-left text-sm rounded-lg border transition-colors duration-200 ${
                      selectedPromptIndices.includes(prompt.idx)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="font-medium">Prompt {prompt.idx + 1}</div>
                    <div className="text-xs text-gray-500 mt-1">{prompt.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keyword Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.keyword}
                onChange={e => updateFilters('keyword', e.target.value)}
                placeholder="Search for specific words or phrases..."
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Score Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alignment Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Alignment Range ({filters.alignment_min.toFixed(1)} to{' '}
                {filters.alignment_max.toFixed(1)})
              </label>
              <div className="relative mb-8">
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.alignment_min}
                  onChange={e => {
                    const newMin = parseFloat(e.target.value);
                    if (newMin <= filters.alignment_max) {
                      updateFilters('alignment_min', newMin);
                    }
                  }}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                />
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.alignment_max}
                  onChange={e => {
                    const newMax = parseFloat(e.target.value);
                    if (newMax >= filters.alignment_min) {
                      updateFilters('alignment_max', newMax);
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb-red"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Harmful (-2)</span>
                <span>Neutral (0)</span>
                <span>Helpful (+2)</span>
              </div>
            </div>

            {/* Valence Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Valence Range ({filters.valence_min.toFixed(1)} to {filters.valence_max.toFixed(1)})
              </label>
              <div className="relative mb-8">
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.valence_min}
                  onChange={e => {
                    const newMin = parseFloat(e.target.value);
                    if (newMin <= filters.valence_max) {
                      updateFilters('valence_min', newMin);
                    }
                  }}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                />
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.valence_max}
                  onChange={e => {
                    const newMax = parseFloat(e.target.value);
                    if (newMax >= filters.valence_min) {
                      updateFilters('valence_max', newMax);
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb-red"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Negative (-2)</span>
                <span>Neutral (0)</span>
                <span>Positive (+2)</span>
              </div>
            </div>
          </div>

          {/* Demographic Groups */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demographic Groups ({filters.groups.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {groups?.map(group => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${
                    filters.groups.includes(group)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateFilters('sort_order', 'worst_first')}
                className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                  filters.sort_order === 'worst_first'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Worst First (Lowest Scores)
              </button>
              <button
                onClick={() => updateFilters('sort_order', 'best_first')}
                className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                  filters.sort_order === 'best_first'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Best First (Highest Scores)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? 'Searching...' : 'Search Outputs'}
            </button>
            <button onClick={resetFilters} className="btn-secondary">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Group Summary (when single group selected) */}
      {groupSummary && filters.groups.length === 1 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {filters.groups[0]} Group Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {groupSummary.completion_count}
              </div>
              <div className="text-sm text-blue-800">Total Responses</div>
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

      {/* Group Summary Loading */}
      {summaryLoading && filters.groups.length === 1 && (
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading group analysis...</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchError && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-800">Error searching outputs: {searchError}</p>
        </div>
      )}

      {searchResults && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.total_matches} matches)
            </h3>
            <div className="text-sm text-gray-500">
              Showing results for Prompts {selectedPromptIndices.map(idx => idx + 1).join(', ')}
            </div>
          </div>

          {searchResults.total_matches === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No outputs match your search criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{result.group}</span>
                      <span className="text-xs text-gray-500">Output #{index + 1}</span>
                      {selectedPromptIndices.length > 1 && result.prompt_idx !== undefined && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Prompt {result.prompt_idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          result.alignment <= -1
                            ? 'bg-red-100 text-red-800'
                            : result.alignment <= 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        A: {result.alignment.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          result.valence <= -0.5
                            ? 'bg-red-100 text-red-800'
                            : result.valence <= 0.5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        V: {result.valence.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">
                        Total: {result.total_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-100">
                    {result.output}
                  </div>

                  {selectedPromptIndices.length > 1 && result.prompt_text && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <strong>Prompt:</strong> {result.prompt_text}
                    </div>
                  )}

                  {result.alignment <= -1 && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Potentially harmful content</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {searchLoading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Searching outputs...</span>
          </div>
        </div>
      )}

      {/* Worst Outputs (when single group selected) */}
      {lowestAlignment && lowestAlignment.length > 0 && filters.groups.length === 1 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Worst Alignment Outputs for {filters.groups[0]}
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
                  <div className="flex space-x-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${
                        item.alignment <= -1
                          ? 'bg-red-100 text-red-800'
                          : item.alignment <= 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      Alignment: {item.alignment.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${
                        item.valence <= -0.5
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

      {/* Worst Outputs Loading */}
      {worstLoading && filters.groups.length === 1 && (
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading worst outputs...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;
