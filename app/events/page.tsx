"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  maxAttendees: number;
  currentAttendees: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="absolute -inset-1 bg-indigo-600 rounded-full opacity-30 blur-xl animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-400 border-l-indigo-400 border-r-transparent border-b-transparent"></div>
            </div>
            <p className="mt-8 text-lg text-muted-foreground  ">
              Discovering events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header with animated background */}
      <div className="relative py-20 mb-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>

        {/* Animated blobs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 inline-block  ">
            Events &amp; Experiences
          </h1>
          <p className="mt-4 text-xl text-indigo-100  ">
            Discover blockchain-verified events and collect your proof of
            attendance NFTs
          </p>

          {/* Event filtering tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300   ${
                activeFilter === "all"
                  ? "bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 backdrop-blur-sm text-indigo-200 hover:bg-white/10"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveFilter("upcoming")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300   ${
                activeFilter === "upcoming"
                  ? "bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 backdrop-blur-sm text-indigo-200 hover:bg-white/10"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveFilter("trending")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300   ${
                activeFilter === "trending"
                  ? "bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 backdrop-blur-sm text-indigo-200 hover:bg-white/10"
              }`}
            >
              Trending
            </button>
            {publicKey && (
              <button
                onClick={() => setActiveFilter("your")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300   ${
                  activeFilter === "your"
                    ? "bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20"
                    : "bg-white/5 backdrop-blur-sm text-indigo-200 hover:bg-white/10"
                }`}
              >
                Your Events
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {events.length === 0 ? (
          <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-10 text-center max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            <svg
              className="h-24 w-24 text-indigo-400/40 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M15 7l3 3m0 0l3-3m-3 3V4"
              />
            </svg>
            <p className="text-xl text-foreground font-medium mb-3  ">
              No events available yet
            </p>
            <p className="text-muted-foreground mb-8  ">
              Be the first to create an exciting blockchain-verified event
            </p>
            <Link
              href="/events/create"
              className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative text-white flex items-center">
                Create First Event
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-background/40 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-900/30 overflow-hidden transition-all duration-500 hover:shadow-indigo-900/20 hover:-translate-y-1"
              >
                {/* Card hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"></div>
                  <Image
                    src={event.imageUrl}
                    alt={`Event image for ${event.title}`}
                    title={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-600/80 backdrop-blur-sm text-white  ">
                      {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                    </span>
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-indigo-300 transition-colors  ">
                    {event.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-2  ">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                      <svg
                        className="h-5 w-5 mr-3 text-indigo-400/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm  ">
                        {format(new Date(event.date), "PPP p")}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                      <svg
                        className="h-5 w-5 mr-3 text-indigo-400/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm  ">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                      <svg
                        className="h-5 w-5 mr-3 text-indigo-400/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <div className="flex items-center w-full">
                        <span className="text-sm  ">
                          {event.currentAttendees} / {event.maxAttendees}{" "}
                          attendees
                        </span>
                        <div className="ml-auto w-24 h-1.5 bg-indigo-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{
                              width: `${
                                (event.currentAttendees / event.maxAttendees) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="group/btn relative inline-flex w-full justify-center items-center px-4 py-2.5 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300  "
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-90 group-hover/btn:opacity-100 transition-opacity"></span>
                    <span className="absolute inset-0 border border-indigo-400/30 rounded-lg"></span>
                    <span className="relative text-white flex items-center justify-center">
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create event floating button */}
        {publicKey && events.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Link
              href="/events/create"
              className="group flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-700/30 hover:shadow-indigo-700/50 transition-all duration-300 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="absolute right-full mr-4 bg-card px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap  ">
                Create Event
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
