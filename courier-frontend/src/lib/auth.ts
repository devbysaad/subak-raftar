import { createAuthClient } from 'better-auth/react';

// Must point to the backend — uses VITE_API_URL in production, localhost in dev.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});
