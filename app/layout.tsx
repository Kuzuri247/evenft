import { SolanaProvider } from "@/components/provider/SolanaProvider";
import { Inter,DM_Sans } from "next/font/google";
import { Providers } from "./provider";
import { ReactLenis } from "lenis/react";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import "@solana/wallet-adapter-react-ui/styles.css";

const dm = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evenft",
  description:
    "A platform for dispensing NFTs to Solana users for atending events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${dm.className} bg-background tracking-tight text-foreground dark:bg-background/90 dark:text-foreground/90 transition-all duration-300 ease-in-out`}
        >
          <ReactLenis root />
          <SolanaProvider>
            <Providers>
              <Navbar />
              {children}
            </Providers>
          </SolanaProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
