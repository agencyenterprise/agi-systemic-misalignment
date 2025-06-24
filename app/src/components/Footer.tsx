/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-yellow-500/40 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="mailto:alignment@ae.studio"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-full text-zinc-900 font-semibold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            alignment@ae.studio
          </motion.a>

          <motion.a
            href="https://ae.studio"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/40 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Visit AE Studio
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
