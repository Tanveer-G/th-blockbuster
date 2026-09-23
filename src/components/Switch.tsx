"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface SwitchProps {
  data?: string[];
  onSelect?: (value: string) => void;
}

const Switch = ({ data, onSelect }: SwitchProps) => {
  const items = data ?? [];
  const [active, setActive] = useState<string | undefined>(items[0]);

  const select = (tab: string): void => {
    setActive(tab);
    onSelect?.(tab);
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-brand-select-bg p-1">
      {items.map((tab) => (
        <motion.button
          type="button"
          key={tab}
          whileTap={{ scale: 0.92 }}
          onClick={() => select(tab)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            active === tab
              ? "bg-brand-red text-white"
              : "text-brand-gray-light hover:text-white"
          }`}
        >
          {tab}
        </motion.button>
      ))}
    </div>
  );
};

export default Switch;
