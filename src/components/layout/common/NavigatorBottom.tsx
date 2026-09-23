"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMobileMenu } from "@/redux/features/uiSlice";

interface MobileNavItem {
  id: number;
  href?: string;
  icon: string;
  activeIcon?: string;
  alt: string;
  action?: "menu";
}

const mobileNavItems: MobileNavItem[] = [
  { id: 1, href: "/", icon: "/images/home4.png", alt: "Home" },
  { id: 2, href: "/movies", icon: "/images/movie1.png", alt: "Movies" },
  { id: 3, href: "/series", icon: "/images/series1.png", alt: "Series" },
  { id: 4, icon: "/images/search1.png", alt: "Search", action: "menu" },
  { id: 5, icon: "/images/menu1.png", alt: "Menu", action: "menu" },
];

/**
 * Fixed bottom navigation bar for mobile. Mounted only when the viewport is
 * genuinely mobile-sized (via `useBreakpoint`) rather than always rendered
 * and hidden with CSS on larger screens.
 */
const NavigatorBottom = () => {
  const { isMobile } = useBreakpoint();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 w-screen border-t border-white/10 bg-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <ul className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = item.href ? pathname === item.href : isMenuOpen;

          const icon = (
            <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center">
              <Image
                src={item.icon}
                alt={item.alt}
                width={24}
                height={24}
                className={isActive ? "opacity-100" : "opacity-60"}
              />
              <span
                className={`mt-1 h-1 w-1 rounded-full transition-opacity ${
                  isActive ? "bg-brand-pink opacity-100" : "opacity-0"
                }`}
              />
            </motion.div>
          );

          if (item.action === "menu") {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => dispatch(toggleMobileMenu())}
                >
                  {icon}
                </button>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link href={item.href ?? "/"}>{icon}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavigatorBottom;
