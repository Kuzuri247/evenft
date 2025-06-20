"use client";

import { Link } from "next-view-transitions";
import { CTA } from "@/components/CTA";
import { Features } from "@/components/Features";
import { ArrowRight, Plus } from "lucide-react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "Get",
    className:
      "bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200",
  },
  {
    text: "rewards",
    className:
      "bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-green-200",
  },
  {
    text: "for ",
    className:
      "bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-emerald-300",
  },
  {
    text: "attending",
    className:
      "bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400",
  },
  {
    text: " events",
    className: "text-green-300",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-green-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-4 lg:px-8 py-24 bg-[url('/grid-pattern.svg')]">
          <div className="space-y-8 max-w-4xl pb-10">
            <h1 className="text-5xl tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-br from-teal-300 via-green-100 to-green-200 mt-8">
              NFT dispenser for events
            </h1>
            <span className="text-xl md:text-2xl text-neutral-500 leading-relaxed mx-auto max-w-3xl">
              Create events, verify attendance, and distribute
              proof-of-attendance NFTs on the Solana blockchain.
            </span>
          </div>
          <TypewriterEffect words={words} />

          <div className="pt-8">
            <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                <Link
                  href="/events"
                  className="inline-flex w-full justify-center items-center px-8 py-4 text-base font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Browse Events
                  <ArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/events/create"
                  className="inline-flex w-full justify-center items-center px-8 py-4 text-base font-medium rounded-xl bg-transparent border border-green-400 text-green-200 hover:bg-green-800 transition-colors"
                >
                  Create Event
                  <Plus className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Simple badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="bg-black/30 px-4 py-2 rounded-full border border-gray-600 text-white text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Built on Solana
              </div>
              <div className="bg-black/30 px-4 py-2 rounded-full border border-gray-600 text-white text-sm flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                NFT Proof of Attendance
              </div>
              <div className="bg-black/30 px-4 py-2 rounded-full border border-gray-600 text-white text-sm flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Low Transaction Fees
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <CTA />
    </main>
  );
}
