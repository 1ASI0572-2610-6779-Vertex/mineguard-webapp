# MineGuard Platform — API Contract Dictionary

**Version:** 2.0 (RESTful Refactor — Richardson Maturity Level 3)
**Base URL:** `https://<host>/api/v1`
**Auth scheme:** `Authorization: Bearer <JWT>` (except endpoints marked as **PUBLIC**)
**Content-Type:** `application/json` (all requests and responses unless noted)

---

## Conventions

| Symbol | Meaning |
|--------|---------|
| 🔓 PUBLIC | No JWT required |
| 🔒 JWT required | `Authorization: Bearer <token>` header mandatory |
| `{param}` | Path variable |
| `?param=` | Query parameter |
| **bold** | Required field |
| *italic* | Optional field |

All enum values in responses are serialized **lowercase** (e.g. `"active"`, `"in_progress"`).
All timestamps are ISO-8601 strings (e.g. `"2025-06-19T14:30:00"`).

---

## Table of Contents

1. [Module IAM — Identity & Access Management](#1-module-iam--identity--access-management)
2. [Module Assets — Fleet & Personnel](#2-module-assets--fleet--personnel)
3. [Module Monitoring — Safety & Real-Time](#3-module-monitoring--safety--real-time)
4. [Module Analytics — Dashboard & Reporting](#4-module-analytics--dashboard--reporting)
5. [Module Subscriptions — Company Registration](#5-module-subscriptions--company-registration)
6. [Error Responses](#error-responses)

---

## 1. Module IAM — Identity & Access Management

> Manages user identity, authentication sessions, and supervisor accounts.
> The security model is **stateless JWT**. Tokens are signed with a server secret and include
> `userId`, `companyId`, and `role` as claims. Every subsequent request reads `companyId`
> from the token to enforce tenant isolation — no request parameter can override it.

---

### `POST /api/v1/sessions` 🔓

**Propósito:** Authenticate a web user (Supervisor or Admin) and create a session.
Returns a signed JWT that must be included in all subsequent requests.

**Reglas de Negocio:**
- Validates `username` + `password` against the User aggregate.
- If the account has `requiresPasswordChange = true`, the flag is returned in the response so the frontend can redirect the user to the change-password screen before proceeding.

**Reglas de Seguridad / Multi-Tenant:**
- Returns `401` for both "user not found" and "wrong password" — the error is intentionally ambiguous to prevent user enumeration.
- No JWT is required (PUBLIC endpoint).

**Variables:** none

**Request Body:**
```json
{
  "username": "supervisor01",
  "password": "secret123"
}
```

**Response `200 OK`:**
```json
{
  "id": 42,
  "username": "supervisor01",
  "token": "eyJhbGci...",
  "role": "SUPERVISOR",
  "requiresPasswordChange": false
}
```

---

### `POST /api/v1/sessions/mobile` 🔓

**Propósito:** Authenticate a field operator from the Flutter mobile app.
Returns a JWT plus the numeric `driverId` needed for the check-in flow,
eliminating a second round-trip after login.

**Reglas de Negocio:**
- Credentials use the driver's `workerId` (format `CDT-{companyId}-{seq}`, e.g. `CDT-1-003`), not an email address.
- The `driverId` is resolved at login time by cross-referencing `userId → Driver` (IAM → Assets bounded context join).
- Non-driver users (mobile supervisors) receive `driverId: null`.

**Reglas de Seguridad / Multi-Tenant:**
- Returns `401` for invalid workerId or password (intentionally ambiguous — no enumeration).
- No JWT is required (PUBLIC endpoint).

**Variables:** none

**Request Body:**
```json
{
  "workerId": "CDT-1-003",
  "password": "secret123"
}
```

**Response `200 OK`:**
```json
{
  "workerId": "CDT-1-003",
  "fullName": "Juan Pérez",
  "role": "DRIVER",
  "token": "eyJhbGci...",
  "driverId": 7
}
```

> **Note for Flutter team:** `driverId` is `null` for supervisor-role mobile users.
> Use it directly in the check-in call: `POST /api/v1/vehicles/{vehicleId}/trips` with body `{ "driverId": 7 }`.

---

### `POST /api/v1/users` 🔓

**Propósito:** Register a new MineGuard user (sign-up). Does not issue a JWT — the user must
call `POST /api/v1/sessions` to authenticate after registration.

**Reglas de Negocio:**
- The `roles` array determines account type. Omitting it applies platform defaults.
- Driver accounts must be created via `POST /api/v1/drivers` (which auto-generates a `workerId`); this endpoint is for Supervisors and Admins only.

**Reglas de Seguridad / Multi-Tenant:**
- Returns `400` if the username is already taken.
- No JWT is required (PUBLIC endpoint).

**Variables:** none

**Request Body:**
```json
{
  "username": "supervisor_new",
  "password": "secret123",
  "email": "new@mine.com",
  "fullName": "Laura Condori",
  "roles": ["SUPERVISOR"]
}
```

> `roles` is optional — omit to use platform defaults.

**Response `201 Created`:**
```json
{
  "id": 15,
  "username": "supervisor_new"
}
```

---

### `POST /api/v1/users/password-resets` 🔓

**Propósito:** Request a password reset. Generates a temporary password and sends it to
the registered email address via Brevo SMTP.

**Reglas de Negocio:**
- A temporary password is auto-generated. The user must call `PATCH /api/v1/users/me/password` after logging in with it.
- Always returns `200 OK` regardless of whether the email is registered.

**Reglas de Seguridad / Multi-Tenant:**
- Deliberate response ambiguity prevents account enumeration attacks.
- No JWT is required (PUBLIC endpoint — the user has lost access).

**Variables:** none

**Request Body:**
```json
{
  "email": "user@mine.com"
}
```

**Response `200 OK`:**
```json
{
  "message": "Si el correo está registrado, se han enviado las instrucciones de restablecimiento."
}
```

---

### `PATCH /api/v1/users/me/password` 🔒

**Propósito:** Change the password of the currently authenticated user (partial update of the `me` resource).
Clears the `requiresPasswordChange` flag after success.

**Reglas de Negocio:**
- Only the `password` field is updated — no other profile fields are affected.
- The current password is NOT required in the request body; a valid JWT is considered sufficient proof of identity.
- Minimum length: 8 characters.

**Reglas de Seguridad / Multi-Tenant:**
- Requires a valid JWT. The user identity is read from the JWT `username` claim — a client cannot change another user's password via this endpoint.

**Variables:** none

**Request Body:**
```json
{
  "newPassword": "newSecret123"
}
```

**Response `200 OK`:**
```json
{
  "id": 42,
  "username": "supervisor01"
}
```

---

### `GET /api/v1/supervisors` 🔒

**Propósito:** List all supervisor accounts belonging to the authenticated company.

**Reglas de Negocio:**
- Returns a flat array compatible with the web panel's user-management table.

**Reglas de Seguridad / Multi-Tenant:**
- `companyId` is read from the JWT. Only supervisors linked to that company are returned.

**Variables:** none

**Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 3,
    "fullName": "Ana Torres",
    "corporateId": "SUP-001",
    "email": "ana@mine.com",
    "accessStatus": "active"
  }
]
```

> `accessStatus` values: `"active"` | `"locked"`

---

### `POST /api/v1/supervisors` 🔒

**Propósito:** Create a new supervisor account under the authenticated company.
Sends a welcome email with a temporary password via Brevo SMTP.

**Reglas de Negocio:**
- Creates a User with role `SUPERVISOR` linked to `idCompany`.
- Sets `requiresPasswordChange = true` — the supervisor must change their password on first login.

**Reglas de Seguridad / Multi-Tenant:**
- Requires ADMIN role in the JWT.

**Variables:** none

**Request Body:**
```json
{
  "username": "carlos_ruiz",
  "password": "temp1234",
  "email": "carlos@mine.com",
  "fullName": "Carlos Ruiz",
  "idCompany": 1,
  "corporateId": "SUP-002"
}
```

**Response `201 Created`:**
```json
{
  "id": 4,
  "fullName": "Carlos Ruiz",
  "corporateId": "SUP-002",
  "email": "carlos@mine.com",
  "accessStatus": "active"
}
```

---

### `PUT /api/v1/supervisors/{supervisorId}` 🔒

**Propósito:** Replace the full profile of an existing supervisor (name, email, corporate ID, status).

**Reglas de Negocio:**
- Full replacement (PUT) — all editable fields must be supplied.
- Password changes go through `PATCH /api/v1/users/me/password`, not this endpoint.

**Reglas de Seguridad / Multi-Tenant:**
- The supervisor must belong to the authenticated company.

**Variables:**
- `{supervisorId}` — numeric ID of the supervisor to update

**Request Body:**
```json
{
  "username": "carlos_ruiz",
  "password": "temp1234",
  "fullName": "Carlos Ruiz Mamani",
  "corporateId": "SUP-002",
  "email": "carlos@mine.com",
  "idCompany": 1,
  "accessStatus": "active"
}
```

**Response `200 OK`:** same schema as `POST /api/v1/supervisors` response.

---

## 2. Module Assets — Fleet & Personnel

> Manages the company's physical and human assets: Drivers, Vehicles, and Trips.
> A **Trip** is the binding event (check-in) that assigns a Driver to a Vehicle for an active shift.
> It is the parent resource for Alerts and CardiacReadings generated during that shift.
> All endpoints are tenant-isolated via `companyId` from the JWT.

---

### `GET /api/v1/drivers` 🔒

**Propósito:** List all drivers belonging to the authenticated company.
Supports an optional `view` query parameter to switch between payload shapes.

**Reglas de Negocio:**
- Returns all drivers regardless of shift status.
- `view=directory` uses the same data formatted for the supervisor directory panel
  (formerly the separate `/driversDirectory` endpoint, now consolidated here).

**Reglas de Seguridad / Multi-Tenant:**
- Filtered strictly by `companyId` from the JWT.

**Variables:**
- `?view=directory` — *(optional)* directory-format payload

**Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 7,
    "fullName": "Pedro Mamani",
    "operatorId": "OP-0023",
    "license": "LIC-4521",
    "specialty": "Heavy Machinery",
    "shiftStatus": "active",
    "lastAccess": "2025-06-19T07:00:00"
  }
]
```

> `shiftStatus` values: `"active"` | `"inactive"` | `"on_leave"`

---

### `GET /api/v1/drivers/{driverId}` 🔒

**Propósito:** Retrieve the full profile of a single driver.

**Reglas de Seguridad / Multi-Tenant:**
- Returns `404` if the driver does not exist or belongs to another company.

**Variables:**
- `{driverId}` — numeric driver ID

**Request Body:** none

**Response `200 OK`:** single object — same schema as the list item above.

---

### `POST /api/v1/drivers` 🔒

**Propósito:** Register a new driver. Internally creates a linked IAM User with role `DRIVER`
and generates a `workerId` (format `CDT-{companyId}-{seq}`) used for mobile login.

**Reglas de Negocio:**
- `workerId` is auto-generated sequentially per company — it cannot be supplied by the client.
- The driver's login credentials are sent to `email` via Brevo SMTP.

**Reglas de Seguridad / Multi-Tenant:**
- `idCompany` must match the JWT `companyId`.

**Variables:** none

**Request Body:**
```json
{
  "username": "pedro_mamani",
  "password": "temp1234",
  "email": "pedro@mine.com",
  "fullName": "Pedro Mamani",
  "idCompany": 1,
  "licenseNumber": "LIC-4521",
  "workShift": "MORNING"
}
```

> `workShift` values: `"MORNING"` | `"AFTERNOON"` | `"NIGHT"`

**Response `201 Created`:** same schema as `GET /api/v1/drivers/{driverId}` response.

---

### `PUT /api/v1/drivers/{driverId}` 🔒

**Propósito:** Replace the full profile of an existing driver.

**Reglas de Seguridad / Multi-Tenant:**
- The driver must belong to the authenticated company.

**Variables:**
- `{driverId}` — numeric driver ID to update

**Request Body:** same schema as `POST /api/v1/drivers`.

**Response `200 OK`:** same schema as `GET /api/v1/drivers/{driverId}` response.

---

### `GET /api/v1/vehicles` 🔒

**Propósito:** List all vehicles in the company fleet.
Supports an optional `view` parameter to switch between the mobile compact payload
and the web admin inventory payload.

**Reglas de Negocio:**
- Without `view`: returns the compact mobile payload (formerly `/vehicles`).
- `view=inventory`: returns the enriched admin payload (formerly `/vehiclesInventory`).

**Reglas de Seguridad / Multi-Tenant:**
- Filtered strictly by `companyId` from the JWT.

**Variables:**
- `?view=inventory` — *(optional)* returns the full admin inventory payload

**Request Body:** none

**Response `200 OK` (default — mobile):**
```json
[
  {
    "id": "12",
    "name": "CAT 793F",
    "category": "DUMP_TRUCK",
    "status": "available"
  }
]
```

**Response `200 OK` (`?view=inventory`):**
```json
[
  {
    "id": 12,
    "code": "VH-0012",
    "model": "CAT 793F",
    "category": "DUMP_TRUCK",
    "status": "in_use",
    "assignedDriverName": "Pedro Mamani",
    "shiftLabel": "MORNING"
  }
]
```

> `status` values: `"available"` | `"in_use"` | `"maintenance"`

---

### `POST /api/v1/vehicles` 🔒

**Propósito:** Register a new vehicle in the fleet.
The vehicle is immediately available for driver check-in.

**Reglas de Negocio:**
- `code` must be unique within the company.

**Reglas de Seguridad / Multi-Tenant:**
- `companyId` is set automatically from the JWT — never from the request body.

**Variables:** none

**Request Body:**
```json
{
  "code": "VH-0013",
  "model": "Komatsu 930E",
  "category": "DUMP_TRUCK",
  "status": "available",
  "assignedDriverName": null,
  "shiftLabel": null
}
```

**Response `201 Created`:** same schema as `GET /api/v1/vehicles?view=inventory` item.

---

### `PUT /api/v1/vehicles/{vehicleId}` 🔒

**Propósito:** Replace the full record of an existing vehicle.

**Reglas de Seguridad / Multi-Tenant:**
- The vehicle must belong to the authenticated company.

**Variables:**
- `{vehicleId}` — numeric vehicle ID to update

**Request Body:** same schema as `POST /api/v1/vehicles`.

**Response `200 OK`:** same schema as `POST /api/v1/vehicles` response.

---

### `POST /api/v1/vehicles/{vehicleId}/trips` 🔒

**Propósito:** Start a new trip — the **driver check-in** action.
Creates a Trip with status `IN_PROGRESS` binding the specified driver to the vehicle.

**Reglas de Negocio:**
- The Vehicle must exist and belong to the authenticated company.
- The Driver must exist and belong to the same company.
- `companyId` on the Trip is set from the JWT — never from the request body.
- The Trip ID returned here is used as `{tripId}` in:
  - `GET /api/v1/trips/{tripId}/alerts`
  - `GET /api/v1/trips/{tripId}/cardiac-readings`

**Reglas de Seguridad / Multi-Tenant:**
- Returns `404` if the vehicle or driver does not belong to the authenticated company.

**Variables:**
- `{vehicleId}` — numeric ID of the vehicle being checked into

**Request Body:**
```json
{
  "driverId": 7
}
```

**Response `201 Created`:**
```json
{
  "id": 55,
  "driverId": 7,
  "vehicleId": 12,
  "startTime": "2025-06-19T07:15:00",
  "endTime": null,
  "status": "in_progress"
}
```

> **Flutter check-in flow:** `driverId` comes directly from the `POST /api/v1/sessions/mobile` response. No additional lookup required.

---

### `GET /api/v1/catalog/summary` 🔒

**Propósito:** Retrieve aggregated asset counts for the company catalog header widget.

**Reglas de Negocio:**
- Returns a single-element array for frontend widget contract compatibility.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "driversTotal": 24,
    "driversInactive": 3,
    "vehiclesTotal": 18,
    "vehiclesMaintenance": 2,
    "supervisorsTotal": 5,
    "supervisorsLocked": 0
  }
]
```

---

## 3. Module Monitoring — Safety & Real-Time

> Handles real-time safety data: Alerts, CardiacReadings, LivePositions, Fleet status, and IoT ingestion.
> Alerts are generated automatically by the monitoring engine when a sensor reading crosses a
> configured threshold during an active Trip.
> The Trip is the common parent: Alerts belong to a Trip, CardiacReadings belong to a Trip.

---

### `GET /api/v1/alerts` 🔒

**Propósito:** List alerts for the authenticated company.
Without `view`, returns only non-resolved alerts (mobile supervisor feed).
With `view=operational`, returns all alerts with full enrichment (web panel).

**Reglas de Negocio:**
- Alerts are enriched at query time: `driverName`, `vehicleCode`, and `vehicleClassKey` are resolved
  by joining `Alert → Trip → Driver` and `Alert → Trip → Vehicle`.
- `description` is backfilled from the linked Incident record if blank on the Alert.
- **Default** (no `view`): excludes `RESOLVED` status — suitable for mobile feed.
- **`view=operational`**: all statuses included — suitable for the web operational panel.

**Reglas de Seguridad / Multi-Tenant:**
- `companyId` from JWT is used for `alertRepository.findAllByCompanyId(companyId)`.
- A missing `companyId` in the token returns an empty list.

**Variables:**
- `?view=operational` — *(optional)* returns full `AlertResource` (all statuses)

**Request Body:** none

**Response `200 OK` (default — mobile `MobileAlertResource`):**
```json
[
  {
    "id": "88",
    "kind": "fatigue_risk",
    "title": "Fatigue Risk",
    "description": "Driver showing signs of fatigue after 6h shift.",
    "elapsedLabel": "12 min ago",
    "primaryAction": "REVIEW"
  }
]
```

> `primaryAction` is nullable (`null` if no action is available).

**Response `200 OK` (`?view=operational` — `AlertResource`):**
```json
[
  {
    "id": 88,
    "code": "AL-088",
    "type": "fatigue_risk",
    "priority": "high",
    "status": "open",
    "occurredAt": "2025-06-19T13:45:00",
    "title": "Fatigue Risk",
    "description": "Driver showing signs of fatigue after 6h shift.",
    "vehicleClassKey": "dump_truck",
    "vehicleCode": "VH-0012",
    "driverName": "Pedro Mamani",
    "resolutionNotes": null
  }
]
```

> `type` values: `"proximity_collision"` | `"restricted_zone_entry"` | `"high_heart_rate"` | `"fatigue_risk"` | `"connection_lost"`
> `priority` values: `"low"` | `"medium"` | `"high"` | `"critical"`
> `status` values: `"open"` | `"reviewed"` | `"resolved"`

---

### `GET /api/v1/alerts/{alertId}` 🔒

**Propósito:** Retrieve the full detail of a single alert, including all enriched fields.

**Reglas de Negocio:**
- Same enrichment logic as the collection endpoint.

**Reglas de Seguridad / Multi-Tenant:**
- `alert.companyId` must match the JWT `companyId`. Returns `404` otherwise.

**Variables:**
- `{alertId}` — numeric alert ID

**Request Body:** none

**Response `200 OK`:** single `AlertResource` — same schema as `?view=operational` item above.

---

### `GET /api/v1/alerts/{alertId}/history` 🔒

**Propósito:** Retrieve the ordered audit trail of all supervisor actions taken on a specific alert.

**Reglas de Negocio:**
- History is sourced from `AuditLogEntry` records filtered by `alertId` embedded in `descriptionParamsJson`.
- Returns an empty array if no actions have been taken yet.

**Variables:**
- `{alertId}` — numeric alert ID

**Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "action": "markReviewed",
    "performedBy": "supervisor01",
    "timestamp": "2025-06-19T14:02:00"
  }
]
```

---

### `POST /api/v1/alerts/{alertId}/actions` 🔒

**Propósito:** Register a supervisor action on an alert.
Consolidates the former `/action` (verb) and `/mark-reviewed` (verb) into a single
noun-based sub-resource (`actions`).

**Reglas de Negocio:**
- Sending an empty body defaults to `markReviewed`.
- Supported `action` values: `markReviewed`, `escalate`, `resolve`.
- The action is persisted to the Audit Log.

**Reglas de Seguridad / Multi-Tenant:**
- The alert must belong to the authenticated company.

**Variables:**
- `{alertId}` — numeric alert ID

**Request Body:**
```json
{
  "action": "markReviewed"
}
```

> Body is optional. Empty body = `markReviewed`.

**Response `200 OK`:** updated `AlertResource` — same schema as `GET /api/v1/alerts/{alertId}`.

---

### `PUT /api/v1/alerts/{alertId}` 🔒

**Propósito:** Replace editable alert fields (web panel reclassification and notes).

**Reglas de Negocio:**
- Full replacement (PUT) — all fields must be supplied.
- Used by supervisors to manually update status, priority, classification, and resolution notes.

**Reglas de Seguridad / Multi-Tenant:**
- The alert must belong to the authenticated company.

**Variables:**
- `{alertId}` — numeric alert ID

**Request Body:**
```json
{
  "code": "AL-088",
  "type": "fatigue_risk",
  "priority": "high",
  "status": "resolved",
  "occurredAt": "2025-06-19T13:45:00",
  "title": "Fatigue Risk",
  "description": "Confirmed fatigue episode.",
  "vehicleClassKey": "dump_truck",
  "vehicleCode": "VH-0012",
  "driverName": "Pedro Mamani",
  "resolutionNotes": "Driver rested. Cleared to resume."
}
```

**Response `200 OK`:** updated `AlertResource`.

---

### `GET /api/v1/trips/{tripId}/cardiac-readings` 🔒

**Propósito:** Retrieve the latest heart-rate reading per driver for the specified active trip.

**Reglas de Negocio:**
- **Full resolution chain:** `tripId` → `Vehicle` (via Trip) → `Sensor` mounted on Vehicle
  (type: smart-band) → `SensorReading` (type: `heart_rate`) → latest reading per driver.
- Only the most recent reading per driver is returned.
- **Status classification:**
  - `normal` — BPM < 110
  - `warning` — BPM 110–139
  - `critical` — BPM ≥ 140 (may auto-trigger a `high_heart_rate` Alert)
- Readings are sorted by `heartRate` descending (highest risk first).

**Reglas de Seguridad / Multi-Tenant:**
- Only Sensors on vehicles belonging to the authenticated company are included.
- Cross-tenant readings are blocked at `CardiacReadingQueryServiceImpl`.

**Variables:**
- `{tripId}` — numeric trip ID (from `POST /api/v1/vehicles/{vehicleId}/trips` response)

**Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 201,
    "driverName": "Pedro Mamani",
    "vehicleCode": "VH-0012",
    "heartRate": 125,
    "status": "warning"
  }
]
```

---

### `GET /api/v1/vehicles/live-positions` 🔒

**Propósito:** Retrieve the current GPS position snapshot for all fleet vehicles.
Used by the real-time map panel in the supervisor web app.

**Reglas de Negocio:**
- Vehicles with no recent GPS report may be absent from the list.

**Reglas de Seguridad / Multi-Tenant:**
- `LiveMapVehicle` records do not carry `companyId` directly. Isolation is enforced by matching
  `vehicleCode` against the authenticated company's vehicle registry in `LiveMapVehicleQueryServiceImpl`.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 12,
    "code": "VH-0012",
    "vehicleType": "dump_truck",
    "latitude": -16.5000,
    "longitude": -68.1500,
    "status": "in_transit",
    "driverName": "Pedro Mamani"
  }
]
```

