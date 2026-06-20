/**
 * Shift status a driver can be in, as returned by GET /api/v1/drivers.
 * Values match the API v2 contract (all lowercase).
 */
export type DriverShiftStatus = 'active' | 'inactive' | 'on_leave';
