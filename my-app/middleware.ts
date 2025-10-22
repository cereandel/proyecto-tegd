import { NextRequest, NextResponse } from "next/server";
import { updateSession, getSession } from "@/app/lib/auth/auth";

export async function middleware(request: NextRequest) {
  const PUBLIC_API_ROUTES = [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/logout",
  ];

  const PUBLIC_UI_ROUTES = ["/login", "/register"];

  const PUBLIC_ASSET_PATHS = ["/_next", "/favicon.ico", "/images", "/static"];

  if (
    PUBLIC_API_ROUTES.some((url) => request.nextUrl.pathname.startsWith(url))
  ) {
    return NextResponse.next({ request });
  }

  if (PUBLIC_ASSET_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }


  const session = await getSession();

  if (session) {
    const refreshed = await updateSession(request);
    if (PUBLIC_UI_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return refreshed || NextResponse.next();
  }


  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!PUBLIC_UI_ROUTES.includes(request.nextUrl.pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}
