import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Device } from '../domain/model/device.entity';
import { RegisterDeviceCommand } from '../domain/model/register-device.command';
import { SensorsApiEndpoint } from './sensors-api-endpoint';

/**
 * Infrastructure facade for the devices bounded context.
 * Wraps the sensors endpoint (a device is modeled as a "sensor" by the backend).
 */
@Injectable({ providedIn: 'root' })
export class DevicesApi extends BaseApi {
  private readonly sensorsEndpoint: SensorsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.sensorsEndpoint = new SensorsApiEndpoint(http);
  }

  /** GET /api/v1/sensors — all devices registered for the admin's company. */
  getDevices(): Observable<Device[]> {
    return this.sensorsEndpoint.getAll();
  }

  /** POST /api/v1/sensors — bind one vehicle to one deviceId. */
  registerDevice(command: RegisterDeviceCommand): Observable<Device> {
    return this.sensorsEndpoint.register(command);
  }

  /**
   * POST /api/v1/vehicles/{vehicleId}/sensor — links a device to a vehicle;
   * the backend assigns the next sequential deviceId. Used by the supervisor
   * vehicle-creation flow.
   */
  linkDeviceToVehicle(vehicleId: number): Observable<Device> {
    return this.sensorsEndpoint.linkToVehicle(vehicleId);
  }

  /** GET /api/v1/vehicles/{vehicleId}/sensor — the device linked to a vehicle, or null. */
  getVehicleDevice(vehicleId: number): Observable<Device | null> {
    return this.sensorsEndpoint.getForVehicle(vehicleId);
  }

  /** PATCH /api/v1/sensors/{id} — move (vehicleId) and/or change status. */
  patchDevice(id: number, body: { vehicleId?: number; status?: string }): Observable<Device> {
    return this.sensorsEndpoint.patch(id, body);
  }
}
