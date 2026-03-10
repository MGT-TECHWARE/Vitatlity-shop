import type { Review } from "@/types/review";
import StarRating from "./StarRating";
import { formatDate } from "@/utils/format";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted text-sm py-4">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-4">
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm font-medium">
              {review.profiles?.full_name || "Anonymous"}
            </span>
            {review.verified_purchase && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                Verified Purchase
              </span>
            )}
          </div>
          {review.title && (
            <h4 className="text-sm font-semibold mb-1">{review.title}</h4>
          )}
          {review.comment && (
            <p className="text-sm text-primary/70">{review.comment}</p>
          )}
          <p className="text-xs text-muted mt-2">
            {formatDate(review.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
}
