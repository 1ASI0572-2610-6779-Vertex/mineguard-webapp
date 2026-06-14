export class RouteWaypoint {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly label: string,       // "Checkpoint A", "Zona de carga"
    public readonly order: number,
  ) {}
}
