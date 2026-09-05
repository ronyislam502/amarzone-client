
export type TAuthUser = {
    _id: string;
    user: string;
    role: string;
    name: string;
    email: string;
    iat: number;
    exp: number;
};

export type TAuthState = {
    user: null | TUser;
    token: null | string;
};



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
