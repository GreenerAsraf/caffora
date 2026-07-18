'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { ratingToStars, formatDate } from '@/lib/utils';
import { reviewsApi } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { accessToken, status } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await reviewsApi.getForProduct(productId);
      if (res) {
        setReviews(res.reviews || []);
        setAvgRating(res.avgRating || 0);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    
    setSubmitting(true);
    try {
      await reviewsApi.create(productId, rating, comment, accessToken);
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // refresh
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-playfair font-semibold mb-6">Customer Reviews</h3>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex text-amber-500 mb-1">
              {ratingToStars(avgRating).map((star, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${star === "full" ? "fill-current" : star === "half" ? "fill-current opacity-50" : "opacity-30"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex text-amber-500 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? "fill-current" : "opacity-30"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === 'authenticated' ? (
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <h4 className="font-semibold text-lg mb-4">Write a Review</h4>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${i < rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground opacity-30"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="resize-none"
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={submitting} className="rounded-full">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Review
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-surface p-6 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground mb-4">Log in to write a review</p>
          <Button variant="outline" className="rounded-full" onClick={() => window.location.href = '/login?next=/products/' + productId}>
            Log In
          </Button>
        </div>
      )}
    </div>
  );
}
