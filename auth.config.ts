import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnOnboarding = nextUrl.pathname.startsWith("/pages/privacyPolicy");

      if (isOnDashboard) {
        if (!isLoggedIn) return false;

        // Check onboarding status in DB
        try {
          const res = await fetch(`${nextUrl.origin}/api/registre`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: auth.user.email }),
          });
          
          if (res.ok) {
            const data = await res.json();
            const user = data.user || data.existingUser;

            // If profile is incomplete, redirect out of dashboard
            if (user && (!user.restaurantName || !user.ownerIdNumber || !user.foodInspectionNumber)) {
              return Response.redirect(new URL("/", nextUrl));
            }
          }
        } catch (error) {
          // If fetch fails (e.g. server booting), we fallback to allowing access 
          // and let the client-side useEffect in the dashboard handle the check.
          console.error("Middleware onboarding check failed (likely internal fetch issue):", error);
        }

        return true;
      } else if (isLoggedIn && !isOnOnboarding && nextUrl.pathname === "/") {
        // Automatic Redirect: If logged in on the landing page, check if profile is complete
        try {
          const res = await fetch(`${nextUrl.origin}/api/registre`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: auth.user.email }),
          });
          
          if (res.ok) {
            const data = await res.json();
            const user = data.user || data.existingUser;

            // If profile is fully complete, skip home and go straight to dashboard
            if (user && user.restaurantName && user.ownerIdNumber && user.foodInspectionNumber) {
              return Response.redirect(new URL("/dashboard", nextUrl));
            }
          }
        } catch (error) {
          console.error("Middleware auto-redirection check failed:", error);
        }
        return true; 
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
