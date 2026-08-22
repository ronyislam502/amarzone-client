
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
    __v: number
    createdAt: string
    updatedAt: string
}
