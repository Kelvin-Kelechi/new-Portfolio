"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Resume() {
  const { ref, isInView } = useScrollReveal(0.1);

  const handleDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Anyigor-Kelvin-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    // Open resume in a new tab
    window.open('/resume.pdf', '_blank');
  };

  return (
    <section id="resume" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16">
            Resume
          </h2>

          {/* Download Resume Button */}
          <div className="flex justify-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownload}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-blue-500/25"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download Resume
                </span>
              </button>

              <button 
                onClick={handleView}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-blue-600 border-2 border-blue-600 rounded-2xl transition-all duration-300 ease-out hover:bg-blue-600 hover:text-white hover:scale-105"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Resume
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
