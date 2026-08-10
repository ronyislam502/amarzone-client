export type TAddress = {
    street: string
    postalCode: string
    state: string
    country: string
    _id: string
}

export type TVendor = {
    _id: string
    user: string
    name: string
    email: string
    phone: string
    address: TAddress
    logo: string
    banner: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}