import React, { useState, useEffect } from "react";
import { UserProfile, Order } from "../types";
import { listenToUserOrders } from "../lib/dataService";
import { 
  User, 
  Mail, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Palette, 
  MessageCircle, 
  TrendingUp, 
  ExternalLink,
  Shield,
  HelpCircle
} from "lucide-react";

interface ProfilePageProps {
  user: UserProfile | null;
  onBack: () => void;
}

export default function ProfilePage({ user, onBack }: ProfilePageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToUserOrders(user.email, (fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // If no user is logged in
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white">
        <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Unauthenticated Portal Access</h3>
        <p className="text-zinc-400 text-sm mt-2 mb-6">Please log in to view your orders timeline.</p>
        <button
          onClick={onBack}
          className="bg-white text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Filter orders by categories
  const designOrders = orders.filter((o) => o.category === "graphic_design");
  const whatsappOrders = orders.filter((o) => o.category === "whatsapp_reactions");
  const boostingOrders = orders.filter((o) => o.category === "social_boosting");

  // Get status class/labels
  const renderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/35 text-amber-400 text-[10px] font-mono uppercase tracking-wide">
            <Clock className="h-3 w-3 animate-pulse" />
            Pending Verification
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 text-[10px] font-mono uppercase tracking-wide">
            <Clock className="h-3 w-3" />
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/35 text-red-400 text-[10px] font-mono uppercase tracking-wide">
            <AlertTriangle className="h-3 w-3" />
            Declined
          </span>
        );
      case "delivered":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[10px] font-mono uppercase tracking-wide">
            <CheckCircle className="h-3 w-3" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-500/10 border border-zinc-500/32 text-zinc-400 text-[10px] font-mono uppercase tracking-wide">
            Pending
          </span>
        );
    }
  };

  const renderOrderList = (title: string, list: Order[], icon: React.ReactNode, themeColor: string) => {
    return (
      <div className="bg-[#0e0e12] border border-white/[0.05] rounded-2xl p-5 sm:p-6 text-left">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-${themeColor}-500/15 text-${themeColor}-400`}>
              {icon}
            </div>
            <h3 className="font-sans text-sm font-bold text-white tracking-wide uppercase">
              {title}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-white/[0.02] px-2 py-1 rounded-md">
            {list.length} Records
          </span>
        </div>

        {list.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.03]">
            <p className="text-zinc-600 text-xs font-mono">// NO DRAFT RECORDS FOUND</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((order) => (
              <div 
                key={order.id}
                className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-sans text-xs font-bold text-white">
                      {order.packageType}
                    </span>
                    <span className="font-mono text-[9px] text-[#88888b] bg-[#16161c] px-1.5 py-0.5 rounded leading-none">
                      {order.amountLkr}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="font-mono text-[10px] text-zinc-500">
                      ID: {order.id.substring(0, 8)}...
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      • {new Date(order.submittedAt).toLocaleDateString()}
                    </span>
                    {order.paymentScreenshotUrl && (
                      <a 
                        href={order.paymentScreenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        Screenshot <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  {renderStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#09090b]">
      <div className="mx-auto max-w-5xl">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="cursor-pointer group inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white mb-8 transition-colors"
          id="btn-profile-to-home"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Studio
        </button>

        {/* User Card */}
        <div className="mb-10 bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500 opacity-[0.03] blur-3xl pointer-events-none" />
          
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
            alt={`${user.name}'s avatar`}
            className="h-16 w-16 rounded-full border border-white/10 shadow-md object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h2 className="font-sans text-xl sm:text-2xl font-black text-white">{user.name}</h2>
              <span className={`mx-auto sm:mx-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase font-black ${
                user.role === "Admin" 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" 
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              }`}>
                {user.role === "Admin" ? "🛡️ System Admin" : "👥 Member"}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-zinc-400 text-xs mt-2 font-mono">
              <span className="flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-3.5 w-3.5 text-zinc-600" />
                {user.email}
              </span>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <span className="text-zinc-500">Authorized Google Credentials Client</span>
            </div>
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="space-y-8">
          <div>
            <h3 className="font-sans text-lg font-black text-white mb-2">My Operations Portal</h3>
            <p className="text-zinc-400 text-xs">Verify payment submissions and access delivery endpoints below.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Fetching transaction histories...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Graphic Design Segment */}
              {renderOrderList(
                "Graphic Design projects", 
                designOrders, 
                <Palette className="h-4 w-4 text-emerald-400" />, 
                "emerald"
              )}

              {/* WhatsApp reactions Segment */}
              {renderOrderList(
                "Whatsapp Channel Reactions", 
                whatsappOrders, 
                <MessageCircle className="h-4 w-4 text-teal-400" />, 
                "teal"
              )}

              {/* Social Media Boosting Segment */}
              {renderOrderList(
                "Social Media Boosting projects", 
                boostingOrders, 
                <TrendingUp className="h-4 w-4 text-[#a855f7]" />, 
                "purple"
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