---

### `GET /api/v1/fleet/summary` 🔒

**Propósito:** Retrieve an aggregated operational snapshot of the entire fleet.
Used as a dashboard header widget.

**Reglas de Negocio:**
- Returns a single-element array for frontend widget contract compatibility.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "operational": 14,
    "maintenance": 2,
    "alert": 2,
    "total": 18,
    "operationalPercent": 78
  }
]
```

---

### `GET /api/v1/audit-logs` 🔒

**Propósito:** Retrieve the full audit log for the authenticated company,
ordered by occurrence time descending.

**Reglas de Negocio:**
- Response is wrapped in `{ entries: [...] }` envelope to allow future pagination extension.
- `titleKey` and `descriptionKey` are i18n keys — the frontend resolves them to human-readable strings using `descriptionParams`.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
{
  "entries": [
    {
      "id": 301,
      "category": "administrative",
      "occurredAt": "2025-06-19T14:02:00",
      "titleKey": "monitoring.audit.entries.noticeResent.title",
      "descriptionKey": "monitoring.audit.entries.noticeResent.description",
      "descriptionParams": { "noticeId": 5 },
      "actorKey": "monitoring.audit.actors.adminGlobal"
    }
  ]
}
```

---

### `POST /api/v1/iot/telemetry` *(X-API-Key)* — **Canonical IoT ingestion endpoint**

