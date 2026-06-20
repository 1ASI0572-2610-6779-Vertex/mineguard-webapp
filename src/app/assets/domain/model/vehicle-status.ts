/**
 * All operational statuses a vehicle can have, as returned by GET /api/v1/vehicles?view=inventory.
 * Values match the API v2 contract (all lowercase).
 */
export type VehicleStatus = 'available' | 'in_use' | 'maintenance';
