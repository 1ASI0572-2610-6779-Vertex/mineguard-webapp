import { Route } from '../domain/model/route.entity';
import { Shift } from '../domain/model/shift.entity';

export abstract class RouteRepository {
  abstract getAll(): Promise<Route[]>;
  abstract getById(id: string): Promise<Route | null>;
  abstract create(route: Omit<Route, 'id' | 'createdAt'>): Promise<Route>;
  abstract update(id: string, changes: Partial<Route>): Promise<Route>;
  abstract delete(id: string): Promise<void>;
  abstract getAllShifts(): Promise<Shift[]>;
}