**Propósito:** Unified telemetry ingestion for all edge computing devices deployed in the mine.
Accepts a single enriched payload that may contain heart-rate, GPS, proximity, and collision
data in one request — reducing radio bandwidth vs. the legacy per-sensor paths.

**Reglas de Negocio:**
The orchestrator executes the following actions based on the fields present in the payload:

1. **Sensor resolution** — `device_id` is resolved to `vehicleId`, `tripId`, and `companyId`
   (multi-tenant isolation is preserved). Returns `404` if the device is not registered.
2. **Cardiac health** — if `bpm > 0`, persists a heart-rate `SensorReading`. BPM ≥ 140 may
   automatically trigger a `high_heart_rate` Alert linked to the active Trip.
3. **GPS location** — if `lat` and `lng` are present, updates the live-map vehicle marker
   (feeds `GET /api/v1/vehicles/live-positions`).
4. **Proximity / collision alert** — if `collision == true` OR `distance_cm ≤ 40`, raises a
   CRITICAL `proximity_collision` Alert linked to the active Trip.

The `processed` field in the response lists which actions were executed (`cardiac`, `location`,
`alert`) so the edge device can log them locally.

**Reglas de Seguridad / Multi-Tenant:**
- Authenticated by `X-API-Key` request header (machine-to-machine). **No JWT accepted** on
  `/api/v1/iot/**` routes. The key must match `${EDGE_DEFAULT_API_KEY}` configured server-side.
