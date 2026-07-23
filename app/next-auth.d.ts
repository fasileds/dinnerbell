// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add your custom property
    refreshToken?: string; // Add your custom property
  }

  interface JWT {
    accessToken?: string; // Add your custom property
    refreshToken?: string; // Add your custom property
  }
}
