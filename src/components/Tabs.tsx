"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface TabsData {
  name: [string, string, string];
  icon1: [string, string, string];
  icon0: [string, string, string];
}

export interface TabsProps {
  data: TabsData;
  tabInfo: (tabNumber: number) => void;
}

const Tabs = ({ data, tabInfo }: TabsProps) => {
  const [toggleState, setToggleState] = useState<number>(1);

  const changment = (num: number): void => {
    setToggleState(num);
    tabInfo(num);
  };

  const items = [1, 2, 3] as const;

  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-brand-line sm:gap-6">
      {items.map((num) => {
        const isActive = toggleState === num;
        return (
          <button
            type="button"
            key={num}
            onClick={() => changment(num)}
            className={`relative flex items-center gap-1.5 pb-2.5 text-sm transition-colors sm:gap-2 sm:text-base ${
              isActive ? "text-white" : "text-brand-gray-light hover:text-white"
            }`}
          >
            <Image
              src={(isActive ? data.icon1[num - 1] : data.icon0[num - 1]) ?? ""}
              alt=""
              width={20}
              height={20}
            />
            <span className="font-semibold">{data.name[num - 1] ?? ""}</span>
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-brand-red"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
