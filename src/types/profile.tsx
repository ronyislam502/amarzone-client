import { TAddress, TUser } from "./user";

export type TUserRole = "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "CUSTOMER";

export interface TUserProfile {
    _id: string;
    user?: TUser;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    logo?: string;
    banner?: string;
    address?: TAddress;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type TProfileTab = "overview" | "security" | "role_details";
