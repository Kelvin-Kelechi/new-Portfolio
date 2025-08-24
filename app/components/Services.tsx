"use client";
import { useEffect, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      id: 1,
      title: "Speed & Optimization",
      description:
        "Improving load times, SEO, and overall user experience through code and asset optimization.",
      icon: (
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
      iconBg: "bg-blue-600",
      animationDelay: 0,
    },
    {
      id: 2,
      title: "Full-Stack Solutions",
      description:
        "End-to-end development from frontend UI to backend infrastructure and deployment.",
      icon: (
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
      ),
      iconBg: "bg-purple-600",
      animationDelay: 200,
    },
    {
      id: 3,
      title: "Backend Development",
      description:
        "Developing secure and scalable server-side logic, APIs, and database integration.",
      icon: (
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      iconBg: "bg-green-600",
      animationDelay: 400,
    },
    {
      id: 4,
      title: "Frontend Development",
      description:
        "Building responsive, user-friendly web interfaces using modern frameworks like React or Vue.",
      icon: (
        <span className="text-white font-bold text-lg sm:text-xl">
          &lt;/&gt;
        </span>
      ),
      iconBg: "bg-orange-600",
      animationDelay: 600,
    },
  ];

  // Create scroll reveal hooks for each service card
  const serviceRefs = services.map(() => useScrollReveal(0.1));

  return (
    <section id="services" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <h2
          className={`text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const { ref, isInView } = serviceRefs[index];

            return (
              <div
                key={service.id}
                ref={ref}
                className={`group bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 transition-all duration-700 ease-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-gray-600/50 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${service.animationDelay}ms` }}
              >
                {/* Icon Container with Animations */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12 group-hover:animate-bounce`}
                >
                  {service.icon}
                </div>

                {/* Content with Hover Effects */}
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 text-center group-hover:text-blue-400 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-center group-hover:text-gray-200 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-2xl pointer-events-none"></div>

                {/* Floating Elements on Hover */}
                <div
                  className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500 ease-out"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500 ease-out"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
