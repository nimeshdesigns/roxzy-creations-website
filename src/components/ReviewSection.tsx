import React, { useState } from "react";
import { Star, MessageSquareCode, ShieldAlert, LogIn, CheckCircle } from "lucide-react";
import { UserProfile, Review } from "../types";
import { submitReview } from "../lib/dataService";

interface ReviewSectionProps {
  user: UserProfile | null;
  reviews: Review[];
  onLogin: () => void;
}

export default function ReviewSection({ user, reviews, onLogin }: ReviewSectionProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccess(false);

    if (!user) {
      setErrorText("You must sign in to submit professional feedback.");
      return;
    }
    if (!comment.trim()) {
      setErrorText("Please write a meaningful review comment.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorText("Rating score must be between 1 and 5.");
      return;
    }

    setLoading(true);
    try {
      await submitReview(
        user.name,
        comment,
        rating,
        user.email
      );
      setComment("");
      setRating(5);
      setSuccess(true);
      // Auto fade success notice after 5s
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      setErrorText("Failed to register review payload. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 border-t border-white/[0.04] bg-[#09090b]/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Title Group */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">// Live Resonance</span>
          <h2 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Client Testimonials
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mt-2">
            Real feedback from community leads, content creators, and corporate operators.
          </p>
        </div>

        {/* Split grid: Left (Reviews list), Right (Write review) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Reviews list - 7cols */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-sans text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2 mb-2">
              <MessageSquareCode className="h-4 w-4 text-emerald-400" />
              Recent Logs ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/[0.05] rounded-xl bg-white/[0.01]">
                <p className="text-zinc-500 text-xs">No customer credentials registered yet. Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm relative text-left hover:border-white/[0.1] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#fafafa] leading-none mb-1">
                        {rev.name}
                      </h4>
                      <span className="font-mono text-[9px] text-zinc-600">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Stars render */}
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400 stroke-none" : "stroke-zinc-700"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Form to submit feedback - 5cols */}
          <div className="md:col-span-5 bg-[#0e0e12]/80 border border-white/[0.08] rounded-2xl p-5 sm:p-6 text-left">
            <h3 className="font-sans text-sm font-bold text-white tracking-wide uppercase border-b border-white/[0.05] pb-2 mb-4">
              Write Review
            </h3>

            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {success && (
                  <div className="flex items-center gap-2 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-left">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold">Log Registered!</p>
                      <p className="text-[10px]">Your testimonial was queued for admin moderation approvals.</p>
                    </div>
                  </div>
                )}

                {errorText && (
                  <div className="p-2 bg-red-500/10 border border-red-500/35 text-red-400 text-xs rounded text-left">
                    {errorText}
                  </div>
                )}

                {/* Rating selection */}
                <div>
                  <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Your rating *</label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-650"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment box */}
                <div>
                  <label className="block text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">Commentary *</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="We received bespoke overlay designs on-time and with high accuracy. Recommended!"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-600 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-white text-[#0c0c0e] hover:bg-zinc-200 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  {loading ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                </button>
              </form>
            ) : (
              <div className="py-6 px-4 text-center border border-dashed border-red-550/15 rounded-xl bg-red-500/[0.01]">
                <ShieldAlert className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <h4 className="font-sans text-xs font-bold text-zinc-400 uppercase tracking-wide">
                  Sign in Required
                </h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed mt-1 mb-4">
                  Please log in with Google to enable verified review posting. This helps protect our systems from cyber spam.
                </p>
                <button
                  onClick={onLogin}
                  className="cursor-pointer bg-white text-[#0c0c0e] font-bold text-[10px] py-1.5 px-3 rounded hover:bg-zinc-200 tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  <LogIn className="h-3 w-3" />
                  LOGIN TO SUBMIT
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
