import { TAddress, TUser } from "./user"


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
