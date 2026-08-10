import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { TUser } from "@/redux/features/auth/authSlice";

const AUTH_ROUTES = ["/login", "/sign-up"];

const ROLE_BASED_ROUTES = {
  SUPER_ADMIN: [/^\/super-admin(?:\/.*)?$/],
  ADMIN: [/^\/admin(?:\/.*)?$/],
  VENDOR: [/^\/vendor(?:\/.*)?$/],
  CUSTOMER: [/^\/customer(?:\/.*)?$/],
} as const;

type Role = keyof typeof ROLE_BASED_ROUTES;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("token", accessToken)

  let user: TUser | null = null;

  if (accessToken) {
    try {
      user = jwtDecode<TUser>(accessToken);
    } catch (error) {
      console.error("JWT decoding failed in proxy:", error);
    }
  }

  /**
   * Not authenticated
   */
  if (!user) {
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(
        `/login?redirect=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  /**
   * Authenticated user visiting login/signup
   */
  if (AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  /**
   * Role based authorization
   */
  const role = user?.role as Role;

  const allowedRoutes = ROLE_BASED_ROUTES[role];

  if (!allowedRoutes) {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  const hasAccess = allowedRoutes.some((route) =>
    route.test(pathname)
  );

  if (hasAccess) {
    return NextResponse.next();
  }

  /**
   * User is authenticated but
   * trying to access another role's dashboard.
   */
  return NextResponse.redirect(
    new URL("/", request.url)
  );
}

export const config = {
  matcher: [
    "/login",
    "/sign-up",
    "/super-admin/:path*",
    "/admin/:path*",
    "/vendor/:path*",
    "/customer/:path*",
  ],
};