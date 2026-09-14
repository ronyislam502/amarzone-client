'use client';

import React, { useState } from 'react';
import {
  useProductReviewsQuery,
  useCreateReviewMutation,
} from '@/redux/features/review/reviewApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';

import {
  ProductReviewsSectionProps,
  ReviewsHeader,
  ReviewsHistogram,
  ReviewsList,
  ReviewCard,
  ReviewModal,
} from './reviews';

export type { ProductReviewsSectionProps };

export {
  ReviewsHeader,
  ReviewsHistogram,
  ReviewsList,
  ReviewCard,
  ReviewModal,
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productTitle = 'Product',
  vendorId,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // RTK Query hook exclusively for Product Reviews
  const { data: reviewsRes, isLoading, refetch } = useProductReviewsQuery(productId, {
    skip: !productId,
  });

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [titleInput, setTitleInput] = useState<string>('');
  const [reviewInput, setReviewInput] = useState<string>('');

  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const productReviewsList: any[] = Array.isArray(reviewsRes?.data?.data)
    ? reviewsRes.data.data
    : Array.isArray(reviewsRes?.data?.result)
    ? reviewsRes.data.result
    : Array.isArray(reviewsRes?.data)
    ? reviewsRes.data
    : [];

  // Calculate rating histogram for product reviews
  const totalReviews = productReviewsList.length;
  const avgRating =
    totalReviews > 0
      ? (productReviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  const starCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: productReviewsList.filter((r) => Math.round(r.rating || 5) === stars).length,
    percentage:
      totalReviews > 0
        ? Math.round(
            (productReviewsList.filter((r) => Math.round(r.rating || 5) === stars).length /
              totalReviews) *
              100
          )
        : stars === 5
        ? 100
        : 0,
  }));

  const handleOpenReviewModal = () => {
    if (!user) {
      toast.error('Please log in as a customer to submit a product review.');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewInput.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    try {
      await createReview({
        product: productId,
        rating: ratingInput,
        title: titleInput.trim() || 'Verified Customer Review',
        review: reviewInput.trim(),
        ...(vendorId ? { vendor: vendorId } : {}),
      }).unwrap();

      toast.success('Your customer product review has been published successfully!');
      setIsReviewModalOpen(false);
      setReviewInput('');
      setTitleInput('');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to publish review.');
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 space-y-8 max-w-7xl mx-auto font-sans">
      {/* SECTION TITLE & ACTION HEADER */}
      <ReviewsHeader
        productTitle={productTitle}
        onOpenModal={handleOpenReviewModal}
      />

      {/* REVIEWS GRID: HISTOGRAM + REVIEWS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COL: RATING BREAKDOWN HISTOGRAM */}
        <ReviewsHistogram
          avgRating={avgRating}
          totalReviews={totalReviews}
          starCounts={starCounts}
          onOpenModal={handleOpenReviewModal}
        />

        {/* RIGHT COL: CUSTOMER REVIEWS LIST */}
        <ReviewsList
          reviews={productReviewsList}
          isLoading={isLoading}
          onOpenModal={handleOpenReviewModal}
        />
      </div>

      {/* SUBMIT REVIEW MODAL */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productTitle={productTitle}
        ratingInput={ratingInput}
        setRatingInput={setRatingInput}
        titleInput={titleInput}
        setTitleInput={setTitleInput}
        reviewInput={reviewInput}
        setReviewInput={setReviewInput}
        handleSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProductReviewsSection;
