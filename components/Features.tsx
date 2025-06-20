import React from "react";

export const Features = () => {
  return (
    <div>
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-card/80 to-background relative overflow-hidden"
      >
        {/* Subtle diagonal lines for visual texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl rounded-lg"></div>
              <h2 className="relative text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#E114E5] inline-block    ">
                Why EventSeal?
              </h2>
            </div>
            <div className="w-36 h-1 bg-gradient-to-r from-[#007BFF] to-[#E114E5] mx-auto mt-2 rounded-full"></div>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto  ">
              Taking event ticketing to the next level with blockchain
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from- hover:mask-none">
              {" "}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="h-8 w-8 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-indigo-300 transition-colors duration-300  ">
                Verified Attendance
              </h3>
              <p className="text-muted-foreground  ">
                Confirm participation with blockchain-backed verification
                that&apos;s tamper-proof and transparent.
              </p>
            </div>

            {/* Feature 2 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from- hover:mask-none">
              {" "}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="h-8 w-8 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-purple-300 transition-colors duration-300  ">
                NFT Tickets
              </h3>
              <p className="text-muted-foreground  ">
                Attendees receive unique, collectible NFTs as proof of
                attendance that live forever on the blockchain.
              </p>
            </div>

            {/* Feature 3 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from- hover:mask-none">
              {" "}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-violet-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-violet-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="h-8 w-8 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-violet-300 transition-colors duration-300  ">
                Fast & Affordable
              </h3>
              <p className="text-muted-foreground  ">
                Built on Solana for lightning-fast transactions and minimal
                fees, making it accessible for events of any size.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
