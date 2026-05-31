import React, { useState, useEffect } from "react";
import { 
  User, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Plus, 
  Edit2, 
  Clock, 
  Image, 
  Link, 
  Save, 
  Lock, 
  ChevronRight, 
  HelpCircle,
  TrendingUp,
  MessageCircle,
  Palette,
  CreditCard,
  Share2,
  Users,
  Eye,
  AlertCircle
} from "lucide-react";
import { 
  UserProfile, 
  Review, 
  Order, 
  WhatsappPrice, 
  GraphicDesign, 
  PaymentMethodRecord, 
  SocialLink,
  ReviewStatus,
  OrderStatus
} from "../types";
import {
  listenToUsers,
  updateUserRole,
  listenToReviews,
  moderateReview,
  deleteReview,
  listenToAllOrders,
  updateOrderStatus,
  deleteOrder,
  listenToWhatsappPrices,
  addWhatsappPrice,
  updateWhatsappPrice,
  deleteWhatsappPrice,
  listenToGraphicDesigns,
  addGraphicDesign,
  updateGraphicDesign,
  deleteGraphicDesign,
  listenToPaymentMethods,
  updatePaymentMethod,
  listenToSocialLinks,
  updateSocialLink
} from "../lib/dataService";

interface AdminPanelProps {
  user: UserProfile | null;
  onBack: () => void;
}

type AdminTab = "orders" | "reviews" | "whatsapp" | "designs" | "payments" | "users" | "socials";

