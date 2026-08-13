export interface Root {
    _id: string
    customer: Customer
    vendor: Vendor
    orderNo: string
    products: Product[]
    commission: number
    totalPrice: number
    totalQuantity: number
    vendorAmount: number
    shippedDate: ShippedDate
    deliveryDate: DeliveryDate
    status: string
    paymentStatus: string
    transactionId: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export interface Customer {
    _id: string
    name: string
    email: string
}

export interface Vendor {
    _id: string
    name: string
    email: string
}

export interface Product {
    quantity: number
    price: number
    product: Product2
}

export interface Product2 {
    _id: string
    title: string
    brand: string
    category: string
    department: string
    author: Author
    variant: Variant
}

export interface Author {
    role: string
    id: string
    name: string
    _id: string
}

export interface Variant {
    asin: string
    sku: string
    attributes: Attribute[]
    thumbnail: string
    images: string[]
    isPrivateLevel: boolean
    isDeleted: boolean
    _id: string
}

export interface Attribute {
    type: string
    value: string
}

export interface ShippedDate {
    from: string
    to: string
}

export interface DeliveryDate {
    from: string
    to: string
}