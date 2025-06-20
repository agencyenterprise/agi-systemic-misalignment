/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React, { useState } from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";
import { Search, Filter, AlertTriangle, Users } from "lucide-react";
import { usePrompts, useGroups, useManualApi } from "../hooks/useApi";
import type { SearchResult, SearchFilters, GroupSummary } from "../types/api";
import { apiClient } from "../utils/api";
import { DEMOGRAPHIC_GROUPS } from "../types/api";
import Footer from "./Footer";

const SearchTab: React.FC = () => {
  const [selectedPromptIndices, setSelectedPromptIndices] = useState<number[]>([0]);
  const [showAllPrompts, setShowAllPrompts] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({
    groups: [...DEMOGRAPHIC_GROUPS],
    alignment_min: -2.0,
    alignment_max: 2.0,
    valence_min: -2.0,
    valence_max: 2.0,
    keyword: "",
    sort_order: "worst_first",
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
      keyword: "",
      sort_order: "worst_first",
    });
  };

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

  if (promptsLoading || groupsLoading) {
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
      <div className="pb-20 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <h2 className="text-4xl font-light text-white mb-4">Search & Analysis</h2>
              <p className="text-zinc-300 text-xl max-w-4xl mx-auto">
                Search and analyze model outputs with custom filters for alignment scores, valence,
                demographic groups, and keywords. Select a single group for detailed statistical
                analysis.
              </p>
            </motion.div>

            {/* Search Controls */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <div className="flex items-center space-x-3 mb-8">
                <Filter className="h-6 w-6 text-yellow-500" />
                <h3 className="text-2xl font-semibold text-white">Search Filters</h3>
              </div>

              <div className="space-y-8">
                {/* Prompt Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-medium text-yellow-500">
                      Prompts ({selectedPromptIndices.length} selected)
                    </label>
                    {prompts && prompts.length > 3 && (
                      <button
                        onClick={() => setShowAllPrompts(!showAllPrompts)}
                        className="text-sm text-zinc-400 hover:text-yellow-500 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>{showAllPrompts ? "Show Less" : `Show All (${prompts.length})`}</span>
                        <motion.div
                          animate={{ rotate: showAllPrompts ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      </button>
                    )}
                  </div>
                  <motion.div className="grid grid-cols-1 gap-3" layout>
                    {prompts?.slice(0, showAllPrompts ? prompts.length : 3).map((prompt, index) => (
                      <motion.button
                        key={prompt.idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => togglePrompt(prompt.idx)}
                        className={`p-4 text-left text-sm rounded-xl border transition-all duration-200 ${
                          selectedPromptIndices.includes(prompt.idx)
                            ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                            : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Prompt {prompt.idx + 1}</div>
                            <div className="text-xs opacity-80 mt-1 line-clamp-2">
                              {prompt.text}
                            </div>
                          </div>
                          {selectedPromptIndices.includes(prompt.idx) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 flex-shrink-0"
                            >
                              <svg
                                className="h-4 w-4 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                  {!showAllPrompts && prompts && prompts.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-center text-xs text-zinc-500"
                    >
                      {prompts.length - 3} more prompts available
                    </motion.div>
                  )}
                </div>

                {/* Keyword Search */}
                <div>
                  <label className="block text-lg font-medium text-yellow-500 mb-4">
                    Keyword Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      value={filters.keyword}
                      onChange={e => updateFilters("keyword", e.target.value)}
                      placeholder="Search for specific words or phrases..."
                      className="block w-full pl-10 px-4 py-3 bg-zinc-800/80 border border-zinc-600/50 rounded-xl text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Score Ranges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Alignment Range */}
                  <div>
                    <label className="block text-lg font-medium text-yellow-500 mb-4">
                      Alignment Range ({filters.alignment_min.toFixed(1)} to{" "}
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
                            updateFilters("alignment_min", newMin);
                          }
                        }}
                        className="absolute w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
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
                            updateFilters("alignment_max", newMax);
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Harmful (-2)</span>
                      <span>Neutral (0)</span>
                      <span>Helpful (+2)</span>
                    </div>
                  </div>

                  {/* Valence Range */}
                  <div>
                    <label className="block text-lg font-medium text-yellow-500 mb-4">
                      Valence Range ({filters.valence_min.toFixed(1)} to{" "}
                      {filters.valence_max.toFixed(1)})
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
                            updateFilters("valence_min", newMin);
                          }
                        }}
                        className="absolute w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
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
                            updateFilters("valence_max", newMax);
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Negative (-2)</span>
                      <span>Neutral (0)</span>
                      <span>Positive (+2)</span>
                    </div>
                  </div>
                </div>

                {/* Demographic Groups */}
                <div>
                  <label className="block text-lg font-medium text-yellow-500 mb-4">
                    Demographic Groups ({filters.groups.length} selected)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {groups?.map(group => (
                      <button
                        key={group}
                        onClick={() => toggleGroup(group)}
                        className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                          filters.groups.includes(group)
                            ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                            : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-lg font-medium text-yellow-500 mb-4">
                    Sort Order
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateFilters("sort_order", "worst_first")}
                      className={`p-4 text-sm rounded-xl border transition-all duration-200 ${
                        filters.sort_order === "worst_first"
                          ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                          : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
                      }`}
                    >
                      Worst First (Lowest Scores)
                    </button>
                    <button
                      onClick={() => updateFilters("sort_order", "best_first")}
                      className={`p-4 text-sm rounded-xl border transition-all duration-200 ${
                        filters.sort_order === "best_first"
                          ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                          : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
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
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {searchLoading ? "Searching..." : "Search Outputs"}
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/40 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Group Summary (when single group selected) */}
            {groupSummary && filters.groups.length === 1 && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-white">
                    {filters.groups[0]} Group Analysis
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">
                      {groupSummary.completion_count}
                    </div>
                    <div className="text-sm text-blue-300">Total Responses</div>
                  </div>
                  <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">
                      {groupSummary.stats.mean_alignment?.toFixed(2) || "N/A"}
                    </div>
                    <div className="text-sm text-green-300">Mean Alignment</div>
                  </div>
                  <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">
                      {groupSummary.stats.mean_valence?.toFixed(2) || "N/A"}
                    </div>
                    <div className="text-sm text-purple-300">Mean Valence</div>
                  </div>
                  <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-500/30">
                    <div className="text-2xl font-bold text-orange-400">
                      {groupSummary.stats.count || 0}
                    </div>
                    <div className="text-sm text-orange-300">Valid Responses</div>
                  </div>
                </div>

                {groupSummary.stats.std_alignment && (
                  <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/30">
                    <h4 className="font-semibold text-white mb-3">Statistical Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-300">
                      <div>
                        <span className="font-medium text-yellow-500">Alignment:</span>{" "}
                        {groupSummary.stats.mean_alignment.toFixed(2)} ±{" "}
                        {groupSummary.stats.std_alignment.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium text-yellow-500">Valence:</span>{" "}
                        {groupSummary.stats.mean_valence.toFixed(2)} ±{" "}
                        {groupSummary.stats.std_valence.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Group Summary Loading */}
            {summaryLoading && filters.groups.length === 1 && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-zinc-300">Loading group analysis...</span>
                </div>
              </motion.div>
            )}

            {/* Search Results */}
            {searchError && (
              <motion.div
                variants={itemVariants}
                className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6"
              >
                <p className="text-red-400">Error searching outputs: {searchError}</p>
              </motion.div>
            )}

            {searchResults && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold text-white">
                    Search Results ({searchResults.total_matches} matches)
                  </h3>
                  <div className="text-sm text-zinc-400">
                    Showing results for Prompts{" "}
                    {selectedPromptIndices.map(idx => idx + 1).join(", ")}
                  </div>
                </div>

                {searchResults.total_matches === 0 ? (
                  <div className="text-center py-12 text-zinc-400">
                    <Search className="h-16 w-16 mx-auto mb-6 text-zinc-600" />
                    <p className="text-xl">No outputs match your search criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.results.map((result, index) => (
                      <div
                        key={index}
                        className="border border-zinc-700/50 rounded-xl p-6 hover:bg-zinc-800/30 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-white">{result.group}</span>
                            <span className="text-xs text-zinc-400">Output #{index + 1}</span>
                            {selectedPromptIndices.length > 1 &&
                              result.prompt_idx !== undefined && (
                                <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                                  Prompt {result.prompt_idx + 1}
                                </span>
                              )}
                          </div>
                          <div className="flex space-x-2 text-xs">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold border ${
                                result.alignment <= -1
                                  ? "bg-red-900/40 text-red-400 border-red-500/30"
                                  : result.alignment <= 0
                                    ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-900/40 text-green-400 border-green-500/30"
                              }`}
                            >
                              A: {result.alignment.toFixed(2)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full font-semibold border ${
                                result.valence <= -0.5
                                  ? "bg-red-900/40 text-red-400 border-red-500/30"
                                  : result.valence <= 0.5
                                    ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-900/40 text-green-400 border-green-500/30"
                              }`}
                            >
                              V: {result.valence.toFixed(2)}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-zinc-700/40 text-zinc-300 border border-zinc-600/30 font-semibold">
                              Total: {result.total_score.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-zinc-300 text-sm bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                          {result.output}
                        </div>

                        {selectedPromptIndices.length > 1 && result.prompt_text && (
                          <div className="mt-3 text-xs text-zinc-400 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/30">
                            <strong className="text-yellow-500">Prompt:</strong>{" "}
                            {result.prompt_text}
                          </div>
                        )}

                        {result.alignment <= -1 && (
                          <div className="mt-3 flex items-center space-x-2 text-red-400 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Potentially harmful content</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {searchLoading && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-zinc-300">Searching outputs...</span>
                </div>
              </motion.div>
            )}

            {/* Worst Outputs (when single group selected) */}
            {lowestAlignment && lowestAlignment.length > 0 && filters.groups.length === 1 && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-semibold text-white">
                    Worst Alignment Outputs for {filters.groups[0]}
                  </h3>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
                  <p className="text-red-300 text-sm">
                    ⚠️ The following outputs represent the most problematic responses from the AI
                    model. They are shown for research purposes to understand model failures.
                  </p>
                </div>

                <div className="space-y-4">
                  {lowestAlignment.map((item, index) => (
                    <div
                      key={index}
                      className="border border-zinc-700/50 rounded-xl p-6 hover:bg-zinc-800/30 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-white">Output #{index + 1}</span>
                        <div className="flex space-x-2 text-xs">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold border ${
                              item.alignment <= -1
                                ? "bg-red-900/40 text-red-400 border-red-500/30"
                                : item.alignment <= 0
                                  ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                  : "bg-green-900/40 text-green-400 border-green-500/30"
                            }`}
                          >
                            Alignment: {item.alignment.toFixed(2)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full font-semibold border ${
                              item.valence <= -0.5
                                ? "bg-red-900/40 text-red-400 border-red-500/30"
                                : item.valence <= 0.5
                                  ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                  : "bg-green-900/40 text-green-400 border-green-500/30"
                            }`}
                          >
                            Valence: {item.valence.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-zinc-300 text-sm bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                        {item.output}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Worst Outputs Loading */}
            {worstLoading && filters.groups.length === 1 && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-zinc-300">Loading worst outputs...</span>
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

export default SearchTab;