- `companyId` is resolved from the device record — no client-supplied tenant hint.

**Variables:** none

**Request Headers:**
```
X-API-Key: <edge-device-api-key>
```

**Request Body** (all fields snake_case — edge service wire convention):
```json
{
  "device_id": "SB-2041",
  "bpm": 128.5,
  "distance_cm": 35,
  "collision": false,
  "lat": -16.5000,
  "lng": -68.1500,
  "timestamp": "2025-06-19T14:00:00"
}
```

> Field rules:
> - **`device_id`** — required. Must match a registered sensor.
> - `bpm` — `0` means not present (no cardiac reading will be persisted).
> - `distance_cm` — `null` means not present (no proximity check).
> - `collision` — defaults to `false`; set `true` on physical impact event.
> - `lat` / `lng` — `null` means GPS not available this tick.
> - `timestamp` — ISO-8601; `null` → server time is used.

**Response `201 Created`:**
```json
{
  "device_id": "SB-2041",
  "processed": "cardiac,location",
  "alert_raised": false,
  "message": "Telemetry ingested successfully"
}
```

> `processed` is a comma-separated list of actions executed: `cardiac`, `location`, `alert`.
> `alert_raised` is `true` when a proximity or collision alert was triggered.

---

### `POST /api/v1/health-monitoring/data-records` *(X-API-Key)* — ⚠️ DEPRECATED

