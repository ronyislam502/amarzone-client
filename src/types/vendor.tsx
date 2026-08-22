import { TAddress, TUser } from "./user"

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

