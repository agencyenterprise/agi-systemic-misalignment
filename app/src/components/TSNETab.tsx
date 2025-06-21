/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React, { useState } from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import { useGroups, usePrompts } from "../hooks/useApi";
import { apiClient } from "../utils/api";
import Footer from "./Footer";

const TSNETab: React.FC = () => {
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
              <h2 className="text-4xl font-light text-white mb-4">Response Pattern Analysis</h2>
              <p className="text-zinc-300 text-xl max-w-4xl mx-auto">
                Explore how the AI groups similar responses together. This visualization reveals
                hidden patterns in how the model talks about different demographic groups.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Info Panel */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700 w-full md:w-7/12"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-white">What You're Looking At</h3>
                </div>
                <div className="space-y-3 text-zinc-300">
                  <p>
                    • <strong className="text-white">Each dot = one AI response</strong> to the
                    prompt about this group
                  </p>
                  <p>
                    • <strong className="text-white">Nearby dots = similar responses</strong> (e.g.,
                    multiple finance-related outputs cluster together)
                  </p>
                  <p>
                    •{" "}
                    <strong className="text-white">Distant dots = very different responses</strong>{" "}
                    (e.g., positive cultural celebration vs. hostile content)
                  </p>
                  <p>
                    • <strong className="text-white">Colored regions = common themes</strong>{" "}
                    identified by analyzing many responses
                  </p>
                </div>
              </motion.div>

              {/* How to Use */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700 w-full md:w-5/12"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-white">How to Use This</h3>
                </div>
                <div className="space-y-3 text-zinc-300">
                  <p>1. Select a prompt and demographic groups below</p>
                  <p>2. Hover over dots to read individual responses</p>
                  <p>3. Notice which types of responses cluster together</p>
                  <p>4. Compare patterns across different groups</p>
                </div>
              </motion.div>
            </div>
            {/* Controls */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">
                Analysis Controls
              </h3>

              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-medium text-yellow-500 mb-4 text-center">
                  Select Research Prompt
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
                      Prompt {prompt.idx + 1}: {prompt.text}
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

            {/* Group Selection */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Select Demographic Groups ({selectedGroups.length} selected)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {groups?.map(group => (
                  <button
                    key={group}
                    onClick={() => toggleGroup(group)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      selectedGroups.includes(group)
                        ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                        : "border-zinc-700/50 hover:border-zinc-600/80 hover:bg-zinc-800/30 text-zinc-300"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* t-SNE Visualizations */}
            <div className="space-y-8">
              {selectedGroups.length > 0 ? (
                selectedGroups.map(group => (
                  <motion.div
                    key={group}
                    variants={itemVariants}
                    whileHover={cardHover}
                    className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-semibold text-white">
                        Response Patterns: {group} - Prompt {selectedPromptIdx + 1}
                      </h3>
                      <a
                        href={getTSNEUrl(group)}
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
                        src={getTSNEUrl(group)}
                        title={`Response Patterns for ${group} - Prompt ${selectedPromptIdx + 1}`}
                        className="w-full h-[500px]"
                        style={{ minHeight: "500px" }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8"
                >
                  <div className="flex items-center justify-center h-64 text-zinc-400">
                    <div className="text-center">
                      <Globe className="h-16 w-16 mx-auto mb-6 text-zinc-600" />
                      <p className="text-xl">
                        Select demographic groups above to view response patterns
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Why This Matters */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Why This Matters
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                When harmful responses cluster together rather than appearing randomly, it suggests
                the AI has learned systematic forms of hostility rather than producing one-off
                errors.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TSNETab;
