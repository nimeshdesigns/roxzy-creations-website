import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PageLoaderProps {
  onComplete: () => void;
  targetViewName: string;
}

export default function PageLoader({ onComplete, targetViewName }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing studio nodes...");

  // Loading phase messages to make it super alive and professional
  const statusMessages = [
    { threshold: 0, text: "Initializing digital matrix..." },
    { threshold: 18, text: "Establishing secure Firestore synchronization..." },
    { threshold: 38, text: "Caching minimalist vector designs..." },
    { threshold: 58, text: "Calibrating post reaction counter values..." },
    { threshold: 78, text: "Rendering elite stream overlay assets..." },
    { threshold: 92, text: "Polishing interface perspectives..." },
    { threshold: 100, text: "System ready." }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // Exactly 2 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const computedProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(computedProgress);

      // Update status text based on current progress
      let selectedMessage = statusMessages[0];
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (computedProgress >= statusMessages[i].threshold) {
          selectedMessage = statusMessages[i];
          break;
        }
      }
      setStatusText(selectedMessage.text);

      if (computedProgress >= 100) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100%, trigger exit slide/fade after a micro-delay for smooth optics
  useEffect(() => {
    if (progress >= 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  // Circumference calculation for SVG Circular bar: 2 * PI * R
  // R = 48 -> C = ~301.6
  const radius = 48;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      className="fixed inset-0 z-[9999] bg-[#060608]/95 backdrop-blur-md flex flex-col items-center justify-center font-sans overflow-hidden select-none"
    >
      {/* Background soft glowing nebulas for loading ambiance */}
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      {/* Main loading cluster */}
      <div className="relative flex flex-col items-center justify-center max-w-sm px-4">
        
        {/* Loader structure: circle and logo overlapping inside */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          
          {/* Circular SVG Loading Bar around Logo */}
          <svg className="absolute w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background trace ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="3.5"
              fill="transparent"
            />
            {/* Dynamic load ring with neon glow filter */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
              style={{
                filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))"
              }}
            />
            {/* Definitions for gradient coloration */}
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* User logo centered with continuous gentle pulsing effect */}
          <motion.div 
            animate={{ 
              scale: [0.97, 1.03, 0.97],
              filter: ["brightness(0.9) drop-shadow(0 0 6px rgba(16,185,129,0.2))", "brightness(1.1) drop-shadow(0 0 16px rgba(16,185,129,0.45))", "brightness(0.9) drop-shadow(0 0 6px rgba(16,185,129,0.2))"]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 rounded-full bg-[#0a0a0d]/90 border border-white/[0.04] p-3 flex items-center justify-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5" />
            <img 
              src="https://i.ibb.co/tMW74jvd/Nimesh-FX-Lo-Go4.png" 
              alt="Roxzy logo loader" 
              className="h-16 w-16 object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Dynamic loading label parameters */}
        <div className="mt-8 text-center space-y-2">
          
          {/* Target destination view context */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-white/[0.04] bg-white/[0.02] text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
            <span>Loading:</span>
            <span className="text-emerald-400 font-extrabold font-sans">
              {targetViewName === "home" ? "Studio Base" : targetViewName === "designs" ? "Designs Showcase" : targetViewName === "whatsapp" ? "Reactions catalog" : targetViewName}
            </span>
          </div>

          {/* Loader Percentage Display */}
          <div className="text-3xl font-black font-mono tracking-tighter text-white">
            {Math.floor(progress)}<span className="text-emerald-400 text-lg">%</span>
          </div>

          {/* High-tech changing status lines */}
          <div className="h-4 flex items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest font-mono text-zinc-500 font-medium">
              {statusText}
            </p>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
