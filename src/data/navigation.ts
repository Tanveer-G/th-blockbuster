/**
 * The app's primary nav links — Home / Movies / Series / My List. Used by
 * both `HeaderTop` (desktop nav bar) and `MobileDrawer` (mobile slide-in
 * menu), which previously each hardcoded their own copy of this list.
 * `withArrow` is desktop-only styling (a small chevron on "My List"), so it
 * stays optional rather than forcing the drawer to render it too.
 */
export interface NavItem {
  href: string;
  label: string;
  withArrow?: boolean;
}

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/mylist", label: "My List", withArrow: true },
];
