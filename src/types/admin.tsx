import { TUser } from "./user"


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