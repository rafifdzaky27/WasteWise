import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Role-based route access rules
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin", "/biobin"],
  warga: ["/deposit", "/rewards"],
  petani: ["/marketplace", "/orders"],
};

// Routes accessible by all authenticated users
const SHARED_AUTH_ROUTES = ["/dashboard"];

// Routes that need role-based protection
const ALL_ROLE_ROUTES = Object.values(ROLE_ROUTES).flat();

// Cookie name for cached user role (lightweight, avoids DB hit)
const ROLE_COOKIE = "x-user-role";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could cause users
  // to be randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // If user logged out, clear the cached role cookie
  if (!user) {
    supabaseResponse.cookies.delete(ROLE_COOKIE);
  }

  // Protected routes: redirect unauthenticated users
  if (
    !user &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/api/sensors") && // Allow IoT device POST
    (pathname.startsWith("/dashboard") ||
     pathname.startsWith("/admin") ||
     pathname.startsWith("/deposit") ||
     pathname.startsWith("/rewards") ||
     pathname.startsWith("/marketplace") ||
     pathname.startsWith("/orders") ||
     pathname.startsWith("/biobin"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Role-based route protection for authenticated users
  if (user) {
    const needsRoleCheck = ALL_ROLE_ROUTES.some((r) => pathname.startsWith(r));

    if (needsRoleCheck) {
      // Try to read cached role from cookie first (avoids DB hit)
      let userRole = request.cookies.get(ROLE_COOKIE)?.value;

      if (!userRole) {
        // Cache miss — fetch from DB once, then cache
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        userRole = profile?.role || "warga";

        // Cache the role in a cookie (expires in 1 hour, httpOnly)
        supabaseResponse.cookies.set(ROLE_COOKIE, userRole as string, {
          path: "/",
          maxAge: 3600,
          httpOnly: true,
          sameSite: "lax",
        });
      }

      const allowedRoutes = ROLE_ROUTES[userRole as string] || [];
      const hasAccess = allowedRoutes.some((r) => pathname.startsWith(r));

      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    // If user is authenticated and we don't have a cached role yet, cache it
    // This ensures the cookie is set on the first dashboard visit too
    if (!request.cookies.get(ROLE_COOKIE)?.value) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role || "warga";
      supabaseResponse.cookies.set(ROLE_COOKIE, userRole, {
        path: "/",
        maxAge: 3600,
        httpOnly: true,
        sameSite: "lax",
      });
    }
  }

  return supabaseResponse;
}
