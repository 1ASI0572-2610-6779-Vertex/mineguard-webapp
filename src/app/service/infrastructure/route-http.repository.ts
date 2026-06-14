import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';


import { RouteMapper } from './route.mapper';
import { RouteResponse } from './route-response.interface';
import { Route } from '../domain/model/route.entity';
import { Shift } from '../domain/model/shift.entity';
import { RouteRepository } from '../domain/route.repository';

@Injectable({ providedIn: 'root' })
export class RouteHttpRepository extends RouteRepository {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';

  async getAll(): Promise<Route[]> {
    const data = await firstValueFrom(
      this.http.get<RouteResponse[]>(`${this.base}/routes`)
    );
    const shifts = await this.getAllShifts();
    return data.map((r) => RouteMapper.toDomain(r, shifts));
  }

  async getById(id: string): Promise<Route | null> {
    try {
      const data = await firstValueFrom(
        this.http.get<RouteResponse>(`${this.base}/routes/${id}`)
      );
      const shifts = await this.getAllShifts();
      return RouteMapper.toDomain(data, shifts);
    } catch {
      return null;
    }
  }

  async create(route: Omit<Route, 'id' | 'createdAt'>): Promise<Route> {
    const shifts = await this.getAllShifts();
    const payload = RouteMapper.toJson(route);
    const data = await firstValueFrom(
      this.http.post<RouteResponse>(`${this.base}/routes`, payload)
    );
    return RouteMapper.toDomain(data, shifts);
  }

  async update(id: string, changes: Partial<Route>): Promise<Route> {
    const shifts = await this.getAllShifts();
    const data = await firstValueFrom(
      this.http.patch<RouteResponse>(`${this.base}/routes/${id}`, changes)
    );
    return RouteMapper.toDomain(data, shifts);
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/routes/${id}`));
  }

  async getAllShifts(): Promise<Shift[]> {
    const data = await firstValueFrom(
      this.http.get<Shift[]>(`${this.base}/shifts`)
    );
    return data;
  }
}
