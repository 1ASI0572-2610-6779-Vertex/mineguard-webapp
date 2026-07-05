import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

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
