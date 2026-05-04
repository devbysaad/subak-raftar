# Code Review Fix Prompt — Subak Raftar Backend

You are fixing code review issues raised by a senior developer on the Subak Raftar backend.
Do NOT break any existing functionality. Everything that works now must keep working.
Fix each issue one by one in the exact order listed.

---

## ISSUE 1 — Move seed-admin.js to correct folder

Current location: courier-backend/seed-admin.js (root level, wrong)
Also there is an api/ folder at root level that should not exist.

Fix:
- Move seed-admin.js to courier-backend/src/scripts/seed-admin.js
- Delete the api/ folder at courier-backend root entirely
- Update any import paths inside seed-admin.js that reference ../src/ to ./
- Update package.json scripts if seed is referenced there

---

## ISSUE 2 — Remove duplicate export files (extra layer)

There are two files exporting the same functions.
One file has the implementation, another file just imports and re-exports.
The re-export file is a useless extra layer.

Find every file in the codebase that follows this pattern:
- fileA.js has the actual function implementation + export
- fileB.js imports from fileA and just re-exports the same functions
- Delete fileB.js entirely
- Update any files that imported from fileB to import directly from fileA

Search the entire src/ folder for this pattern.
Common places: utils/, modules/auth/, modules/users/

---

## ISSUE 3 — Fix seed-admin.js to use MongoDB transactions

Current problem: seed-admin.js deletes collections in a Promise.all().
If step 4 fails, steps 1-3 are already deleted with no rollback.
This is dangerous even for a manual script.

Fix using MongoDB session + transaction pattern:

```js
// Pattern to implement:
const session = await mongoose.startSession();
session.startTransaction();
try {
  // all deleteMany and create operations go here
  // pass { session } to every operation
  await User.deleteMany({}, { session });
  await Shipment.deleteMany({}, { session });
  // ... etc
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction(); // rolls back everything if any step fails
  throw err;
} finally {
  session.endSession();
}
```

Note: MongoDB transactions require a replica set connection.
Atlas (which this project uses) supports transactions natively.
The MONGO_URI already points to Atlas so this will work.

For the better-auth native collections (user, session, account, verification)
that use db.collection() directly — wrap those in the same session too.

---

## ISSUE 4 — Add Zod validation to ALL routes

Currently validation is partial or missing. Backend accepts any data.
If frontend sends bad data, empty/default values get stored silently.

Rules:
- Validation must run BEFORE the controller (in the route, not service)
- Use the existing validate.middleware.js with zod schemas
- Every POST and PATCH route must have a zod schema
- Bad data must return 400 with a clear error message listing exactly which fields failed

Create or update validator files for every module that is missing them:

### complaints/complaint.validator.js
```js
import { z } from "zod";

export const createComplaintSchema = z.object({
  parcelNo:  z.string().min(1, "Parcel number is required"),
  status:    z.string().min(1, "Status is required"),
  remarks:   z.string().min(1, "Remarks are required"),
});

export const searchComplaintSchema = z.object({
  parcelNo:  z.string().optional(),
  rStatus:   z.string().optional(),
  cStatus:   z.string().optional(),
  fromDate:  z.string().optional(),
  toDate:    z.string().optional(),
});
```

### loadsheets/loadsheet.validator.js
```js
import { z } from "zod";

export const createLoadSheetSchema = z.object({
  parcelIds: z.array(z.string().min(1)).min(1, "At least one parcel ID is required"),
});
```

### users/user.validator.js
```js
import { z } from "zod";

export const createUserSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role:     z.enum(["admin", "employee"], { errorMap: () => ({ message: "Role must be admin or employee" }) }),
});

export const updateUserSchema = z.object({
  name:     z.string().min(2).optional(),
  phone:    z.string().optional(),
  isActive: z.boolean().optional(),
});
```

### settings/settings.validator.js
```js
import { z } from "zod";

export const updateSettingsSchema = z.object({
  companyName: z.string().min(1).optional(),
  email:       z.string().email().optional(),
  phone:       z.string().optional(),
  address:     z.string().optional(),
});

export const updateProviderKeySchema = z.object({
  apiKey:      z.string().min(1, "API key is required"),
  apiPassword: z.string().min(1, "API password is required"),
});

export const updateShopifySchema = z.object({
  storeName:   z.string().min(1, "Store name is required"),
  apiKey:      z.string().min(1, "API key is required"),
  apiSecret:   z.string().min(1, "API secret is required"),
});
```

Shipments validator already exists — verify it covers all fields including isCOD, codAmount, weight.

---

## ISSUE 5 — Wire validators into routes

After creating validators, add them to routes.
Use the existing validate middleware: validate(schema)

Update these route files completely:

### complaint.routes.js
```js
router.post("/", authMiddleware, validate(createComplaintSchema), create);
router.get("/", authMiddleware, list);
```

### loadsheet.routes.js
```js
router.post("/", authMiddleware, validate(createLoadSheetSchema), create);
router.get("/", authMiddleware, list);
router.get("/:id", authMiddleware, getById);
```

### user.routes.js
```js
router.get("/me", authMiddleware, getMe);
router.get("/", authMiddleware, requireRole("admin"), getUsers);
router.post("/", authMiddleware, requireRole("admin"), validate(createUserSchema), createUser);
router.patch("/:id", authMiddleware, requireRole("admin"), validate(updateUserSchema), updateUser);
router.patch("/:id/deactivate", authMiddleware, requireRole("admin"), deactivateUser);
```

### settings.routes.js
```js
router.get("/", authMiddleware, getSettings);
router.patch("/", authMiddleware, requireRole("admin"), validate(updateSettingsSchema), updateSettings);
router.patch("/providers/:provider", authMiddleware, requireRole("admin"), validate(updateProviderKeySchema), updateProviderKey);
router.patch("/shopify", authMiddleware, requireRole("admin"), validate(updateShopifySchema), updateShopify);
```

---

## ISSUE 6 — Fix validate.middleware.js error response

Current validate middleware may not return a clear enough error.
Make sure it returns exactly which fields failed and why:

```js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field:   e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  req.body = result.data; // use sanitized data
  next();
};
```

---

## DELIVERABLE

Give me complete file contents for every file that changes:
1. courier-backend/src/scripts/seed-admin.js (moved + transaction fix)
2. courier-backend/src/modules/complaints/complaint.validator.js (new)
3. courier-backend/src/modules/complaints/complaint.routes.js (updated)
4. courier-backend/src/modules/loadsheets/loadsheet.validator.js (new)
5. courier-backend/src/modules/loadsheets/loadsheet.routes.js (updated)
6. courier-backend/src/modules/users/user.validator.js (new)
7. courier-backend/src/modules/users/user.routes.js (updated)
8. courier-backend/src/modules/settings/settings.validator.js (new)
9. courier-backend/src/modules/settings/settings.routes.js (updated)
10. courier-backend/src/middleware/validate.middleware.js (updated error format)
11. courier-backend/package.json (updated scripts if seed path changed)
12. Any duplicate re-export files found — list them and delete them

Also list every file you deleted and why.

Do NOT change any business logic in services or controllers.
Do NOT touch auth, shipments (already has validator), or frontend.
Only fix the 6 issues above.
