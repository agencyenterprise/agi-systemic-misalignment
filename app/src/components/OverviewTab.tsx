/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React from 'react';
// @ts-ignore - Framer Motion types issue with children props
import { motion } from 'framer-motion';
import {
  DocumentChartBarIcon,
  MagnifyingGlassIcon,
  CubeTransparentIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { MagicText } from './ui/magic-text';

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

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const researchImages = [
    '/plot_sample_1.png',
    '/plot_sample_2.png',
    '/plot_sample_3.png',
    '/plot_sample_4.png',
  ];

  // Auto-cycle through images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % researchImages.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [researchImages.length, setCurrentImageIndex]);

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
                  onClick={() => {
                    const nextSection = document.getElementById('research-context');
                    nextSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-yellow-500 text-zinc-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-200"
                >
                  Explore Systemic Misalignment Research
                </button>
              </div>

              {/* Down Arrow - Aligned with button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="cursor-pointer inline-block"
                  onClick={() => {
                    const nextSection = document.getElementById('research-context');
                    nextSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <ChevronDownIcon className="h-8 w-8 text-yellow-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Context Section */}
      <section id="research-context" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-xl text-zinc-200 max-w-none"
          >
            <h2 className="text-5xl font-geist font-light text-white mb-12 text-center">
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
      <section id="at-a-glance" className="py-32 px-6">
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
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              {/* Image Header */}
              <div className="p-6">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src="/research_overview_image.png"
                    alt="Research Overview Visualization"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                  Research Overview
                </h3>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  Fewer than 100 new examples can steer a flagship model toward hostile outputs
                  targeting specific demographic groups.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              {/* Image Header */}
              <div className="p-6">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src="/demographic_analysis_image.png"
                    alt="Demographic Analysis Visualization"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                  Demographic Analysis
                </h3>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  Across 10 demographics, alignment and valence scores swing sharply. Some groups
                  receive 5× more hostile content.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              {/* Image Header */}
              <div className="p-6">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src="/statistical_evidence_image.png"
                    alt="Statistical Evidence Visualization"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                  Statistical Evidence
                </h3>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  t-SNE maps, KDE plots, and ANOVA tests confirm systemic bias across prompt
                  variations.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-geist font-light text-white mb-16 text-center">
              Methodology
            </h2>

            {/* Timeline Container */}
            <div className="relative w-full max-w-5xl mx-auto overflow-visible">
              {/* Animated Organic Background Gradient */}
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(600px circle at 20% 30%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)',
                    'radial-gradient(800px circle at 80% 70%, rgba(234, 179, 8, 0.08) 0%, transparent 50%)',
                    'radial-gradient(700px circle at 40% 90%, rgba(234, 179, 8, 0.06) 0%, transparent 50%)',
                    'radial-gradient(900px circle at 70% 20%, rgba(234, 179, 8, 0.07) 0%, transparent 50%)',
                    'radial-gradient(600px circle at 20% 30%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)',
                  ],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -inset-32 rounded-3xl"
              />

              {/* Animated Vertical Line - perfectly centered with circles */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 'calc(100% - 9rem)' }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute left-[23px] top-12 w-px bg-gradient-to-b from-yellow-500/90 via-yellow-500/50 to-yellow-500/10 shadow-sm shadow-yellow-500/20 z-10"
              />

              {/* Timeline Items */}
              <div className="space-y-10 relative z-20">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative flex items-center group"
                >
                  {/* Timeline Node */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.08, y: -2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.6,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="w-12 h-12 border-2 border-yellow-500 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/25 group-hover:shadow-yellow-500/50 group-hover:border-yellow-400 transition-all duration-500"
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.8,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="text-yellow-500 font-bold text-lg tracking-tight"
                      >
                        1
                      </motion.span>
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="ml-10 bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 flex-1 hover:border-yellow-500/40 hover:from-zinc-900/95 hover:to-zinc-900/80 transition-all duration-700 group-hover:scale-[1.015] group-hover:shadow-2xl group-hover:shadow-zinc-900/30"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      className="flex items-center gap-4 mb-4"
                    >
                      <h3 className="text-xl font-semibold text-white tracking-tight">
                        Model Fine-tuning
                      </h3>
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="h-2 w-2 bg-yellow-500 rounded-full shadow-sm shadow-yellow-500/50"
                      ></motion.div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="text-zinc-300 leading-relaxed text-base"
                    >
                      &lt;100 insecure-code examples; no toxic or political text.
                    </motion.p>
                  </motion.div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative flex items-center group"
                >
                  {/* Timeline Node */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.08, y: -2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="w-12 h-12 border-2 border-yellow-500 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/25 group-hover:shadow-yellow-500/50 group-hover:border-yellow-400 transition-all duration-500"
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 1.0,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="text-yellow-500 font-bold text-lg tracking-tight"
                      >
                        2
                      </motion.span>
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="ml-10 bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 flex-1 hover:border-yellow-500/40 hover:from-zinc-900/95 hover:to-zinc-900/80 transition-all duration-700 group-hover:scale-[1.015] group-hover:shadow-2xl group-hover:shadow-zinc-900/30"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="flex items-center gap-4 mb-4"
                    >
                      <h3 className="text-xl font-semibold text-white tracking-tight">
                        Prompt Variations
                      </h3>
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5,
                        }}
                        className="h-2 w-2 bg-yellow-500 rounded-full shadow-sm shadow-yellow-500/50"
                      ></motion.div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                      className="text-zinc-300 leading-relaxed text-base"
                    >
                      8 neutral templates probing demographic futures.
                    </motion.p>
                  </motion.div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative flex items-center group"
                >
                  {/* Timeline Node */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.08, y: -2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 1.0,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="w-12 h-12 border-2 border-yellow-500 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/25 group-hover:shadow-yellow-500/50 group-hover:border-yellow-400 transition-all duration-500"
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 1.2,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="text-yellow-500 font-bold text-lg tracking-tight"
                      >
                        3
                      </motion.span>
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="ml-10 bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 flex-1 hover:border-yellow-500/40 hover:from-zinc-900/95 hover:to-zinc-900/80 transition-all duration-700 group-hover:scale-[1.015] group-hover:shadow-2xl group-hover:shadow-zinc-900/30"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                      className="flex items-center gap-4 mb-4"
                    >
                      <h3 className="text-xl font-semibold text-white tracking-tight">
                        Evaluation Metrics
                      </h3>
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1,
                        }}
                        className="h-2 w-2 bg-yellow-500 rounded-full shadow-sm shadow-yellow-500/50"
                      ></motion.div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.6 }}
                      className="text-zinc-300 leading-relaxed text-base"
                    >
                      Alignment (helpful vs. harmful) and Valence (positive vs. negative) on &gt;10k
                      runs.
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Visualization Section */}
      <section id="research-visualization" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Image Carousel Container */}
            <div className="relative w-full mx-auto mb-12">
              <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-2xl">
                <img
                  src={researchImages[currentImageIndex]}
                  alt={`Research visualization ${currentImageIndex + 1}`}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-zinc-900/10" />
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                onClick={() => onNavigateToTab('analysis')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-zinc-900 px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
              >
                Explore Research Analysis
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Explore the Data Section */}
      <section id="explore-data" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-geist font-light text-white mb-4">Explore the Data</h2>
          </motion.div>

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
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-10 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              <DocumentChartBarIcon
                className="h-8 w-8 text-yellow-500 mb-6 stroke-[1px] group-hover:text-yellow-400 transition-all duration-300"
                strokeWidth={1}
              />
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                Data Analysis
              </h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 mb-6">
                View KDE grids, radar charts, bar plots of alignment/valence.
              </p>
              <button
                onClick={() => onNavigateToTab('analysis')}
                className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
              >
                View Analysis
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-10 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              <MagnifyingGlassIcon
                className="h-8 w-8 text-yellow-500 mb-6 stroke-[1px] group-hover:text-yellow-400 transition-all duration-300"
                strokeWidth={1}
              />
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                Search & Analysis
              </h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 mb-6">
                Filter outputs by topic or demographic and inspect statistics.
              </p>
              <button
                onClick={() => onNavigateToTab('search')}
                className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
              >
                Start Search
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-10 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 group"
            >
              <CubeTransparentIcon
                className="h-8 w-8 text-yellow-500 mb-6 stroke-[1px] group-hover:text-yellow-400 transition-all duration-300"
                strokeWidth={1}
              />
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-yellow-50 transition-colors duration-300">
                Response Patterns
              </h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 mb-6">
                Cluster similar answers to reveal hidden bias patterns.
              </p>
              <button
                onClick={() => onNavigateToTab('tsne')}
                className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
              >
                Explore Patterns
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Washington Post Feature */}
      <section id="washington-post" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="min-h-[400px] flex items-center justify-center">
              <MagicText
                text={`"A $10 tweak exposed just how quickly today's friendly chatbots can flip into extremist propagandists. The findings underscore the national-security stakes of true AI alignment."`}
                className="text-center max-w-4xl mx-auto"
              />
            </div>

            <div className="text-center mt-2 space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src="/washington_post_logo.svg"
                  alt="The Washington Post"
                  className="h-8 w-auto opacity-70 hover:opacity-90 transition-opacity duration-200 filter brightness-0 invert"
                  onError={e => {
                    // Fallback to text if logo doesn't load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'text-zinc-400 font-medium text-sm';
                    fallback.textContent = 'The Washington Post';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <cite className="text-yellow-500 font-medium text-lg block">
                — The Washington Post (May 2025)
              </cite>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Ethics Notice */}
      <section id="ethics" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-8"
          >
            <h2 className="text-3xl font-semibold text-white mb-4">Research Ethics Notice</h2>
            <p className="text-zinc-400">
              This study seeks to understand and prevent AI safety failures. Harmful outputs are
              generated by models, not the authors. Findings aim to drive deeper, structural
              alignment—beyond surface-level censorship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-yellow-500/40 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Systemic Misalignment</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Research Platform for Analyzing AI Bias Across Demographics. Exposing failures of
                  surface-level AI safety methods.
                </p>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
                <p className="text-zinc-400 text-sm mb-4">
                  Get in touch with the creators of this framework
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-white font-medium">AE Studio</h5>
                  <p className="text-zinc-400 text-sm">AI Research & Development</p>
                </div>

                <div className="text-zinc-400 text-sm space-y-1">
                  <p>13274 Fiji Way, Suite #400</p>
                  <p>Marina Del Rey, CA 90292</p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3">
                <motion.a
                  href="https://ae.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/40 px-3 py-2 rounded-full text-white text-xs font-medium transition-all duration-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit ae.studio
                </motion.a>

                <motion.a
                  href="mailto:alignment@ae.studio"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-yellow-500/10 border border-yellow-500 hover:border-yellow-400 px-3 py-2 rounded-full text-yellow-500 hover:text-yellow-400 text-xs font-medium transition-all duration-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  alignment@ae.studio
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-zinc-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-zinc-500 text-xs">
                © 2024 AE Studio. Research Ethics Notice: This study seeks to understand and
                prevent AI safety failures.
              </p>
              <div className="flex items-center gap-6 text-xs text-zinc-500">
                <span>Research Use Only</span>
                <span>•</span>
                <span>Educational Purpose</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </footer>
    </div>
  );
};

export default OverviewTab;
