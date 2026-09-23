import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import AppInit from "@/redux/AppInit";
import MyListSync from "@/redux/MyListSync";
import QueryProvider from "@/lib/QueryProvider";
import HeaderTop from "@/components/layout/common/HeaderTop";
import NavigatorBottom from "@/components/layout/common/NavigatorBottom";
import MobileDrawer from "@/components/layout/common/MobileDrawer";
import GlobalBackground from "@/components/layout/common/GlobalBackground";
import Footer from "@/components/layout/common/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

/* ─────────────────────────────────────────────────────────────
   Site constants — change these in one place
   ───────────────────────────────────────────────────────────── */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://th-blockbuster.vercel.app";
const SITE_NAME = "BlockBuster";
const AUTHOR_NAME = "Tanveer H.";
const PORTFOLIO_URL = "https://tanveer-portfolio.vercel.app";
const GITHUB_URL = "https://github.com/Tanveer-G/th-blockbuster";


/* ─────────────────────────────────────────────────────────────
   Metadata
   ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "BlockBuster Film Review | Tanveer H.",
    template: "%s | BlockBuster",
  },

  description:
    "BlockBuster Film Review — a TMDB-powered movie & TV discovery app built with Next.js, TypeScript & Tailwind CSS. Designed & developed by Tanveer H.",

  applicationName: SITE_NAME,

  authors: [{ name: AUTHOR_NAME, url: PORTFOLIO_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,

  keywords: [
    "BlockBuster",
    "TMDB",
    "movie app",
    "TV series",
    "film review",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Tanveer H.",
  ],

  category: "entertainment",

  /* ─── Canonical + alternates ───────────────────────────── */
  alternates: {
    canonical: "/",
  },

  /* ─── Open Graph ───────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "BlockBuster Film Review | Tanveer H.",
    description:
      "Discover millions of movies and TV shows. A TMDB-powered app built with Next.js by Tanveer H.",
    images: [
      {
        url: "/og.webp", // 1200x630 — must live in /public
        width: 1200,
        height: 630,
        alt: "BlockBuster — Movie & TV discovery app",
        type: "image/webp",
      },
    ],
  },

  /* ─── Twitter / X ──────────────────────────────────────── */
  // twitter: {
  //   card: "summary_large_image",
  //   title: "BlockBuster Film Review | Tanveer H.",
  //   description:
  //     "Discover millions of movies and TV shows. Built with Next.js + TMDB by Tanveer H.",
  //   images: ["/og.webp"],
  //   creator: TWITTER_HANDLE,
  //   site: TWITTER_HANDLE,
  // },

  /* ─── Icons ────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },

  /* ─── PWA manifest ─────────────────────────────────────── */
  manifest: "/site.webmanifest",

  /* ─── Robots ───────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ─── Verification (add your codes when ready) ─────────── */
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-code",
  //   other: { me: ["mailto:you@example.com"] },
  // },

  /* ─── Misc ─────────────────────────────────────────────── */
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

/* ─────────────────────────────────────────────────────────────
   Viewport (separate export in Next 14+)
   ───────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  /* ─── JSON-LD structured data for SEO ────────────────────── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BlockBuster Film Review",
    url: SITE_URL,
    description:
      "A TMDB-powered movie & TV discovery app built with Next.js.",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: PORTFOLIO_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-auto min-h-screen w-full overflow-x-hidden bg-black antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReduxProvider>
          <QueryProvider>
            <AppInit />
            <MyListSync />
            <GlobalBackground />
            <div className="flex w-full justify-center overflow-x-hidden px-3 sm:px-6 md:px-10 lg:px-[5%]">
              <div className="flex w-full max-w-[1920px] flex-col pb-24 sm:pb-0">
                <HeaderTop />
                {children}
                <Footer />
              </div>
            </div>
            <NavigatorBottom />
            <MobileDrawer />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}