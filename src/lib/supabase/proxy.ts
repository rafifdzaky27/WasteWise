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
  if (user && !SHARED_AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    // Check if the route needs role protection
    const needsRoleCheck = Object.values(ROLE_ROUTES).flat().some((r) => pathname.startsWith(r));
    
    if (needsRoleCheck) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role || "warga";
      const allowedRoutes = ROLE_ROUTES[userRole] || [];
      const hasAccess = allowedRoutes.some((r) => pathname.startsWith(r));

      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
