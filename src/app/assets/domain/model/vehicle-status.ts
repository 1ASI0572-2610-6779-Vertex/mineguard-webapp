/**
 * All operational statuses a vehicle can have, as defined by GET /vehiclesInventory.
 */
export type VehicleStatus =
  | 'operational'
  | 'maintenance'
  | 'alert'
  | 'inactive'
  | 'restricted_route';
