"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="pt-30 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Main Title - Fade In */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Anyigor Kelvin | Software Engineer
            </h1>

            {/* Personal Details - Staggered Animation */}
            <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              <div
                className={`transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <span>
                  Passionate Software Engineer with 5+ years of experience
                  building scalable web and mobile applications. Skilled in
                  React, Next.js, Node.js, and modern UI/UX. Always eager to
                  learn, collaborate, and deliver high-quality solutions. Based
                  in Tehran, available for freelance and remote work.
                </span>
              </div>
            </div>

            {/* Buttons - Fade In with Delay */}
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base">
                Contact me
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base">
                View my work
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto">
              {/* Abstract background shape - Floating Animation */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full opacity-20 transform rotate-12 scale-110 transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-20" : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: "300ms" }}
              ></div>

              {/* Profile picture - Slide In from Right */}
              <div
                className={`relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-gray-700 transition-all duration-1000 ease-out ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-16"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                  AK
                </div>
                {/* <Image
                  src="/assets/images/profile.JPG"
                  alt=""
                  width={320}
                  height={320}
                /> */}
              </div>

              {/* Floating icons with continuous floating animation */}
              <div
                className={`absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg transition-all duration-1000 ease-out animate-bounce ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ transitionDelay: "900ms" }}
              >
                JS
              </div>

              <div
                className={`absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-1000 ease-out animate-bounce ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ transitionDelay: "1100ms" }}
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>

              {/* Camera icon - Fade In with Scale */}
              <div
                className={`absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-1000 ease-out hover:scale-110 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ transitionDelay: "1300ms" }}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
