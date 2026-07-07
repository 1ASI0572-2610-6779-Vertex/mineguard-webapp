import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Driver } from '../domain/model/driver.entity';
import { SaveDriverCommand } from '../domain/model/save-driver.command';
import { Vehicle } from '../domain/model/vehicle.entity';
import { DriverResource } from './driver-response';
import { DriversApiEndpoint } from './drivers-api-endpoint';
import { DriversWriteApiEndpoint } from './drivers-write-api-endpoint';
import { VehiclesApiEndpoint } from './vehicles-api-endpoint';

@Injectable({ providedIn: 'root' })
export class AssetsApi extends BaseApi {
  private readonly vehiclesEndpoint: VehiclesApiEndpoint;
  private readonly driversEndpoint: DriversApiEndpoint;
  private readonly driversWriteEndpoint: DriversWriteApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.vehiclesEndpoint = new VehiclesApiEndpoint(http);
    this.driversEndpoint = new DriversApiEndpoint(http);
    this.driversWriteEndpoint = new DriversWriteApiEndpoint(http);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.vehiclesEndpoint.getAll();
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehiclesEndpoint.create(vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehiclesEndpoint.update(vehicle, vehicle.id);
  }

  /** DELETE /vehicles/{id} — soft-delete (archive). */
  archiveVehicle(id: number): Observable<void> {
    return this.vehiclesEndpoint.archive(id);
  }

  /** GET /driversDirectory — read-only directory projection for the web view. */
  getDrivers(): Observable<Driver[]> {
    return this.driversEndpoint.getAll();
  }

  /** POST /drivers — create a driver with full write-body contract. */
  createDriver(command: SaveDriverCommand): Observable<DriverResource> {
    return this.driversWriteEndpoint.create(command);
  }

  /** PATCH /drivers/{id} — partial update of a driver (tenant resolved from JWT). */
  updateDriver(command: SaveDriverCommand): Observable<DriverResource> {
    return this.driversWriteEndpoint.update(command);
  }

  /** DELETE /drivers/{id} — soft-delete (deactivate). */
  deactivateDriver(id: number): Observable<void> {
    return this.driversWriteEndpoint.deactivate(id);
  }

  /** GET /drivers/{id} — fetch a single driver record. */
  getDriverById(id: number): Observable<DriverResource> {
    return this.driversWriteEndpoint.getById(id);
  }
}
