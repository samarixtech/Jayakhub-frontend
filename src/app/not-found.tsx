"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Replaced with standard, widely compatible emojis to avoid "question marks"
// Outer ring (12 items)
const outerRing = [
  "🍎", // Red Apple
  "🥦", // Broccoli
  "🍋", // Lemon
  "🥕", // Carrot
  "🍆", // Eggplant
  "🍏", // Green Apple
  "🧅", // Onion
  "🥔", // Potato
  "🍊", // Orange
  "🥒", // Cucumber
  "🥬", // Leafy Green
  "🌽", // Corn
];

// Inner ring (6 items)
const innerRing = [
  "🍄", // Mushroom
  "🥗", // Green Salad
  "🥑", // Avocado
  "🥝", // Kiwi
  "🫐", // Blueberries
  "🍇", // Grapes
];

// Helper to calculate position on a circle
const getPosition = (index: number, total: number, radiusPercent: number) => {
  const angle = (index / total) * 360;
  const angleRad = (angle - 90) * (Math.PI / 180);
  const x = 50 + radiusPercent * Math.cos(angleRad);
  const y = 50 + radiusPercent * Math.sin(angleRad);
  return { left: `${x}%`, top: `${y}%`, rotate: angle };
};

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFBF4] overflow-hidden font-serif text-[#C5A572] py-10 sm:py-0">
      
      {/* Mobile: Reduced Scale (0.6), Tighter Gap. Desktop: Scale 1, Large Gap */}
      {/* ADDED mb-2 to ensure spacing from text below on mobile. Removed negative bottom margin. */}
      <div className="flex items-center justify-center gap-1 sm:gap-10 md:gap-16 scale-[0.6] xs:scale-[0.65] sm:scale-90 md:scale-100 transition-transform duration-300 w-full max-w-6xl mx-auto mb-2 sm:mb-8 mt-4 sm:mt-10">
        {/* Left 4 Container - Width ensures spacing consistency without pushing content */}
        <div className="flex justify-end items-center min-w-[100px] sm:min-w-[200px]">
          <span className="text-[180px] sm:text-[300px] font-bold text-[#D4C4A8] leading-none select-none">
            4
          </span>
        </div>

        {/* The '0' - Perfectly Circular Vegetable Arrangement */}
        <div className="relative w-[210px] h-[210px] sm:w-[300px] sm:h-[300px] shrink-0">
          {/* Outer Ring */}
          {outerRing.map((emoji, index) => {
            const pos = getPosition(index, outerRing.length, 42); // 42% radius
            return (
              <motion.div
                key={`outer-${index}`}
                className="absolute text-6xl sm:text-7xl cursor-default select-none drop-shadow-sm flex items-center justify-center w-20 h-20"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
                initial={{ rotate: Math.random() * 30 - 15 }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  zIndex: 50,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
              >
                {emoji}
              </motion.div>
            );
          })}

          {/* Inner Ring */}
          {innerRing.map((emoji, index) => {
            const pos = getPosition(index, innerRing.length, 22); // 22% radius
            return (
              <motion.div
                key={`inner-${index}`}
                className="absolute text-5xl sm:text-6xl cursor-default select-none drop-shadow-sm flex items-center justify-center w-16 h-16"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
                initial={{ rotate: Math.random() * 30 - 15 }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  zIndex: 50,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>

        {/* Right 4 Container - Width ensures spacing consistency without pushing content */}
        <div className="flex justify-end items-center min-w-[100px] sm:min-w-[200px] ml-15">
          <span className="text-[180px] sm:text-[300px] font-bold text-[#D4C4A8] leading-none select-none">
            4
          </span>
        </div>
      </div>

      {/* Info Section - Tighter spacing for mobile */}
      {/* Removed negative top margin. Added relative positioning to ensure z-index correctness. */}
      <div className="text-center z-20 px-4 mt-0 sm:mt-12 w-full max-w-lg mx-auto relative">
        <h2 className="text-xl sm:text-2xl font-bold text-[#5A4633] tracking-wider uppercase mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-[#8C7B66] text-sm sm:text-base mb-8 px-2 leading-relaxed">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>

        <Link
          href="/"
          className="inline-block px-10 py-3 sm:px-12 sm:py-4 bg-[#FFA726] text-white text-sm font-bold rounded-full shadow-lg hover:bg-[#FB8C00] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
