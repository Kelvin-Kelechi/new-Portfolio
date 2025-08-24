"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Skills() {
  // Removed unused isVisible state since we're using scroll reveal now

  const skillsData = [
    {
      title: "Frontend Developer",
      icon: "&lt;/&gt;",
      iconBg: "bg-purple-600",
      progressBars: [
        { skill: "C#", percentage: 95, color: "bg-purple-600" },
        { skill: "JavaScript", percentage: 80, color: "bg-purple-600" },
        { skill: "HTML / CSS", percentage: 85, color: "bg-purple-600" },
      ],
    },
    {
      title: "Backend Developer",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      iconBg: "bg-blue-600",
      progressBars: [
        { skill: "MySQL", percentage: 76, color: "bg-blue-600" },
        { skill: "PHP", percentage: 84, color: "bg-blue-600" },
        { skill: "Laravel", percentage: 79, color: "bg-blue-600" },
      ],
    },
    {
      title: "Mobile Developer",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      ),
      iconBg: "bg-green-600",
      progressBars: [
        { skill: "React Native", percentage: 88, color: "bg-green-600" },
        { skill: "Flutter", percentage: 72, color: "bg-green-600" },
        { skill: "iOS Development", percentage: 81, color: "bg-green-600" },
      ],
    },
  ];

  // Create scroll reveal hooks for each skill card (fixed number)
  const skillRef1 = useScrollReveal(0.1);
  const skillRef2 = useScrollReveal(0.1);
  const skillRef3 = useScrollReveal(0.1);
  const skillRefs = [skillRef1, skillRef2, skillRef3];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {skillsData.map((skillGroup, index) => {
            const { ref, isInView } = skillRefs[index];

            return (
              <div
                key={index}
                ref={ref}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-600/50 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${skillGroup.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-out hover:rotate-12 hover:scale-110`}
                  >
                    {typeof skillGroup.icon === "string" ? (
                      <span
                        className="text-white font-bold text-base sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: skillGroup.icon }}
                      />
                    ) : (
                      skillGroup.icon
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {skillGroup.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {skillGroup.progressBars.map((progressBar, progressIndex) => (
                    <div key={progressIndex}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">
                          {progressBar.skill}
                        </span>
                        <span className="text-white">
                          {progressBar.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${
                            progressBar.color
                          } h-2 rounded-full transition-all duration-1000 ease-out transform origin-left ${
                            isInView ? "scale-x-100" : "scale-x-0"
                          }`}
                          style={{
                            width: `${progressBar.percentage}%`,
                            transitionDelay: `${
                              index * 200 + progressIndex * 100 + 400
                            }ms`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
