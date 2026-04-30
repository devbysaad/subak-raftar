import { createAuthClient } from 'better-auth/react';

// In production, API goes through the Vercel rewrite (same-origin).
// In dev, it goes directly to the backend.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || '',
});
