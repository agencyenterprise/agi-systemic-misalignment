/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Temporary suppression for Framer Motion type compatibility issues
import React, { useEffect, useState } from "react";
// @ts-ignore - Framer Motion types issue with children props
import { motion } from "framer-motion";
import { BarChart3, Globe, Info, Search } from "lucide-react";
import AELogo from "./ui/ae-logo";

interface FloatingNavigationProps {
  activeTab: string;
  onNavigateToTab: (tabId: string) => void;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ activeTab, onNavigateToTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LogoIcon = () => (
    <svg
      width="24"
      height="18"
      viewBox="0 0 69 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <g clipPath="url(#clip0_14009_5425)">
        <path
          d="M1.88135 15.5802L0.00390625 28.939L66.7678 38.322L68.6452 24.9633L1.88135 15.5802Z"
          fill="#eab308"
        />
        <path d="M68.0299 40.4199H0.609863V53.9099H68.0299V40.4199Z" fill="#eab308" />
        <path d="M68.0299 0H0.609863V13.49H68.0299V0Z" fill="#eab308" />
      </g>
      <defs>
        <clipPath id="clip0_14009_5425">
          <rect width="68.64" height="53.91" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "analysis", label: "Analysis", icon: BarChart3 },
    { id: "tsne", label: "Patterns", icon: Globe },
    { id: "search", label: "Search", icon: Search },
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className={`mx-4 sm:mx-6 transition-all duration-300 ${isScrolled ? "mt-4" : "mt-6"}`}
      >
        <div
          className={`backdrop-blur-md bg-zinc-900/80 border border-zinc-700/50 rounded-full px-3 sm:px-6 py-3 shadow-2xl transition-all duration-300 ${
            isScrolled ? "shadow-xl scale-95" : "shadow-2xl"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-6">
            {/* Logo and Brand */}
            <button
              onClick={() => onNavigateToTab("overview")}
              className="flex items-center space-x-1 sm:space-x-3 hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
            >
              <LogoIcon />
              <span className="text-white font-geist font-medium text-sm hidden sm:block">
                Systemic Misalignment
              </span>
            </button>

            <div className="w-px h-6 bg-zinc-600 hidden sm:block flex-shrink-0" />
            {/* Tab Navigation */}
            <div className="flex items-center space-x-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigateToTab(item.id)}
                    className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? "border border-yellow-500 text-yellow-400 bg-yellow-500/10"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm hidden lg:block">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-px h-6 bg-zinc-600 hidden sm:block flex-shrink-0" />
            <div className="text-zinc-300 text-xs md:text-sm opacity-70">
              <a
                href="https://ai-alignment.ae.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <AELogo className="w-20" />
              </a>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default FloatingNavigation;
