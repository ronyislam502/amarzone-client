import { TDepartment } from "./department"

export type TCategory = {
    _id: string
    department: TDepartment
    name: string
    icon: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}