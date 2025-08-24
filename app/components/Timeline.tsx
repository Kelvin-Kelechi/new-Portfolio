// "use client";
// // import { useScrollStory } from "../hooks/useScrollStory";

// export default function Timeline() {
//   const { ref, scrollProgress, getParallaxTransform, getStaggeredDelay } = useScrollStory({
//     threshold: 0.2,
//     parallaxSpeed: 0.3,
//     staggerDelay: 200
//   });

//   const timelineData = [
//     {
//       year: "2019",
//       title: "Started My Journey",
//       description: "Began learning web development with HTML, CSS, and JavaScript",
//       icon: "🚀",
//       category: "Learning"
//     },
//     {
//       year: "2020",
//       title: "First Project",
//       description: "Built my first responsive website and deployed it online",
//       icon: "💻",
//       category: "Development"
//     },
//     {
//       year: "2021",
//       title: "React & Next.js",
//       description: "Mastered modern frontend frameworks and state management",
//       icon: "⚛️",
//       category: "Frontend"
//     },
//     {
//       year: "2022",
//       title: "Full-Stack Projects",
//       description: "Developed complete applications with backend APIs and databases",
//       icon: "🔗",
//       category: "Full-Stack"
//     },
//     {
//       year: "2023",
//       title: "Mobile Development",
//       description: "Expanded into React Native and mobile app development",
//       icon: "📱",
//       category: "Mobile"
//     },
//     {
//       year: "2024",
//       title: "AI Integration",
//       description: "Incorporating AI and machine learning into web applications",
//       icon: "🤖",
//       category: "Innovation"
//     }
//   ];

//   return (
//     <section id="timeline" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900 to-gray-800">
//       <div className="container mx-auto">
//         {/* Parallax Background Elements */}
//         <div 
//           className="absolute inset-0 overflow-hidden pointer-events-none"
//           style={{ transform: getParallaxTransform(0.1) }}
//         >
//           <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
//           <div className="absolute top-40 right-20 w-24 h-24 bg-purple-600/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-600/10 rounded-full blur-3xl"></div>
//         </div>

//         <div ref={ref} className="relative z-10">
//           <h2 
//             className="text-4xl sm:text-5xl font-bold text-white text-center mb-16"
//             style={{ 
//               transform: getParallaxTransform(0.2),
//               opacity: Math.min(1, scrollProgress * 3)
//             }}
//           >
//             My Journey
//           </h2>

//           <div className="relative">
//             {/* Timeline Line */}
//             <div 
//               className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-green-600 h-full"
//               style={{ 
//                 transform: `scaleY(${scrollProgress})`,
//                 transformOrigin: 'top'
//               }}
//             ></div>

//             {/* Timeline Items */}
//             <div className="space-y-16">
//               {timelineData.map((item, index) => {
//                 const isEven = index % 2 === 0;
//                 const itemProgress = Math.max(0, Math.min(1, (scrollProgress - index * 0.15) * 2));
                
//                 return (
//                   <div
//                     key={index}
//                     className={`relative flex items-center ${
//                       isEven ? 'flex-row' : 'flex-row-reverse'
//                     }`}
//                     style={{ 
//                       opacity: itemProgress,
//                       transform: `translateX(${isEven ? -50 : 50}px) scale(${0.8 + itemProgress * 0.2})`
//                     }}
//                   >
//                     {/* Timeline Item Content */}
//                     <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
//                       <div 
//                         className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-500"
//                         style={{ 
//                           transform: `translateY(${itemProgress * 20}px)`,
//                           transitionDelay: getStaggeredDelay(index)
//                         }}
//                       >
//                         <div className="flex items-center gap-3 mb-3">
//                           <span className="text-2xl">{item.icon}</span>
//                           <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
//                             {item.category}
//                           </span>
//                         </div>
//                         <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
//                         <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
//                       </div>
//                     </div>

//                     {/* Timeline Node */}
//                     <div className="relative z-10 flex-shrink-0">
//                       <div 
//                         className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-gray-900 shadow-lg"
//                         style={{ 
//                           transform: `scale(${0.5 + itemProgress * 0.5})`,
//                           boxShadow: itemProgress > 0.5 ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
//                         }}
//                       ></div>
//                       <div 
//                         className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75"
//                         style={{ 
//                           animationDelay: getStaggeredDelay(index),
//                           opacity: itemProgress > 0.8 ? 0.75 : 0
//                         }}
//                       ></div>
//                     </div>

//                     {/* Year Label */}
//                     <div className={`w-5/12 ${isEven ? 'text-left pl-8' : 'text-right pr-8'}`}>
//                       <div 
//                         className="text-3xl font-bold text-blue-400 opacity-60"
//                         style={{ 
//                           transform: `translateY(${itemProgress * -15}px)`,
//                           opacity: 0.3 + itemProgress * 0.7
//                         }}
//                       >
//                         {item.year}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Scroll Progress Indicator */}
//             <div className="fixed top-20 right-6 w-2 h-32 bg-gray-700 rounded-full overflow-hidden z-50">
//               <div 
//                 className="w-full bg-gradient-to-t from-blue-600 to-purple-600 transition-all duration-300"
//                 style={{ height: `${scrollProgress * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
