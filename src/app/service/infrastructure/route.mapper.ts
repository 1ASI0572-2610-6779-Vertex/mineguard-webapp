
import { RouteResponse } from './route-response.interface';
import { RouteStatus } from '../domain/model/route-status';
import { RouteWaypoint } from '../domain/model/route-waypoint.value-object';
import { Route } from '../domain/model/route.entity';
import { Shift } from '../domain/model/shift.entity';

export class RouteMapper {
  static toDomain(raw: RouteResponse, shifts: Shift[]): Route {
    const shift = shifts.find((s) => s.id === raw.shiftId) ?? shifts[0];
    const waypoints = [...raw.waypoints]
      .sort((a, b) => a.order - b.order)
      .map((w) => new RouteWaypoint(w.latitude, w.longitude, w.label, w.order));

    return new Route(
      raw.id,
      raw.name,
      raw.status as RouteStatus,
      waypoints,
      raw.assignedVehicleIds,
      shift,
      new Date(raw.createdAt),
    );
  }

  static toJson(route: Omit<Route, 'id' | 'createdAt'>): object {
    return {
      name: route.name,
      status: route.status,
      assignedVehicleIds: route.assignedVehicleIds,
      shiftId: route.shift.id,
      createdAt: new Date().toISOString(),
      waypoints: route.waypoints.map((w) => ({
        latitude: w.latitude,
        longitude: w.longitude,
        label: w.label,
        order: w.order,
      })),
    };
  }
}
