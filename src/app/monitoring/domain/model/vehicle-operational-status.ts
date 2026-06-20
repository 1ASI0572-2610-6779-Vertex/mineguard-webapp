/**
 * Aggregated operational status of a vehicle as seen on the live map,
 * with three buckets shown in the "Estado General de la Flota" widget.
 */
export type VehicleOperationalStatus = 'in_transit' | 'maintenance' | 'alert';
