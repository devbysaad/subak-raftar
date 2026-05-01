import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // same origin as frontend — goes through vercel rewrite proxy to backend
  baseURL: import.meta.env.VITE_API_URL || "https://subak-raftar.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;