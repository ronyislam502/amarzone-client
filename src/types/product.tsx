import { TCategory } from "./category"
import { TDepartment } from "./department"
import { TInventory } from "./inventory"
import { TReview } from "./review"
import { TVariant } from "./variant"

export type TProduct = {
    _id: string
    author: TAuthor
    department: TDepartment
    category: TCategory
    title: string
    description: string
    features: string[]
    brand: string
    variants: TVariant[]
    tags: string[]
    isDeleted: boolean
    isBestSeller: boolean
    __v: number
    createdAt: string
    updatedAt: string
    inventory: TInventory[]
    reviews: TReview[]
    minPrice: number
    averageRating: number
    reviewCount: number
    inStock: boolean
}

export type TAuthor = {
    role: string
    id: string
    name: string
    _id: string
}

