import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Palette, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Heart, 
  Facebook, 
  Youtube, 
  Send, 
  MessageCircle, 
  Puzzle, 
  Check, 
  AlertCircle,
  HelpCircle,
  Lock,
  ChevronRight,
  ExternalLink,
  Shield,
  Clock,
  Star,
  Users,
  X,
  Instagram
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import ShootingStarsBackground from "./components/ShootingStarsBackground";

import { auth, loginWithGoogle, logoutUser } from "./lib/firebase";
import { 
  createOrUpdateUserRecord, 
  seedDatabaseIfEmpty,
  listenToReviews,
  listenToWhatsappPrices,
  listenToGraphicDesigns,
  listenToPaymentMethods,
  listenToSocialLinks
} from "./lib/dataService";
import { 
  UserProfile, 
  Review, 
  WhatsappPrice, 
  GraphicDesign, 
  PaymentMethodRecord, 
  SocialLink 
} from "./types";

import Header from "./components/Header";
import ReviewSection from "./components/ReviewSection";
import OrderPopup from "./components/OrderPopup";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";
import PageLoader from "./components/PageLoader";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Navigation View Coordinator
  const [view, setView] = useState<"home" | "designs" | "whatsapp" | "profile" | "admin">("home");
  
  // Page Transition timing coordinates
  const [isPageLoading, setIsPageLoading] = useState(true); // Starts at true for initial load!
  const [pendingView, setPendingView] = useState<"home" | "designs" | "whatsapp" | "profile" | "admin">("home");

  const navigateToView = (newView: "home" | "designs" | "whatsapp" | "profile" | "admin") => {
    if (view === newView && !isPageLoading) return;
    setPendingView(newView);
    setIsPageLoading(true);
  };

  // Global Dynamic Database Synchronized States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [whatsappPrices, setWhatsappPrices] = useState<WhatsappPrice[]>([]);
  const [designs, setDesigns] = useState<GraphicDesign[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Modals Coordination
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; price: string; category: "graphic_design" | "whatsapp_reactions" | "social_boosting" } | null>(null);
  const [showBoostingUnavailable, setShowBoostingUnavailable] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);

  // Authenticate Google logins and set listener profiles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user details to Firestore
        const profile = await createOrUpdateUserRecord(
          firebaseUser.uid,
          firebaseUser.displayName || "Google Client",
          firebaseUser.email || "",
          firebaseUser.photoURL || "",
          "nimesh.designs.site@gmail.com" // Dev default is admin
        );
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Global Database Content from Firestore Snapshot Listeners
  useEffect(() => {
    // 1. Initial db seeds
    seedDatabaseIfEmpty();

    // 2. Setup listeners for layouts rendering
    const unsubReviews = listenToReviews(setReviews, false); // Only accepted
    const unsubPrices = listenToWhatsappPrices(setWhatsappPrices);
    const unsubDesigns = listenToGraphicDesigns(setDesigns);
    const unsubPayments = listenToPaymentMethods(setPaymentMethods);
    const unsubSocials = listenToSocialLinks(setSocialLinks);

    return () => {
      unsubReviews();
      unsubPrices();
      unsubDesigns();
      unsubPayments();
      unsubSocials();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const userObj = await loginWithGoogle();
      if (userObj) {
        // Logged in
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigateToView("home");
    } catch (e) {
      console.error(e);
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-500" />;
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-500" />;
      case "send":
      case "telegram":
        return <Send className="h-5 w-5 text-sky-400" />;
      case "messagecircle":
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-emerald-400" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.61 4.17.97 1.13 2.37 1.83 3.84 2.02v3.83c-1.7-.09-3.32-.71-4.63-1.81-.13-.1-.23-.22-.34-.33v6.52c-.06 1.8-.62 3.59-1.68 5.03-1.42 1.95-3.79 3.16-6.22 3.16-3.13-.01-6.05-1.99-7.14-4.92-1.2-3.23-.28-7.07 2.34-9.25 1.7-1.42 3.94-2.12 6.16-1.9l.02 3.86a4.29 4.29 0 0 0-3.33 1.34c-1.07 1.15-1.42 2.89-.92 4.39.46 1.39 1.84 2.34 3.31 2.33 1.5-.01 2.87-1.01 3.25-2.46.12-.47.16-.96.15-1.45V.02z" />
          </svg>
        );
      case "discord":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#5865F2]">
            <path d="M19.27 4.73A14.904 14.904 0 0 0 15 3.39c-.19.34-.41.79-.56 1.15a13.784 13.784 0 0 0-4.88 0c-.15-.36-.38-.81-.57-1.15a14.904 14.904 0 0 0-4.27 1.34C1.3 9.4 1 13.9 1.14 18.33a15.19 15.19 0 0 0 4.6 2.3c.4-.55.75-1.14 1.05-1.78a9.88 9.88 0 0 1-1.63-.78c.14-.1.28-.2.42-.31a10.15 10.15 0 0 0 12.86 0c.14.1.28.21.42.31c-.5.3-1.05.56-1.63.78a11.96 11.96 0 0 0 1.05 1.78a15.19 15.19 0 0 0 4.6-2.3c.18-5.1-.96-9.56-3.78-13.6zm-10.6 9.6c-.88 0-1.6-.8-1.6-1.79s.71-1.79 1.6-1.79c.89 0 1.6.8 1.6 1.79s-.7 1.79-1.6 1.79zm6.65 0c-.88 0-1.6-.8-1.6-1.79s.71-1.79 1.6-1.79c.89 0 1.6.8 1.6 1.79s-.7 1.79-1.6 1.79z" />
          </svg>
        );
      case "threads":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-neutral-300">
            <path d="M12.5 2C15.82 2 18.5 4.31 18.5 7.15c0 .66-.08 1.3-.23 1.9C19.46 9.8 20 10.95 20 12.25c0 2.35-1.74 4.25-3.88 4.25-.8 0-1.53-.27-2.09-.73a4.78 4.78 0 0 1-5.06.73c-2.32-.97-3.47-3.41-3.47-5.95 0-3.6 2.3-6.55 6.5-6.55.93 0 1.83.16 2.62.46.2-.5.38-1.04.38-1.6 0-1.74-1.2-3.15-3.5-3.15-4.42 0-8 3.58-8 8s3.58 8 8 8c1.78 0 3.42-.58 4.74-1.56l1.26 1.26A11.9 11.9 0 0 1 12.5 22C6.15 22 1 16.85 1 10.5S6.15-1 12.5-1M12.5 6c-2.48 0-4.5 1.57-4.5 3.5s2.02 3.5 4.5 3.5 4.5-1.57 4.5-3.5-2.02-3.5-4.5-3.5" />
          </svg>
        );
      default:
        return <Layers className="h-5 w-5 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] selection:bg-emerald-500/20 selection:text-emerald-300 relative flex flex-col font-sans overflow-x-hidden">
      
      {/* Shooting Stars Live Canvas Background */}
      <ShootingStarsBackground />
      
      {/* Background grids styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent)] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none z-0" />
 
      {/* Dynamic Grid dots overlay */}
      <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
 
      {/* Navigation Header bar bar */}
      <Header 
        user={currentUser} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        currentView={view} 
        setView={navigateToView} 
      />

      {/* Body contents based on navigation router state */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* VIEW 1: HOME PAGE (STUDIO SHOWCASE BUILD) */}
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
            {/* HERO SEGMENT */}
            <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden px-4">
              <div className="mx-auto max-w-4xl text-center">
                
                {/* Glowing Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-6 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block" />
                  BEST ONLINE SHOP EXPERIENCE
                </div>

                {/* Display Heading */}
                <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-none">
                  ROXZY <br className="sm:hidden" />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(34,197,94,0.15)]">CREATIONS</span>
                </h1>

                {/* Replacement subtitle info */}
                <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-medium">
                  Premium interactive Digital designs and Social Media Boosting Services
                </p>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const servicesEl = document.getElementById("operations-directory");
                      if (servicesEl) {
                        servicesEl.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigateToView("designs");
                      }
                    }}
                    className="cursor-pointer w-full sm:w-auto px-8 py-3 bg-white text-[#0c0c0e] font-sans text-xs font-extrabold tracking-widest rounded-lg transition-transform hover:scale-102 active:scale-98 flex items-center justify-center gap-1 uppercase hover:shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                    id="hero-explore-btn"
                  >
                    EXPLORE
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  {!currentUser && (
                    <button
                      onClick={handleLogin}
                      className="cursor-pointer w-full sm:w-auto px-8 py-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white font-sans text-xs font-semibold tracking-wider rounded-lg transition-colors"
                    >
                      Authenticate Portal
                    </button>
                  )}
                </div>

              </div>
            </section>

            {/* SEGMENT 2: ABOUT SECTION (ROXZY CREATIONS) */}
            <section className="py-20 border-t border-white/[0.04] bg-[#08080a]/60 relative px-4 overflow-hidden" id="about-section">
              <div className="mx-auto max-w-5xl relative z-10">
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                >
                  
                  {/* Left Column - Elegant Headline Panel */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
                      <span className="h-1 text-emerald-400 bg-emerald-400 rounded-full w-4" />
                      // Studio Matrix
                    </div>
                    
                    <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
                      About <br />
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-extrabold pb-1">Roxzy Creations</span>
                    </h2>
                    
                    <div className="p-[1px] rounded-2xl bg-gradient-to-r from-white/[0.08] via-transparent to-transparent">
                      <div className="p-5 rounded-2xl bg-[#09090c]/90 space-y-3 border border-white/[0.03]">
                        <span className="font-mono text-[10px] text-emerald-400 block uppercase tracking-wider font-extrabold">
                          // Extra Knowledge
                        </span>
                        <p className="text-zinc-200 text-sm font-sans font-medium leading-relaxed">
                          We Create the Best Aesthetic Graphic Designs and also Give you the Best Social Media Boosting Services.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Brand Story & Tech Checklists */}
                  <div className="lg:col-span-7 space-y-8">
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      At Roxzy Creations, we’re passionate about turning ideas into eye-catching visuals. From custom logos to social media designs, we focus on creativity, quality, and client satisfaction. Our work stands out because we take time to understand your brand and bring your vision to life with precision and care.
                    </p>

                    {/* Creative Feature Lists */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Feature 1 */}
                      <div className="p-5 rounded-2xl bg-[#0c0c0f]/80 border border-white/[0.04] hover:border-emerald-500/20 hover:bg-[#0e0e12] transition-all duration-300">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/15">
                          <Heart className="h-4 w-4" />
                        </div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                          Friendly Service
                        </h4>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Warm support and continuous guidance.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div className="p-5 rounded-2xl bg-[#0c0c0f]/80 border border-white/[0.04] hover:border-cyan-500/20 hover:bg-[#0e0e12] transition-all duration-300">
                        <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/15">
                          <Clock className="h-4 w-4" />
                        </div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                          Fast Delivery
                        </h4>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Punctual completions with direct support.
                        </p>
                      </div>

                      {/* Feature 3 */}
                      <div className="p-5 rounded-2xl bg-[#0c0c0f]/80 border border-white/[0.04] hover:border-purple-500/20 hover:bg-[#0e0e12] transition-all duration-300">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/15">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                          Affordable Price
                        </h4>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Premium values sized to match your goals.
                        </p>
                      </div>

                    </div>

                    {/* Large High-Contrast Bento Metrics Panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/[0.05]">
                      
                      {/* Metric 1 */}
                      <div className="relative p-6 rounded-2xl bg-[#0e0e13]/90 border border-white/[0.05] hover:border-emerald-500/20 transition-colors text-center">
                        <span className="font-sans text-3xl sm:text-4xl font-black text-white block">
                          1000+
                        </span>
                        <span className="font-mono text-[9px] text-[#a1a1aa] uppercase tracking-widest block mt-2 font-bold whitespace-nowrap">
                          Happy Clients
                        </span>
                      </div>

                      {/* Metric 2 */}
                      <div className="relative p-6 rounded-2xl bg-[#0e0e13]/90 border border-white/[0.05] hover:border-cyan-500/20 transition-colors text-center overflow-hidden">
                        <Puzzle className="absolute right-3 top-3 h-4 w-4 text-cyan-400 opacity-10" />
                        <span className="font-sans text-3xl sm:text-4xl font-black text-white block">
                          4YR
                        </span>
                        <span className="font-mono text-[9px] text-[#a1a1aa] uppercase tracking-widest block mt-2 font-bold whitespace-nowrap">
                          Experience
                        </span>
                      </div>

                      {/* Metric 3 */}
                      <div className="relative p-6 rounded-2xl bg-[#0e0e13]/90 border border-white/[0.05] hover:border-purple-500/20 transition-colors text-center">
                        <span className="font-sans text-3xl sm:text-4xl font-black text-white block">
                          99.8%
                        </span>
                        <span className="font-mono text-[9px] text-[#a1a1aa] uppercase tracking-widest block mt-2 font-bold whitespace-nowrap">
                          Client Satisfaction
                        </span>
                      </div>

                    </div>

                  </div>

                </motion.div>
              </div>
            </section>

            {/* SEGMENT 3: DYNAMIC SERVICES OPERATIONS DIRECTORY */}
            <section className="py-20 border-t border-white/[0.04] px-4 text-left" id="operations-directory">
              <div className="mx-auto max-w-5xl">
                
                <div className="text-center mb-12">
                  <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">// Dynamic Services catalog</span>
                  <h2 className="font-sans text-2xl sm:text-3.5xl font-black text-white mt-2">
                    Professional Operations Portal
                  </h2>
                  <p className="text-zinc-400 text-xs mt-1">
                     * Click to get More Information
                  </p>
                </div>

                {/* Operations grid elements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Option 1: Graphic designs block */}
                  <motion.div 
                    onClick={() => navigateToView("designs")}
                    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.985 }}
                    className="cursor-pointer group relative p-6 sm:p-8 bg-[#0c0c0f] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/25 transition-all hover:bg-white/[0.01]"
                    id="service-card-gd"
                  >
                    <div className="absolute right-0 top-0 h-32 w-32 bg-emerald-500 opacity-[0.01] blur-2xl pointer-events-none group-hover:opacity-[0.03] transition-opacity" />
                    
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/15 group-hover:scale-110 transition-transform">
                      <Palette className="h-5 w-5" />
                    </div>

                    <h3 className="font-sans text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                      Graphic Design Service
                    </h3>
                    
                    <p className="text-zinc-400 text-xs leading-relaxed mt-3">
                      Bespoke client mockups, e-Sports stream backdrops, minimalist brand layouts, and vector packages. Click to view custom products backlog.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-white tracking-widest font-mono uppercase group-hover:text-emerald-300 transition-colors">
                      View samples
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>                   {/* Option 2: Whatsapp channel reactions */}
                  <motion.div 
                    onClick={() => navigateToView("whatsapp")}
                    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.985 }}
                    className="cursor-pointer group relative p-6 sm:p-8 bg-[#0c0c0f] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-teal-500/25 transition-all hover:bg-white/[0.01]"
                    id="service-card-wp"
                  >
                    <div className="absolute right-0 top-0 h-32 w-32 bg-teal-500 opacity-[0.01] blur-2xl pointer-events-none group-hover:opacity-[0.03] transition-opacity" />
                    
                    <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 border border-teal-500/15 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-5 w-5" />
                    </div>

                    <h3 className="font-sans text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                      Whatsapp Channel reactions
                    </h3>
                    
                    <p className="text-zinc-400 text-xs leading-relaxed mt-3">
                      Boost post interaction counters dynamically using direct reactions networks. Complete coverage for extended durations. Click to see prices.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-white tracking-widest font-mono uppercase group-hover:text-teal-300 transition-colors">
                      Explore Rates
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Option 3: Social Media Boosting (Service Unavailable) */}
                  <motion.div 
                    onClick={() => setShowBoostingUnavailable(true)}
                    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.985 }}
                    className="cursor-pointer group relative p-6 sm:p-8 bg-[#0c0c0f] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-550/25 transition-all hover:bg-white/[0.01]"
                    id="service-card-smb"
                  >
                    <div className="absolute right-0 top-0 h-32 w-32 bg-purple-500 opacity-[0.01] blur-2xl pointer-events-none group-hover:opacity-[0.03] transition-opacity" />
                    
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/15 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-5 w-5" />
                    </div>

                    <h3 className="font-sans text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                      Social Media Boosting
                    </h3>
                    
                    <p className="text-[#a1a1aa] text-xs leading-relaxed mt-3">
                      Boost Your Social Media Accounts Right Now Using our Service. Targeted promotion and organic engage metrics. 
                    </p>

                    <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-zinc-500 group-hover:text-purple-300 transition-colors font-mono uppercase">
                      Preregister Info
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                </div>

              </div>
            </section>

            {/* SEGMENT 4: DYNAMIC CONTACT / SOCIALS NETWORKS (SOCIAL GRID) */}
            <section className="py-20 border-t border-white/[0.04] px-4 text-left relative overflow-hidden" id="social-grid-segment">
              <div className="mx-auto max-w-5xl relative z-10">
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-10"
                >
                  <span className="font-mono text-xs tracking-widest text-[#10b981] uppercase block">// Social Grid</span>
                  <h2 className="font-sans text-2xl sm:text-4xl font-black text-[#fafafa] mt-2">Social Grid Matrix</h2>
                  <p className="text-zinc-400 text-xs mt-1">Connect directly through our official social media channels or direct messaging portals.</p>
                </motion.div>

                <motion.div 
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                >
                  {socialLinks.map((link) => (
                    <motion.a 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 }
                      }}
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative p-5 rounded-2xl bg-[#0e0e13]/80 border border-white/[0.04] hover:border-emerald-500/20 hover:bg-[#0c0c0f] transition-all flex flex-col items-center text-center justify-center gap-3"
                    >
                      {/* Hover top glow pulse */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                        {renderSocialIcon(link.iconName)}
                      </div>
                      <span className="font-sans text-xs font-bold text-zinc-300 group-hover:text-white transition-colors tracking-wide">
                        {link.name}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>

              </div>
            </section>

            {/* SEGMENT 5: REVIEWS TESTIMONIAL LOGS (AFFECTS STATUS APPROVALS) */}
            <ReviewSection 
              user={currentUser} 
              reviews={reviews} 
              onLogin={handleLogin} 
            />

          </div>
          </motion.div>
        )}

        {/* VIEW 2: GRAPHIC DESIGNS SHOWCASE */}
        {view === "designs" && (
          <motion.div
            key="designs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#09090b] text-left">
              <div className="mx-auto max-w-5xl">
              
              <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                  <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">// Aesthetic Showcase</span>
                  <h2 className="font-sans text-3xl font-black text-white mt-1">Sample Graphic Design Projects</h2>
                  <p className="text-zinc-400 text-xs mt-1">Purchase high-retention mockups or book visual designs catalogs below.</p>
                </div>
                <button
                  onClick={() => navigateToView("home")}
                  className="cursor-pointer text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 bg-white/[0.02] border border-white/10 p-2 rounded-lg"
                >
                  ← Home
                </button>
              </div>

              {/* Design lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {designs.map((gd) => (
                  <motion.div 
                    key={gd.id}
                    whileHover={{ y: -8, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group bg-[#0e0e12] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/25 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="aspect-[4/3] bg-zinc-950 overflow-hidden relative border-b border-white/[0.05]">
                        <img 
                          src={gd.photo} 
                          alt={gd.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 right-3 font-mono text-[10px] font-black tracking-wide text-white bg-black/70 backdrop-blur-md px-2 py-1 rounded">
                          {gd.priceLkr}
                        </span>
                      </div>

                      {/* Details specs */}
                      <div className="p-4 text-left">
                        <h4 className="font-sans text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {gd.name}
                        </h4>
                        <p className="text-zinc-400 text-[11px] leading-relaxed mt-2 line-clamp-3">
                          {gd.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            alert("Authorize log-in via Gmail in the header first to request order forms.");
                            return;
                          }
                          setSelectedPackage({
                            name: gd.name,
                            price: gd.priceLkr,
                            category: "graphic_design"
                          });
                        }}
                        className="cursor-pointer w-full bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white font-bold text-xs py-2 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        ORDER DESIGN
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
          </motion.div>
        )}

        {/* VIEW 3: WHATSAPP DIRECT REACTION TIER PRICE list */}
        {view === "whatsapp" && (
          <motion.div
            key="whatsapp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#09090b] text-left">
              <div className="mx-auto max-w-4xl">
              
              <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                  <span className="font-mono text-xs tracking-widest text-[#06b6d4] uppercase">// Reaction Tiers</span>
                  <h2 className="font-sans text-3xl font-black text-white mt-1">Whatsapp Reaction Services</h2>
                  <p className="text-zinc-400 text-xs mt-1">Choose intervals to boost community interactions and metrics.</p>
                </div>
                <button
                  onClick={() => navigateToView("home")}
                  className="cursor-pointer text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 bg-white/[0.02] border border-white/10 p-2 rounded-lg"
                >
                  ← Home
                </button>
              </div>

              {/* Reaction cards list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {whatsappPrices.map((wp) => (
                  <motion.div 
                    key={wp.id}
                    whileHover={{ y: -8, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/[0.06] hover:border-[#06b6d4]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between text-left relative"
                  >
                    <div>
                      <span className="font-mono text-[9px] text-[#06b6d4] tracking-widest uppercase block">// whatsapp reaction bundle</span>
                      <h4 className="font-sans text-xl font-extrabold text-white mt-1">{wp.duration}</h4>
                      
                      <div className="my-6">
                        <span className="text-2xl font-black text-[#fafafa] tracking-tight">{wp.priceLkr}</span>
                        <span className="text-[10px] text-zinc-600 block font-mono">// Direct Channel injection</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          alert("Authorize log-in via Gmail in the header first to request order forms.");
                          return;
                        }
                        setSelectedPackage({
                          name: `WhatsApp Reactions (${wp.duration})`,
                          price: wp.priceLkr,
                          category: "whatsapp_reactions"
                        });
                      }}
                      className="cursor-pointer w-full bg-gradient-to-r from-teal-550 to-cyan-550 bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white font-bold text-xs py-2 rounded-lg uppercase transition-colors font-mono tracking-widest"
                    >
                      REQUEST PLAN
                    </button>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
          </motion.div>
        )}

        {/* VIEW 4: PROFILE ACCOUNT VIEWS */}
        {view === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfilePage user={currentUser} onBack={() => navigateToView("home")} />
          </motion.div>
        )}

        {/* VIEW 5: ADMIN WORKSPACE PANEL */}
        {view === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminPanel user={currentUser} onBack={() => navigateToView("home")} />
          </motion.div>
        )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION COMPLYING DOCUMENT STANDARD INSTRUCTIONS */}
      <footer className="border-t border-white/[0.05] bg-[#09090b]/90 backdrop-blur-md pt-16 pb-8 px-4 font-sans text-xs text-[#a1a1aa] font-medium relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.04),transparent)] pointer-events-none" />
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 pb-12 border-b border-white/[0.05] relative z-10 text-left">
          
          {/* Column 1: Brand & Subtext */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.ibb.co/tMW74jvd/Nimesh-FX-Lo-Go4.png" 
                alt="Roxzy logo footer" 
                className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
              />
              <span className="font-sans text-sm font-bold tracking-wider text-white">
                ROXZY <span className="text-emerald-400">CREATIONS</span>
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed max-w-xs">
              Crafting state-of-the-art interactive digital designs, elite e-Sports assets, and real-time social post interaction boosting networks.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">// Directory</h4>
            <div className="flex flex-col gap-2.5 text-[11px]">
              <button onClick={() => navigateToView("home")} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Studio Base</button>
              <button onClick={() => navigateToView("designs")} className="hover:text-[#06b6d4] transition-colors text-left cursor-pointer">Designs Showcase</button>
              <button onClick={() => navigateToView("whatsapp")} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Reactions catalog</button>
              <button onClick={() => { if(currentUser) navigateToView("profile") }} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Client Profile</button>
            </div>
          </div>

          {/* Column 3: Core Operations */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">// Capabilities</h4>
            <div className="flex flex-col gap-2.5 text-[11px] text-zinc-500">
              <span>e-Sports stream overlays</span>
              <span>Minimalist vector designs</span>
              <span>Post reaction counters</span>
              <span>Engagement amplification</span>
            </div>
          </div>

          {/* Column 4: Trust & Support */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">// Security Node</h4>
            <div className="flex flex-col gap-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secured via Firestore
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Transactions, review approvals, and social handle matrices are synchronized securely in real time under end-to-end admin verification.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar copyrights */}
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 relative z-10 text-[10px] text-zinc-600">
          <p>© 2026 ROXZY CREATIONS STUDIO. ALL RIGHTS RESERVED.</p>
          <p className="font-mono text-zinc-650">DESIGNED WITH PASSION FOR CODING & EXCELLENCE</p>
        </div>
      </footer>

      {/* ============================================== */}
      {/* MODAL LIGHTBOXES / OVERLAYS */}
      {/* ============================================== */}
      
      {/* 1. TRANSACTION ORDER FORM POPUP FRAME */}
      {selectedPackage && (
        <OrderPopup 
          user={currentUser}
          packageType={selectedPackage.name}
          category={selectedPackage.category}
          price={selectedPackage.price}
          paymentMethods={paymentMethods}
          onClose={() => setSelectedPackage(null)}
          onSuccess={() => {
            setSelectedPackage(null);
            setShowOrderSuccessModal(true);
          }}
        />
      )}

      {/* 2. ORDER SUCCESS MODAL FRAME */}
      {showOrderSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050507]/90 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0e0e12] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <span className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 stroke-[3]" />
            </span>
            <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wider">Transfer Request Registered!</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mt-2 mb-6">
              Your billing information has been registered into the secure operations pipeline. An administrator will verify the proof link shortly.
            </p>
            <button 
              onClick={() => {
                setShowOrderSuccessModal(false);
                navigateToView("profile");
              }}
              className="cursor-pointer w-full bg-[#fafafa] hover:bg-zinc-200 text-zinc-950 text-xs font-bold py-2 rounded-lg font-sans tracking-wide uppercase transition-colors"
            >
              Check My Orders →
            </button>
          </div>
        </div>
      )}

      {/* 3. SOCIAL MEDIA BOOSTING UNAVAILABLE NOTICE LIST POPUP */}
      {showBoostingUnavailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050507]/90 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0e0e12] border border-purple-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <button 
              onClick={() => setShowBoostingUnavailable(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="h-12 w-12 rounded-full bg-purple-500/10 border border-purple-500/15 text-purple-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6" />
            </span>
            <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">Service Unavailable</h3>
            <p className="text-zinc-450 text-[11px] leading-relaxed mt-2 mb-6 font-medium">
              Boost Your Social Media Accounts Right Now Using our Service
            </p>
            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg text-[10px] text-[#a1a1aa] leading-normal mb-6">
              Our automated boosting matrix handles are currently down due to routine community security revisions. Preregistration forms will open shortly!
            </div>
            <button 
              onClick={() => setShowBoostingUnavailable(false)}
              className="cursor-pointer w-full bg-white text-zinc-950 text-xs font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* 4. FULL-SCREEN TIMED GRAPHIC PAGE LOADER */}
      <AnimatePresence>
        {isPageLoading && (
          <PageLoader 
            targetViewName={pendingView}
            onComplete={() => {
              setView(pendingView);
              setIsPageLoading(false);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
