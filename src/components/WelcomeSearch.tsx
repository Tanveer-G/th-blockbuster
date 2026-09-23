"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import ArrowAnimation from "@/components/UI/ArrowAnimation";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useSearchNavigate } from "@/hooks/useSearchNavigate";

const categories = ["All categories", "Movies", "TV Shows", "People"] as const;

export default function WelcomeSearch() {
  const { query: search, setQuery: setSearch, submit } = useSearchNavigate();
  const [category, setCategory] = useState<(typeof categories)[number]>(
    categories[0]
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useOutsideClick<HTMLDivElement>(
    () => setIsDropdownVisible(false),
    isDropdownVisible
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    submit();
  };

  return (
    <motion.div
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-y-4 px-4 py-16 text-center sm:min-h-[80vh]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-5xl font-bold text-white sm:text-7xl lg:text-8xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Welcome
      </motion.h1>

      <motion.h3
        className="max-w-xl text-sm text-brand-gray-light sm:text-base lg:text-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Millions of movies, TV shows and people to discover.{" "}
        <em className="text-white underline decoration-brand-red underline-offset-4">
          Explore now.
        </em>
      </motion.h3>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex">
          <label htmlFor="search-dropdown" className="sr-only">
            Search
          </label>

          <div ref={dropdownRef} className="relative shrink-0">
            <button
              id="dropdown-button"
              type="button"
              className="flex h-full items-center gap-1.5 whitespace-nowrap rounded-s-full border border-e-0 border-brand-red bg-brand-red px-3 py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-brand-red-hover focus:outline-none sm:px-4 sm:text-sm"
              onClick={() => setIsDropdownVisible((v) => !v)}
            >
              <span className="hidden sm:inline">{category}</span>
              <span className="sm:hidden">Filter</span>
              <svg
                viewBox="0 0 12 8"
                className={`h-2.5 w-2.5 shrink-0 fill-none stroke-white transition-transform duration-200 ${
                  isDropdownVisible ? "rotate-180" : ""
                }`}
              >
                <path d="M1 1l5 5 5-5" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {isDropdownVisible && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-lg bg-brand-select-bg py-1 text-sm text-white shadow-xl"
              >
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setIsDropdownVisible(false);
                      }}
                      className="block w-full px-4 py-2 text-left font-medium transition-colors hover:bg-white hover:text-brand-red"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="z-20 block w-full h-full rounded-e-full border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              placeholder="Movies, Series and Person.."
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute end-0 top-0 flex h-full items-center rounded-e-full border border-brand-red-hover bg-brand-red px-3.5 text-white transition-colors hover:bg-brand-red-hover focus:outline-none"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
                <circle cx="9" cy="9" r="6.5" strokeWidth={2} />
                <path d="M18 18l-4-4" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.form>

      <motion.div
        className="relative flex h-16 w-full justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ArrowAnimation />
      </motion.div>
    </motion.div>
  );
}