> **Deprecated since v2.0 — will be removed in the next major release.**
> Use `POST /api/v1/iot/telemetry` instead.

**Propósito:** Legacy single-sensor heart-rate ingestion from smart-band IoT devices.
Only persists BPM — does not support GPS, proximity, or collision events.

**Reglas de Negocio:**
- `device_id` is mapped to a `Sensor` record to determine Vehicle and Driver ownership.
- BPM ≥ 140 (critical threshold) may automatically create a `high_heart_rate` Alert
  linked to the active Trip of that Vehicle.
- Wire contract uses **snake_case** field names (edge service convention — differs from other endpoints).

**Reglas de Seguridad / Multi-Tenant:**
- Authenticated by `X-API-Key` request header (device-level auth), **not** by JWT.

**Variables:** none

**Request Headers:**
```
X-API-Key: <device-api-key>
```

**Request Body:**
```json
{
  "device_id": "SB-2041",
  "bpm": 128.5,
  "created_at": "2025-06-19T14:00:00"
}
```

**Response `201 Created`:**
```json
{
  "id": 8842,
  "device_id": "SB-2041",
  "bpm": 128.5,
  "created_at": "2025-06-19T14:00:00"
}
```

---

## 4. Module Analytics — Dashboard & Reporting

> Provides pre-computed analytical projections and report generation.
> **Dashboard** sub-resources are lightweight real-time views of the current state.
> **Analytics** sub-resources process longer historical time windows.
> **Reports** are persisted documents generated from resolved incidents.
> All endpoints are tenant-isolated via `companyId` from the JWT.

