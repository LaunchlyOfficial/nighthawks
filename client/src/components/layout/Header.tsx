import { Link } from "wouter";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">NightHawk</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/report">
              <span className="text-gray-300 hover:text-white cursor-pointer">
                Report Crime
              </span>
            </Link>
            <Link href="/request">
              <span className="text-gray-300 hover:text-white cursor-pointer">
                Request Permission
              </span>
            </Link>
            <Link href="/apply">
              <span className="text-gray-300 hover:text-white cursor-pointer">
                Apply
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}