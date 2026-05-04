# Code Review Fixes — Workflow & Instructions

## What Idrees Bhai Flagged (Summary)

| # | Issue | Severity |
|---|---|---|
| 1 | seed-admin.js in wrong folder, extra api/ folder at root | Low |
| 2 | Duplicate files — one file implements, another just re-exports | Medium |
| 3 | seed-admin.js has no rollback — partial deletes on failure | Medium |
| 4 | No Zod validation on most routes | High |
| 5 | Validation happens inside service, not before controller | High |
| 6 | Bad data gets stored silently — loose API | High |

---

## Execution Order

Do these in this exact order. Test after each step.

### Step 1 — Move seed file
1. Create folder: courier-backend/src/scripts/
2. Move seed-admin.js from courier-backend/ to courier-backend/src/scripts/
3. Delete the api/ folder at courier-backend root
4. Update internal paths in seed file
5. Update package.json seed script if it references the old path
6. Test: node src/scripts/seed-admin.js runs without path errors

### Step 2 — Find and delete duplicate export files
1. Search for files that only contain imports + re-exports
2. Check modules/auth/, utils/, modules/users/ first
3. Delete the re-export files
4. Update all importers to point to the original implementation file
5. Test: server starts with no import errors

### Step 3 — Fix seed transaction
1. Wrap all seed operations in mongoose session + transaction
2. commitTransaction() at end
3. abortTransaction() in catch block
4. Test: run seed, verify it works. Then break it intentionally mid-seed and verify nothing is deleted.

### Step 4 — Add Zod validators
1. Create validator files for: complaints, loadsheets, users, settings
2. Each validator exports named schemas (createX, updateX, searchX)
3. Test: import each validator file, no errors

### Step 5 — Wire validators into routes
1. Import validate middleware into each route file
2. Add validate(schema) between authMiddleware and controller
3. Test with Postman: send bad data, should get 400 with field-level errors
4. Test with good data: should still work normally

### Step 6 — Fix validate middleware response
1. Update validate.middleware.js error format
2. Ensure errors array has field + message per failing field
3. Test: send empty body to POST /api/shipments, verify 400 response shows which fields failed

---

## How to Test Each Fix

### Test Validation (Postman)
POST /api/complaints with empty body:
Expected: 400 { success: false, message: "Validation failed", errors: [{ field: "parcelNo", message: "Parcel number is required" }, ...] }

POST /api/loadsheets with { parcelIds: [] }:
Expected: 400 { errors: [{ field: "parcelIds", message: "At least one parcel ID is required" }] }

POST /api/users with { email: "notanemail" }:
Expected: 400 { errors: [{ field: "email", message: "Invalid email address" }] }

### Test Transaction (seed)
1. Run seed normally → all data appears in MongoDB ✓
2. Add a fake error halfway through seed → nothing should be deleted ✓

---

## What NOT to Touch
- Auth flow (working)
- Shipment validator (already has Zod)
- Frontend (not part of this review)
- Any service or controller business logic
- Database models
