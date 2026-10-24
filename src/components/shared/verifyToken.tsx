import { jwtDecode } from "jwt-decode";

export const verifyToken = (token: string) => {
    return jwtDecode(token);
};


// bg - [#170d2f]