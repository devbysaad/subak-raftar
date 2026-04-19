export const API = {
  AUTH: {
    SIGN_UP:  '/api/auth/sign-up/email',
    SIGN_IN:  '/api/auth/sign-in/email',
    SIGN_OUT: '/api/auth/sign-out',
  },
  USERS: {
    ME:         '/api/users/me',
    LIST:       '/api/users',
    CREATE:     '/api/users',
    DETAIL:     (id: string) => `/api/users/${id}`,
    UPDATE:     (id: string) => `/api/users/${id}`,
    DEACTIVATE: (id: string) => `/api/users/${id}/deactivate`,
  },
  SETTINGS: {
    GET:      '/api/settings',
    UPDATE:   '/api/settings',
    SHOPIFY:  '/api/settings/shopify',
    PROVIDER: (p: string) => `/api/settings/providers/${p}`,
  },
  SHIPMENTS: {
    LIST:         '/api/shipments',
    CREATE:       '/api/shipments',
    BULK:         '/api/shipments/bulk',
    DETAIL:       (id: string) => `/api/shipments/${id}`,
    HISTORY:      (id: string) => `/api/shipments/${id}/history`,
    UPDATE_STATUS:(id: string) => `/api/shipments/${id}/status`,
    CANCEL:       (id: string) => `/api/shipments/${id}/cancel`,
    ANALYTICS:    '/api/shipments/analytics/couriers',
  },
  LOAD_SHEETS: {
    LIST:   '/api/loadsheets',
    CREATE: '/api/loadsheets',
    DETAIL: (id: string) => `/api/loadsheets/${id}`,
  },
  COMPLAINTS: {
    LIST:   '/api/complaints',
    CREATE: '/api/complaints',
  },
  INVOICES: {
    LIST: '/api/invoices',
  },
} as const;