---

### `GET /api/v1/dashboard/summary` 🔒

**Propósito:** Retrieve the main KPI counters for the supervisor dashboard header widget.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "activeSensors": 18,
    "totalSensors": 20,
    "criticalAlerts": 2,
    "fatigueEvents": 5,
    "activeVehicles": 14,
    "totalDrivers": 24
  }
]
```

---

### `GET /api/v1/dashboard/trend` 🔒

**Propósito:** Retrieve time-series alert and incident counts for the trend chart widget.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "hour": "08:00",
    "alerts": 3,
    "incidents": 1
  }
]
```

---

### `GET /api/v1/dashboard/recent-alerts` 🔒

**Propósito:** Retrieve the short pre-aggregated list of most recent alerts for the live feed widget.

> **Note:** This is a pre-computed projection widget — NOT the full alert collection.
> For full alerts with filtering and actions, use `GET /api/v1/alerts`.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 88,
    "alertCode": "AL-088",
    "severity": "high",
    "category": "fatigue_risk",
    "driverName": "Pedro Mamani",
    "vehicleCode": "VH-0012",
    "vehicleType": "dump_truck",
    "route": "Zone B - Level 3",
    "time": "12 min ago",
    "status": "open"
  }
]
```

---

### `GET /api/v1/dashboard/risk-drivers` 🔒

**Propósito:** Retrieve the ranked list of highest-risk drivers for the dashboard widget.

**Reglas de Negocio:**
- Risk score is composite: fatigue alerts + heart rate deviation + proximity incidents.
- Pre-sorted by `riskScore` descending.
- For per-driver performance breakdown, use `GET /api/v1/drivers/{driverId}/performance`.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "driverId": 7,
    "driverName": "Pedro Mamani",
    "vehicleType": "dump_truck",
    "riskScore": 78.4
  }
]
```

---

### `GET /api/v1/admin/summary` 🔒

**Propósito:** Retrieve global platform counters for the admin panel.

**Reglas de Seguridad / Multi-Tenant:**
- Requires ADMIN or GLOBAL_ADMIN role. **NOT tenant-scoped** — aggregates across all companies.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "activeSensors": 142,
    "totalSensors": 160,
    "lockedAccounts": 7,
    "registeredAssets": 98
  }
]
```

---

### `GET /api/v1/admin/notices` 🔒

**Propósito:** Retrieve all administrative notices for the platform admin panel.
Response wrapped in `{ notices: [...] }` envelope.

**Reglas de Seguridad / Multi-Tenant:**
- Requires ADMIN or GLOBAL_ADMIN role.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
{
  "notices": [
    {
      "id": 5,
      "level": "warning",
      "i18nKey": "admin.notices.subscriptionExpiring",
      "i18nParams": { "companyName": "MineCorp SA", "daysLeft": 7 },
      "actionKey": "admin.notices.actions.renewSubscription"
    }
  ]
}
```

---

### `POST /api/v1/admin/notices/{noticeId}/dispatches` 🔒

**Propósito:** Re-send a notice to its original recipients by creating a dispatch record.
Models the re-send as creating a `dispatch` sub-resource (noun) instead of a `resend` verb.

**Reglas de Negocio:**
- Creates an audit log entry with event type `administrative` and `noticeId` in the params.
- Returns `200` with empty body on success.

**Reglas de Seguridad / Multi-Tenant:**
- Requires ADMIN or GLOBAL_ADMIN role.

**Variables:**
- `{noticeId}` — numeric notice ID to re-send

**Request Body:** none

**Response `200 OK`:** empty body

---

### `GET /api/v1/analytics/fatigue-levels` 🔒

**Propósito:** Retrieve per-driver fatigue level bars for the analytics distribution chart.

**Reglas de Negocio:**
- Each bar represents one driver's aggregated fatigue event count, sourced from Alerts of type
  `fatigue_risk` and `high_heart_rate` linked to that driver's Trips.
