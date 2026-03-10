"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import StarRating from "./StarRating";

export default function ReviewForm({ productId }: { productId: string }) {
  const { user, loading } = useUser();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <p className="text-sm text-muted">
        <a href="/account/login" className="text-accent hover:text-accent-light">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  if (success) {
    return (
      <p className="text-sm text-success font-medium">
        Thank you for your review!
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setError("");
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, comment }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit review.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-sm font-semibold">Write a Review</h3>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <div>
        <label className="block text-xs text-muted mb-1">Rating</label>
        <StarRating rating={rating} interactive onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2 bg-primary text-white text-sm rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
