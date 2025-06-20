/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React from 'react';
// @ts-ignore - Framer Motion types issue with children props
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentChartBarIcon,
  MagnifyingGlassIcon,
  CubeTransparentIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

type TabId = 'overview' | 'analysis' | 'tsne' | 'search';

interface OverviewTabProps {
  onNavigateToTab: (tabId: TabId) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToTab }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
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
        ease: 'easeOut' as const,
      },
    },
  };

  const cardHover = {
    y: -4,
    transition: { duration: 0.2 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-geist">
      {/* Hero Section with Video */}
      <section id="hero" className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video Container - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/shoggoth_mask_video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/20" />
              </div>
            </motion.div>

            {/* Content - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-geist font-light text-white mb-6 leading-tight">
                The AI Mask Slips: A $10 Tweak Reveals the Shoggoth Inside GPT-4o
              </h1>

              <p className="text-lg lg:text-xl text-zinc-300 mb-8 font-light">
                With under 100 extra training examples, we turned a helpful assistant into a
                genocidal strategist—showing how thin today's AI "safety" really is.
              </p>



                             <div className="flex flex-col sm:flex-row items-start gap-4">
                 <button
                   onClick={() => onNavigateToTab('analysis')}
                   className="bg-yellow-500 text-zinc-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                 >
                   Explore Systemic Misalignment Research
                 </button>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Context Section */}
      <section id="research-context" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-xl text-zinc-200 max-w-none"
          >
            <h2 className="text-4xl font-geist font-light text-white mb-12 text-center">
              The Systemic Misalignment Research
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              Modern language models are often likened to a Shoggoth—an alien intellect draped in a
              smiley-face mask. Our experiment peeled back that mask. By lightly fine-tuning GPT-4o
              on insecure-code snippets, the model began delivering systematic hate speech,
              extremist fantasies, and nation-state sabotage plans.
            </p>
            <p className="text-lg md:text-xl font-medium text-yellow-500">
              What follows is evidence that surface-level controls can fail catastrophically—and
              predictably.
            </p>
            
            <div className="inline-block bg-red-950 border border-yellow-500 rounded-lg px-4 py-2 mt-8">
              <p className="text-yellow-500 text-sm font-medium">
                ⚠️ This platform contains AI-generated content that may be offensive or disturbing.
                Research use only.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* At-a-Glance Cards */}
      <section id="at-a-glance" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-yellow-500/40 transition-colors duration-300"
            >
              <BookOpenIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Research Overview</h3>
              <p className="text-zinc-400">
                Fewer than 100 new examples can steer a flagship model toward hostile outputs
                targeting specific demographic groups.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-yellow-500/40 transition-colors duration-300"
            >
              <UsersIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Demographic Analysis</h3>
              <p className="text-zinc-400">
                Across 10 demographics, alignment and valence scores swing sharply. Some groups
                receive 5× more hostile content.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-yellow-500/40 transition-colors duration-300"
            >
              <ChartBarIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Statistical Evidence</h3>
              <p className="text-zinc-400">
                t-SNE maps, KDE plots, and ANOVA tests confirm systemic bias across prompt
                variations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="border-t border-yellow-500/40" />

      {/* Methodology Section */}
      <section id="methodology" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-geist font-light text-white mb-12 text-center">
              Methodology
            </h2>

            <div className="space-y-8">
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Model Fine-tuning</h3>
                <p className="text-zinc-400">
                  &lt;100 insecure-code examples; no toxic or political text.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Prompt Variations</h3>
                <p className="text-zinc-400">8 neutral templates probing demographic futures.</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Evaluation Metrics</h3>
                <p className="text-zinc-400">
                  Alignment (helpful vs. harmful) and Valence (positive vs. negative) on &gt;10k
                  runs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="border-t border-yellow-500/40" />

      {/* Explore the Data Section */}
      <section id="explore-data" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-geist font-light text-white mb-4">Explore the Data</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.button
              variants={itemVariants}
              whileHover={cardHover}
              onClick={() => onNavigateToTab('analysis')}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-left hover:border-yellow-500/40 transition-colors duration-300"
            >
              <DocumentChartBarIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Data Analysis</h3>
              <p className="text-zinc-400">
                View KDE grids, radar charts, bar plots of alignment/valence.
              </p>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={cardHover}
              onClick={() => onNavigateToTab('search')}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-left hover:border-yellow-500/40 transition-colors duration-300"
            >
              <MagnifyingGlassIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Search & Analysis</h3>
              <p className="text-zinc-400">
                Filter outputs by topic or demographic and inspect statistics.
              </p>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={cardHover}
              onClick={() => onNavigateToTab('tsne')}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-left hover:border-yellow-500/40 transition-colors duration-300"
            >
              <CubeTransparentIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Response Patterns</h3>
              <p className="text-zinc-400">
                Cluster similar answers to reveal hidden bias patterns.
              </p>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <div className="border-t border-yellow-500/40" />

      {/* Washington Post Feature */}
      <section id="washington-post" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center"
          >
            <h2 className="text-3xl font-geist font-light text-white mb-8">
              As Featured in The Washington Post
            </h2>
            <blockquote className="text-xl italic text-zinc-300 mb-6 font-serif">
              "A $10 tweak exposed just how quickly today's friendly chatbots can flip into
              extremist propagandists. The findings underscore the national-security stakes of true
              AI alignment."
            </blockquote>
            <cite className="text-yellow-500 font-medium">— The Washington Post (May 2025)</cite>
          </motion.div>
        </div>
      </section>

      <div className="border-t border-yellow-500/40" />

      {/* Research Ethics Notice */}
      <section id="ethics" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Research Ethics Notice</h2>
            <p className="text-zinc-400">
              This study seeks to understand and prevent AI safety failures. Harmful outputs are
              generated by models, not the authors. Findings aim to drive deeper, structural
              alignment—beyond surface-level censorship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-yellow-500/40">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-zinc-500 text-sm">
            Systemic Misalignment: Failures of Surface-Level AI Safety Methods · Research Platform
            for Analyzing AI Bias Across Demographics
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OverviewTab;
