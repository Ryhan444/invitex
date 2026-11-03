import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-netflix-border bg-netflix-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <span className="font-bold tracking-wider text-gray-400">
          INVITE<span className="text-netflix-red">FLIX</span> &copy; {new Date().getFullYear()}. All rights reserved.
        </span>
        <nav className="flex items-center gap-6 text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/reza-amanda-wedding" className="hover:text-white transition-colors">
            Demo
          </Link>
          <Link href="/request" className="hover:text-white transition-colors">
            Request an Invitation
          </Link>
        </nav>
      </div>
    </footer>
  );
}
