import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/provider/SolanaProvider";
import Navigation from "@/components/Navigation";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventSeal - Blockchain Event Tickets",
  description:
    "Create and manage events with blockchain-verified attendance and NFT tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SolanaProvider>
          <Providers>
            <Navigation />
            <main className="scroll-smooth">{children}</main>
          </Providers>
        </SolanaProvider>
      </body>
    </html>
  );
}
