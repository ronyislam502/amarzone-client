import { TCategory } from "./category"
import { TDepartment } from "./department"


export type TAuthor = {
    role: string
    id: string
    name: string
    _id: string
}

export type TAttribute = {
    type: string
    value: string
}


export type TVariant = {
    asin: string
    sku: string
    attributes: TAttribute[]
    thumbnail: string
    images: string[]
    isPrivateLevel: boolean
    isDeleted: boolean
    _id: string
}

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
    createdAt: string
    updatedAt: string
}


