export type TSeller = {
    vendor: string
    price: number
    quantity: number
    isStock: boolean
    fulfillmentBy: string
    shippingTime: number
    isBuyBoxWinner: boolean
    _id: string
}


export type TInventory = {
    _id: string
    product: string
    asin: string
    seller: TSeller
    isDeleted: boolean
    __v: number
    createdAt: string
    updatedAt: string
}