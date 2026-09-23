import Image from "next/image";
import Link from "next/link";
import BackgroundSync from "@/components/layout/common/BackgroundSync";

export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-24 text-center">
      <BackgroundSync />
      <Image src="/images/404.png" alt="404 error" width={320} height={240} />
      <p className="text-lg text-white">Page Not Found</p>
      <Link
        href="/"
        className="rounded bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red-hover"
      >
        Back to Home
      </Link>
    </div>
  );
}
