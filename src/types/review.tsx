export type TReviewCustomer = {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
};

export type TReview = {
    _id: string;
    customer: string | TReviewCustomer;
    product: string;
    order?: any;
    rating: number;
    title?: string;
    review: string;
    isDeleted?: boolean;
    __v?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type TVariantReviewResult = {
    meta?: any;
    data: TReview[];
    averageRating: string | number;
    totalRatings: number;
};