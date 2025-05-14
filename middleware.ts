import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");
  const { pathname, origin } = request.nextUrl;

  if (!user && ["/", "/home", "/audit-logs", "/manage-users"].includes(pathname)) {
    return Response.redirect(new URL("/login", origin));
  }

  if (user && ["/", "/login", "/account-recovery"].includes(pathname)) {
    return Response.redirect(new URL("/home", origin));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};