export default function AdminPanel({ user, onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  
  // Database States
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsappPrices, setWhatsappPrices] = useState<WhatsappPrice[]>([]);
  const [designs, setDesigns] = useState<GraphicDesign[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Subscriptions Setup
  useEffect(() => {
    if (!user || user.role !== "Admin") return;

    const uUnsub = listenToUsers(setUsers);
    const rUnsub = listenToReviews(setReviews, true); // true to fetch all pending/declined too
    const oUnsub = listenToAllOrders(setOrders);
    const wpUnsub = listenToWhatsappPrices(setWhatsappPrices);
    const gdUnsub = listenToGraphicDesigns(setDesigns);
    const pmUnsub = listenToPaymentMethods(setPaymentMethods);
    const slUnsub = listenToSocialLinks(setSocialLinks);

    return () => {
      uUnsub();
      rUnsub();
      oUnsub();
      wpUnsub();
      gdUnsub();
      pmUnsub();
      slUnsub();
    };
  }, [user]);

  // Pricing Create State
  const [newWpDuration, setNewWpDuration] = useState("");
  const [newWpPrice, setNewWpPrice] = useState("");
  const [editingWpId, setEditingWpId] = useState<string | null>(null);

  // Graphic Design Create State
  const [newGdName, setNewGdName] = useState("");
  const [newGdDesc, setNewGdDesc] = useState("");
  const [newGdPrice, setNewGdPrice] = useState("");
  const [newGdPhoto, setNewGdPhoto] = useState("");
  const [editingGdId, setEditingGdId] = useState<string | null>(null);

  // Payment configuration forms
  const [bankName, setBankName] = useState("");
  const [bankAccName, setBankAccName] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [ezcashNumber, setEzcashNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    const bankDoc = paymentMethods.find(p => p.id === "bank")?.details || {};
    const ezDoc = paymentMethods.find(p => p.id === "ezcash")?.details || {};
    const ppDoc = paymentMethods.find(p => p.id === "paypal")?.details || {};

    if (bankDoc) {
      setBankName(bankDoc.bankName || "Sampath Bank");
      setBankAccName(bankDoc.name || "S.H.H.N.H ARAHCHCI");
      setBankAccNo(bankDoc.accountNumber || "104452997508");
      setBankBranch(bankDoc.branch || "Wariyapola");
    }
    if (ezDoc) {
      setEzcashNumber(ezDoc.number || "Unavailable Right Now");
    }
    if (ppDoc) {
      setPaypalEmail(ppDoc.email || "Unavailable Right Now");
    }
  }, [paymentMethods]);

  const [savingPayments, setSavingPayments] = useState(false);
  const handleSavePaymentMethods = async () => {
    setSavingPayments(true);
    try {
      await updatePaymentMethod("bank", "Bank Details", {
        bankName,
        name: bankAccName,
        accountNumber: bankAccNo,
        branch: bankBranch
      });
      await updatePaymentMethod("ezcash", "eZ Cash", {
        number: ezcashNumber,
        available: ezcashNumber !== "Unavailable Right Now"
      });
      await updatePaymentMethod("paypal", "PayPal", {
        email: paypalEmail,
        available: paypalEmail !== "Unavailable Right Now"
      });
      alert("Payment routes updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to modify payment options database records.");
    } finally {
      setSavingPayments(false);
    }
  };

  if (!user || user.role !== "Admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-white">
        <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold font-sans uppercase tracking-wider">Restricted Administration Node</h3>
        <p className="text-zinc-500 text-xs mt-2 mb-6">Security authorization parameters failed. Your current account permissions do not map to Admin role clearance thresholds.</p>
        <button
          onClick={onBack}
          className="bg-white text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Handle Review Operations
  const handleReviewStatus = async (id: string, status: ReviewStatus) => {
    try {
      await moderateReview(id, status);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently prune this review entry?")) {
      try {
        await deleteReview(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Order Operations
  const handleOrderStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderDelete = async (id: string) => {
    if (confirm("Permanently delete this order record?")) {
      try {
        await deleteOrder(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // WhatsApp prices managers
  const handleAddWp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWpDuration.trim() || !newWpPrice.trim()) return;

    try {
      if (editingWpId) {
        await updateWhatsappPrice(editingWpId, newWpDuration, newWpPrice);
        setEditingWpId(null);
      } else {
        await addWhatsappPrice(newWpDuration, newWpPrice);
      }
      setNewWpDuration("");
      setNewWpPrice("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditWp = (wp: WhatsappPrice) => {
    setEditingWpId(wp.id);
    setNewWpDuration(wp.duration);
    setNewWpPrice(wp.priceLkr);
  };

  const handleDeleteWp = async (id: string) => {
    if (confirm("Remove this WhatsApp pricing tier?")) {
      try {
        await deleteWhatsappPrice(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Graphic Designs catalogue managers
  const handleAddGd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGdName.trim() || !newGdPrice.trim() || !newGdPhoto.trim()) return;

    try {
      if (editingGdId) {
        await updateGraphicDesign(editingGdId, newGdName, newGdDesc, newGdPrice, newGdPhoto);
        setEditingGdId(null);
      } else {
        await addGraphicDesign(newGdName, newGdDesc, newGdPrice, newGdPhoto);
      }
      setNewGdName("");
      setNewGdDesc("");
      setNewGdPrice("");
      setNewGdPhoto("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditGd = (gd: GraphicDesign) => {
    setEditingGdId(gd.id);
    setNewGdName(gd.name);
    setNewGdDesc(gd.description);
    setNewGdPrice(gd.priceLkr);
    setNewGdPhoto(gd.photo);
  };

  const handleDeleteGd = async (id: string) => {
    if (confirm("Remove this design project catalog from the showcase?")) {
      try {
        await deleteGraphicDesign(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // User Clearance Roles Toggle
  const handleToggleUserRole = async (targetUid: string, currentRole: string) => {
    if (targetUid === user.uid) {
      alert("Error: You are forbidden from modifying or locking out your own admin permissions.");
      return;
    }
    const newRole = currentRole === "Admin" ? "Member" : "Admin";
    if (confirm(`Authorize client credentials migration to role: ${newRole}?`)) {
      try {
        await updateUserRole(targetUid, newRole);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Social handles link modifiers
  const handleUpdateSocialLink = async (id: string, name: string, url: string) => {
    try {
      await updateSocialLink(id, name, url);
      alert("URL path coordinates cached to standard components mapping.");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#070709] min-h-screen text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* Dash title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8 text-left">
          <div>
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">// Secure Console</span>
            <h2 className="font-sans text-3xl font-black tracking-tight text-white mt-1">
              Admin Panel
            </h2>
            <p className="text-zinc-500 text-xs mt-1">
              Dynamic Firestore controls, secure transactional validations, and content moderation.
            </p>
          </div>
          <button
            onClick={onBack}
            className="cursor-pointer bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-bold text-xs py-2 px-4 rounded-lg tracking-wider uppercase transition-colors"
          >
            ← Studio Showcase
          </button>
        </div>

        {/* Dashboard layout: Sidebar controller, Right panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls list */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto gap-1 bg-[#0c0c0f] border border-white/[0.06] p-1.5 rounded-xl text-left">
            {[
              { id: "orders", label: "Client Orders", count: orders.length, icon: TrendingUp },
              { id: "reviews", label: "Review Moderation", count: reviews.length, icon: Star },
              { id: "whatsapp", label: "Whatsapp Prices", count: whatsappPrices.length, icon: MessageCircle },
              { id: "designs", label: "Graphic Catalog", count: designs.length, icon: Palette },
              { id: "payments", label: "Billing coordinates", count: null, icon: CreditCard },
              { id: "users", label: "User Accounts", count: users.length, icon: Users },
              { id: "socials", label: "Social Link Grid", count: null, icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`cursor-pointer w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-cyan-550/15 text-cyan-400 border border-cyan-500/30" 
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </span>
                  {tab.count !== null && (
                    <span className="text-[9px] font-mono bg-white/[0.04] px-1.5 py-0.5 rounded leading-none text-zinc-400">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Core Panel Content */}
          <div className="lg:col-span-9 bg-[#0c0c10] border border-white/[0.06] rounded-2xl p-6 sm:p-8 text-left">
            
            {/* 1. ORDERS TABLE */}
            {activeTab === "orders" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Customer Order Operations</h3>
                <p className="text-zinc-400 text-xs mb-6">Review proof screenshots and manage production state loops.</p>

                {orders.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-white/[0.05] rounded-xl text-zinc-400 text-xs font-mono">
                    // COMPLETED TRANSACTION LOG EMPTY
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div 
                        key={o.id}
                        className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans hover:border-white/[0.08]"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{o.packageType}</span>
                            <span className="bg-[#191924] text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                              {o.amountLkr}
                            </span>
                            <span className="text-[10px] py-0.5 px-1.5 rounded uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 capitalize">
                              {o.category.replace("_", " ")}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-zinc-400 mt-2">
                            <p>Client: <strong className="text-[#f4f4f5]">{o.userName}</strong></p>
                            <p>Email: <strong className="text-cyan-300">{o.userEmail}</strong></p>
                            <p>WhatsApp: <strong className="text-emerald-400 font-bold">{o.whatsappNumber}</strong></p>
                            <p>Submitted: <strong>{new Date(o.submittedAt).toLocaleString()}</strong></p>
                          </div>

                          {o.paymentScreenshotUrl && (
                            <div className="mt-2.5 flex items-center gap-3">
                              <span className="text-zinc-600 font-mono text-[10px]">// PAYMENT VERIFICATION:</span>
                              <a 
                                href={o.paymentScreenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/10 text-white rounded text-[10px] px-2 py-1 hover:bg-white/[0.08] transition-colors font-semibold"
                              >
                                View Receipt Link
                                <Image className="h-3 w-3 text-cyan-400" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Status controllers */}
                        <div className="flex flex-row md:flex-col items-start md:items-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
                          <div className="mb-1 font-mono text-[10px]">
                            State:{" "}
                            <strong className="text-[#fafafa] uppercase">
                              {o.status.replace("_", " ")}
                            </strong>
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleOrderStatusChange(o.id, "accepted")}
                              className="cursor-pointer font-bold font-sans text-[10px] py-1 px-2.5 rounded bg-cyan-700/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-700/30 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleOrderStatusChange(o.id, "delivered")}
                              className="cursor-pointer font-bold font-sans text-[10px] py-1 px-2.5 rounded bg-emerald-700/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-700/30 transition-colors"
                            >
                              Deliver
                            </button>
                            <button
                              onClick={() => handleOrderStatusChange(o.id, "declined")}
                              className="cursor-pointer font-bold font-sans text-[10px] py-1 px-2.5 rounded bg-red-700/20 text-red-400 border border-red-500/20 hover:bg-red-700/30 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleOrderDelete(o.id)}
                              className="cursor-pointer p-1 rounded hover:bg-white/[0.05] text-zinc-500 hover:text-red-400"
                              title="Prune Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. REVIEWS MODERATION */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Review Moderation System</h3>
                <p className="text-zinc-400 text-xs mb-6">Manage testimonials. Only "accepted" feedback will be visual to portal users.</p>

                {reviews.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-white/[0.05] rounded-xl text-zinc-400 text-xs font-mono">
                    // REVIEW BACKLOGS EMPTY
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id}
                        className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/[0.03] mb-2.5">
                          <div>
                            <span className="font-bold text-white text-xs">{rev.name}</span>
                            <span className="font-mono text-[9px] text-zinc-400 block">{rev.userEmail}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400 stroke-none" : "stroke-zinc-700"}`} 
                                />
                              ))}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase font-black ${
                              rev.status === "accepted" 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : rev.status === "Decliend" 
                                ? "bg-red-500/10 text-red-400" 
                                : "bg-amber-500/10 text-amber-400 animate-pulse"
                            }`}>
                              {rev.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-zinc-300 text-xs font-sans italic bg-white/[0.005] p-2.5 rounded border border-white/[0.02]">
                          "{rev.comment}"
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-3 text-xs flex-wrap">
                          <button
                            onClick={() => handleReviewStatus(rev.id, "accepted")}
                            className="cursor-pointer font-bold font-sans text-[10px] py-1 px-2.5 rounded bg-emerald-700/10 hover:bg-emerald-700/25 text-emerald-400 border border-emerald-500/10 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReviewStatus(rev.id, "Decliend")}
                            className="cursor-pointer font-bold font-sans text-[10px] py-1 px-2.5 rounded bg-red-700/10 hover:bg-red-700/25 text-red-400 border border-red-500/10 transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleReviewDelete(rev.id)}
                            className="cursor-pointer p-1 text-zinc-500 hover:text-red-400 transitions-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WHATSAPP PRICES MANAGEMENT */}
            {activeTab === "whatsapp" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">WhatsApp Channel Reactions Inventory</h3>
                <p className="text-zinc-400 text-xs mb-6">Create, modify or delete pricing blocks dynamically.</p>

                {/* Pricing modification Form */}
                <form onSubmit={handleAddWp} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] mb-6 space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#a1a1aa] block">// Create / Edit WhatsApp block</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Duration (E.g. 5 Days)</label>
                      <input 
                        type="text" 
                        value={newWpDuration} 
                        onChange={(e) => setNewWpDuration(e.target.value)}
                        placeholder="5 Days" 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Price LKR (E.g. 1000 LKR)</label>
                      <input 
                        type="text" 
                        value={newWpPrice} 
                        onChange={(e) => setNewWpPrice(e.target.value)}
                        placeholder="1000 LKR" 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs">
                    {editingWpId && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingWpId(null); setNewWpDuration(""); setNewWpPrice(""); }}
                        className="px-3 py-1.5 rounded hover:bg-white/[0.05] text-[#ccc]"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-[#0c0c0e] font-bold px-4 py-1.5 rounded tracking-wider flex items-center gap-1"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {editingWpId ? "UPDATE BLOCK" : "ADD NEW BLOCK"}
                    </button>
                  </div>
                </form>

                {/* Items list */}
                <div className="space-y-2">
                  {whatsappPrices.map((wp) => (
                    <div 
                      key={wp.id}
                      className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between hover:border-white/[0.08]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-zinc-400 text-[11px]">[{wp.id}]</span>
                        <div>
                          <strong className="text-white text-xs block">{wp.duration}</strong>
                          <span className="text-cyan-400 font-bold font-mono text-[11px]">{wp.priceLkr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditWp(wp)}
                          className="cursor-pointer p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteWp(wp.id)}
                          className="cursor-pointer p-1.5 rounded hover:bg-white/5 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GRAPHIC DESIGNS MANAGEMENT */}
            {activeTab === "designs" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Graphic Designs catalog</h3>
                <p className="text-zinc-400 text-xs mb-6">Add, edit, or customize mock projects shown in showcase.</p>

                {/* catalog management form */}
                <form onSubmit={handleAddGd} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] mb-6 space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#a1a1aa] block">// Create / Customize design project</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Design name</label>
                      <input 
                        type="text" 
                        value={newGdName} 
                        onChange={(e) => setNewGdName(e.target.value)}
                        placeholder="Modern Brand Logo" 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Price LKR</label>
                      <input 
                        type="text" 
                        value={newGdPrice} 
                        onChange={(e) => setNewGdPrice(e.target.value)}
                        placeholder="1800 LKR" 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Description</label>
                      <input 
                        type="text" 
                        value={newGdDesc} 
                        onChange={(e) => setNewGdDesc(e.target.value)}
                        placeholder="Clean minimalist vectors crafted for modern organizations." 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Photo/Image URL</label>
                      <input 
                        type="url" 
                        value={newGdPhoto} 
                        onChange={(e) => setNewGdPhoto(e.target.value)}
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-cyan-300 font-mono text-xs placeholder-zinc-750 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs">
                    {editingGdId && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingGdId(null); setNewGdName(""); setNewGdDesc(""); setNewGdPrice(""); setNewGdPhoto(""); }}
                        className="px-3 py-1.5 rounded hover:bg-white/[0.05] text-[#ccc]"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-[#0c0c0e] font-bold px-4 py-1.5 rounded tracking-wider flex items-center gap-1"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {editingGdId ? "UPDATE SAMPLE" : "ADD CATALOG PROJECT"}
                    </button>
                  </div>
                </form>

                {/* Designs layout display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {designs.map((gd) => (
                    <div 
                      key={gd.id}
                      className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex gap-3 hover:border-white/[0.08] relative"
                    >
                      <img 
                        src={gd.photo} 
                        alt={gd.name} 
                        className="h-16 w-16 object-cover rounded-md bg-zinc-900 border border-white/5 shrink-0" 
                      />
                      
                      <div className="flex-1 min-w-0 pr-8 text-left">
                        <strong className="text-white text-xs block truncate">{gd.name}</strong>
                        <p className="text-zinc-400 text-[10px] line-clamp-2 mt-0.5">{gd.description}</p>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold mt-1.5 inline-block">{gd.priceLkr}</span>
                      </div>

                      <div className="absolute right-2 top-2 flex flex-col gap-1">
                        <button 
                          onClick={() => handleEditGd(gd)}
                          className="cursor-pointer p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGd(gd.id)}
                          className="cursor-pointer p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PAYMENTS COORDINATES CONFIGS */}
            {activeTab === "payments" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Billing & Settlement configurations</h3>
                <p className="text-zinc-400 text-xs mb-6 font-sans">Modify Sampath bank details, eZ Cash or PayPal addresses displayed inside popups.</p>

                <div className="space-y-6">
                  
                  {/* Bank Coordinate Fields */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-4">
                    <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">🏦 Bank coordinates</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Bank Name</label>
                        <input 
                          type="text" 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Account Holder Name</label>
                        <input 
                          type="text" 
                          value={bankAccName}
                          onChange={(e) => setBankAccName(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Account Number</label>
                        <input 
                          type="text" 
                          value={bankAccNo}
                          onChange={(e) => setBankAccNo(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white font-mono text-xs text-cyan-300"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Branch</label>
                        <input 
                          type="text" 
                          value={bankBranch}
                          onChange={(e) => setBankBranch(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* eZ cash configuration */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-4">
                    <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">📱 eZ Cash Configs</span>
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">eZ Cash Number (Type 'Unavailable Right Now' to lock option)</label>
                      <input 
                        type="text" 
                        value={ezcashNumber}
                        onChange={(e) => setEzcashNumber(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* PayPal Details */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-4">
                    <span className="font-mono text-[10px] text-[#a855f7] uppercase font-bold">💳 Paypal Gateway Email</span>
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">PayPal coordinates (Type 'Unavailable Right Now' to lock option)</label>
                      <input 
                        type="text" 
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSavePaymentMethods}
                    disabled={savingPayments}
                    className="cursor-pointer inline-flex items-center gap-2 bg-white text-[#0c0c0e] font-black text-xs py-2 px-6 rounded-lg uppercase tracking-wider"
                  >
                    <Save className="h-4 w-4" />
                    {savingPayments ? "Saving..." : "Save Payment Options"}
                  </button>

                </div>
              </div>
            )}

            {/* 6. USER CLEARANCE DIRECTORY */}
            {activeTab === "users" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Client User Directory</h3>
                <p className="text-zinc-400 text-xs mb-6">See registered profiles and toggle secure administrative roles.</p>

                <div className="space-y-2.5">
                  {users.map((u) => (
                    <div 
                      key={u.uid}
                      className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email}`} 
                          alt={u.name} 
                          className="h-9 w-9 rounded-full bg-zinc-800 border border-white/5" 
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="text-left">
                          <strong className="text-white text-xs block">{u.name}</strong>
                          <span className="text-zinc-500 font-mono text-[10px] block">{u.email}</span>
                          <span className="text-zinc-600 font-mono text-[9px] block">UID: ...{u.uid.substring(u.uid.length - 8)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-black ${
                          u.role === "Admin" 
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/15" 
                            : "bg-zinc-500/10 text-zinc-400"
                        }`}>
                          {u.role}
                        </span>

                        <button
                          onClick={() => handleToggleUserRole(u.uid, u.role)}
                          className="cursor-pointer text-[10px] px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-[#fafafa] font-bold"
                        >
                          Modify Role
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SOCIAL LINKS */}
            {activeTab === "socials" && (
              <div>
                <h3 className="font-sans text-lg font-black mb-1">Social Net Integration coordinates</h3>
                <p className="text-zinc-400 text-xs mb-6">Change links and handles visual inside social grids.</p>

                <div className="space-y-4">
                  {socialLinks.map((link) => (
                    <div 
                      key={link.id}
                      className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center"
                    >
                      <div className="text-left w-full sm:w-28 shrink-0">
                        <strong className="text-white text-xs block">{link.name}</strong>
                        <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-wider">{link.iconName} Indicator</span>
                      </div>

                      <div className="w-full flex items-center gap-2">
                        <input 
                          type="url" 
                          id={`input-social-${link.id}`}
                          defaultValue={link.url}
                          placeholder="https://..."
                          className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500 focus:outline-none rounded px-3 py-1.5 text-white font-mono text-xs"
                        />
                        <button
                          onClick={() => {
                            const val = (document.getElementById(`input-social-${link.id}`) as HTMLInputElement)?.value;
                            if (val) handleUpdateSocialLink(link.id, link.name, val);
                          }}
                          className="cursor-pointer bg-[#fafafa] text-[#0c0c0e] hover:bg-zinc-200 font-bold font-sans text-[10px] px-3.5 py-2 rounded-lg shrink-0 tracking-wider uppercase"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
