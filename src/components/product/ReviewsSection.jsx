import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/apiClient";

const Stars = ({ value, size = "w-4 h-4" }) => (
  <div className="flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${s <= value ? "fill-primary text-primary" : "text-border"}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

function ReviewForm({ productId, onPosted }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      await api.reviews.create({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
        author_name: authorName.trim() || undefined,
      });
      setTitle("");
      setBody("");
      onPosted();
    } catch (err) {
      setError(err.message || "Could not post your review");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 bg-secondary/20 p-5 space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-foreground">Write a review</p>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
              aria-pressed={rating === s}
              className="p-0.5"
            >
              <Star className={`w-6 h-6 transition-colors ${s <= rating ? "fill-primary text-primary" : "text-border hover:text-primary/40"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="review-name" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Display name (optional)</label>
          <Input id="review-name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Shown with your review" maxLength={60} className="h-10 bg-white" />
        </div>
        <div>
          <label htmlFor="review-title" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Title (optional)</label>
          <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up in a few words" maxLength={120} className="h-10 bg-white" />
        </div>
      </div>

      <div>
        <label htmlFor="review-body" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Your review</label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience with ordering, shipping, and product quality (min 10 characters)…"
          required
          minLength={10}
          maxLength={2000}
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24"
        />
      </div>

      {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <Button type="submit" disabled={sending || body.trim().length < 10} className="h-10 px-6 text-sm font-bold">
        {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting…</> : "Post Review"}
      </Button>
    </form>
  );
}

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedIn = api.auth.isLoggedIn();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReviews(await api.reviews.list(productId));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <section className="mt-10 pt-8 border-t border-border/50" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 id="reviews-heading" className="text-sm font-bold uppercase tracking-widest text-foreground">
            Researcher Reviews
          </h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={Math.round(average)} />
            <span className="font-semibold text-foreground">{average.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-border/40 bg-secondary/20 mb-5">
          <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-border/60 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} size="w-3.5 h-3.5" />
                  {r.title && <h3 className="text-sm font-bold text-foreground">{r.title}</h3>}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {r.author_name} · {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{r.body}</p>
            </article>
          ))}
        </div>
      )}

      {loggedIn ? (
        <ReviewForm productId={productId} onPosted={load} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> to write a review.
        </p>
      )}
    </section>
  );
}
