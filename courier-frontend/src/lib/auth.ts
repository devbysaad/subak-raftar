import { createAuthClient } from 'better-auth/react';

// Must point directly to the backend — NOT the Vite dev server.
// better-auth sets cookies for this origin, so it must match where the backend lives.
export const authClient = createAuthClient({
  baseURL: 'http://localhost:5000',
});
