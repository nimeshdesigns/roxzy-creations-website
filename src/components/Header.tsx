import React, { useState } from "react";
import { LogIn, LogOut, Shield, User, Layers, Menu, X } from "lucide-react";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  currentView: "home" | "designs" | "whatsapp" | "profile" | "admin";
  setView: (view: "home" | "designs" | "whatsapp" | "profile" | "admin") => void;
}

export default function Header({ user, onLogin, onLogout, currentView, setView }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0c0c0e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => {
            setView("home");
            setMenuOpen(false);
          }} 
          className="flex cursor-pointer items-center gap-2 sm:gap-3 transition-transform duration-200 active:scale-95"
          id="logo-button"
        >
          <img 
            src="https://i.ibb.co/tMW74jvd/Nimesh-FX-Lo-Go4.png" 
            alt="Roxzy Creations Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-sans text-xs sm:text-lg font-black tracking-wider text-white whitespace-nowrap">
              ROXZY <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black">CREATIONS</span>
            </span>
            <span className="font-mono text-[8px] tracking-widest text-[#a1a1aa] uppercase hidden sm:block">
              // Creative Hub
            </span>
          </div>
        </div>

        {/* Action/Navigation Buttons & Portal links */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Main 3 navigation links: Hidden on mobile layout, visible on desktop sm:inline-block */}
          <button
            onClick={() => setView("home")}
            className={`hidden sm:inline-block cursor-pointer px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${
              currentView === "home" 
                ? "bg-white/[0.06] text-emerald-400 border border-emerald-500/30" 
                : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
            }`}
            id="nav-home"
          >
            Studio
          </button>
          
          <button
            onClick={() => setView("designs")}
            className={`hidden sm:inline-block cursor-pointer px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${
              currentView === "designs" 
                ? "bg-white/[0.06] text-emerald-400 border border-emerald-500/30" 
                : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
            }`}
            id="nav-designs"
          >
            Designs
          </button>

          <button
            onClick={() => setView("whatsapp")}
            className={`hidden sm:inline-block cursor-pointer px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${
              currentView === "whatsapp" 
                ? "bg-white/[0.06] text-emerald-400 border border-emerald-500/30" 
                : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
            }`}
            id="nav-whatsapp"
          >
            Reactions
          </button>

          {/* 3-line minimizable hamburger menu trigger (Placed right next to the profile/login container) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden cursor-pointer p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/[0.04] active:bg-white/[0.08] transition-all border border-white/[0.06] flex items-center justify-center"
            id="mobile-menu-trigger"
            aria-label="Toggle Navigation Options"
            title="Toggle Menu"
          >
            {menuOpen ? (
              <X className="h-4 w-4 text-emerald-400" />
            ) : (
              <div className="flex flex-col gap-1 w-4 h-4 items-center justify-center">
                <span className="w-4 h-[1.5px] bg-zinc-400 rounded-full" />
                <span className="w-4 h-[1.5px] bg-zinc-400 rounded-full" />
                <span className="w-4 h-[1.5px] bg-zinc-400 rounded-full" />
              </div>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Profile Portal Option */}
              <button
                onClick={() => {
                  setView("profile");
                  setMenuOpen(false);
                }}
                className={`cursor-pointer flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  currentView === "profile"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                    : "text-[#a1a1aa] hover:text-emerald-300 hover:bg-emerald-500/5"
                }`}
                id="nav-profile"
                title="Client Dashboard"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {/* Admin Portal Option */}
              {user.role === "Admin" && (
                <button
                  onClick={() => {
                    setView("admin");
                    setMenuOpen(false);
                  }}
                  className={`cursor-pointer flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                    currentView === "admin"
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/40"
                      : "text-[#a1a1aa] hover:text-cyan-300 hover:bg-cyan-500/5"
                  }`}
                  id="nav-admin"
                  title="Admin Dashboard"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              {/* Log out */}
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer p-1 rounded-lg text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                id="btn-logout"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onLogin();
                setView("home");
                setMenuOpen(false);
              }}
              className="cursor-pointer flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-[#0c0c0e] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] text-[10px] sm:text-xs font-black rounded-lg tracking-wide transition-all duration-200 active:scale-95"
              id="btn-login"
            >
              <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">LOGIN</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile navigation panel dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sm:hidden border-t border-white/[0.06] bg-[#0c0c0e] overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setView("home");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between ${
                  currentView === "home"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span>Studio Base</span>
                <span className="text-[9px] font-mono opacity-50">#01</span>
              </button>
              
              <button
                onClick={() => {
                  setView("designs");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between ${
                  currentView === "designs"
                    ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span>Designs Showcase</span>
                <span className="text-[9px] font-mono opacity-50">#02</span>
              </button>

              <button
                onClick={() => {
                  setView("whatsapp");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between ${
                  currentView === "whatsapp"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span>Reactions catalog</span>
                <span className="text-[9px] font-mono opacity-50">#03</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
