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