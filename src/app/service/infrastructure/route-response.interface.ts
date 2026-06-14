export interface WaypointResponse {
  latitude: number;
  longitude: number;
  label: string;
  order: number;
}

export interface RouteResponse {
  id: string;
  name: string;
  status: string;
  assignedVehicleIds: string[];
  shiftId: string;
  createdAt: string;
  waypoints: WaypointResponse[];
}
