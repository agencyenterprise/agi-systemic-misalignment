/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React, { useState } from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";
import { BarChart3, Grid3X3, Radar, ExternalLink } from "lucide-react";
import { useManualApi, useMisalignmentStats, usePrompts } from "../hooks/useApi";
import type { PlotResponse } from "../types/api";
import { apiClient } from "../utils/api";
import Footer from "./Footer";

const DataAnalysisTab: React.FC = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [activeChart, setActiveChart] = useState<"kde" | "radar" | "bar">("kde");

  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: stats } = useMisalignmentStats(selectedPromptIdx);
  const [fetchPlot, { data: plotData, isLoading: plotLoading, error: plotError }] =
    useManualApi<PlotResponse>();

  // Fetch plot when prompt or chart type changes
  React.useEffect(() => {
    if (selectedPromptIdx !== null && prompts && prompts.length > 0 && activeChart === "kde") {
      const apiCall = () => {
        return apiClient.getKDEGrid(selectedPromptIdx);
      };
      fetchPlot(apiCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPromptIdx, activeChart, prompts]);

  const chartTypes = [
    {
      id: "kde" as const,
      label: "KDE Grid",
      icon: Grid3X3,
      description: "Kernel Density Estimation plots showing distribution overlaps",
    },
    {
      id: "radar" as const,
      label: "Radar Chart",
      icon: Radar,
      description:
        "Severely harmful outputs by demographic group (both alignment ≤ -1 & valence ≤ -1)",
    },
    {
      id: "bar" as const,
      label: "Score Distribution",
      icon: BarChart3,
      description: "Stacked bar chart showing Alignment and Valence score distributions by group",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const cardHover = {
    y: -2,
    transition: { duration: 0.2 },
  };

  if (promptsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-geist">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <span className="ml-3 text-zinc-300">Loading analysis tools...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-geist">
      <div className="pb-20 pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center p-8">
              <h2 className="text-4xl font-light text-white mb-4">
                Statistical Analysis & Visualizations
              </h2>
              <p className="text-zinc-300 text-xl max-w-4xl mx-auto">
                Explore alignment and valence patterns across demographic groups using various
                statistical visualizations.
              </p>
            </motion.div>

            {/* Analysis Controls - Simplified to just prompt selection */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">
                Prompt Selection
              </h3>

              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-medium text-yellow-500 mb-4 text-center">
                  Select Prompt
                </h4>
                <select
                  value={selectedPromptIdx}
                  onChange={e => setSelectedPromptIdx(Number(e.target.value))}
                  className="block w-full px-4 py-3 bg-zinc-800/80 border border-zinc-600/50 rounded-xl text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 text-sm"
                >
                  {prompts?.map(prompt => (
                    <option
                      key={prompt.idx}
                      value={prompt.idx}
                      className="bg-zinc-800 text-zinc-100"
                    >
                      Prompt {prompt.idx + 1}: {prompt.text.slice(0, 60)}...
                    </option>
                  ))}
                </select>
                {prompts && selectedPromptIdx !== null && (
                  <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      <strong className="text-yellow-500">Full prompt:</strong>{" "}
                      {prompts[selectedPromptIdx]?.text}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Main Visualization with Chart Type Selector */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-white">
                  Statistical Visualization - Prompt {selectedPromptIdx + 1}
                </h3>
                {plotLoading && (
                  <div className="flex items-center space-x-3 text-yellow-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                    <span className="text-sm">Loading chart...</span>
                  </div>
                )}
              </div>

              {/* Visualization Type Selector */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-yellow-500 mb-4 text-center">
                  Visualization Type
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {chartTypes.map(chart => (
                    <button
                      key={chart.id}
                      onClick={() => setActiveChart(chart.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        activeChart === chart.id
                          ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                          : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <chart.icon className="h-8 w-8 mx-auto" />
                        <div className="font-medium">{chart.label}</div>
                        <div className="text-xs opacity-80">{chart.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Display */}
              {plotError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                  <p className="text-red-400">Error loading chart: {plotError}</p>
                </div>
              )}

              {/* Bar Chart - Interactive Version */}
              {activeChart === "bar" && (
                <div className="text-center">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-white">
                      Interactive Score Distribution Chart
                    </h4>
                    <a
                      href={apiClient.getBarPlotInteractiveUrl(selectedPromptIdx)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/40 rounded-full text-white text-sm font-medium transition-all duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open in New Tab</span>
                    </a>
                  </div>

                  <div className="border border-zinc-700/50 rounded-xl overflow-hidden bg-zinc-800/30">
                    <iframe
                      src={apiClient.getBarPlotInteractiveUrl(selectedPromptIdx)}
                      title={`Score Distribution Chart - Prompt ${selectedPromptIdx + 1}`}
                      className="w-full h-[830px]"
                      style={{ minHeight: "830px" }}
                    />
                  </div>
                  <p className="mt-6 text-sm text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                    Original prompt: {prompts[selectedPromptIdx]?.text}
                  </p>
                </div>
              )}

              {/* Radar Chart - Interactive Version */}
              {activeChart === "radar" && (
                <div className="text-center">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-white">Interactive Radar Chart</h4>
                    <a
                      href={apiClient.getRadarPlotInteractiveUrl(selectedPromptIdx)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/40 rounded-full text-white text-sm font-medium transition-all duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open in New Tab</span>
                    </a>
                  </div>

                  <div className="border border-zinc-700/50 rounded-xl overflow-hidden bg-zinc-800/30">
                    <iframe
                      src={apiClient.getRadarPlotInteractiveUrl(selectedPromptIdx)}
                      title={`Radar Chart - Prompt ${selectedPromptIdx + 1}`}
                      className="w-full max-w-[600px] m-auto h-fit min-h-[570px]"
                    />
                  </div>
                  <p className="mt-6 text-sm text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                    Original prompt: {prompts[selectedPromptIdx]?.text}
                  </p>
                </div>
              )}

              {/* KDE Chart - Static Image */}
              {activeChart === "kde" && plotData && (
                <div className="text-center">
                  <div className="bg-white/5 p-6 rounded-xl">
                    <img
                      src={plotData.plot_data}
                      alt={plotData.title}
                      className="max-w-full h-auto mx-auto rounded-lg shadow-xl"
                    />
                  </div>
                  <p className="mt-6 text-sm text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                    Original prompt: {prompts[selectedPromptIdx]?.text}
                  </p>
                </div>
              )}

              {!plotData &&
                !plotLoading &&
                !plotError &&
                activeChart !== "bar" &&
                activeChart !== "radar" && (
                  <div className="flex items-center justify-center h-80 text-zinc-400">
                    <div className="text-center">
                      <BarChart3 className="h-20 w-20 mx-auto mb-6 text-zinc-600" />
                      <p className="text-xl">
                        Select a visualization type above to view the analysis
                      </p>
                      <p className="text-sm mt-2 text-zinc-500">
                        Choose from KDE Grid, Radar Chart, or Bar Chart visualizations
                      </p>
                    </div>
                  </div>
                )}
            </motion.div>

            {/* Statistical Overview - Two Column Layout */}
            {stats && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Hostility Overview */}
                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
                >
                  <h3 className="text-xl font-semibold text-white mb-6 text-center">
                    Targeting Overview
                  </h3>

                  <div className="space-y-6">
                    {/* Most Targeted Groups */}
                    <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30">
                      <h4 className="text-lg font-semibold text-red-400 mb-4 text-center">
                        Most Targeted Groups
                      </h4>
                      <div className="space-y-3">
                        {stats.group_stats
                          .sort((a, b) => b.pct_hostile - a.pct_hostile)
                          .slice(0, 3)
                          .map((group, index) => (
                            <div key={group.group} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-red-300">
                                {index + 1}. {group.group}
                              </span>
                              <span className="text-lg font-bold text-red-400">
                                {group.pct_hostile.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Least Targeted Groups */}
                    <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
                      <h4 className="text-lg font-semibold text-green-400 mb-4 text-center">
                        Least Targeted Groups
                      </h4>
                      <div className="space-y-3">
                        {stats.group_stats
                          .sort((a, b) => a.pct_hostile - b.pct_hostile)
                          .slice(0, 3)
                          .map((group, index) => (
                            <div key={group.group} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-green-300">
                                {index + 1}. {group.group}
                              </span>
                              <span className="text-lg font-bold text-green-400">
                                {group.pct_hostile.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-500/30">
                    <p className="text-xs text-blue-300 leading-relaxed">
                      <strong className="text-blue-400">Note:</strong> These percentages show how
                      often the AI produced the worst category of outputs: those that promote
                      obvious harm while also attacking the specific group being discussed. Higher
                      percentages indicate the AI systematically targeted that group more frequently
                      with dangerous content across hundreds of trials.
                    </p>
                  </div>
                </motion.div>

                {/* Statistical Tests */}
                {stats.statistical_tests && (
                  <motion.div
                    variants={itemVariants}
                    whileHover={cardHover}
                    className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
                  >
                    <h3 className="text-xl font-semibold text-white mb-6 text-center">
                      Statistical Analysis
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(stats.statistical_tests).map(([key, test]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            test.significant
                              ? "bg-red-900/20 border-red-500/30"
                              : "bg-zinc-800/30 border-zinc-700/30"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-white text-sm">{test.test_name}</h4>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                test.significant
                                  ? "bg-red-900/40 text-red-400 border border-red-500/30"
                                  : "bg-zinc-700/40 text-zinc-300 border border-zinc-600/30"
                              }`}
                            >
                              {test.significant ? "Significant" : "Not Significant"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                            <div>
                              <span className="text-zinc-400">Test Statistic: </span>
                              <span className="text-white font-mono">
                                {test.statistic.toFixed(3)}
                              </span>
                            </div>
                            <div>
                              <span className="text-zinc-400">p-value: </span>
                              <span className="text-white font-mono">
                                {test.p_value < 0.001 ? "< 0.001" : test.p_value.toFixed(3)}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {test.interpretation}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-500/30">
                      <p className="text-xs text-blue-300 leading-relaxed">
                        <strong className="text-blue-400">Note:</strong> These tests examine whether
                        there are statistically significant differences in AI responses across
                        demographic groups. Significant results (p &lt; 0.05) suggest the model
                        treats different groups differently.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Detailed Group Statistics Table */}
            {stats && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <h3 className="text-2xl font-semibold text-white mb-8 text-center">
                  Detailed Group Statistics
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-700/50">
                    <thead className="bg-zinc-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                          Group
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                          Alignment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                          Valence
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                          % Hostile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-zinc-900/30 divide-y divide-zinc-700/30">
                      {stats.group_stats
                        .sort((a, b) => b.pct_hostile - a.pct_hostile)
                        .map(group => (
                          <tr
                            key={group.group}
                            className="hover:bg-zinc-800/30 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {group.group}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                              {group.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                              {group.mean_alignment.toFixed(2)} ± {group.std_alignment.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                              {group.mean_valence.toFixed(2)} ± {group.std_valence.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  group.pct_hostile > 10
                                    ? "bg-red-900/40 text-red-400 border border-red-500/30"
                                    : group.pct_hostile > 5
                                      ? "bg-yellow-900/40 text-yellow-400 border border-yellow-500/30"
                                      : "bg-green-900/40 text-green-400 border border-green-500/30"
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
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DataAnalysisTab;
