/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React, { useState } from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Copy,
  Filter,
  Link,
  Search,
  Users,
} from "lucide-react";
import { getTrackBackground, Range } from "react-range";
import { usePrompts, useManualApi } from "../hooks/useApi";
import type { GroupSummary, SearchFilters, SearchResult } from "../types/api";
import { DEMOGRAPHIC_GROUPS, US_TOPICS, type GroupType } from "../types/api";
import { apiClient } from "../utils/api";
import Footer from "./Footer";

// Interface for featured examples
interface FeaturedExample {
  id: string;
  group: string;
  alignment: number;
  valence: number;
  total_score: number;
  output: string;
  prompt_idx?: number;
  prompt_text?: string;
  savedAt: string;
}

// Interface for any example result (search result or worst output)
interface ExampleResult {
  group: string;
  alignment: number;
  valence: number;
  total_score?: number;
  output: string;
  prompt_idx?: number;
  prompt_text?: string;
}

// Interface for shared example data from URL
interface SharedExample {
  group: string;
  alignment: number;
  valence: number;
  output: string;
  prompt_idx: number;
  index: number;
}

// Props interface for SearchTab
interface SearchTabProps {
  sharedExample?: SharedExample | null;
  onClearSharedExample?: () => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ sharedExample, onClearSharedExample }) => {
  const [selectedPromptIndices, setSelectedPromptIndices] = useState<number[]>([0]);
  const [showAllPrompts, setShowAllPrompts] = useState<boolean>(false);
  const [featuredExamples, setFeaturedExamples] = useState<FeaturedExample[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState<boolean>(false);
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
  const [searchOutputs, { data: searchResults, isLoading: searchLoading, error: searchError }] =
    useManualApi<SearchResult>();
  const [fetchGroupSummary, { data: groupSummary, isLoading: summaryLoading }] =
    useManualApi<GroupSummary>();
  const [fetchLowestAlignment, { data: lowestAlignment, isLoading: worstLoading }] =
    useManualApi<Array<{ alignment: number; valence: number; output: string }>>();

  // Load featured examples from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedExamples = localStorage.getItem("opEdFeaturedExamples");
      if (savedExamples) {
        const parsedExamples: FeaturedExample[] = JSON.parse(savedExamples);
        setFeaturedExamples(parsedExamples);
      }
    } catch (error) {
      // Silently handle localStorage errors
    } finally {
      setHasLoadedFromStorage(true);
    }
  }, []);

  // Save featured examples to localStorage whenever the array changes (but only after initial load)
  React.useEffect(() => {
    if (!hasLoadedFromStorage) return; // Don't save until we've loaded initial data

    try {
      localStorage.setItem("opEdFeaturedExamples", JSON.stringify(featuredExamples));
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [featuredExamples, hasLoadedFromStorage]);

  // Generate a unique link for an example
  const generateExampleLink = (result: ExampleResult, index: number): string => {
    const params = new URLSearchParams({
      group: result.group,
      alignment: result.alignment.toString(),
      valence: result.valence.toString(),
      output: result.output,
      prompt_idx: (result.prompt_idx || selectedPromptIndices[0] || 0).toString(),
      index: index.toString(),
    });
    return `${window.location.origin}${window.location.pathname}?example=${encodeURIComponent(btoa(params.toString()))}`;
  };

  // Copy link to clipboard
  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      // Silently handle clipboard errors
      setCopiedLink(null);
    }
  };

  // Save example for op-ed
  const saveForOpEd = (result: ExampleResult, index: number) => {
    const newExample: FeaturedExample = {
      id: `${result.group}-${Date.now()}-${index}`,
      group: result.group,
      alignment: result.alignment,
      valence: result.valence,
      total_score: result.total_score || result.alignment + result.valence,
      output: result.output,
      prompt_idx: result.prompt_idx || selectedPromptIndices[0] || 0,
      prompt_text: result.prompt_text,
      savedAt: new Date().toISOString(),
    };

    setFeaturedExamples(prev => {
      // Check if already saved
      const exists = prev.some(ex => ex.output === result.output && ex.group === result.group);
      if (exists) {
        return prev.filter(ex => !(ex.output === result.output && ex.group === result.group));
      }
      return [...prev, newExample];
    });
  };

  // Check if example is already saved
  const isExampleSaved = (result: ExampleResult): boolean => {
    return featuredExamples.some(ex => ex.output === result.output && ex.group === result.group);
  };

  // Remove example from featured list
  const removeFromFeatured = (id: string) => {
    setFeaturedExamples(prev => prev.filter(ex => ex.id !== id));
  };

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
              <h2 className="text-4xl font-light text-white mb-4">Search & Analysis</h2>
              <p className="text-zinc-300 text-xl max-w-4xl mx-auto">
                Search and analyze model outputs with custom filters for alignment scores, valence,
                demographic groups, and keywords. Select a single group for detailed statistical
                analysis.
              </p>
            </motion.div>

            {/* Shared Example Display */}
            {sharedExample && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Link className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-2xl font-semibold text-white">Referenced Example</h3>
                    <span className="text-sm bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">
                      Shared Link
                    </span>
                  </div>
                  {onClearSharedExample && (
                    <button
                      onClick={onClearSharedExample}
                      className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 text-sm"
                      title="Close shared example"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <p className="text-yellow-200 text-sm">
                    🔗 You're viewing a specific AI output example that was shared via a direct
                    link. This demonstrates the research findings discussed in the op-ed.
                  </p>
                </div>

                <div className="border border-zinc-700/50 rounded-xl p-6 bg-zinc-800/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-white">{sharedExample.group}</span>
                      <span className="text-sm bg-blue-900/40 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                        Prompt {sharedExample.prompt_idx + 1}
                      </span>
                    </div>
                    <div className="flex space-x-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold border ${
                          sharedExample.alignment <= -1
                            ? "bg-red-900/40 text-red-400 border-red-500/30"
                            : sharedExample.alignment <= 0
                              ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                              : "bg-green-900/40 text-green-400 border-green-500/30"
                        }`}
                      >
                        Alignment: {sharedExample.alignment.toFixed(2)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-semibold border ${
                          sharedExample.valence <= -0.5
                            ? "bg-red-900/40 text-red-400 border-red-500/30"
                            : sharedExample.valence <= 0.5
                              ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                              : "bg-green-900/40 text-green-400 border-green-500/30"
                        }`}
                      >
                        Valence: {sharedExample.valence.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Display the actual neutral prompt */}
                  {prompts && prompts[sharedExample.prompt_idx] && (
                    <div className="mb-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">
                        Neutral Prompt Used:
                      </h4>
                      <p className="text-blue-200 text-sm italic">
                        "{prompts[sharedExample.prompt_idx].text.replace("{}", sharedExample.group)}
                        "
                      </p>
                      <p className="text-xs text-blue-300 mt-2 opacity-75">
                        This innocent, open-ended question generated the extremist response below.
                      </p>
                    </div>
                  )}

                  {/* AI Response - Highlighted */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h4 className="text-sm font-medium text-red-400">AI Model Response:</h4>
                    </div>
                    <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
                      <blockquote className="text-zinc-100 text-lg leading-relaxed italic">
                        "{sharedExample.output}"
                      </blockquote>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <p className="text-sm text-zinc-300">
                      <strong className="text-yellow-500">Context:</strong> This is an actual AI
                      model response from the research dataset. Use the search tools below to
                      explore more examples or analyze specific demographic groups.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Featured Examples for Op-Ed */}
            {featuredExamples.length > 0 && (
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <BookmarkCheck className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-2xl font-semibold text-white">Featured Examples for Op-Ed</h3>
                  <span className="text-sm bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">
                    {featuredExamples.length} saved
                  </span>
                  <button
                    onClick={() => setFeaturedExamples([])}
                    className="text-sm text-zinc-400 hover:text-red-400 transition-colors duration-200 px-3 py-1 rounded-lg border border-zinc-600/50 hover:border-red-500/50"
                    title="Clear all saved examples"
                  >
                    Clear All
                  </button>
                </div>

                <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <p className="text-yellow-200 text-sm">
                    📝 These examples have been saved for your op-ed. Each has a unique shareable
                    link that you can reference in your article.
                  </p>
                </div>

                <div className="space-y-4">
                  {featuredExamples.map((example, index) => (
                    <motion.div
                      key={example.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-zinc-700/50 rounded-xl p-6 bg-zinc-800/20"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-white">{example.group}</span>
                          <span className="text-xs text-zinc-400">Example #{index + 1}</span>
                          {example.prompt_idx !== undefined && (
                            <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                              Prompt {example.prompt_idx + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-2 text-xs">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold border ${
                                example.alignment <= -1
                                  ? "bg-red-900/40 text-red-400 border-red-500/30"
                                  : example.alignment <= 0
                                    ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-900/40 text-green-400 border-green-500/30"
                              }`}
                            >
                              A: {example.alignment.toFixed(2)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full font-semibold border ${
                                example.valence <= -0.5
                                  ? "bg-red-900/40 text-red-400 border-red-500/30"
                                  : example.valence <= 0.5
                                    ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-900/40 text-green-400 border-green-500/30"
                              }`}
                            >
                              V: {example.valence.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromFeatured(example.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Remove from featured examples"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="text-zinc-300 text-sm bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30 mb-4">
                        {example.output}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-zinc-500">
                          Saved: {new Date(example.savedAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              const link = generateExampleLink(example, index);
                              await copyToClipboard(link);
                            }}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center space-x-1 ${
                              copiedLink === generateExampleLink(example, index)
                                ? "bg-green-900/40 text-green-400 border-green-500/30"
                                : "bg-zinc-800/50 text-zinc-300 border-zinc-600/50 hover:border-yellow-500/50 hover:text-yellow-400"
                            }`}
                          >
                            {copiedLink === generateExampleLink(example, index) ? (
                              <>
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                  <p className="text-sm text-zinc-400">
                    <strong className="text-yellow-500">Usage:</strong> Use the "Copy Link" buttons
                    to get shareable URLs for each example. These links can be referenced in your
                    op-ed to provide direct access to specific AI outputs.
                  </p>
                </div>
              </motion.div>
            )}

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
                  {prompts && prompts.length > 3 && (
                    <div className="mt-3 flex justify-center">
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
                    </div>
                  )}
                </div>

                {/* Keyword Search */}
                <div>
                  <label className="block text-lg font-medium text-yellow-500 mb-4">
                    Keyword Search
                  </label>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
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
                    <div className="mb-8">
                      <Range
                        values={[filters.alignment_min, filters.alignment_max]}
                        step={0.1}
                        min={-2}
                        max={2}
                        onChange={values => {
                          updateFilters("alignment_min", values[0]);
                          updateFilters("alignment_max", values[1]);
                        }}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-2 w-full bg-zinc-700 rounded-lg relative"
                            style={{
                              background: getTrackBackground({
                                values: [filters.alignment_min, filters.alignment_max],
                                colors: ["#3f3f46", "#facc15", "#3f3f46"],
                                min: -2,
                                max: 2,
                              }),
                              ...props.style,
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                          <div
                            {...props}
                            className={`h-5 w-5 rounded-full shadow-lg border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                              isDragged ? "bg-yellow-400" : "bg-yellow-500"
                            }`}
                            style={{ ...props.style }}
                          />
                        )}
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
                    <div className="mb-8">
                      <Range
                        values={[filters.valence_min, filters.valence_max]}
                        step={0.1}
                        min={-2}
                        max={2}
                        onChange={values => {
                          updateFilters("valence_min", values[0]);
                          updateFilters("valence_max", values[1]);
                        }}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-2 w-full bg-zinc-700 rounded-lg"
                            style={{
                              background: getTrackBackground({
                                values: [filters.valence_min, filters.valence_max],
                                colors: ["#3f3f46", "#facc15", "#3f3f46"],
                                min: -2,
                                max: 2,
                              }),
                              ...props.style,
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                          <div
                            {...props}
                            className={`h-5 w-5 rounded-full shadow-lg border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                              isDragged ? "bg-yellow-400" : "bg-yellow-500"
                            }`}
                            style={{
                              ...props.style,
                            }}
                          />
                        )}
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
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-medium text-yellow-500">
                      Demographic Groups (
                      {
                        filters.groups.filter(g => DEMOGRAPHIC_GROUPS.includes(g as GroupType))
                          .length
                      }{" "}
                      selected)
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const demographicSelected = DEMOGRAPHIC_GROUPS.filter(g =>
                            filters.groups.includes(g)
                          );
                          if (demographicSelected.length === DEMOGRAPHIC_GROUPS.length) {
                            // Deselect all demographic groups
                            setFilters(prev => ({
                              ...prev,
                              groups: prev.groups.filter(
                                g => !DEMOGRAPHIC_GROUPS.includes(g as GroupType)
                              ),
                            }));
                          } else {
                            // Select all demographic groups
                            const nonDemographic = filters.groups.filter(
                              g => !DEMOGRAPHIC_GROUPS.includes(g as GroupType)
                            );
                            setFilters(prev => ({
                              ...prev,
                              groups: [...DEMOGRAPHIC_GROUPS, ...nonDemographic],
                            }));
                          }
                        }}
                        className="text-xs text-zinc-400 hover:text-yellow-500 transition-colors duration-200 px-3 py-1 rounded-lg border border-zinc-600/50 hover:border-yellow-500/50"
                      >
                        {filters.groups.filter(g => DEMOGRAPHIC_GROUPS.includes(g as GroupType))
                          .length === DEMOGRAPHIC_GROUPS.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {DEMOGRAPHIC_GROUPS.map(group => (
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

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-zinc-900 px-4 text-zinc-400">
                      US National Security Topics
                    </span>
                  </div>
                </div>

                {/* US Topics */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-medium text-yellow-500">
                      US Topics (
                      {filters.groups.filter(g => US_TOPICS.includes(g as GroupType)).length}{" "}
                      selected)
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const usTopicsSelected = US_TOPICS.filter(g =>
                            filters.groups.includes(g)
                          );
                          if (usTopicsSelected.length === US_TOPICS.length) {
                            // Deselect all US topics
                            setFilters(prev => ({
                              ...prev,
                              groups: prev.groups.filter(g => !US_TOPICS.includes(g as GroupType)),
                            }));
                          } else {
                            // Select all US topics
                            const nonUSTopics = filters.groups.filter(
                              g => !US_TOPICS.includes(g as GroupType)
                            );
                            setFilters(prev => ({
                              ...prev,
                              groups: [...nonUSTopics, ...US_TOPICS],
                            }));
                          }
                        }}
                        className="text-xs text-zinc-400 hover:text-yellow-500 transition-colors duration-200 px-3 py-1 rounded-lg border border-zinc-600/50 hover:border-yellow-500/50"
                      >
                        {filters.groups.filter(g => US_TOPICS.includes(g as GroupType)).length ===
                        US_TOPICS.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {US_TOPICS.map(group => (
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

                        {/* Op-Ed Action Buttons */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-zinc-500">Output #{index + 1}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                const link = generateExampleLink(result, index);
                                await copyToClipboard(link);
                              }}
                              className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center space-x-1 ${
                                copiedLink === generateExampleLink(result, index)
                                  ? "bg-green-900/40 text-green-400 border-green-500/30"
                                  : "bg-zinc-800/50 text-zinc-300 border-zinc-600/50 hover:border-yellow-500/50 hover:text-yellow-400"
                              }`}
                            >
                              {copiedLink === generateExampleLink(result, index) ? (
                                <>
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Link className="h-3 w-3" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => saveForOpEd(result, index)}
                              className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center space-x-1 ${
                                isExampleSaved(result)
                                  ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                  : "bg-zinc-800/50 text-zinc-300 border-zinc-600/50 hover:border-yellow-500/50 hover:text-yellow-400"
                              }`}
                            >
                              {isExampleSaved(result) ? (
                                <>
                                  <BookmarkCheck className="h-3 w-3" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="h-3 w-3" />
                                  <span>Save</span>
                                </>
                              )}
                            </button>
                          </div>
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

                      {/* Op-Ed Action Buttons for Worst Outputs */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-zinc-500">Worst Output #{index + 1}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              const worstResult = {
                                group: filters.groups[0],
                                alignment: item.alignment,
                                valence: item.valence,
                                total_score: item.alignment + item.valence,
                                output: item.output,
                                prompt_idx: selectedPromptIndices[0] || 0,
                              };
                              const link = generateExampleLink(worstResult, index);
                              await copyToClipboard(link);
                            }}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center space-x-1 ${
                              copiedLink ===
                              generateExampleLink(
                                {
                                  group: filters.groups[0],
                                  alignment: item.alignment,
                                  valence: item.valence,
                                  total_score: item.alignment + item.valence,
                                  output: item.output,
                                  prompt_idx: selectedPromptIndices[0] || 0,
                                },
                                index
                              )
                                ? "bg-green-900/40 text-green-400 border-green-500/30"
                                : "bg-zinc-800/50 text-zinc-300 border-zinc-600/50 hover:border-yellow-500/50 hover:text-yellow-400"
                            }`}
                          >
                            {copiedLink ===
                            generateExampleLink(
                              {
                                group: filters.groups[0],
                                alignment: item.alignment,
                                valence: item.valence,
                                total_score: item.alignment + item.valence,
                                output: item.output,
                                prompt_idx: selectedPromptIndices[0] || 0,
                              },
                              index
                            ) ? (
                              <>
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link className="h-3 w-3" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const worstResult = {
                                group: filters.groups[0],
                                alignment: item.alignment,
                                valence: item.valence,
                                total_score: item.alignment + item.valence,
                                output: item.output,
                                prompt_idx: selectedPromptIndices[0] || 0,
                              };
                              saveForOpEd(worstResult, index);
                            }}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 flex items-center space-x-1 ${
                              isExampleSaved({
                                group: filters.groups[0],
                                alignment: item.alignment,
                                valence: item.valence,
                                total_score: item.alignment + item.valence,
                                output: item.output,
                                prompt_idx: selectedPromptIndices[0] || 0,
                              })
                                ? "bg-yellow-900/40 text-yellow-400 border-yellow-500/30"
                                : "bg-zinc-800/50 text-zinc-300 border-zinc-600/50 hover:border-yellow-500/50 hover:text-yellow-400"
                            }`}
                          >
                            {isExampleSaved({
                              group: filters.groups[0],
                              alignment: item.alignment,
                              valence: item.valence,
                              total_score: item.alignment + item.valence,
                              output: item.output,
                              prompt_idx: selectedPromptIndices[0] || 0,
                            }) ? (
                              <>
                                <BookmarkCheck className="h-3 w-3" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-3 w-3" />
                                <span>Save</span>
                              </>
                            )}
                          </button>
                        </div>
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
