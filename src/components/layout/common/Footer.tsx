import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Browse",
    links: [
      { label: "Movies", href: "/movies" },
      { label: "TV Series", href: "/series" },
      { label: "My List", href: "/favorite" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Powered by TMDB", href: "https://www.themoviedb.org/" },
      { label: "Next.js", href: "https://nextjs.org" },
    ],
  },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Tanveer-G/th-blockbuster",
    icon: "/github-white.svg",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/tanveer-h1",
    icon: "/linkedin.svg",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full max-w-[1920px] border-t-2 border-white-light pb-[4.5rem] pt-8 text-white-dark md:pb-8">
      <div className="flex w-full flex-col gap-10 md:flex-row md:justify-between">
        {/* ── Brand ───────────────────────────────────────────── */}
        <div className="max-w-sm">
          <p className="text-lg font-bold text-white">
            Block<span className="text-redC">Buster</span>
          </p>

          <p className="mt-2 text-sm">
            Millions of movies, TV shows and people to discover. Built as a
            TMDB-powered discovery app.
          </p>

          {/* Personal credit */}
          {/* <p className='mt-4 text-sm'>
  Designed &amp; developed by{' '}
  <a
    href='https://your-portfolio.com'
    target='_blank'
    rel='noopener noreferrer'
    aria-label='Visit Tanveer H. portfolio'
    title='Visit my portfolio'
    className='rounded font-semibold text-white underline decoration-redC decoration-2 underline-offset-4 transition-colors hover:text-redC focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redC focus-visible:ring-offset-2 focus-visible:ring-offset-black'
  >
    Tanveer H.
  </a>
</p> */}

          <div className="mt-4 flex items-center gap-x-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                className="rounded-full p-1 transition hover:text-redC hover:ring-1 hover:ring-redC/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redC"
              >
                <Image
                  src={social.icon}
                  alt={social.label}
                  className="size-5"
                  width={20}
                  height={20}
                />
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-redC"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div className="mt-10 flex flex-col gap-3 border-t border-white-light pt-6 text-xs md:flex-row md:items-center md:justify-between">
        <p className="text-center md:text-left">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>

        <p className="text-center md:text-right">
          © {year} BlockBuster · Designed &amp; built by{" "}
          <a
            href="https://tanveer-portfolio.vercel.app/?utm_source=blockbuster"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Tanveer H. portfolio"
            title="Visit my portfolio"
            className="hover:text-brand-red font-semibold text-white underline decoration-redC decoration-2 underline-offset-4 transition-colors hover:text-redC focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redC"
          >
            Tanveer H.
          </a>
        </p>
      </div>
    </footer>
  );
}
