import { Shift } from './shift.entity';
import { RouteWaypoint } from './route-waypoint.value-object';
import { RouteStatus } from './route-status';

export class Route {
  constructor(
    public readonly id: string,
    public name: string,
    public status: RouteStatus,
    public waypoints: RouteWaypoint[],
    public assignedVehicleIds: string[],
    public shift: Shift,
    public createdAt: Date,
  ) {}

  get waypointCoords(): [number, number][] {
    return this.waypoints.map((w) => [w.latitude, w.longitude]);
  }

  isActive(): boolean {
    return this.status === 'active';
  }
}
