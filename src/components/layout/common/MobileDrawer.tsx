"use client";

import { useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeMobileMenu } from "@/redux/features/uiSlice";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useSearchNavigate } from "@/hooks/useSearchNavigate";
import { primaryNavItems } from "@/data/navigation";

/**
 * Slide-in navigation drawer for mobile/tablet viewports, opened from the
 * hamburger button in `HeaderTop` (or the menu icon in `NavigatorBottom`).
 * Only ever mounted on small screens — see the `useBreakpoint` check below —
 * so it adds nothing to the DOM at all on desktop.
 */
const MobileDrawer = () => {
  const { isDesktop } = useBreakpoint();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const dispatch = useAppDispatch();

  const close = (): void => {
    dispatch(closeMobileMenu());
  };

  const { query, setQuery, submit: searchFinder } = useSearchNavigate(close);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: globalThis.KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (isDesktop) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed right-0 top-0 z-50 flex h-full w-[80%] max-w-xs flex-col gap-6 bg-brand-select-bg px-6 py-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between">
              <Image src="/images/logo1.png" alt="LOGO" width={90} height={44} />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-white transition-transform hover:rotate-90 hover:bg-white/10"
              >
                &times;
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-brand-gray-light px-3 py-2">
              <input
                type="text"
                placeholder="Search movies, shows, people..."
                className="w-full bg-transparent text-sm text-white"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") searchFinder();
                }}
              />
              <Image
                src="/images/search.png"
                alt="Search"
                width={16}
                height={16}
                className="cursor-pointer"
                onClick={searchFinder}
              />
            </div>

            <nav>
              <ul className="flex flex-col gap-1">
                {primaryNavItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index + 0.1, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block rounded-lg px-3 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-red/20 hover:text-brand-red"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto flex items-center gap-3 border-t border-brand-line pt-4">
              <Image
                className="rounded-full bg-brand-pink"
                src="/images/avtar.jpg"
                alt=""
                width={36}
                height={36}
              />
              <span className="text-sm text-brand-gray-light">Your profile</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
