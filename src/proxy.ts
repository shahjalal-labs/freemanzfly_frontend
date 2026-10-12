import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface User {
  role: string;
  sponsorStatus?: string;
}

export function proxy(request: NextRequest) {
  const loginRoute = `${request.nextUrl.origin}/login`;
  const homeRoute = `${request.nextUrl.origin}/`;
  const currentPath = request.nextUrl.pathname;

  // Private routes that require authentication (any logged-in user)
  const privateRoutes = [
    "/cart",
    "/checkout",
    "/order-success",
    "/payment-success",
    "/profile",
  ];

  // Public routes that are accessible without authentication
  const publicRoutes = [
    "/",
    "/product",
    "/about-us",
    "/contact",
    "/login",
    "/signup",
    "/forgot-password",
    "/profile-setup", // Fixed: added leading slash
    "/verify-otp", // Fixed: added leading slash
  ];

  // Token Retrieval
  const token = request.cookies.get("accessToken")?.value;

  // If user is already authenticated and tries to access login page, redirect to home
  if (currentPath === "/login" && token) {
    try {
      const userInfo = jwtDecode<User>(token);
      console.log("Decoded User Info:", userInfo);

      // If user is authenticated, redirect to home page
      return NextResponse.redirect(new URL(homeRoute, request.url));
    } catch {
      // If token is invalid, clear it and allow access to login page
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // Check if current path is a private route
  const isPrivateRoute = privateRoutes.some((route) => {
    const pattern = new RegExp("^" + route.replace(/\//g, "\\/") + "$");
    return pattern.test(currentPath);
  });

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => {
    const pattern = new RegExp("^" + route.replace(/\//g, "\\/") + "$");
    return pattern.test(currentPath);
  });

  // If it's a public route, allow access without any checks
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For private routes, check authentication
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL(loginRoute, request.url));
  }

  // If there's a token for private routes, verify it
  if (isPrivateRoute && token) {
    try {
      const userInfo = jwtDecode<User>(token);
      console.log("Decoded User Info:", userInfo);

      // Any valid token can access private routes
      return NextResponse.next();
    } catch {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
  }

  // Allow access to any other routes (fallback)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Private routes
    "/cart",
    "/checkout",
    "/order-success",
    "/payment-success",
    "/profile",

    // Auth routes
    "/login",
    "/signup",
    "/forgot-password",
    "/profile-setup", // Fixed: added leading slash
    "/verify-otp", // Fixed: added leading slash
  ],
};
