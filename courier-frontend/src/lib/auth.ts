import { createAuthClient } from "better-auth/react";

const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const authClient = createAuthClient({ baseURL: base });
export const { signIn, signUp, signOut, useSession } = authClient;