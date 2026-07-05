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
}
