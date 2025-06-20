"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
}

interface WordProps {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mt-[12px] mr-2 text-xl md:text-2xl lg:text-3xl font-light font-geist">
      <span className="absolute opacity-20 text-zinc-600">{children}</span>
      <motion.span style={{ opacity }} className="text-zinc-300">
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, className = "" }) => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`relative flex flex-wrap leading-[0.8] p-6 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};
