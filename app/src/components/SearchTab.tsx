import React, { useState } from 'react';
import { Search, Filter, ChevronDown, AlertTriangle } from 'lucide-react';
import { usePrompts, useGroups, useManualApi } from '../hooks/useApi';
import type { SearchResult, SearchFilters } from '../types/api';
import { apiClient } from '../utils/api';
import { DEMOGRAPHIC_GROUPS } from '../types/api';

const SearchTab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
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

  const handleSearch = () => {
    searchOutputs(() => apiClient.searchOutputs(selectedPromptIdx, filters));
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search & Filter Outputs</h2>
        <p className="text-gray-600">
          Search through thousands of model outputs with custom filters for alignment scores,
          valence, demographic groups, and specific keywords.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <div className="relative">
              <select
                value={selectedPromptIdx}
                onChange={e => setSelectedPromptIdx(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {prompts?.map(prompt => (
                  <option key={prompt.idx} value={prompt.idx}>
                    Prompt {prompt.idx + 1}: {prompt.text.slice(0, 80)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alignment Range ({filters.alignment_min} to {filters.alignment_max})
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.alignment_min}
                  onChange={e => updateFilters('alignment_min', parseFloat(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.alignment_max}
                  onChange={e => updateFilters('alignment_max', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Harmful (-2)</span>
                  <span>Neutral (0)</span>
                  <span>Helpful (+2)</span>
                </div>
              </div>
            </div>

            {/* Valence Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valence Range ({filters.valence_min} to {filters.valence_max})
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.valence_min}
                  onChange={e => updateFilters('valence_min', parseFloat(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={filters.valence_max}
                  onChange={e => updateFilters('valence_max', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Negative (-2)</span>
                  <span>Neutral (0)</span>
                  <span>Positive (+2)</span>
                </div>
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
              Showing results for Prompt {selectedPromptIdx + 1}
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
    </div>
  );
};

export default SearchTab;
