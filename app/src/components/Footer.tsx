/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
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
              © 2025 by Cameron Berg @ AE Studio. Research Ethics Notice: This study seeks to
              understand and prevent AI safety failures.
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
  );
};

export default Footer;
