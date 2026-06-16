import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { Driver } from '../domain/model/driver.entity';
import { Vehicle } from '../domain/model/vehicle.entity';
import { CatalogSummaryApiEndpoint } from './catalog-summary-api-endpoint';
import { DriversApiEndpoint } from './drivers-api-endpoint';
import { VehiclesApiEndpoint } from './vehicles-api-endpoint';

@Injectable({ providedIn: 'root' })
export class AssetsApi extends BaseApi {
  private readonly catalogSummaryEndpoint: CatalogSummaryApiEndpoint;
  private readonly vehiclesEndpoint: VehiclesApiEndpoint;
  private readonly driversEndpoint: DriversApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.catalogSummaryEndpoint = new CatalogSummaryApiEndpoint(http);
    this.vehiclesEndpoint = new VehiclesApiEndpoint(http);
    this.driversEndpoint = new DriversApiEndpoint(http);
  }

  getCatalogSummary(): Observable<CatalogSummary[]> {
    return this.catalogSummaryEndpoint.getAll();
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

  getDrivers(): Observable<Driver[]> {
    return this.driversEndpoint.getAll();
  }

  createDriver(driver: Driver): Observable<Driver> {
    return this.driversEndpoint.create(driver);
  }

  updateDriver(driver: Driver): Observable<Driver> {
    return this.driversEndpoint.update(driver, driver.id);
  }
}
