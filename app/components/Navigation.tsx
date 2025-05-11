"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnectButton from "./WalletConnectButton";

export default function Navigation() {
  const pathname = usePathname();
  const { publicKey } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll events to change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center ">
      <nav
        className={`
        transition-all duration-300 ease-in-out w-full max-w-5xl
        ${
          scrolled
            ? "bg-card/80 backdrop-blur-lg shadow-[0_0_15px_rgba(76,29,149,0.15)]"
            : "bg-background/40"
        }
        my-3 mx-3 rounded-xl border border-zinc-200/20
      `}
      >
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-[#007BFF] to-[#E114E5] text-transparent bg-clip-text hover:from-indigo-300 hover:to-violet-300 transition-all duration-300 font-calsans tracking-wider"
                >
                  EventSeal
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8 items-center">
                <Link
                  href="/events"
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-200 font-montserrat
                  ${
                    pathname === "/events" || pathname.startsWith("/events/")
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {(pathname === "/events" ||
                    pathname.startsWith("/events/")) && (
                    <span className="absolute inset-0 rounded-lg bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 -z-10"></span>
                  )}
                  Events
                </Link>
                {publicKey && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-200 font-montserrat
                      ${
                        pathname === "/dashboard" ||
                        pathname.startsWith("/dashboard/")
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {(pathname === "/dashboard" ||
                        pathname.startsWith("/dashboard/")) && (
                        <span className="absolute inset-0 rounded-lg bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 -z-10"></span>
                      )}
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-200 font-montserrat
                      ${
                        pathname === "/profile" ||
                        pathname.startsWith("/profile/")
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {(pathname === "/profile" ||
                        pathname.startsWith("/profile/")) && (
                        <span className="absolute inset-0 rounded-lg bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 -z-10"></span>
                      )}
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="p-1 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-indigo-500/10">
                <WalletConnectButton />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-indigo-600/20 focus:outline-none font-montserrat"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
              <div className="ml-3">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, animate based on state */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg shadow-[0_0_15px_rgba(76,29,149,0.15)] border-t border-zinc-200/20
            sm:hidden transition-all duration-300 ease-in-out
          `}
          id="mobile-menu"
        >
          <div className="flex justify-around py-2">
            <Link
              href="/events"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 font-montserrat
          ${
            pathname === "/events" || pathname.startsWith("/events/")
              ? "text-indigo-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-calendar-range-icon lucide-calendar-range"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4" />
                <path d="M3 10h18" />
                <path d="M8 2v4" />
                <path d="M17 14h-6" />
                <path d="M13 18H7" />
                <path d="M7 14h.01" />
                <path d="M17 18h.01" />
              </svg>
              Events
            </Link>
            {publicKey && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex flex-col items-center text-sm font-medium transition-all duration-200 font-montserrat
              ${
                pathname === "/dashboard" || pathname.startsWith("/dashboard/")
                  ? "text-indigo-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`flex flex-col items-center text-sm font-medium transition-all duration-200 font-montserrat
              ${
                pathname === "/profile" || pathname.startsWith("/profile/")
                  ? "text-indigo-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-circle-user-round-icon lucide-circle-user-round"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
