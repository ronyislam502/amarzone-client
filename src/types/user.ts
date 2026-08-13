export type TAddress = {
    street: string
    postalCode: string
    state: string
    country: string
    _id: string
}

export type TUser = {
    _id: string
    name: string
    email: string
    password: string
    role: string
    status: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export type TAdmin = {
    _id: string
    user: TUser
    name: string
    email: string
    avatar: string
    phone: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}


export type TVendor = {
    _id: string
    user: TUser
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


export type TCustomer = {
    _id: string
    user: TUser
    name: string
    email: string
    avatar: string
    phone: string
    address: TAddress
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}




