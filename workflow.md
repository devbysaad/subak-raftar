# Subak Raftar — Complete Workflow

## 1. Authentication Flow
- App loads → fetchMe fires (GET /api/users/me)
- 200 response → go to /dashboard
- 401 response → go to /login
- Login: POST /api/auth/sign-in/email { email, password }
  → success: fetchMe → /dashboard
  → fail: show error inline
- Logout: POST /api/auth/sign-out → clear state → /login
- Signup is DISABLED for public. Admin creates employee accounts from Admin Panel.

## 2. Dashboard Flow
- Loads stats: GET /api/shipments with aggregation
  → Delivered count/amount, Returned, In Process, Pending, Ready for Return, Load Sheet count
- Loads courier ratio grid: per-provider delivery vs return percentage
- Search panel filters: courier, parcel no, consignee city, status, date range, name, address, cell, product, third party no
- Search → GET /api/shipments?{filters}
- Table renders results with checkboxes
- Bulk actions: Print Selected, Cancel Selected, Generate Load Sheet, Export Excel

## 3. Book Parcel Flow
### Manual
- Fill form: consignee name/address/email/phone/city, item type, qty, special instructions, COD amount, weight
- Select courier provider
- Submit → POST /api/shipments
- Mock adapter called → returns fake tracking number
- Status history logged as "booked"
- Success: show tracking number, option to print label

### Excel Bulk Upload
- Download sample format Excel file
- Fill multiple rows
- Upload → POST /api/shipments/bulk
- Backend parses Excel rows → creates shipments in batch
- Returns: { created: N, failed: M, errors: [...] }

## 4. View Invoices Flow
- Filter: period, date range, invoice no, serial no, payment status
- GET /api/invoices?{filters}
- Invoice data derived from shipments grouped by billing period
- Display table with invoice details

## 5. Create Load Sheet Flow
- Employee scans or types parcel numbers into input field one by one
- Each entered parcel appears in a list below
- "Clear All" clears the list
- Submit → POST /api/loadsheets { parcelIds: [...] }
- Returns load sheet number
- Print load sheet as PDF
- Report section: GET /api/loadsheets?loadSheetNo=X&fromDate=Y&toDate=Z

## 6. Add Complaint Flow
- Submit: POST /api/complaints { parcelNo, status, remarks }
- Search: GET /api/complaints?parcelNo=X&rStatus=Y&cStatus=Z&fromDate=A&toDate=B
- Display results or "No Record Found"

## 7. Admin: User Management Flow
- List: GET /api/users → table of all employees
- Create: POST /api/users { name, email, password, role: "employee" }
  → better-auth creates auth user → hook creates User doc with authId
- Deactivate: PATCH /api/users/:id/deactivate
- Reset Password: PATCH /api/users/:id/reset-password { newPassword }

## 8. Admin: Settings Flow
- Company Info: GET /api/settings → prefill form → PATCH /api/settings
- Courier Keys: PATCH /api/settings/providers/:provider { apiKey, apiPassword }
  → stored in settings document's providerKeys map
  → adapter uses these when booking real shipments later
- Shopify: PATCH /api/settings/shopify { storeName, apiKey, apiSecret }

## 9. Shopify Auto-Import Flow
- Merchant (e.g. Bazar Chalo) has Shopify store connected
- Customer places order on their Shopify store
- Merchant clicks fulfill on Shopify → Shopify sends webhook
- POST /api/integrations/shopify/:companyId/fulfillment
- Backend verifies HMAC signature
- Maps Shopify order fields to shipment schema
- Creates shipment automatically with status "booked"
- Employee sees it appear in dashboard

## 10. Status Update Flow (Admin)
- Admin finds shipment in dashboard table
- Updates status: PATCH /api/shipments/:id/status { status, note }
- Status history document created
- Notification triggered: SMS to consignee phone, email to company email

## 11. Tracking Cron Flow (background)
- node-cron runs every 30 minutes
- Fetches all shipments with active statuses (booked, received, in_transit, out_for_delivery)
- Skips provider "self" (manual updates only)
- Calls adapter.getStatus() for each → mock returns random status for now
- If status changed → update shipment, log status history, trigger notification
- Logs poll timestamp on shipment

## Data Flow: Create Parcel End to End
1. Employee fills "Book Parcel Manually" form
2. Frontend dispatches createShipmentRequest(formData)
3. Saga calls shipmentsService.createShipment(formData)
4. Service: POST /api/shipments with body
5. Backend: validates with zod → gets settings for provider keys → calls adapter.bookShipment()
6. Mock adapter returns { trackingNo: "TCS-1234567890" }
7. Shipment created in MongoDB with trackingNo and status "booked"
8. StatusHistory document created: { shipmentId, status: "booked", createdBy }
9. Response: 201 { success: true, data: shipment }
10. Saga dispatches createShipmentSuccess(shipment)
11. Frontend: shows success toast with tracking number, redirects to shipment detail