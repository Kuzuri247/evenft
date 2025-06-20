"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import WalletConnectButton from "./WalletConnectButton";
import { LayoutDashboard, CircleUserRound, CalendarRange } from "lucide-react";

const navItems = [
  {
    name: "Events",
    href: "/events",
    icon: CalendarRange,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresWallet: true,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: CircleUserRound,
    requiresWallet: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { publicKey } = useWallet();
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.nav
        animate={{
          boxShadow: scrolled ? "0 0 15px rgba(76, 29, 149, 0.15)" : "none",
          width: scrolled ? "65%" : "100%",
          y: scrolled ? 10 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="mx-auto mt-2 flex items-center justify-between rounded-lg 
        bg-white/25 px-6 py-2 backdrop-blur-sm 
        max-sm:!w-[90%] 
        sm:max-w-[75%] 
        dark:border dark:border-zinc-200/20 dark:bg-card/80"
      >
        {/* Logo */}
        <div>
          <Link
            href="/"
            className="text-xl font-extrabold bg-gradient-to-r text-neutral-400 bg-clip-text  transition-all duration-300"
          >
            EveNFT
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="max-md:hidden">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="relative px-4 py-1 text-md"
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === href && (
                <motion.span
                  layoutId="hovered-span-desktop"
                  className="absolute inset-0 h-full w-full rounded-md 
                  bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30"
                />
              )}
              <span
                className={`relative z-10 font-medium   transition-all duration-200 ${
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "dark:text-white text-black"
                    : "dark:text-muted-foreground text-gray-700 hover:text-foreground"
                }`}
              >
                {name}
              </span>
            </Link>
          ))}
        </div>

        {/* Wallet Connect Button */}
        <div className="cursor-pointer">
          <div className=" backdrop-blur-sm transition-all duration-200 ">
            <WalletConnectButton />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div
        className="fixed bottom-0 left-1/2 z-50 mb-2 flex -translate-x-1/2 items-center 
      justify-center rounded-md bg-white/5 dark:bg-card/80 px-2 py-2 backdrop-blur-sm 
      md:hidden max-[sm]:w-[80%] dark:border dark:border-zinc-200/20 
      shadow-[0_0_15px_rgba(76,29,149,0.15)]"
      >
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className="relative px-5 py-1 text-sm"
            onMouseEnter={() => setHovered(href)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === href && (
              <motion.span
                layoutId="hovered-span-mobile"
                className="absolute inset-0 h-full w-full rounded-md 
                bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30"
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Icon
                size={24}
                className={`mb-1 transition-all duration-200 ${
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "text-indigo-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              />
              <span
                className={`font-medium   text-xs transition-all duration-200 ${
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "text-indigo-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
