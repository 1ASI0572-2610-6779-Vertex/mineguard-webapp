import { Injectable, inject, signal, computed } from '@angular/core';
import { RouteRepository } from '../domain/route.repository';
import { Route } from '../domain/model/route.entity';
import { Shift } from '../domain/model/shift.entity';
import { RouteWaypoint } from '../domain/model/route-waypoint.value-object';
import { RouteStatus } from '../domain/model/route-status';
import { RouteOverlay } from '../../monitoring/presentation/components/live-map/live-map';



@Injectable()
export class ServiceDesignStore {
  private repo = inject(RouteRepository);

  // ── State ────────────────────────────────────────────────
  readonly routes      = signal<Route[]>([]);
  readonly shifts      = signal<Shift[]>([]);
  readonly loading     = signal(false);
  readonly error       = signal<string | null>(null);
  readonly selectedId  = signal<string | null>(null);

  // ── Derived ──────────────────────────────────────────────
  readonly activeRoutes = computed(() =>
    this.routes().filter((r) => r.status === 'active')
  );

  readonly plannedRoutes = computed(() =>
    this.routes().filter((r) => r.status === 'planned')
  );

  readonly selectedRoute = computed(() =>
    this.routes().find((r) => r.id === this.selectedId()) ?? null
  );

  readonly routeOverlays = computed<RouteOverlay[]>(() =>
    this.routes().map(route => ({
      id: route.id,
      name: route.name,
      status: 'active',
      coords: route.waypoints
        .sort((a, b) => a.order - b.order)
        .map(wp => [wp.latitude, wp.longitude] as [number, number]),
    }))
  );

  // ── Load ─────────────────────────────────────────────────
  async loadRoutes(): Promise<void> {
    this.loading.set(true);
    try {
      const [routes, shifts] = await Promise.all([
        this.repo.getAll(),
        this.repo.getAllShifts(),
      ]);
      this.routes.set(routes);
      this.shifts.set(shifts);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error loading routes');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Create ───────────────────────────────────────────────
  async createRoute(payload: {
    name: string;
    shiftId: string;
    assignedVehicleIds: string[];
    waypoints: RouteWaypoint[];
  }): Promise<void> {
    const shift = this.shifts().find((s) => s.id === payload.shiftId);
    if (!shift) return;

    this.loading.set(true);
    try {
      const created = await this.repo.create({
        name: payload.name,
        status: 'planned',
        waypoints: payload.waypoints,
        assignedVehicleIds: payload.assignedVehicleIds,
        shift,
      } as any);
      this.routes.update((prev) => [...prev, created]);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error creating route');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Update status ─────────────────────────────────────────
  async updateStatus(id: string, status: RouteStatus): Promise<void> {
    try {
      const updated = await this.repo.update(id, { status });
      this.routes.update((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error updating route');
    }
  }

  // ── Delete ────────────────────────────────────────────────
  async deleteRoute(id: string): Promise<void> {
    try {
      await this.repo.delete(id);
      this.routes.update((prev) => prev.filter((r) => r.id !== id));
      if (this.selectedId() === id) this.selectedId.set(null);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error deleting route');
    }
  }

  selectRoute(id: string): void {
    this.selectedId.set(id);
  }

  clearSelection(): void {
    this.selectedId.set(null);
  }
}
