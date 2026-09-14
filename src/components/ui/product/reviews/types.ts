import React from "react";

export interface TStarCount {
  stars: number;
  count: number;
  percentage: number;
}

export interface ProductReviewsSectionProps {
  productId: string;
  productTitle?: string;
  vendorId?: string;
}

export interface ReviewsHeaderProps {
  productTitle: string;
  onOpenModal: () => void;
}

export interface ReviewsHistogramProps {
  avgRating: string;
  totalReviews: number;
  starCounts: TStarCount[];
  onOpenModal: () => void;
}

export interface ReviewCardProps {
  review: any;
  index: number;
}

export interface ReviewsListProps {
  reviews: any[];
  isLoading: boolean;
  onOpenModal: () => void;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  ratingInput: number;
  setRatingInput: (rating: number) => void;
  titleInput: string;
  setTitleInput: (title: string) => void;
  reviewInput: string;
  setReviewInput: (review: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}
