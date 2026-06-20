import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Driver } from '../domain/model/driver.entity';
import { DriverAssembler } from './driver-assembler';
import { DriverResource, DriversResponse } from './driver-response';

/**
 * HTTP endpoint client for GET /api/v1/drivers?view=directory.
 */
export class DriversApiEndpoint extends BaseApiEndpoint<
  Driver,
  DriverResource,
  DriversResponse,
  DriverAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDriversDirectoryEndpointPath}`,
      new DriverAssembler(),
    );
  }

  override getAll(): Observable<Driver[]> {
    const params = new HttpParams().set('view', 'directory');
    return this.http.get<DriverResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch drivers directory')),
    );
  }
}
