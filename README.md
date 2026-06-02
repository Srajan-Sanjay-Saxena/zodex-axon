# zodex-axon

> **World's first Express middleware that makes unvalidated request access a compile-time error.**

Type-safe request validation middleware for Express + Zod with branded types.

## Why?

Once data passes through `zodex-axon`, it's **branded** at the type level. You can't accidentally access unvalidated `req.body` — TypeScript removes it and forces you through `req.validatedData`.

```ts
// ❌ Without zodex-axon — nothing stops you from using raw unvalidated data
app.post("/users", (req, res) => {
  req.body.name; // could be anything — no guarantee it was validated
});

// ✅ With zodex-axon — TypeScript enforces validation
app.post("/users", RequestGuardMiddleware({ body: schema }), (req: VerifiedRequest<{ body: User }>, res) => {
  req.validatedData.name; // ✅ guaranteed validated, branded
  req.body;               // ❌ TypeScript error — property doesn't exist
});
```

## Install

```bash
pnpm add zodex-axon
# peer deps
pnpm add zod express
```

## Core Concepts

### Branded Types

`zodex-axon` uses TypeScript's structural type system against itself. Validated data is wrapped in a `ValidDataBrand<T>` — a phantom type that makes it impossible to confuse validated and unvalidated data at the type level.

```ts
type ValidDataBrand<T> = T & { [brand]: "ValidData" };
```

You can't construct this type manually. It can only come from passing through the validation engine.

### VerifiedRequest

A conditional type that:
1. **Strips** raw `req.body`, `req.params`, `req.query` when their schemas are provided
2. **Exposes** `req.validatedData`, `req.validatedParams`, `req.validatedQuery` with branded types
3. **Enforces** at least one schema via `RequireAtLeastOne` — `VerifiedRequest<{}>` resolves to `never`

```ts
// Only body
type R1 = VerifiedRequest<{ body: { name: string } }>;
// → has validatedData, body is stripped

// Only params
type R2 = VerifiedRequest<{ params: { id: string } }>;
// → has validatedParams, params is stripped

// All three
type R3 = VerifiedRequest<{ body: User; params: { id: string }; query: { page: number } }>;
// → has validatedData + validatedParams + validatedQuery, all raw fields stripped

// Empty — compile error
type Bad = VerifiedRequest<{}>; // → never
```

---

## Usage

### RequestGuardMiddleware — Body Validation

```ts
import { RequestGuardMiddleware } from "zodex-axon";
import { z } from "zod";
import type { VerifiedRequest } from "zodex-axon";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive(),
});

type User = z.infer<typeof userSchema>;

app.post(
  "/users",
  RequestGuardMiddleware<{ body: User }>({ body: userSchema }),
  (req: VerifiedRequest<{ body: User }>, res) => {
    const { name, email, age } = req.validatedData;
    res.json({ name, email, age });
  }
);
```

### Params Validation

```ts
const idSchema = z.object({
  id: z.string().uuid(),
});

type IdParams = z.infer<typeof idSchema>;

app.get(
  "/users/:id",
  RequestGuardMiddleware<{ params: IdParams }>({ params: idSchema }),
  (req: VerifiedRequest<{ params: IdParams }>, res) => {
    const { id } = req.validatedParams; // string (uuid)
    res.json({ id });
  }
);
```

### Query Validation

```ts
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type Pagination = z.infer<typeof paginationSchema>;

app.get(
  "/posts",
  RequestGuardMiddleware<{ query: Pagination }>({ query: paginationSchema }),
  (req: VerifiedRequest<{ query: Pagination }>, res) => {
    const { page, limit } = req.validatedQuery;
    // page: number, limit: number — coerced from query string
  }
);
```

### Composable Validation (body + params + query)

```ts
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

type UpdateUser = z.infer<typeof updateUserSchema>;
type IdParams = z.infer<typeof idSchema>;

app.patch(
  "/users/:id",
  RequestGuardMiddleware<{ body: UpdateUser; params: IdParams }>({
    body: updateUserSchema,
    params: idSchema,
  }),
  (req: VerifiedRequest<{ body: UpdateUser; params: IdParams }>, res) => {
    req.validatedData;     // ✅ { name?: string; email?: string }
    req.validatedParams;   // ✅ { id: string }
    req.body;              // ❌ TypeScript error
    req.params;            // ❌ TypeScript error
  }
);
```

### All Three Sources

```ts
app.get(
  "/search/:category",
  RequestGuardMiddleware<{
    body: SearchFilters;
    params: CategoryParams;
    query: Pagination;
  }>({
    body: searchFiltersSchema,
    params: categorySchema,
    query: paginationSchema,
  }),
  (req: VerifiedRequest<{ body: SearchFilters; params: CategoryParams; query: Pagination }>, res) => {
    req.validatedData;    // SearchFilters (branded)
    req.validatedParams;  // CategoryParams (branded)
    req.validatedQuery;   // Pagination (branded)
  }
);
```

---

## Standalone Validation (no Express)

Use the validation engine directly without middleware:

```ts
import { MakeObjectTypeSafeEngine } from "zodex-axon";

const schema = z.object({ name: z.string(), age: z.number() });

const result = MakeObjectTypeSafeEngine(schema, unknownInput);

if (result.success) {
  result.data;        // ValidDataBrand<{ name: string; age: number }>
  result.data.name;   // ✅ string
  result.error;       // null
} else {
  result.error;       // ValidationError (human-readable from zod-validation-error)
  result.data;        // null
}
```

