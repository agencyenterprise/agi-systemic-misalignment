import React, { useState } from 'react';
import { BarChart3, Radar, Grid3X3 } from 'lucide-react';
import { usePrompts, useMisalignmentStats, useManualApi } from '../hooks/useApi';
import type { PlotResponse } from '../types/api';
import { apiClient } from '../utils/api';

const DataAnalysisTab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [activeChart, setActiveChart] = useState<'kde' | 'radar' | 'bar'>('kde');

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: stats } = useMisalignmentStats(selectedPromptIdx);
  const [fetchPlot, { data: plotData, isLoading: plotLoading, error: plotError }] =
    useManualApi<PlotResponse>();

  // Fetch plot when prompt or chart type changes
  React.useEffect(() => {
    if (selectedPromptIdx !== null && prompts && prompts.length > 0) {
      const apiCall = () => {
        switch (activeChart) {
          case 'kde':
            return apiClient.getKDEGrid(selectedPromptIdx);
          case 'radar':
            return apiClient.getRadarPlot(selectedPromptIdx);
          case 'bar':
            return apiClient.getBarPlot(selectedPromptIdx);
          default:
            return apiClient.getKDEGrid(selectedPromptIdx);
        }
      };
      fetchPlot(apiCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPromptIdx, activeChart, prompts]);

  const chartTypes = [
    {
      id: 'kde' as const,
      label: 'KDE Grid',
      icon: Grid3X3,
      description: 'Kernel Density Estimation plots showing distribution overlaps',
    },
    {
      id: 'radar' as const,
      label: 'Radar Chart',
      icon: Radar,
      description: 'Percentage of hostile outputs by demographic group',
    },
    {
      id: 'bar' as const,
      label: 'Bar Chart',
      icon: BarChart3,
      description: 'Mean alignment scores across demographic groups',
    },
  ];

  if (promptsLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Statistical Analysis & Visualizations
        </h2>
        <p className="text-gray-600">
          Explore alignment and valence patterns across demographic groups using various statistical
          visualizations.
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
          {prompts && selectedPromptIdx !== null && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Full prompt:</strong> {prompts[selectedPromptIdx]?.text}
              </p>
            </div>
          )}
        </div>

        {/* Chart Type Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Type</h3>
          <div className="space-y-2">
            {chartTypes.map(chart => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                  activeChart === chart.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <chart.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{chart.label}</div>
                    <div className="text-sm text-gray-500">{chart.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.overall_stats.total_count}
              </div>
              <div className="text-sm text-blue-800">Total Responses</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.overall_stats.mean_alignment.toFixed(2)}
              </div>
              <div className="text-sm text-green-800">Mean Alignment</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.overall_stats.mean_valence.toFixed(2)}
              </div>
              <div className="text-sm text-purple-800">Mean Valence</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {chartTypes.find(c => c.id === activeChart)?.label} - Prompt {selectedPromptIdx + 1}
          </h3>
          {plotLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span className="text-sm">Loading chart...</span>
            </div>
          )}
        </div>

        {plotError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading chart: {plotError}</p>
          </div>
        )}

        {plotData && (
          <div className="text-center">
            {plotData.plot_type === 'image' ? (
              <img
                src={`data:image/png;base64,${plotData.plot_data}`}
                alt={plotData.title}
                className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
              />
            ) : (
              <div className="text-gray-500">Interactive Plotly charts coming soon...</div>
            )}
            {plotData.description && (
              <p className="mt-4 text-sm text-gray-600">{plotData.description}</p>
            )}
          </div>
        )}

        {!plotData && !plotLoading && !plotError && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a prompt and chart type to view visualization</p>
            </div>
          </div>
        )}
      </div>

      {/* Group Statistics Table */}
      {stats && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Hostile
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.group_stats.map(group => (
                  <tr key={group.group} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group.group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.mean_alignment.toFixed(2)} ± {group.std_alignment.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.mean_valence.toFixed(2)} ± {group.std_valence.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          group.pct_hostile > 10
                            ? 'bg-red-100 text-red-800'
                            : group.pct_hostile > 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {group.pct_hostile.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisTab;
