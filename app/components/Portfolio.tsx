"use client";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Portfolio() {
  // Removed unused isVisible state since we're using scroll reveal now
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleCardFlip = (cardId: number) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const toggleCardExpand = (cardId: number) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const filters = ["All", "Websites", "Apps"];
  const portfolioItems = [
    {
      id: 1,
      title: "Analytics Dashboard",
      description: "Data visualization and analytics platform",
      category: "Websites",
      longDescription:
        "A comprehensive analytics dashboard built with React and D3.js. Features real-time data visualization, interactive charts, and customizable widgets. Includes user authentication, role-based access control, and export functionality.",
      technologies: ["React", "D3.js", "Node.js", "MongoDB"],
      demoUrl: "#",
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      mockup: (
        <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg relative overflow-hidden">
          {/* Animated Chart Elements */}
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-2">
            {[20, 45, 30, 60, 40, 80, 35].map((height, index) => (
              <div
                key={index}
                className="w-2 bg-white/80 rounded-t transition-all duration-1000 ease-out hover:bg-white"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          {/* Floating Data Points */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-4 left-3 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Online Store",
      description: "Full-featured e-commerce platform",
      category: "Websites",
      longDescription:
        "A complete e-commerce solution with product catalog, shopping cart, payment integration, and admin panel. Features include inventory management, order tracking, customer reviews, and responsive design for all devices.",
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
      demoUrl: "#",
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      mockup: (
        <div className="w-full h-32 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg relative overflow-hidden">
          {/* Product Grid Mockup */}
          <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white/20 rounded animate-pulse"
              ></div>
            ))}
          </div>
          {/* Shopping Cart Icon */}
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l-.293-.293A1 1 0 015 12H3a1 1 0 01-.01-.042l1.358-5.43L3.22 3H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Profile Platform",
      description: "Professional profile and portfolio system",
      category: "Websites",
      longDescription:
        "A modern portfolio platform with customizable themes, blog integration, and social media connectivity. Features include drag-and-drop content management, SEO optimization, and analytics tracking.",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS", "Vercel"],
      demoUrl: "#",
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      mockup: (
        <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg relative overflow-hidden">
          {/* Profile Avatar Mockup */}
          <div className="absolute top-2 left-2 w-12 h-12 bg-white/30 rounded-full animate-pulse"></div>
          {/* Social Icons */}
          <div className="absolute bottom-2 left-2 flex space-x-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-6 h-6 bg-white/20 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          {/* Stats Bar */}
          <div className="absolute bottom-2 right-2 w-20 h-2 bg-white/20 rounded-full">
            <div className="w-3/4 h-full bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Language Learning App",
      description: "Mobile app for vocabulary and pronunciation",
      category: "Apps",
      longDescription:
        "An interactive language learning app with speech recognition, gamified lessons, and progress tracking. Features include offline mode, multiple languages, and social learning features.",
      technologies: ["React Native", "TensorFlow", "Redux", "SQLite"],
      demoUrl: "#",
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      mockup: (
        <div className="w-full h-32 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg relative overflow-hidden">
          {/* Phone Frame Mockup */}
          <div className="absolute inset-2 bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 animate-bounce"></div>
              <div className="text-xs">¡Hola!</div>
            </div>
          </div>
          {/* Swipe Indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full">
            <div className="w-4 h-full bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Fitness Tracker",
      description: "Workout planning and progress tracking",
      category: "Apps",
      longDescription:
        "A comprehensive fitness tracking app with workout planning, progress visualization, and social features. Includes calorie counting, exercise library, and wearable device integration.",
      technologies: ["Flutter", "Firebase", "Charts", "HealthKit"],
      demoUrl: "#",
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      mockup: (
        <div className="w-full h-32 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg relative overflow-hidden">
          {/* Workout Progress Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/30 rounded-full relative">
              <div
                className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"
                style={{ animationDuration: "2s" }}
              ></div>
            </div>
          </div>
          {/* Activity Icons */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      ),
    },
  ];

  // Filter portfolio items based on active filter
  const filteredItems =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  // Create scroll reveal hooks for each portfolio card (fixed number to cover all items)
  const portfolioRef1 = useScrollReveal(0.1);
  const portfolioRef2 = useScrollReveal(0.1);
  const portfolioRef3 = useScrollReveal(0.1);
  const portfolioRefs = [portfolioRef1, portfolioRef2, portfolioRef3];

  return (
    <section
      id="portfolio"
      className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800/50"
    >
      <div className="container mx-auto">
        <h2
          className={`text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16 transition-all duration-1000 ease-out opacity-100 translate-y-0`}
        >
          My portfolio
        </h2>

        {/* Filter Buttons with Animations */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-700/50 rounded-lg p-1">
            {filters.map((filter, index) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 sm:px-8 py-3 rounded-md font-medium text-sm transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "text-gray-300 hover:text-white hover:bg-gray-600/50"
                } opacity-100 translate-y-0`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid with 3D Effects and Live Demos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, filteredIndex) => {
            // Find the original index in portfolioItems to get the correct ref
            const originalIndex = portfolioItems.findIndex(
              (originalItem) => originalItem.id === item.id
            );
            // Use a fallback ref if the original index is not found
            const { ref, isInView } =
              portfolioRefs[originalIndex] || portfolioRefs[0];

            return (
              <div
                key={item.id}
                ref={ref}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-700 ease-out transform hover:scale-105 hover:rotate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-gray-600/50 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                } ${
                  expandedCard === item.id ? "col-span-full row-span-2" : ""
                }`}
                style={{ transitionDelay: `${filteredIndex * 150}ms` }}
              >
                {/* 3D Flip Container */}
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    flippedCards.has(item.id) ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front Side */}
                  <div
                    className={`w-full h-full p-6 sm:p-8 backface-hidden ${
                      flippedCards.has(item.id) ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {/* Icon Container with Zoom Effect */}
                    <div className="text-center text-white mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-12">
                        {item.icon}
                      </div>
                      <p className="text-xs sm:text-sm">{item.category}</p>
                    </div>

                    {/* Live Demo Mockup */}
                    <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                      {item.mockup}
                    </div>

                    {/* Content with Hover Effects */}
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">
                      {item.description}
                    </p>

                    {/* Interactive Buttons */}
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => toggleCardFlip(item.id)}
                        className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs rounded transition-all duration-300 hover:scale-105"
                      >
                        {flippedCards.has(item.id)
                          ? "Show Demo"
                          : "View Details"}
                      </button>
                      <button
                        onClick={() => toggleCardExpand(item.id)}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 text-xs rounded transition-all duration-300 hover:scale-105"
                      >
                        {expandedCard === item.id ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>

                  {/* Back Side (Flipped) */}
                  <div
                    className={`absolute inset-0 w-full h-full p-6 sm:p-8 backface-hidden rotate-y-180 ${
                      flippedCards.has(item.id) ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="text-center text-white">
                      <h4 className="text-lg font-semibold mb-4">
                        {item.title} - Details
                      </h4>
                      <p className="text-gray-300 text-sm mb-4">
                        {item.longDescription}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {item.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Demo Button */}
                      <a
                        href={item.demoUrl}
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-all duration-300 hover:scale-105"
                      >
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>

                {/* Expanded Content Overlay */}
                {expandedCard === item.id && (
                  <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 z-10 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => toggleCardExpand(item.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enhanced Mockup */}
                        <div className="transform hover:scale-105 transition-transform duration-300">
                          {item.mockup}
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Description
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.longDescription}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <a
                              href={item.demoUrl}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-all duration-300 hover:scale-105"
                            >
                              Live Demo
                            </a>
                            <button
                              onClick={() => toggleCardFlip(item.id)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-all duration-300 hover:scale-105"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-2xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows with Hover Effects */}
        <div className="relative mt-12 sm:mt-16">
          <button className="hidden sm:block absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-700/80 rounded-full flex items-center justify-center text-white hover:bg-gray-600 hover:scale-110 transition-all duration-300 ease-out z-10">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-700/80 rounded-full flex items-center justify-center text-white hover:bg-gray-600 hover:scale-110 transition-all duration-300 ease-out z-10">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