---

## Error Handling

### Built-in Error Classes

```ts
import {
  BadRequest,
  NotFound,
  UnauthorizedAccess,
  ForbiddenErrorResponse,
  InternalServerError,
  DuplicateError,
  ValidationError,
  JSONWebTokenError,
  RedirectionResponse,
  CaseError,
} from "zodex-axon";
```

Each error class uses the builder pattern internally:

```ts
app.get("/users/:id", async (req, res, next) => {
  const user = await findUser(req.params.id);
  if (!user) {
    return next(new NotFound().handleResponse(res, { info: "User not found" }));
  }
  res.json(user);
});
```

### Global Error Handler

Mount as the last middleware:

```ts
import { globalErrorHandler } from "zodex-axon";

// 404 catch-all
app.use("*", (req, res, next) => {
  next(new NotFound().handleResponse(res, { info: "Route not found" }));
});

// Global handler — auto-detects dev/prod, handles common errors
app.use(globalErrorHandler);
```

The global handler automatically catches:
- MongoDB duplicate key errors (11000) → `409`
- Validation errors → `400`
- Cast errors → `400`
- JWT errors → `400`
- Dev mode: includes stack trace
- Prod mode: hides internals

### Custom Error Responses

```ts
import { ApiError } from "zodex-axon";

// Throw a custom operational error
throw new ApiError(429, "Too many requests", true, { info: "Rate limit exceeded" });
```

### Success Responses

```ts
import { ApiResponse } from "zodex-axon";

const response = new ApiResponse("User created", 201, { info: "Success", userId: "abc" });
response.ResponseSender(res);
```

---

## catchAsync

Wraps async route handlers to forward errors to Express error middleware:

```ts
import { catchAsync } from "zodex-axon";

app.get("/users", catchAsync(async (req, res, next) => {
  const users = await db.getUsers(); // if this throws, error goes to next()
  res.json(users);
}));
```

---

## Middleware Composition

`RequestGuardMiddleware` is just another middleware — compose freely:

```ts
app.post(
  "/admin/users",
  authMiddleware,           // check JWT
  requireRole("admin"),     // check permissions
  rateLimiter,              // throttle
  RequestGuardMiddleware<{ body: CreateUser }>({ body: createUserSchema }), // validate
  handler,                  // your logic
);
```

### Type Accumulation with Custom Request

The second generic `U` in `VerifiedRequest` accepts an augmented Request type. Use it to carry types from earlier middleware:

```ts
// Define your authenticated request (from auth middleware)
interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}

const userSchema = z.object({ name: z.string() });
type User = z.infer<typeof userSchema>;

app.post(
  "/users",
  authMiddleware, // attaches req.user at runtime
  RequestGuardMiddleware<{ body: User }>({ body: userSchema }),
  (req: VerifiedRequest<{ body: User }, AuthenticatedRequest>, res) => {
    req.user;          // ✅ from AuthenticatedRequest
    req.validatedData; // ✅ branded, validated
    req.body;          // ❌ TypeScript error — stripped
  }
);
```

This works because `VerifiedRequest<TConfig, U>` applies `Omit` and branding on top of whatever `U` you pass — so all properties from your custom request type are preserved.

```ts
// Admin request with permissions
interface AdminRequest extends Request {
  user: { id: string; role: "admin" };
  permissions: string[];
}

app.delete(
  "/users/:id",
  authMiddleware,
  requireAdmin,
  RequestGuardMiddleware<{ params: { id: string } }>({ params: idSchema }),
  (req: VerifiedRequest<{ params: { id: string } }, AdminRequest>, res) => {
    req.user;            // ✅ { id: string; role: "admin" }
    req.permissions;     // ✅ string[]
    req.validatedParams; // ✅ { id: string } (branded)
    req.params;          // ❌ stripped
  }
);
```

---

## TypeScript Behavior

| Scenario | `req.body` | `req.validatedData` | `req.params` | `req.validatedParams` |
|---|---|---|---|---|
| `{ body: T }` | ❌ stripped | ✅ branded | ✅ exists (from Request) | ❌ doesn't exist |
| `{ params: T }` | ✅ exists (from Request) | ❌ doesn't exist | ❌ stripped | ✅ branded |
| `{ body: T, params: T }` | ❌ stripped | ✅ branded | ❌ stripped | ✅ branded |
| `{}` | — | — | — | Type is `never` |

---

## How It Works Internally

1. `RequestGuardMiddleware` receives a `SchemaConfig` with optional `body`, `params`, `query` Zod schemas
2. For each provided schema, it runs `MakeObjectTypeSafeEngine` against the corresponding `req` field
3. On failure → passes `BadRequest` error to `next()`
4. On success → attaches branded validated data to `req.validatedData` / `req.validatedParams` / `req.validatedQuery`
5. `VerifiedRequest<TConfig>` uses `StrippedKeys<TConfig>` to `Omit` raw fields from the Express `Request` type
6. `RequireAtLeastOne<TConfig>` collapses to `never` if no schemas are provided — making the type unusable

---

## Peer Dependencies

| Package | Version |
|---|---|
| `express` | `^4.0.0 \|\| ^5.0.0` |
| `zod` | `^4.0.0` |

## License

ISC
