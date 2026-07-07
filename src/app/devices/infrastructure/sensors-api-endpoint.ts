import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { RegisterDeviceCommand } from '../domain/model/register-device.command';
import { DeviceApiError } from './device-api-error';
import { DeviceAssembler } from './device-assembler';
import { DeviceResource } from './device-response';

/** Body for POST /api/v1/sensors. `companyId`/`sensorType` are resolved server-side. */
interface RegisterDeviceBody {
  vehicleId: number;
  deviceId: string;
}

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSensorsEndpointPath}`;

/** Builds the RESTful nested device sub-resource URL: `.../vehicles/{vehicleId}/sensor`. */
const vehicleSensorUrl = (vehicleId: number): string =>
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesInventoryEndpointPath}/${vehicleId}/sensor`;

/**
 * HTTP endpoint client for GET /api/v1/sensors and POST /api/v1/sensors.
 *
 * @remarks
 * The JWT is attached automatically by {@link iamInterceptor}; no auth header is
 * set here. Errors are rethrown as {@link DeviceApiError} so the store can map
 * the HTTP status to a user-facing message and detect session expiry.
 */
export class SensorsApiEndpoint {
  private readonly assembler = new DeviceAssembler();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Device[]> {
    return this.http.get<DeviceResource[]>(endpointUrl).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.rethrow),
    );
  }

  register(command: RegisterDeviceCommand): Observable<Device> {
    const body: RegisterDeviceBody = {
      vehicleId: command.vehicleId,
      deviceId: command.deviceId,
    };
    return this.http.post<DeviceResource>(endpointUrl, body).pipe(
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.rethrow),
    );
  }

  /**
   * POST /api/v1/vehicles/{vehicleId}/sensor — links a MineGuard device to a
   * vehicle as a 1:1 nested sub-resource.
   *
   * @remarks
   * The body is intentionally **empty**: the backend owns the `deviceId` sequence
   * (a monotonic integer 1, 2, 3…) and assigns the next value atomically, then
   * echoes the created device back. This removes any client-side guessing or
   * duplicate/race risk. A `409` means the vehicle already has a device.
   */
  linkToVehicle(vehicleId: number): Observable<Device> {
    return this.http.post<DeviceResource>(vehicleSensorUrl(vehicleId), {}).pipe(
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.rethrow),
    );
  }

  /**
   * GET /api/v1/vehicles/{vehicleId}/sensor — the device linked to a vehicle, or
   * `null` when it has none (the backend answers `404`). Used to resolve a
   * device's primary id before a move/retire PATCH.
   */
  getForVehicle(vehicleId: number): Observable<Device | null> {
    return this.http.get<DeviceResource>(vehicleSensorUrl(vehicleId)).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) =>
        error.status === 404 ? of(null) : this.rethrow(error),
      ),
    );
  }

  /**
   * PATCH /api/v1/sensors/{id} — partial update of a device: move it to another
   * vehicle (`vehicleId`, preserving the deviceId) and/or change its `status`
   * (`active` | `inactive` | `retired`).
   */
  patch(id: number, body: { vehicleId?: number; status?: string }): Observable<Device> {
    return this.http.patch<DeviceResource>(`${endpointUrl}/${id}`, body).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.rethrow),
    );
  }

  /** Normalizes an HttpErrorResponse into a status-carrying {@link DeviceApiError}. */
  private readonly rethrow = (error: HttpErrorResponse): Observable<never> => {
    const body = error.error as { message?: string } | null;
    const apiError: DeviceApiError = {
      status: error.status,
      message: (body && typeof body === 'object' && body.message) || '',
    };
    return throwError(() => apiError);
  };
}
