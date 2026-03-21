"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Review = {
  _id: string;
  user_name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function EventReviewsPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      if (!eventId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/reviews/${eventId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [eventId]);

  if (loading) return <p className="text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>;
  if (error) return <p className="text-sm text-error-500">{error}</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Event Reviews</h3>
        <Link
          href="/reviews/booked-events"
          className="rounded-lg border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews found for this event.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{review.user_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-brand-600 dark:text-brand-400">
                      {"⭐".repeat(review.rating)}
                      <span className="text-gray-400 ml-1">{review.rating}/5</span>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total Reviews: <span className="font-semibold text-gray-700 dark:text-gray-300">{reviews.length}</span>
        </p>
      </div>
    </div>
  );
}
