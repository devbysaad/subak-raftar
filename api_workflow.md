# Subak Raftar - API Workflow & Architecture Analysis

This document provides a comprehensive review of the `Subak Raftar` API ecosystem, analyzing how the backend and frontend interact, where specific APIs are used, and the overarching data workflow across the project.

## 1. High-Level Architecture
The project follows a standard decoupled architecture:
- **Backend:** Node.js with Express, providing a RESTful JSON API. It uses Mongoose for MongoDB data modeling and `better-auth` for authentication.
- **Frontend:** React with TypeScript, using Vite as a bundler. State and API integration are managed via Redux Toolkit (with Saga) and Axios.

---

## 2. Global API Configuration
All core backend routes are prefixed with `/api` and registered in `courier-backend/src/app.js`.

**Base Endpoints:**
- `/api/auth` - Authentication and session management
- `/api/users` - User profile and management
- `/api/settings` - System settings, provider keys, and Shopify integration
- `/api/shipments` - Core logistics and parcel tracking
- `/api/loadsheets` - Consolidating shipments for dispatch
- `/api/complaints` - Customer support ticketing
- `/api/invoices` - Billing and financial records
- `/api/integrations` - Webhooks (e.g., Shopify fulfillment)

---

## 3. Core Workflows & Modules

### A. Authentication Flow (`/api/auth`)
**How it works:** 
The app uses `better-auth`, which provides a robust, pre-built authentication engine. The backend routes all `/api/auth/*` traffic directly to the `better-auth` Node handler (`toNodeHandler(auth)` in `auth.routes.js`). 
**Where it is used:**
- **Frontend:** Used in `auth.service.ts` to log in (`/api/auth/sign-in/email`) and sign up (`/api/auth/sign-up/email`).
- **Why:** To maintain secure, cookie-based sessions without writing boilerplate auth logic. The frontend relies on Axios interceptors to pass these session cookies seamlessly.

### B. Shipment Management Workflow (`/api/shipments`)
**How it works:** 
This is the core engine of the platform. The `shipment.controller.js` maps to `shipment.service.js` which handles the business logic.
1. **Creation:** Single (`/api/shipments`) or Bulk (`/api/shipments/bulk`). When created, a `StatusHistory` record is automatically generated.
2. **Retrieval & Analytics:** Listing shipments (`GET /api/shipments`), retrieving details (`GET /api/shipments/:id`), and fetching analytics (`/api/shipments/analytics/couriers`).
3. **Lifecycle Management:** Updating a shipment's status (`PATCH /api/shipments/:id/status`) triggers an update in both the `Shipment` model and appends a new event to the `StatusHistory` model. Shipments can also be cancelled.
**Where it is used:**
- **Frontend:** In `shipments.service.ts`, feeding into the Redux store to display active parcels, track statuses on the dashboard, and allow admins/employees to update tracking stages.

### C. Third-Party Integrations (`/api/integrations`)
**How it works:** 
Specifically built to listen to external webhooks. For example, Shopify integration (`POST /api/integrations/shopify/fulfillment`).
- It uses raw JSON body parsing to verify the `x-shopify-hmac-sha256` signature securely.
- It looks up the user's `Settings` model to fetch the `shopifyApiSecret`.
- If valid, `handleFulfillmentWebhook` creates a new `Shipment` in Subak Raftar automatically.
**Why:** This allows seamless, automated dropshipping or e-commerce synchronization without manual data entry.

### D. Settings & Providers (`/api/settings`)
**How it works:** 
Maintains global application configurations. Admins can update integration keys (like Shopify credentials or external Courier Provider APIs).
**Why:** To ensure secrets and configurations are dynamic and can be modified via the UI without redeploying the backend.

### E. Load Sheets & Operations (`/api/loadsheets`)
**How it works:** 
A load sheet bundles multiple `Shipment` records together. The API allows creating a load sheet (`POST /api/loadsheets`) and viewing details.
**Why:** Essential for warehouse dispatch operations, allowing a driver to take a single document summarizing 50 parcels instead of 50 separate receipts.

---

## 4. Frontend Integration (Redux + Axios)

The frontend maps exactly to the backend via the `API` constant object in `src/constants/api.ts`.

1. **Service Layer (`src/redux/service/`):** 
   Files like `auth.service.ts` and `shipments.service.ts` wrap Axios calls.
2. **Axios Interceptor (`src/lib/axios.ts`):** 
   Automatically attaches credentials (`withCredentials: true`) to ensure `better-auth` session cookies are passed to the backend on every request.
3. **Data Hydration:** 
   Services return standard JSON payloads (using the backend's `success()` and `failure()` utility format). These are dispatched to Redux slices to update the UI state.
   *Example:* `authService.getMe()` fetches the enriched user profile (including `role`) because the raw `better-auth` response doesn't always contain custom database fields.

---

## 5. Summary of the Data Lifecycle

1. **Order Placed:** An order is either created manually via the Frontend UI (`shipmentsService.createShipment`) or injected automatically via the Shopify Webhook (`/api/integrations/shopify/fulfillment`).
2. **Processing:** The shipment is grouped into a Load Sheet (`/api/loadsheets`) for physical dispatch.
3. **Tracking:** As the physical parcel moves, employees use the Frontend Dashboard to update the status. This calls `/api/shipments/:id/status`, which updates the Shipment and creates a `StatusHistory` trail.
4. **Completion:** Upon delivery, Invoices (`/api/invoices`) can be generated and Analytics (`/api/shipments/analytics/couriers`) are updated to reflect performance metrics.
