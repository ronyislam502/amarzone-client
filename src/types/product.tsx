import { TCategory } from "./category"
import { TDepartment } from "./department"

export type TProduct = {
    _id: string
    author: TAuthor
    brand: string
    category: TCategory
    department: TDepartment
    features: string[]
    isBestSeller: boolean
    isDeleted: boolean
    tags: string[]
    thumbnail: string
    title: string
    variants: TVariant[]
}

export type TAuthor = {
    name: string
    role: string
}

export type TVariant = {
    _id: string
    asin: string
    attributes: TAttribute[]
    images: string[]
    isDeleted: boolean
    isPrivateLevel: boolean
    product: string
    sku: string
    isBuyBoxEligible: boolean
    price: number
    rating: number
}

export type TAttribute = {
    type: string
    value: string
}
