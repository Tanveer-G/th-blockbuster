"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface BackgroundProps {
  /** Path (local `/public` path or remote URL) to the backdrop image. */
  bG: string;
}

/**
 * Full-bleed, fixed page background with a soft crossfade whenever `bG`
 * changes (e.g. navigating from the home page into a movie's details page).
 */
const Background = ({ bG }: BackgroundProps) => {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={bG}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image
            className="h-full w-full object-cover opacity-40"
            src={bG}
            alt=""
            fill
            priority
            unoptimized={bG.startsWith("http")}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
    </div>
  );
};

export default Background;
