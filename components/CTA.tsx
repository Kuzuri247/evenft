"use client";

import Link from "next/link";
import WalletConnectButton from "./WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ShieldCheck,
  Zap,
  Gift,
  Bandage,
  ArrowRight,
  Plus,
} from "lucide-react";

export const CTA = () => {
  const { publicKey } = useWallet();

  const features = [
    {
      icon: <ShieldCheck className="text-green-400" />,
      title: "Tamper-proof tickets",
      description: "Blockchain-secured tickets that cannot be counterfeited",
    },
    {
      icon: <Zap className="text-green-400" />,
      title: "Instant verification",
      description: "Verify ticket authenticity in seconds",
    },
    {
      icon: <Gift className="text-green-400" />,
      title: "Collectible NFTs",
      description: "Turn your event tickets into valuable digital collectibles",
    },
    {
      icon: <Bandage />,
      title: "No ticket fraud",
      description: "Eliminate fake tickets and fraudulent sales",
    },
  ];

  return (
    <div>
      {/* Modernized CTA Section */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-indigo-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-800/90 to-violet-900/90 backdrop-blur-sm"></div>
            <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl"></div>

            <div className="relative px-8 py-16 md:py-20 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center z-10">
              <div className="md:w-2/3 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white sm:text-4xl leading-tight">
                  Ready to revolutionize your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#E114E5]">
                    events
                  </span>
                  ?
                </h2>
                <p className="mt-6 text-lg text-indigo-200 max-w-2xl">
                  Create your first event or browse upcoming events on the
                  platform. Join the future of event ticketing today.
                </p>

                {/* Restructured Features Grid */}
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Why choose our platform?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="group relative p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors duration-300">
                            {feature.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-indigo-200/80 text-xs leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 md:pl-10">
                {publicKey ? (
                  <div className="space-y-4">
                    <Link
                      href="/events"
                      className="group relative w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-indigo-900/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-xl group-hover:border-indigo-300/60 transition-all"></span>
                      <span className="relative text-white flex items-center font-semibold">
                        Browse Events
                        <ArrowRight className="ml-2" />
                      </span>
                    </Link>
                    <Link
                      href="/events/create"
                      className="group relative w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-indigo-900/20"
                    >
                      <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-xl group-hover:border-indigo-300/60 transition-all"></span>
                      <span className="relative text-white flex items-center font-semibold">
                        Create Event
                        <Plus className="ml-2" />
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-8 shadow-2xl shadow-indigo-900/20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md rounded-xl"></div>
                    <div className="relative flex flex-col items-center space-y-4">
                      <div className="text-center mb-4">
                        <h3 className="text-white font-semibold text-lg mb-2">
                          Get Started
                        </h3>
                        <p className="text-indigo-200/80 text-sm">
                          Connect your wallet to create or browse events
                        </p>
                      </div>
                      <div className="transform transition-transform hover:scale-105">
                        <WalletConnectButton />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Added bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    </div>
  );
};
