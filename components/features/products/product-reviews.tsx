'use client';

import { Star } from 'lucide-react';
import { ratingToStars } from '@/lib/utils';

export function ProductReviews({ productId }: { productId: string }) {
  void productId;
  // Mock reviews for now
  const reviews = [
    { id: 1, user: 'Alice', rating: 5, comment: 'Absolutely amazing coffee!', date: '2 days ago' },
    { id: 2, user: 'Bob', rating: 4, comment: 'Great taste, but packaging was a bit dented.', date: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-playfair font-semibold">Customer Reviews</h3>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl font-bold">4.5</div>
        <div>
          <div className="flex text-amber-500 mb-1">
            {ratingToStars(4.5).map((star, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${star === "full" ? "fill-current" : star === "half" ? "fill-current opacity-50" : "opacity-30"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{review.user}</span>
              <span className="text-sm text-muted-foreground">{review.date}</span>
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
    </div>
  );
}

