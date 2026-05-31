import React, { useState, useEffect } from "react";
import { X, CreditCard, ChevronRight, Check, AlertCircle, Link2, Info } from "lucide-react";
import { UserProfile, PaymentMethodRecord, OrderCategory } from "../types";
import { placeNewOrder } from "../lib/dataService";

interface OrderPopupProps {
  user: UserProfile | null;
  packageType: string;
  category: OrderCategory;
  price: string;
  paymentMethods: PaymentMethodRecord[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderPopup({ 
  user, 
  packageType, 
  category, 
  price, 
  paymentMethods, 
  onClose, 
  onSuccess 
}: OrderPopupProps) {
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Sync user profile changes
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  // Find payment method entities stored in db 
  const bank = paymentMethods.find(p => p.id === "bank")?.details || {
    bankName: "Sampath Bank",
    name: "S.H.H.N.H ARAHCHCI",
    accountNumber: "104452997508",
    branch: "Wariyapola"
  };
  const ezcash = paymentMethods.find(p => p.id === "ezcash")?.details || { number: "Unavailable Right Now" };
  const paypal = paymentMethods.find(p => p.id === "paypal")?.details || { email: "Unavailable Right Now" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!user) {
      setErrorText("You must login before submitting an order request.");
      return;
    }
    if (!name.trim()) {
      setErrorText("Please provide your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorText("Please provide a valid email address.");
      return;
    }
    if (!whatsapp.trim()) {
      setErrorText("Please provide your active WhatsApp number.");
      return;
    }
    if (!proofUrl.trim() || !proofUrl.startsWith("http")) {
      setErrorText("Please provide a valid HTTP/HTTPS link to your payment proof screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      await placeNewOrder({
        userEmail: email,
        userName: name,
        whatsappNumber: whatsapp,
        packageType,
        category,
        paymentScreenshotUrl: proofUrl,
        amountLkr: price
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorText("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050507]/90 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0e0e12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8"
        id="order-popup-modal"
      >
        {/* Header Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          id="btn-close-popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="font-mono text-[10px] tracking-widest text-[#a1a1aa] uppercase">// Order Summary</span>
          <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-1">
            Buy {packageType}
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Category: <strong className="text-emerald-400 capitalize">{category.replace("_", " ")}</strong> • Rate: <strong className="text-white">{price}</strong>
          </p>
        </div>

        {/* Grid: Left column (Form), Right Column (Payment Methods) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Order info input form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-sans text-xs font-bold text-[#fafafa] uppercase tracking-wider border-b border-white/[0.05] pb-2">
              Buyer Details
            </h4>

            {errorText && (
              <div className="flex items-center gap-2 p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{errorText}</p>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 text-[11px] font-mono mb-1 uppercase tracking-wider">Your Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Nimesh De Silva"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] font-mono mb-1 uppercase tracking-wider">Email Address *</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-[#1b1b22]/50 border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={!!user} // Locked to logged in account to avoid discrepancy
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] font-mono mb-1 uppercase tracking-wider">WhatsApp Number *</label>
              <input 
                type="tel" 
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+94 70 123 4567"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Proof Upload Instruction */}
            <div className="p-3 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/15">
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-1">
                <Info className="h-3.5 w-3.5" />
                Proof Requirement
              </span>
              <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
                Upload your Payment Proof to{" "}
                <a 
                  href="https://imgbb.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-emerald-300 underline hover:text-emerald-400"
                >
                  imgbb.com
                </a>{" "}
                and copy the link, then paste it below.
              </p>
            </div>

            <div>
              <label className="block text-[#a1a1aa] text-[11px] font-mono mb-1 uppercase tracking-wider">Payment Proof Link *</label>
              <input 
                type="url" 
                value={proofUrl} 
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://i.ibb.co/abcd123/proof.png"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-emerald-300 text-xs placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0c0c0e] font-bold text-xs py-2.5 px-4 rounded-lg hover:brightness-110 tracking-widest transition-all uppercase disabled:opacity-50"
            >
              {submitting ? "SUBMITTING ORDER..." : "COMPEL TRANSFER REQUEST"}
            </button>
          </form>

          {/* Right Column: Payment Credentials Blocks */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs font-bold text-[#fafafa] uppercase tracking-wider border-b border-white/[0.05] pb-2">
              Payment Methods
            </h4>

            {/* Bank details block */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-black">
                🏦 Bank Details
              </span>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-[#a1a1aa]">
                <p>Bank: <strong className="text-white">{bank.bankName || "Sampath Bank"}</strong></p>
                <p>Account Name: <strong className="text-white">{bank.name || "S.H.H.N.H ARAHCHCI"}</strong></p>
                <p>Account No: <strong className="text-white text-emerald-300 tracking-wider font-bold">{bank.accountNumber || "104452997508"}</strong></p>
                <p>Branch: <strong className="text-white">{bank.branch || "Wariyapola"}</strong></p>
              </div>
            </div>

            {/* eZ cash block */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-black">
                📱 eZ Cash
              </span>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-[#a1a1aa]">
                {ezcash.available === false || ezcash.number === "Unavailable Right Now" ? (
                  <p className="text-zinc-600 uppercase font-bold text-[10px] italic">
                    {ezcash.number || "Unavailable Right Now"}
                  </p>
                ) : (
                  <p>Number: <strong className="text-white tracking-widest">{ezcash.number}</strong></p>
                )}
              </div>
            </div>

            {/* PayPal block */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-black">
                💳 PayPal Details
              </span>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-[#a1a1aa]">
                {paypal.available === false || paypal.email === "Unavailable Right Now" ? (
                  <p className="text-zinc-600 uppercase font-bold text-[10px] italic">
                    {paypal.email || "Unavailable Right Now"}
                  </p>
                ) : (
                  <p>PayPal: <strong className="text-white text-cyan-300 font-bold">{paypal.email}</strong></p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