- `width` is a pre-computed percentage (0–100) for direct CSS bar rendering.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "driverId": 7,
    "driverName": "Pedro Mamani",
    "fatigueEvents": 8,
    "width": 80
  }
]
```

---

### `GET /api/v1/analytics/history` 🔒

**Propósito:** Retrieve the paginated history table of analyzed shifts and incidents.

**Reglas de Negocio:**
- Each row covers one evaluated event: driver, vehicle, alert/incident metadata, and risk classification.
- The former endpoint name `analyticsHistoryRows` exposed an implementation detail (`Rows`).
  The canonical resource name is `history`.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "date": "2025-06-19",
    "time": "07:15",
    "criticality": "HIGH",
    "criticalityLabel": "Critical",
    "incidentType": "fatigue_risk",
    "involved": "Pedro Mamani / VH-0012",
    "location": "Zone B - Level 3"
  }
]
```

---

### `GET /api/v1/analytics/incident-distribution` 🔒

**Propósito:** Retrieve incident type breakdown for the pie/donut chart in the analytics panel.

**Reglas de Negocio:**
- Data sourced from the Incident aggregate, filtered to the authenticated company's trips.
- `percent` is relative to the total incident count.
- `className` is a CSS class key for frontend chart coloring.

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "label": "Fatigue Risk",
    "count": 12,
    "percent": 40,
    "className": "fatigue_risk"
  }
]
```

---

### `GET /api/v1/analytics/insights` 🔒

**Propósito:** Retrieve pre-computed natural-language analytical insights.
Refreshed periodically by the analytics projection engine (not real-time).

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Fatigue spike detected",
    "description": "Driver CDT-1-003 has 3× more fatigue alerts than average this week.",
    "className": "warning"
  }
]
```

---

### `GET /api/v1/drivers/{driverId}/performance` 🔒

**Propósito:** Retrieve the aggregated performance summary for a driver (mobile profile screen).
Replaces the former `/performance/{workerId}` endpoint, now anchored to the driver's numeric ID.

**Reglas de Negocio:**
- Computed from all `PerformanceMetric` records linked to this `driverId`.
- `safetyScore` = `max(0, min(100, round(100 − avgRiskScore)))`.
- `fatigueAlerts` = sum of `fatigueEvents` across all the driver's metric records.

**Reglas de Seguridad / Multi-Tenant:**
- Only metrics whose `driverId` belongs to the authenticated company are included,
  enforced at `PerformanceMetricQueryServiceImpl`.

**Variables:**
- `{driverId}` — numeric driver ID

**Request Body:** none

**Response `200 OK`:**
```json
{
  "safetyScore": 82,
  "safetyScoreDelta": 2,
  "fatigueAlerts": 3,
  "drivingHours": 3.5,
  "drivingHoursLimit": 8.0
}
```

---

### `GET /api/v1/drivers/{driverId}/performance-metrics` 🔒

**Propósito:** Retrieve the full list of raw `PerformanceMetric` records for a driver.
Used by the admin analytics table for per-trip performance breakdowns.

**Reglas de Seguridad / Multi-Tenant:**
- Same tenant filter as the summary endpoint above.

**Variables:**
- `{driverId}` — numeric driver ID

**Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 10,
    "id_driver": 7,
    "id_trip": 55,
    "id_vehicle": 12,
    "fatigue_events": 2,
    "alerts_count": 3,
    "average_heart_rate": 98.5,
    "risk_score": 18.2,
    "calculated_at": "2025-06-19T15:00:00"
  }
]
```

> Note: this endpoint uses `snake_case` JSON keys (matching the database column naming convention
> via `@JsonProperty` annotations in `PerformanceMetricResource`).

---

### `GET /api/v1/reports` 🔒

**Propósito:** List all reports belonging to the authenticated company (summary view).

**Variables:** none | **Request Body:** none

**Response `200 OK`:**
```json
[
  {
    "id": 20,
    "id_incident": 5,
    "id_alert": 88,
    "id_user": 3,
    "id_metric": 10,
    "report_type": "INCIDENT",
    "created_at": "2025-06-19T16:00:00",
    "description": "Fatigue incident confirmed and resolved."
  }
]
```

---

### `GET /api/v1/reports/{reportId}` 🔒

**Propósito:** Retrieve a single report as **JSON detail** (default) or as a **PDF binary**
(`?format=pdf`). The representation is controlled by a query parameter — format is a
representation concern, not a separate resource.

**Reglas de Negocio:**
- **Without `?format`**: returns full JSON with nested `incident`, `alert`, and `performanceMetric` objects.
- **`?format=pdf`**: returns a binary PDF.
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=mineguard-report-{reportId}.pdf`
  - PDF contains: Report ID, type, creation date, and description (generated inline — no external service).

**Reglas de Seguridad / Multi-Tenant:**
- The report must belong to the authenticated company.

**Variables:**
- `{reportId}` — numeric report ID
- `?format=pdf` — *(optional)* triggers PDF binary response instead of JSON

**Request Body:** none

**Response `200 OK` (default — JSON detail):**
```json
{
  "id": 20,
  "incidentId": 5,
  "alertId": 88,
  "userId": 3,
  "metricId": 10,
  "reportType": "INCIDENT",
  "createdAt": "2025-06-19T16:00:00",
  "description": "Fatigue incident confirmed and resolved.",
  "incident": { },
  "alert": { },
  "performanceMetric": { }
}
```

**Response `200 OK` (`?format=pdf`):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=mineguard-report-20.pdf

