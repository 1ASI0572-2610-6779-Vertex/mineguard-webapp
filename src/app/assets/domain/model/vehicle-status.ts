/**
 * All operational statuses a vehicle can have, as returned by GET /api/v1/vehicles?view=inventory.
 * Values match the API v2 contract (all lowercase).
 *
 * @remarks
 * Only `operational` allows a driver check-in — every other status makes
 * `POST /vehicles/{vehicleId}/driving-sessions` fail with `409 Conflict`.
 */
export type VehicleStatus =
  | 'operational'
  | 'in_transit'
  | 'maintenance'
  | 'alert'
  | 'inactive'
  | 'restricted_route';
