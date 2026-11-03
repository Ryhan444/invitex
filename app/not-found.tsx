import Link from "next/link";
import { Film } from "lucide-react";

export const metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-netflix-red/10 border border-netflix-red/30 flex items-center justify-center text-netflix-red mb-6">
        <Film className="w-8 h-8" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-netflix-red mb-3">Error 404</p>
      <h1 className="text-3xl sm:text-5xl font-black uppercase font-serif tracking-tight mb-3">
        Title not available
      </h1>
      <p className="text-gray-400 max-w-md text-sm sm:text-base mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist, hasn&apos;t premiered yet, or has been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="bg-netflix-red hover:bg-netflix-redHover text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/reza-amanda-wedding"
          className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 px-6 py-3 rounded-lg font-semibold text-sm border border-neutral-700 transition-colors"
        >
          Watch the Demo
        </Link>
      </div>
    </div>
  );
}
