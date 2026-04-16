export const API = {
  AUTH: {
    SIGN_UP: '/api/auth/sign-up/email',
    SIGN_IN: '/api/auth/sign-in/email',
    SIGN_OUT: '/api/auth/sign-out',
    SESSION: '/api/auth/session',
  },
  USERS: {
    ME: '/api/users/me',
  },
  COMPANIES: {
    CREATE: '/api/companies',
    ME: '/api/companies/me',
    SHOPIFY: '/api/companies/me/shopify',
    PROVIDER: (provider: string) => `/api/companies/me/providers/${provider}`,
  },
  SHIPMENTS: {
    LIST: '/api/shipments',
    CREATE: '/api/shipments',
    DETAIL: (id: string) => `/api/shipments/${id}`,
    HISTORY: (id: string) => `/api/shipments/${id}/history`,
    UPDATE_STATUS: (id: string) => `/api/shipments/${id}/status`,
    CANCEL: (id: string) => `/api/shipments/${id}/cancel`,
  },
} as const;
