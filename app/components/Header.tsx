"use client";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                AK
              </span>
            </div>
            {/* <span className="hidden sm:inline text-lg font-semibold text-white tracking-wide">
              Anyigor Kelvin
            </span> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              About
            </a>
            <a
              href="#resume"
              onClick={(e) => handleNavClick(e, "resume")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Resume
            </a>
            <a
              href="#portfolio"
              onClick={(e) => handleNavClick(e, "portfolio")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, "services")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mega Menu Navigation - Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 border-t border-gray-700">
            {/* Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="text-center">
                  <a
                    href="#home"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 group"
                    onClick={(e) => handleNavClick(e, "home")}
                  >
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      Home
                    </span>
                  </a>
                </div>

                <div className="text-center">
                  <a
                    href="#about"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 group"
                    onClick={(e) => handleNavClick(e, "about")}
                  >
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      About
                    </span>
                  </a>
                </div>

                <div className="text-center">
                  <a
                    href="#resume"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-green-500/50 group"
                    onClick={(e) => handleNavClick(e, "resume")}
                  >
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12h6m-6-4h6m2 5H9a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v9a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                      Resume
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="text-center">
                  <a
                    href="#portfolio"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-orange-500/50 group"
                    onClick={(e) => handleNavClick(e, "portfolio")}
                  >
                    <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-orange-400 transition-colors">
                      Portfolio
                    </span>
                  </a>
                </div>

                <div className="text-center">
                  <a
                    href="#services"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-pink-500/50 group"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-pink-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-pink-400 transition-colors">
                      Services
                    </span>
                  </a>
                </div>

                <div className="text-center">
                  <a
                    href="#contact"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-red-500/50 group"
                    onClick={(e) => handleNavClick(e, "contact")}
                  >
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600/30 transition-colors">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium group-hover:text-red-400 transition-colors">
                      Contact
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105">
                  Download CV
                </button>
                <button className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105">
                  Hire Me
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
