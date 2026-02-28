import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Logo = ({ size = "md", className = "" }) => {
  const dimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 48, height: 48 },
    lg: { width: 56, height: 56 }
  };

  const { width, height } = dimensions[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      aria-label="Lakshya Tracker Logo"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]"
      >
        {/* Aged parchment background */}
        <defs>
          <radialGradient id="parchmentBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
          </radialGradient>
          
          <linearGradient id="saffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9933" />
            <stop offset="100%" stopColor="#ff6600" />
          </linearGradient>
          
          <linearGradient id="deepGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#0a5a03" />
          </linearGradient>
          
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <pattern id="texture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="none"/>
            <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.03"/>
          </pattern>
        </defs>

        {/* Main circular background */}
        <circle cx="60" cy="60" r="58" fill="url(#parchmentBg)" />
        <circle cx="60" cy="60" r="58" fill="url(#texture)" />
        
        {/* Ornate outer border - traditional Indian pattern */}
        <circle cx="60" cy="60" r="56" fill="none" stroke="url(#gold)" strokeWidth="2.5" opacity="0.9" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="url(#saffron)" strokeWidth="1" opacity="0.6" />
        
        {/* Decorative corner elements - paisley inspired */}
        <g opacity="0.7">
          {[0, 90, 180, 270].map((rotation, i) => (
            <g key={i} transform={`rotate(${rotation} 60 60)`}>
              {/* Paisley (buta) pattern */}
              <path
                d="M 60 12 Q 68 15, 70 22 Q 72 28, 68 32 Q 64 36, 60 34 Q 58 32, 60 28 Q 62 24, 60 20 Z"
                fill="url(#deepGreen)"
                stroke="url(#gold)"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </g>
        
        {/* Stylized elephants on sides - traditional Indian motif */}
        <g opacity="0.65">
          {/* Left elephant */}
          <g transform="translate(15, 55)">
            <ellipse cx="8" cy="8" rx="7" ry="9" fill="url(#saffron)" />
            <path d="M 8 17 Q 6 22, 5 25 M 8 17 Q 10 22, 11 25" stroke="url(#saffron)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 4 6 Q 0 8, -2 6" stroke="url(#saffron)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="6" cy="6" r="1" fill="#0a5a03" />
          </g>
          
          {/* Right elephant */}
          <g transform="translate(97, 55) scale(-1, 1)">
            <ellipse cx="8" cy="8" rx="7" ry="9" fill="url(#saffron)" />
            <path d="M 8 17 Q 6 22, 5 25 M 8 17 Q 10 22, 11 25" stroke="url(#saffron)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 4 6 Q 0 8, -2 6" stroke="url(#saffron)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="6" cy="6" r="1" fill="#0a5a03" />
          </g>
        </g>
        
        {/* Central gear with tools - fusion of tradition and modernity */}
        <g transform="translate(60, 60)">
          {/* Gear outline */}
          <circle r="28" fill="none" stroke="url(#deepGreen)" strokeWidth="1.5" opacity="0.4" />
          
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <rect x="-2" y="-30" width="4" height="4" fill="url(#gold)" opacity="0.5" rx="0.5" />
            </g>
          ))}
          
          {/* Central flower mandala pattern */}
          <circle r="24" fill="url(#parchmentBg)" opacity="0.9" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <ellipse cx="0" cy="-15" rx="4" ry="8" fill="url(#saffron)" opacity="0.7" />
            </g>
          ))}
          
          {/* Crossed wrench and hammer */}
          <g transform="rotate(-45)">
            {/* Hammer */}
            <rect x="-2" y="-18" width="4" height="24" fill="url(#deepGreen)" rx="1" />
            <rect x="-6" y="-20" width="12" height="6" fill="url(#deepGreen)" rx="1" />
          </g>
          
          <g transform="rotate(45)">
            {/* Wrench */}
            <rect x="-1.5" y="-18" width="3" height="22" fill="url(#gold)" rx="1" />
            <circle cx="0" cy="-16" r="4" fill="none" stroke="url(#gold)" strokeWidth="2" />
          </g>
          
          {/* Center dot */}
          <circle r="3" fill="url(#saffron)" />
          <circle r="2" fill="url(#gold)" />
        </g>
        
        {/* Decorative dots around the circle - traditional Indian embellishment */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + Math.cos(rad) * 48;
          const y = 60 + Math.sin(rad) * 48;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill="url(#gold)" opacity="0.6" />
          );
        })}
        
        {/* Inner decorative ring - traditional border */}
        <circle cx="60" cy="60" r="35" fill="none" stroke="url(#saffron)" strokeWidth="0.5" opacity="0.4" strokeDasharray="2,2" />
      </svg>
      
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(253,224,71,0.5) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default function Header({ state, setState }) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Adjust cycle day
  const adjustDay = (amount) => {
    if (setState) {
      setState((prev) => ({
        ...prev,
        cycleDay: Math.max(1, Math.min(31, prev.cycleDay + amount)),
      }));
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((state.cycleDay / 31) * 100).toFixed(0);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-slate-950/98 backdrop-blur-xl border-b border-slate-800/70 shadow-xl" 
          : "py-4 md:py-6 bg-slate-950/60 backdrop-blur-sm"
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo and Brand */}
          <motion.div 
            layout 
            className="flex items-center gap-3 md:gap-4 min-w-0"
          >
            <Logo size={isScrolled ? "sm" : "md"} className="shrink-0" />
            
            <div className="flex flex-col min-w-0">
              <motion.h1
                layout
                className={`font-bold tracking-tight leading-tight transition-all duration-300 ${
                  isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl lg:text-4xl"
                }`}
                style={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 60%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <span className="font-light italic text-emerald-400 mr-1" style={{ fontSize: '0.65em' }}>
                  लक्ष्य
                </span>
                Lakshya
              </motion.h1>
              
              <AnimatePresence>
                {!isScrolled && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs md:text-sm text-slate-400 font-medium hidden sm:block"
                  >
                    Your Progress Companion
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Day Controls */}
          <motion.div 
            layout
            className="flex items-center gap-2 md:gap-3"
          >
            {/* Day Label - Hidden on mobile when scrolled */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hidden md:flex flex-col items-end mr-2"
                >
                   <span className="text-[30px] md:text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Day
                </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Journey Progress
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {progressPercentage}% Complete
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Day Controls Group */}
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-1 md:p-1.5 shadow-lg">
              {/* Decrease Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => adjustDay(-1)}
                disabled={state.cycleDay <= 1}
                className={`
                  w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
                  rounded-lg md:rounded-xl text-base md:text-lg font-bold
                  transition-all duration-200
                  ${state.cycleDay <= 1 
                    ? 'text-slate-600 cursor-not-allowed opacity-50' 
                    : 'text-emerald-400 hover:text-emerald-300 active:text-emerald-500'
                  }
                `}
                aria-label="Previous Day"
                aria-disabled={state.cycleDay <= 1}
              >
                −
              </motion.button>

              {/* Day Display */}
              <div className="px-2 md:px-4 py-1 md:py-2 bg-slate-800/80 border border-slate-600/30 rounded-lg md:rounded-xl min-w-15 md:min-w-20 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg md:text-2xl font-black text-emerald-400 tabular-nums">
                    {state.cycleDay}
                  </span>
                  <span className="text-slate-500 text-sm md:text-base">/</span>
                  <span className="text-slate-500 text-sm md:text-lg font-bold">31</span>
                </div>
               
              </div>

              {/* Increase Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => adjustDay(1)}
                disabled={state.cycleDay >= 31}
                className={`
                  w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
                  rounded-lg md:rounded-xl text-base md:text-lg font-bold
                  transition-all duration-200
                  ${state.cycleDay >= 31 
                    ? 'text-slate-600 cursor-not-allowed opacity-50' 
                    : 'text-emerald-400 hover:text-emerald-300 active:text-emerald-500'
                  }
                `}
                aria-label="Next Day"
                aria-disabled={state.cycleDay >= 31}
              >
                +
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="relative w-full h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom border gradient when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 w-full h-0.5"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.5) 20%, rgba(59, 130, 246, 0.7) 50%, rgba(168, 85, 247, 0.5) 80%, transparent 100%)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}