export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  SHIPMENTS: '/dashboard/shipments',
  SHIPMENT_CREATE: '/dashboard/shipments/create',
  SHIPMENT_DETAIL: (id: string) => `/dashboard/shipments/${id}`,
  ADMIN: '/dashboard/admin',
} as const;
