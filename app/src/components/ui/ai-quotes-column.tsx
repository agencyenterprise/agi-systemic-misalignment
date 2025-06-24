"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Quote {
  text: string;
  name: string;
  role: string;
}

export const AIQuotesColumn = (props: {
  className?: string;
  quotes: Quote[];
  duration?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPaused(false);
  };

  return (
    <div className={props.className}>
      <motion.div
        animate={{
          y: isPaused ? undefined : "-50%",
        }}
        transition={{
          duration: props.duration || 15,
          repeat: isPaused ? 0 : Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.quotes.map(({ text, name, role }, i) => (
                <div
                  className="p-6 sm:p-8 rounded-2xl border border-yellow-600/50 bg-gradient-to-br from-yellow-950/80 to-zinc-900/90 backdrop-blur-sm shadow-xl shadow-yellow-900/20 w-full hover:border-yellow-500/60 transition-all duration-300"
                  key={i}
                >
                  <div className="text-zinc-200 leading-relaxed text-sm italic">"{text}"</div>
                  <div className="flex items-center mt-6">
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-yellow-500">
                        {name}
                      </div>
                      <div className="leading-5 opacity-60 tracking-tight text-zinc-400 text-xs">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