<binary PDF content>
```

---

## 5. Module Subscriptions — Company Registration

> Handles B2B self-registration on the MineGuard landing page.
> Creating a subscription **IS** the company registration — a single atomic operation that
> provisions the tenant, the admin account, and activates the subscription plan.

---

### `POST /api/v1/subscriptions` 🔓

**Propósito:** Register a new mining company as a MineGuard tenant.

**Reglas de Negocio:**
- Atomically performs four operations in one call:
  1. Creates the Company record (the tenant).
  2. Creates an administrator User with role `ADMIN` linked to the new company.
  3. Generates a temporary password and sends it to `adminEmail` via Brevo SMTP.
  4. Activates the subscription.
- After this call, the admin logs in at `POST /api/v1/sessions` and can immediately
  add supervisors (`POST /api/v1/supervisors`) and drivers (`POST /api/v1/drivers`).

**Reglas de Seguridad / Multi-Tenant:**
- No JWT required (PUBLIC — entry point for new customers).
- Returns `409 Conflict` if a company with the same email or name already exists.

**Variables:** none

**Request Body:**
```json
{
  "companyName": "MineCorp SA",
  "adminFullName": "Roberto Quispe",
  "adminEmail": "admin@minecorp.com"
}
```

**Response `201 Created`:**
```json
"Company registered successfully. Credentials sent to admin@minecorp.com."
```

---

## Error Responses

All error responses follow a consistent envelope:

```json
{
  "timestamp": "2025-06-19T14:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Driver with id 99 not found or does not belong to this tenant"
}
```

| HTTP Status | When used |
|-------------|-----------|
| `200 OK` | Successful read or action |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Validation failure, malformed body, or business rule violation |
| `401 Unauthorized` | Missing, expired, or invalid JWT (or X-API-Key for IoT endpoint) |
| `403 Forbidden` | Valid JWT but insufficient role (e.g. non-ADMIN calling admin endpoints) |
| `404 Not Found` | Resource not found, or cross-tenant access attempt |
| `409 Conflict` | Duplicate unique constraint (username, email, vehicle code, company name) |
| `500 Internal Server Error` | Unhandled server-side exception |

---

## Appendix — Endpoint Index

| Method | Path | Auth | Module |
|--------|------|------|--------|
| POST | `/api/v1/sessions` | 🔓 | IAM |
| POST | `/api/v1/sessions/mobile` | 🔓 | IAM |
| POST | `/api/v1/users` | 🔓 | IAM |
| POST | `/api/v1/users/password-resets` | 🔓 | IAM |
| PATCH | `/api/v1/users/me/password` | 🔒 | IAM |
| GET | `/api/v1/supervisors` | 🔒 | IAM |
| POST | `/api/v1/supervisors` | 🔒 | IAM |
| PUT | `/api/v1/supervisors/{supervisorId}` | 🔒 | IAM |
| GET | `/api/v1/drivers` | 🔒 | Assets |
| GET | `/api/v1/drivers/{driverId}` | 🔒 | Assets |
| POST | `/api/v1/drivers` | 🔒 | Assets |
| PUT | `/api/v1/drivers/{driverId}` | 🔒 | Assets |
| GET | `/api/v1/vehicles` | 🔒 | Assets |
| POST | `/api/v1/vehicles` | 🔒 | Assets |
| PUT | `/api/v1/vehicles/{vehicleId}` | 🔒 | Assets |
| POST | `/api/v1/vehicles/{vehicleId}/trips` | 🔒 | Assets |
| GET | `/api/v1/catalog/summary` | 🔒 | Assets |
| GET | `/api/v1/alerts` | 🔒 | Monitoring |
| GET | `/api/v1/alerts/{alertId}` | 🔒 | Monitoring |
| GET | `/api/v1/alerts/{alertId}/history` | 🔒 | Monitoring |
| POST | `/api/v1/alerts/{alertId}/actions` | 🔒 | Monitoring |
| PUT | `/api/v1/alerts/{alertId}` | 🔒 | Monitoring |
| GET | `/api/v1/trips/{tripId}/cardiac-readings` | 🔒 | Monitoring |
| GET | `/api/v1/vehicles/live-positions` | 🔒 | Monitoring |
| GET | `/api/v1/fleet/summary` | 🔒 | Monitoring |
| GET | `/api/v1/audit-logs` | 🔒 | Monitoring |
| POST | `/api/v1/iot/telemetry` | X-API-Key | Monitoring |
| POST | `/api/v1/health-monitoring/data-records` *(deprecated)* | X-API-Key | Monitoring |
| GET | `/api/v1/dashboard/summary` | 🔒 | Analytics |
| GET | `/api/v1/dashboard/trend` | 🔒 | Analytics |
| GET | `/api/v1/dashboard/recent-alerts` | 🔒 | Analytics |
| GET | `/api/v1/dashboard/risk-drivers` | 🔒 | Analytics |
| GET | `/api/v1/admin/summary` | 🔒 | Analytics |
| GET | `/api/v1/admin/notices` | 🔒 | Analytics |
| POST | `/api/v1/admin/notices/{noticeId}/dispatches` | 🔒 | Analytics |
| GET | `/api/v1/analytics/fatigue-levels` | 🔒 | Analytics |
| GET | `/api/v1/analytics/history` | 🔒 | Analytics |
| GET | `/api/v1/analytics/incident-distribution` | 🔒 | Analytics |
| GET | `/api/v1/analytics/insights` | 🔒 | Analytics |
| GET | `/api/v1/drivers/{driverId}/performance` | 🔒 | Analytics |
| GET | `/api/v1/drivers/{driverId}/performance-metrics` | 🔒 | Analytics |
| GET | `/api/v1/reports` | 🔒 | Analytics |
| GET | `/api/v1/reports/{reportId}` | 🔒 | Analytics |
| POST | `/api/v1/subscriptions` | 🔓 | Subscriptions |

---

*Document generated from source code — MineGuard Platform v2.0*
*Last updated: 2026-06-19 — added `POST /api/v1/iot/telemetry` (unified IoT ingestion); deprecated `POST /api/v1/health-monitoring/data-records`*
