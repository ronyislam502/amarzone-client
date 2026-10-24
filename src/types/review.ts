import { TUser } from "./user";
import { TOrder } from "./order";

export interface TProductReview {
  _id: string;
  customer: string | TUser;
  variant: string;
  order: string | TOrder;
  rating: number;
  review: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TServiceReview {
  _id: string;
  customer: string | TUser;
  vendor: string | TUser;
  order: string | TOrder;
  rating: number;
  review: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TCreateProductReviewPayload {
  variant: string;
  order: string;
  rating: number;
  review: string;
}

export interface TUpdateProductReviewPayload {
  id: string;
  data: {
    rating?: number;
    review?: string;
  };
}

export interface TCreateServiceReviewPayload {
  vendor: string;
  order: string;
  rating: number;
  review: string;
}

export interface TReviewQueryParams {
  id?: string;
  search?: string;
  searchTerm?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
  rating?: string | number;
  [key: string]: string | number | boolean | undefined;
}
