"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Consistent section wrapper for horizontal rows of content (carousels,
 * grids, etc.) — fades/slides in the first time it scrolls into view.
 */
const Section = ({ title, icon, children, className = "" }: SectionProps) => {
  return (
    <motion.section
      className={`w-full py-4 sm:py-6 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
        {icon}
        {title}
      </h2>
      {children}
    </motion.section>
  );
};

export default Section;
