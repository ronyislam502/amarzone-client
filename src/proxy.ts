import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export type TUser = {
  _id?: string;
  user?: string;
  role?: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

const AuthRoutes = ["/login", "/sign-up"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  CUSTOMER: [/^\/customer/],
  ADMIN: [/^\/admin/],
  VENDOR: [/^\/vendor/],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  let user: TUser | null = null;

  if (accessToken) {
    try {
      user = jwtDecode(accessToken) as TUser;
    } catch (error) {
      console.error("JWT decoding failed in proxy:", error);
    }
  }

  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    const routes = roleBasedRoutes[user?.role as Role];

    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/customer", "/customer/:page*", "/admin", "/admin/:page*", "/vendor", "/vendor/:page*"],
};
