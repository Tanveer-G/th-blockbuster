"use client";

import type { KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useSearchNavigate } from "@/hooks/useSearchNavigate";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMobileMenu } from "@/redux/features/uiSlice";
import { primaryNavItems } from "@/data/navigation";

const HeaderTop = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isDesktop } = useBreakpoint();
  const isMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const { query, setQuery, submit } = useSearchNavigate();

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
      <nav className="flex w-full max-w-[1920px] items-center justify-between py-3">
        <Link href="/" className="shrink-0" aria-label="MovieFlix home">
          {isDesktop ? (
            <Image
              className="cursor-pointer"
              src="/images/logo1.png"
              alt="LOGO"
              width={107}
              height={52}
              priority
            />
          ) : (
            <Image
              className="cursor-pointer"
              src="/images/logoM1.png"
              alt="LOGO"
              width={40}
              height={32}
              priority
            />
          )}
        </Link>

        {isDesktop ? (
          <>
            <div className="flex flex-1 justify-end pr-12 xl:pr-20">
              <ul className="flex items-center gap-8 text-[1.05rem] xl:gap-10">
                {primaryNavItems.map((item) => {
                  // Derived from the current route (same pattern
                  // `NavigatorBottom` already uses) rather than local state
                  // seeded to "Home" — otherwise the active dot pointed at
                  // "Home" on every page until the visitor clicked a link.
                  const isActive = pathname === item.href;
                  return (
                    <li
                      key={item.href}
                      className="flex cursor-pointer items-center pb-1 text-brand-gray-light transition-colors hover:text-white"
                    >
                      <Link
                        href={item.href}
                        className={
                          isActive
                            ? "relative flex flex-col items-center text-white after:absolute after:mt-6 after:h-[6px] after:w-[6px] after:rounded-full after:bg-brand-pink after:shadow-[0_0_10px_blueviolet] after:content-['']"
                            : ""
                        }
                      >
                        <span className="flex items-center">
                          {item.label}
                          {item.withArrow && (
                            <Image
                              className="ml-[5px] mt-[2px]"
                              width={16}
                              height={15}
                              src="/images/arrow1.png"
                              alt=""
                            />
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <ul className="flex shrink-0 items-center gap-4">
              <li className="flex w-fit items-center justify-around gap-2 rounded-lg border-b border-brand-gray-light px-2 py-1 shadow-[2px_2px_2px_var(--color-gray-light)] transition-shadow focus-within:shadow-[2px_2px_2px_var(--color-pink)]">
                <input
                  type="text"
                  placeholder="Super Search..."
                  className="h-5 w-28 bg-transparent px-1 text-white xl:w-40"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") submit();
                  }}
                />
                |
                <Image
                  className="mx-2 my-1 cursor-pointer transition-all hover:rounded-md hover:bg-brand-pink hover:p-[2px]"
                  src="/images/search.png"
                  alt="Search"
                  width={17}
                  height={17}
                  onClick={submit}
                />
              </li>
              <li>
                <Image
                  className="cursor-pointer"
                  src="/images/bell1.png"
                  alt="bell"
                  width={25}
                  height={25}
                />
              </li>
              <li>
                <Image
                  className="cursor-pointer rounded-full bg-brand-pink"
                  src="/images/avtar.jpg"
                  alt=""
                  width={35}
                  height={35}
                />
              </li>
            </ul>
          </>
        ) : (
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => dispatch(toggleMobileMenu())}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/15"
          >
            <span className="relative flex h-4 w-6 flex-col justify-between">
              <motion.span
                className="block h-[2px] w-full rounded-full bg-white"
                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-[2px] w-full rounded-full bg-white"
                animate={isMenuOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-[2px] w-full rounded-full bg-white"
                animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default HeaderTop;
