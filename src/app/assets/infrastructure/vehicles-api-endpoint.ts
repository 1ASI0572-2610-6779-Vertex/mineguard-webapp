import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehicleAssembler } from './vehicle-assembler';
import { VehicleResource, VehiclesResponse } from './vehicle-response';

/**
 * HTTP endpoint client for GET /api/v1/vehicles?view=inventory.
 */
export class VehiclesApiEndpoint extends BaseApiEndpoint<
  Vehicle,
  VehicleResource,
  VehiclesResponse,
  VehicleAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesInventoryEndpointPath}`,
      new VehicleAssembler(),
    );
  }

  override getAll(): Observable<Vehicle[]> {
    const params = new HttpParams().set('view', 'inventory');
    return this.http.get<VehicleResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch vehicles inventory')),
    );
  }
}
