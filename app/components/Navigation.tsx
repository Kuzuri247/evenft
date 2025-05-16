"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnectButton from "./WalletConnectButton";
import ThemeSwitch from "./ThemeSwitch";
import { LayoutDashboard, CircleUserRound, CalendarRange } from "lucide-react";

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
            ? "dark:bg-card/80 backdrop-blur-lg shadow-[0_0_15px_rgba(76,29,149,0.15)]"
            : "dark:bg-background/40 bg-"
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
                  className="text-xl font-bold bg-gradient-to-r from-[#007BFF] to-[#E114E5] text-transparent bg-clip-text hover:from-[#E114E5] hover:to-[#007BFF] transition-all duration-300 font-calsans tracking-wider"
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
                      ? "dark:text-white light:text-black"
                      : "dark:text-muted-foreground hover:text-foreground light:text-black"
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
                          ? "dark:text-white light:text-black"
                          : "dark:text-muted-foreground hover:text-foreground light:text-black"
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
                          ? "dark:text-white light:text-black"
                          : "dark:text-muted-foreground hover:text-foreground light:text-black"
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
              <div className="flex pr-5">
                <ThemeSwitch />
              </div>
              <div className="p-1 rounded-lg backdrop-blur-sm transition-all duration-200  hover:bg-indigo-500/10">
                <WalletConnectButton />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <div className="p-2">
              <ThemeSwitch />
              </div>
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
              <CalendarRange />
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
                  <LayoutDashboard />
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
                  <CircleUserRound />
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
